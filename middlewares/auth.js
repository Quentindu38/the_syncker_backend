const config = require("../config/config");

const shouldBeAuthorized = (req, res, next) => {
  const xToken = req.headers["x-api-key"];
  if(xToken != config.privateKey) {
    return res.status(401).json("Unauthenticated");
  }
  next();
}

module.exports = shouldBeAuthorized;