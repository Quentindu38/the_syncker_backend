const jwt = require("jsonwebtoken");
const config = require("../config/config");

const shouldBeAuthorized = (req, res, next) => {
  const xToken = req.headers["x-api-key"];
  jwt.verify(xToken, config.privateKey, (err, decodd) => {
    if(err) {
      return res.status(401).json("Unauthenticated");
    }
    next();
  });
}

module.exports = shouldBeAuthorized;