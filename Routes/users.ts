import express, { Request, Response, NextFunction, Express } from "express";
import { db } from "../config/firebase-config";
import middleware from "../middleware";
import { getDefaultUser, User } from "../models";

const router = express.Router();
router.use(middleware.decodeToken);
require("dotenv").config();

/**
 * Request Body -> uid: string
 */
router.post("/create-user", async (req, res) => {
  try {
    const docRef = db.collection("users").doc(req.body.uid);
    const usr = await docRef.get();
    if (!usr.exists) {
      const newUser = getDefaultUser();
      await docRef.set(newUser);

      res.status(200).send({ result: "User created" });
    } else {
      throw new Error("User already exists");
    }
  } catch (error: any) {
    console.log("Error /create-user - ", error);
    res.send({ err: error.message });
  }
});

/**
 * Request Body -> uid: string
 */
router.post("/get-user", async (req, res) => {
  try {
    const uid = req.body.uid;
    const docRef = db.collection("users").doc(uid);
    const usr = await docRef.get();
    if (!usr.exists) {
      throw new Error("User doesnt exist");
    } else {
      res.status(200).send({ result: usr.data() });
    }
  } catch (error: any) {
    console.log("Error - ", error.message);
    res.send({ error: error.message });
  }
});

/**
 * Request Body -> uid: string, tokensUsed: number
 * Response -> result: user{}
 */
router.post("/update-tokens", async (req, res) => {
  try {
    // Get user
    const { uid, tokensUsed } = req.body;
    const docRef = db.collection("users").doc(uid);
    const usr = await docRef.get();

    if (!usr.exists) {
      throw new Error("User doesnt exist");
    } else {
      // Check if there are enough tokens availble
      const { availableTokens, numberOfRequests, planType } =
        usr.data() as User;
      if (availableTokens - tokensUsed < 0) {
        throw new Error("Error: Not enough tokens available");
      } else {
        const updatedUser = {
          numberOfRequests: numberOfRequests + 1,
          planType,
          availableTokens: availableTokens - tokensUsed,
        };
        docRef.update(updatedUser);
        res.status(200).send({ result: updatedUser });
      }
    }
  } catch (error: any) {
    console.log("Error - ", error.message);
    res.send({ error: error.message });
  }
});

/**
 * Request Body -> UID: number, newPlan: Free | Standard | Unlimited
 * Response -> result: user{}
 */
router.post("/update-plan", async (req, res) => {
  try {
    const { uid, newPlan } = req.body;
    const docRef = db.collection("users").doc(uid);
    const usr = await docRef.get();
    if (!usr.exists) {
      throw new Error("User doesnt exist");
    } else {
      // Check if there are enough tokens availble
      const { numberOfRequests } = usr.data() as User;
      const newTokens = newPlan === "Standard" ? 30000 : 3000;
      const updatedUser = {
        numberOfRequests,
        availableTokens: newTokens,
        planType: newPlan,
      };
      docRef.update(updatedUser);
      res.status(200).send({ result: updatedUser });
    }
  } catch (error: any) {
    console.log("Error - ", error.message);
    res.send({ error: error.message });
  }
});
export default router;
