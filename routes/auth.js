const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
const config = require("../config/config");


const issueToken = (req, res, next) => {

  const requestData = req.body;

  if(requestData.username === config.username && requestData.password == config.password) {
    const token = jwt.sign({uniqueId: config.uniqueId}, config.privateKey, { expiresIn: '12h' });
    return res.status(200).json({
      authenticated: true,
      token: token,
    });
  } else {
    res.status(401).json({authenticated: false});
  }

}

router.post('/', issueToken);

module.exports = router;