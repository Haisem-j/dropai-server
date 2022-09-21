import { Request, Response, NextFunction, Express } from "express";
import { admin } from "../config/firebase-config";
class Middleware {
  async decodeToken(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      return res.json({ message: "Error authorization refused" });
    }
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decodeValue = await admin.auth().verifyIdToken(token);
      if (decodeValue) {
        req.body.uid = decodeValue.uid;
        req.body.userEmail = decodeValue.email;
        return next();
      }
    } catch (e) {
      return res.status(403).json({ message: "Invalid token" });
    }
  }
}

export default new Middleware();
