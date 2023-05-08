

verifyIsRequiredFieldsInSignUp = (req, res, next) => {
  
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    if( (username == ""&&email == "") || (username == ""&&password == "") || (email == ""&&password == "") ){
      res.status(200).json("Fields are required");
      return;
    }else if(username == "" ){
       res.status(200).json("UserName is required");
       return;
    }else if(password == "" ){
      res.status(200).json( "Password is required" );
      return;
   }else if(email == "" ){
     res.status(200).json( "email is required" );
     return;
  }
  next();
};

module.exports=verifyIsRequiredFieldsInSignUp;

