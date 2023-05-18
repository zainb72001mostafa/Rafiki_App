

verifyIsRequiredFieldsInSignUp = (req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    if( (username == ""&&email == "") || (username == ""&&password == "") || (email == ""&&password == "") ){
      const data = {
        message: "Fields are required",
        flag: false
      };
      res.status(200).json(data);
      return;
    }else if(username == "" ){
      const data = {
        message: "UserName is required",
        flag: false
      };
       res.status(200).json(data);
       return;
    }else if(password == "" ){
      const data = {
        message: "Password is required",
        flag: false
      };
      res.status(200).json(data);
      return;
   }else if(email == "" ){
    const data = {
      message: "email is required",
      flag: false
    };
     res.status(200).json(data );
     return;
  }
  next();
};

module.exports=verifyIsRequiredFieldsInSignUp;

