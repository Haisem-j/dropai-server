import express, { Request, Response, NextFunction, Express } from "express";
import Stripe from "stripe";
import middleware from "../middleware";

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
export default router;
