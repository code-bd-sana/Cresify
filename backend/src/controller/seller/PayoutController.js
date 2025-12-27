import dotenv from "dotenv";
import mongoose from "mongoose";
import Stripe from "stripe";
import Payout from "../../models/PayoutModel.js";
import Transaction from "../../models/TransactionModel.js";
import Wallet from "../../models/WalletModel.js";
import { toTwo } from "../../utils/money.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

export const getWallet = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const wallet = await Wallet.findOne({ user: sellerId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    // recent transactions for this user
    const transactions = await Transaction.find({ user: sellerId })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return res.json({ wallet, transactions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to get wallet" });
  }
};

export const requestPayout = async (req, res) => {
  const { sellerId, amount: rawAmount, method } = req.body;
  const amount = toTwo(rawAmount);
  if (!sellerId || amount === undefined || Number.isNaN(amount))
    return res.status(400).json({ message: "Missing fields" });

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const wallet = await Wallet.findOne({ user: sellerId }).session(session);
    if (!wallet || toTwo(wallet.balance || 0) < amount) {
      if (session.inTransaction && session.inTransaction())
        await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // create payout record
    const payout = await Payout.create(
      [
        {
          payoutId: `payout_${Date.now()}`,
          seller: sellerId,
          amount: toTwo(amount),
          currency: wallet.currency || "usd",
          status: "queued",
          method: method || "manual",
        },
      ],
      { session }
    );

    // deduct from wallet balance immediately (funds reserved for payout)
    const before = toTwo(wallet.balance || 0);
    wallet.balance = toTwo((wallet.balance || 0) - amount);
    await wallet.save({ session });

    await Transaction.create(
      [
        {
          transactionId: `${payout[0].payoutId}-debit`,
          type: "payout",
          wallet: wallet._id,
          user: sellerId,
          amount: toTwo(amount),
          currency: wallet.currency || "usd",
          balanceBefore: before,
          balanceAfter: wallet.balance,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return res
      .status(201)
      .json({ message: "Payout requested", payout: payout[0] });
  } catch (err) {
    console.error("requestPayout error", err);
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ message: "Failed to request payout", error: err.message });
  }
};

export const listPayouts = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const query = sellerId ? { seller: sellerId } : {};
    const payouts = await Payout.find(query).sort({ createdAt: -1 }).limit(100);
    return res.json({ payouts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to list payouts" });
  }
};

export const processPayout = async (req, res) => {
  const { payoutId } = req.params;
  if (!payoutId) {
    return res.status(400).json({ message: "Missing payoutId" });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1️⃣ Find payout
    let payout = null;
    if (mongoose.Types.ObjectId.isValid(payoutId)) {
      payout = await Payout.findById(payoutId).session(session);
    }
    if (!payout) {
      payout = await Payout.findOne({ payoutId }).session(session);
    }
    if (!payout) {
      if (session.inTransaction && session.inTransaction())
        await session.abortTransaction();
      return res.status(404).json({ message: "Payout not found" });
    }

    if (payout.status === "paid") {
      if (session.inTransaction && session.inTransaction())
        await session.abortTransaction();
      return res.status(400).json({ message: "Payout already processed" });
    }

    // 2️⃣ Load seller wallet
    const wallet = await Wallet.findOne({ user: payout.seller }).session(
      session
    );
    if (!wallet) {
      if (session.inTransaction && session.inTransaction())
        await session.abortTransaction();
      return res.status(404).json({ message: "Seller wallet not found" });
    }

    // 3️⃣ Validate escrow funds
    if (wallet.reserved < payout.amount) {
      if (session.inTransaction && session.inTransaction())
        await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient reserved balance for payout",
      });
    }

    // 4️⃣ Stripe transfer (idempotent-safe)
    let stripeTransfer = null;
    if (
      payout.method === "stripe_connect" &&
      payout.metadata?.connectedAccountId
    ) {
      try {
        stripeTransfer = await stripe.transfers.create(
          {
            amount: Math.round(payout.amount * 100),
            currency: payout.currency || "usd",
            destination: payout.metadata.connectedAccountId,
            metadata: { payoutId: payout.payoutId },
          },
          {
            idempotencyKey: `payout_${payout.payoutId}`,
          }
        );
      } catch (err) {
        console.error("Stripe transfer failed", err);
        if (session.inTransaction && session.inTransaction())
          await session.abortTransaction();
        return res.status(502).json({
          message: "Stripe transfer failed",
          error: err.message,
        });
      }
    }

    // 5️⃣ Update wallet escrow
    const balanceBefore = wallet.reserved;
    wallet.reserved -= payout.amount;
    await wallet.save({ session });

    // 6️⃣ Mark payout paid
    payout.status = "paid";
    payout.processedAt = new Date();
    if (stripeTransfer) {
      payout.stripeTransferId = stripeTransfer.id;
    }
    await payout.save({ session });

    // 7️⃣ Ledger transaction
    await Transaction.create(
      [
        {
          transactionId: `${payout.payoutId}-completed`,
          type: "payout",
          wallet: wallet._id,
          user: payout.seller,
          order: null,
          payment: null,
          amount: payout.amount,
          currency: payout.currency || "usd",
          balanceBefore,
          balanceAfter: wallet.reserved,
          metadata: {
            stripeTransferId: stripeTransfer?.id || null,
          },
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.json({
      message: "Payout processed successfully",
      payout,
      stripeTransfer,
    });
  } catch (err) {
    console.error("processPayout error", err);
    if (session.inTransaction && session.inTransaction())
      await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      message: "Failed to process payout",
      error: err.message,
    });
  }
};
