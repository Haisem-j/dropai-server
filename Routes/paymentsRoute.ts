import express from "express";
import Stripe from "stripe";
import middleware from "../middleware";
import { db } from "../config/firebase-config";

const router = express.Router();
router.use(middleware.decodeToken);
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_KEY || "", {
  apiVersion: "2022-08-01",
});

/**
 * Payments route
 * Req body -> uid, paymentId, newPlan
 */
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { uid, paymentId, newPlan } = req.body;
    const customer = await stripe.customers.create({
      metadata: {
        uid,
        newPlan,
      },
    });
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: paymentId,
          quantity: 1,
        },
      ],
      customer: customer.id,
      mode: "subscription",
      success_url: `${process.env.CLIENT_URL}checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}plans?canceled=true`,
    });

    res.send({ url: session.url });
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("Error /create-checkout-session - ", error);
  }
});

/**
 * Billing Information
 * Req body -> paymentId
 */
router.post("/get-billing-info", async (req, res) => {
  const { paymentId } = req.body;
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      type: "card",
      customer: paymentId,
    });
    const invoices = await stripe.invoices.list({
      customer: paymentId,
      limit: 3,
    });
    const billingInfo = {
      payment: {
        brand: paymentMethods.data[0].card?.brand,
        ending: paymentMethods.data[0].card?.last4,
      },
      billingInterval: invoices.data[0].lines.data[0].plan?.interval,
      invoices: invoices.data[0].lines.data.map((invoice) => ({
        period: invoice.period,
        plan: invoice.description,
        amount: invoice.amount / 100,
        invoiceId: invoice.id,
      })),
    };
    res.send({
      billingInfo,
    });
  } catch (error: any) {
    console.log(error);

    res.send({ err: error.message });
  }
});

/**
 * Cancel Subscription
 * Req body -> customerId, uid
 */
router.post("/cancel-sub", async (req, res) => {
  const { customerId, uid } = req.body;
  try {
    // Get user
    const docRef = db.collection("users").doc(uid);
    const subscriptions = await stripe.customers.retrieve(customerId, {
      expand: ["subscriptions"],
    });
    docRef.update({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      endOfCycle: subscriptions.subscriptions.data[0].current_period_end,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const subId = subscriptions.subscriptions.data[0].id;
    const updatedSub = await stripe.subscriptions.update(subId, {
      cancel_at_period_end: true,
    });
    console.log("Update Sub -", updatedSub);

    res.send({
      data: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        periodEnd: subscriptions.subscriptions.data[0].current_period_end,
      },
    });
  } catch (error: any) {
    console.log(error);

    res.send({ err: error.message });
  }
});
export default router;
