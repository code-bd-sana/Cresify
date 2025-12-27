import dotenv from "dotenv";
import Stripe from "stripe";
import Wallet from "../../models/WalletModel.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

export const createConnectLink = async (req, res) => {
  try {
    const { sellerId, returnUrl } = req.body;
    if (!sellerId) return res.status(400).json({ message: "Missing sellerId" });

    // find or create wallet for seller
    let wallet = await Wallet.findOne({ user: sellerId });
    if (!wallet) {
      wallet = await Wallet.create({ user: sellerId });
    }

    // If seller already has a stripe account id, reuse it
    let accountId = wallet.stripeAccountId;
    if (!accountId) {
      const acct = await stripe.accounts.create({ type: "express", country: "US" });
      accountId = acct.id;
      wallet.stripeAccountId = accountId;
      wallet.stripeDetails = acct;
      wallet.stripePayoutsEnabled = acct.payouts_enabled || false;
      wallet.stripeChargesEnabled = acct.charges_enabled || false;
      await wallet.save();
    }

    const frontendReturn =
      returnUrl || process.env.FRONTEND_URL || "http://localhost:3000";
    const refreshUrl = (process.env.FRONTEND_URL || "http://localhost:3000") + "/dashboard/wallet";

    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: frontendReturn,
      type: "account_onboarding",
    });

    return res.json({ url: link.url, accountId });
  } catch (err) {
    console.error("createConnectLink error", err);
    return res.status(500).json({ message: "Failed to create connect link", error: err.message });
  }
};

export const unlinkAccount = async (req, res) => {
  try {
    const { sellerId } = req.body;
    if (!sellerId) return res.status(400).json({ message: "Missing sellerId" });

    const wallet = await Wallet.findOne({ user: sellerId });
    if (!wallet || !wallet.stripeAccountId) {
      return res.status(404).json({ message: "No connected Stripe account" });
    }

    const accountId = wallet.stripeAccountId;

    // Remove local references
    wallet.stripeAccountId = null;
    wallet.stripeDetails = {};
    wallet.stripePayoutsEnabled = false;
    wallet.stripeChargesEnabled = false;
    await wallet.save();

    // Optionally delete the Stripe account to clean up. Wrap in try/catch in case it fails.
    try {
      await stripe.accounts.del(accountId);
    } catch (e) {
      console.warn("stripe.accounts.del failed", e?.message || e);
    }

    return res.json({ message: "Unlinked Stripe account" });
  } catch (err) {
    console.error("unlinkAccount error", err);
    return res.status(500).json({ message: "Failed to unlink account", error: err.message });
  }
};
