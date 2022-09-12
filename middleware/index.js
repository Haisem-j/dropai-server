const admin = require("../config/firebase-config");
class Middleware {
  async decodeToken(req, res, next) {
    if (!req.headers.authorization) {
      return res.json({ message: "Error authorization refused" });
    }
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decodeValue = await admin.auth().verifyIdToken(token);
      if (decodeValue) {
        return next();
      }
    } catch (e) {
      return res.status(403).json({ message: "Invalid token" });
    }
  }
}

module.exports = new Middleware();
