import express, { Request, Response, NextFunction, Express } from "express";
import moment from "moment";
import { firestore } from "firebase-admin";

import { db } from "../config/firebase-config";

const router = express.Router();

router.post("/contact-us", async (req, res) => {
  try {
    const { email, message } = req.body;
    const emailRef = db
      .collection("contactus")
      .doc(moment().format("MMMMDoYYYY"));
    const emails = await emailRef.get();
    if (!emails.exists) {
      await emailRef.set({
        [email]: firestore.FieldValue.arrayUnion(message),
      });
    } else {
      await emailRef.set(
        {
          [email]: firestore.FieldValue.arrayUnion(message),
        },
        { merge: true }
      );
    }
    res.send({ success: true, message: "Email has been sent!" });
  } catch (error: any) {
    console.log("Error - /landing/contact-us", error.message);
    res.send({ success: false, message: "Email could not be sent!" });
  }
});

router.post("/newsletter", async (req, res) => {
  try {
    const { email } = req.body;
    const newsletterRef = db.collection("newsletter").doc("signedup");
    const emails = await newsletterRef.get();
    if (!emails.exists) {
      await newsletterRef.set({
        subscribers: firestore.FieldValue.arrayUnion(email),
      });
    } else {
      await newsletterRef.set(
        {
          subscribers: firestore.FieldValue.arrayUnion(email),
        },
        { merge: true }
      );
    }
    res.send({ success: true, message: "Subscribed to newsletter!" });
  } catch (error: any) {
    console.log("Error - /newsletter", error.message);
    res.send({ success: false, message: "Could not subscribe to newsletter" });
  }
});
export default router;
