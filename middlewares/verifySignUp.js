const User = require("../models/userModel");


checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({username: req.body.username })
       .then(user => {
          if (user) {
           res.status(200).json({ message: "Failed! Username is already in use!", flag: false });
            return;
             }

      // Email
      User.findOne({ email: req.body.email })
         .then( user => {
           if (user) {
            res.status(200).json({ message: "Failed! Email is already in use!", flag: false });
            return;
           }
  
        next();
      })
      .catch(err => {
        res.status(200).json({message:" ERROR",err: err, flag: false});
        return;
      });
    })
    .catch(err => {
      res.status(200).json({message:" ERROR",err: err, flag: false});
      return;
    });
    
  };
  
  module.exports = checkDuplicateUsernameOrEmail;