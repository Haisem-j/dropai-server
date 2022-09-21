import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
import Stripe from "stripe";

import AiRoutes from "./Routes/aiRoutes";
import UsersRoutes from "./Routes/users";

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
// Web hooks -> checkout successful
app.post(
  "/webhook",
  // Stripe requires the raw body to construct the event
  express.raw({ type: "application/json" }),
  (req: express.Request, res: express.Response): void => {
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
        stripe.customers
          .retrieve(c.customer)
          .then((customer) => {
            console.log(customer);
            console.log("################################");
            console.log(event?.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
