const User = require("../models/userModel");


checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({username: req.body.username })
       .then(user => {
          if (user) {
           res.status(200).json({ message: "Failed! Username is already in use!" });
            return;
             }

      // Email
      User.findOne({ email: req.body.email })
         .then( user => {
           if (user) {
            res.status(200).json({ message: "Failed! Email is already in use!" });
            return;
           }
  
        next();
      })
      .catch(err => {
        res.status(200).json({ message: err });
        return;
      });
    })
    .catch(err => {
      res.status(200).json({ message: err });
      return;
    });
    
  };
  
  module.exports = checkDuplicateUsernameOrEmail;