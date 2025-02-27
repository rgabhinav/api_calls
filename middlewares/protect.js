const jwt = require("jsonwebtoken");
const userModel = require('../models/user-model');

module.exports.protect = async (req, res, next) => {
  if (req.cookies.token) {
    try {
      const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

      req.user = await userModel
        .findOne({ email: data.email })
        .select("-password");

      next();
    } catch (err) {
      res.status(401).send("Not Authorized!");
    }
  }
  if (!req.cookies.token) {
    res.send(401).send("Not Authorized, You don't have permission to access.");
  }
};
