const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).end();
    }
    req.userId = decoded.userId;
    next();
  });
};

module.exports = { verifyJWT };
