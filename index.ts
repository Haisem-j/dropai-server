import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
import Stripe from "stripe";

import AiRoutes from "./Routes/aiRoutes";
import UsersRoutes from "./Routes/users";
import PaymentsRoutes from "./Routes/paymentsRoute";
import { db } from "./config/firebase-config";
import { User } from "./models";

require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2022-08-01",
});
const webhookSecret: string = process.env.STRIPE_WEBHOOK_SEC;
const app: Express = express();
const port = 8080;

// Middlewares
app.use(cors());
// Use JSON parser for all non-webhook routes
app.use(
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    if (req.originalUrl === "/webhook") {
      next();
    } else {
      express.json()(req, res, next);
    }
  }
);

app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", AiRoutes);
app.use("/api/user", UsersRoutes);
app.use("/api/payments", PaymentsRoutes);
app.use(express.static("landingpage"));
// Web hooks -> checkout successful
app.post(
  "/webhook",
  // Stripe requires the raw body to construct the event
  express.raw({ type: "application/json" }),
  async (req: express.Request, res: express.Response) => {
    const sig = req.headers["stripe-signature"];

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig || "",
        webhookSecret
      );
    } catch (err: any) {
      console.log(`Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    if (event.data.object) {
      const c: any = event.data.object;
      if (event.type === "checkout.session.completed") {
        try {
          const customer = await stripe.customers.retrieve(c.customer);
          const tempObj = customer as any;
          const { uid, newPlan } = tempObj.metadata;

          const docRef = db.collection("users").doc(uid);
          const usr = await docRef.get();
          if (!usr.exists) {
            throw new Error("User doesnt exist");
          } else {
            const { numberOfRequests } = usr.data() as User;
            const newTokens = newPlan === "Standard" ? 6000 : 9999;
            const updatedUser = {
              numberOfRequests,
              availableTokens: newTokens,
              planType: newPlan,
              paymentId: customer.id,
            };
            docRef.update(updatedUser);
          }
        } catch (error: any) {
          console.log("Error - ", error.message);
          res.send({ error: error.message });
        }
      }
    }
    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
