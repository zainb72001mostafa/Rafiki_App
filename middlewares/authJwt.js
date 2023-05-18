const jwt = require("jsonwebtoken");
require('dotenv').config();

verifyToken = (req, res, next) => {
let token = req.session.token;

if (!token) {
    return res.status(200).json({ message: "No Token provided!", flag: false });
  }

try{
jwt.verify(token, process.env.secret, (err, decoded) => {
    if (err) {
        return res.status(200).json({ message: "Unauthorized!", flag: false});
      }
      req.userId = decoded.id;
      next();
    })
} catch (error ){
  res.status(200).json({ status: "server error", message: error.message , flag: false})

}


};

module.exports = verifyToken ;