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
      try {
        const acct = await stripe.accounts.create({
          type: "express",
          country: "US",
        });
        accountId = acct.id;
        wallet.stripeAccountId = accountId;
        wallet.stripeDetails = acct;
        wallet.stripePayoutsEnabled = acct.payouts_enabled || false;
        wallet.stripeChargesEnabled = acct.charges_enabled || false;
        await wallet.save();
      } catch (createErr) {
        // If Connect is not enabled for this Stripe key, fall back to OAuth-style URL
        console.warn(
          "stripe.accounts.create failed, falling back to OAuth",
          createErr?.message || createErr
        );
        const clientId = process.env.STRIPE_CLIENT_ID;
        if (!clientId) {
          throw new Error(
            "Stripe Connect account creation failed and STRIPE_CLIENT_ID is not configured for OAuth fallback"
          );
        }

        const frontendReturn =
          returnUrl || process.env.FRONTEND_URL || "http://localhost:3000";
        // Build OAuth Express onboarding URL
        const params = new URLSearchParams({
          response_type: "code",
          client_id: clientId,
          scope: "read_write",
          redirect_uri: frontendReturn,
        });
        const oauthUrl = `https://connect.stripe.com/express/oauth/authorize?${params.toString()}`;
        return res.json({ url: oauthUrl, accountId: null, oauth: true });
      }
    }

    const frontendReturn =
      returnUrl || process.env.FRONTEND_URL || "http://localhost:3000";
    const refreshUrl =
      (process.env.FRONTEND_URL || "http://localhost:3000") +
      "/dashboard/wallet";

    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: frontendReturn,
      type: "account_onboarding",
    });

    return res.json({ url: link.url, accountId });
  } catch (err) {
    console.error("createConnectLink error", err);
    return res
      .status(500)
      .json({ message: "Failed to create connect link", error: err.message });
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
    return res
      .status(500)
      .json({ message: "Failed to unlink account", error: err.message });
  }
};

export const updateStripeAccount = async (req, res) => {
  try {
    const { sellerId, account } = req.body;
    if (!sellerId) return res.status(400).json({ message: "Missing sellerId" });

    const wallet = await Wallet.findOne({ user: sellerId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    // If there's a connected Stripe account, attempt to update it
    if (wallet.stripeAccountId) {
      try {
        const updatePayload = {};
        if (account.email) updatePayload.email = account.email;
        // Map some basic business/profile fields
        updatePayload.business_profile = {
          ...(account.businessName ? { name: account.businessName } : {}),
          ...(account.phone ? { support_phone: account.phone } : {}),
        };

        // Attempt to update the Stripe account and store returned details
        const acct = await stripe.accounts.update(
          wallet.stripeAccountId,
          updatePayload
        );
        wallet.stripeDetails = acct;
        wallet.stripePayoutsEnabled = acct.payouts_enabled || false;
        wallet.stripeChargesEnabled = acct.charges_enabled || false;
        await wallet.save();

        return res.json({ wallet });
      } catch (stripeErr) {
        console.warn(
          "stripe.accounts.update failed",
          stripeErr?.message || stripeErr
        );
        // Still persist local changes if provided
        wallet.stripeDetails = { ...(wallet.stripeDetails || {}), ...account };
        await wallet.save();
        return res.status(200).json({
          wallet,
          warning: stripeErr?.message || "Stripe update failed",
        });
      }
    }

    // No connected stripe account yet — persist provided details locally
    wallet.stripeDetails = { ...(wallet.stripeDetails || {}), ...account };
    await wallet.save();

    return res.json({ wallet });
  } catch (err) {
    console.error("updateStripeAccount error", err);
    return res
      .status(500)
      .json({ message: "Failed to update stripe account", error: err.message });
  }
};

export const refreshStripeAccount = async (req, res) => {
  try {
    const { sellerId } = req.body;
    if (!sellerId) return res.status(400).json({ message: "Missing sellerId" });

    const wallet = await Wallet.findOne({ user: sellerId });
    if (!wallet || !wallet.stripeAccountId) {
      return res.status(404).json({ message: "No connected Stripe account" });
    }

    const acct = await stripe.accounts.retrieve(wallet.stripeAccountId);
    // update local wallet copy
    wallet.stripeDetails = acct;
    wallet.stripePayoutsEnabled = acct.payouts_enabled || false;
    wallet.stripeChargesEnabled = acct.charges_enabled || false;
    await wallet.save();

    return res.json({ wallet });
  } catch (err) {
    console.error("refreshStripeAccount error", err);
    return res
      .status(500)
      .json({
        message: "Failed to refresh stripe account",
        error: err.message,
      });
  }
};

// Admin-only: set the local flags for payouts/charges. This does NOT change Stripe state.
export const setStripeFlags = async (req, res) => {
  try {
    const { sellerId, payoutsEnabled, chargesEnabled } = req.body;
    if (!sellerId) return res.status(400).json({ message: "Missing sellerId" });

    const wallet = await Wallet.findOne({ user: sellerId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    if (typeof payoutsEnabled === "boolean")
      wallet.stripePayoutsEnabled = payoutsEnabled;
    if (typeof chargesEnabled === "boolean")
      wallet.stripeChargesEnabled = chargesEnabled;

    await wallet.save();
    return res.json({ wallet });
  } catch (err) {
    console.error("setStripeFlags error", err);
    return res
      .status(500)
      .json({ message: "Failed to set stripe flags", error: err.message });
  }
};
