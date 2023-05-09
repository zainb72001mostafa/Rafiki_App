const router = require("express").Router();
const User = require("../models/userModel");
const checkDuplicateUsernameOrEmail = require("../middlewares/verifySignUp");
const verifyIsRequiredFieldsInSignUp = require("../middlewares/verifyIsRequiredFields");
require('dotenv').config();

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");

// Register Function
router.post("/api/auth/signup",[verifyIsRequiredFieldsInSignUp],[checkDuplicateUsernameOrEmail] ,(req , res) => {

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  })
// save user data
  user
  .save()
  .then(() => {
    res.status(200).json("Registered Successfully!");

  })
  .catch((err) => res.send(err));

 });

// Login Function 
router.post("/api/auth/signin", (req, res) => {
 let username = req.body.username;
 let password = req.body.password;
 if(username == "" && password == ""){
  return res.status(200).json("Fields are required");
 }else if(username == ""){
  return res.status(200).json( "UserName is required" );
}else if(password == ""){
  return res.status(200).json( "Password is required" );
}
else{

User.findOne({ username: req.body.username })
    .then( user => {
 
      if (!user) {
        return res.status(200).json({ message: "User Not found." });
      }
      
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

    
  if (!passwordIsValid) {
   return res.status(200).json({ message: "Invalid Password!" });
  }
 

  var token = jwt.sign({ id: user.id }, process.env.secret, {
    expiresIn: 86400, // 24 hours
  });

// save JWT token in the session to make it available to the app

req.session.token = token;

  res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
    });

     })
.catch(err => {
  res.status(200).json(err);
});
}
});

// logout function
router.post("/api/auth/signout", (req, res) => {
try {
  req.session = null;
   res.status(200).json({ message: "You've been log out!" });
} catch (err) {
  res.status(200).json(err);
}
});


/**** Forget password ****/

router.post("/forget-password", async(req, res) => {

var server_name = req.headers.host; // Get server name from request
var protocol = req.protocol; // Get protocol (http or https)
const {email} = req.body;
const oldUser = await User.findOne({email});
try{
if(!oldUser){
return res.status(200).json( "User Not Exists!!" );
}

const secret = process.env.JWT_SECRET+oldUser.password;
const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
expiresIn: "5m",
});
const link = ``+protocol+`://`+server_name+`/reset-password/${oldUser._id}/${token}`;

var transporter = nodemailer.createTransport({
service: "gmail",
auth: {
  user: process.env.auth_email ,
  pass: process.env.auth_password,
},
});

var mailOptions = {
from: process.env.auth_email,
to: email,
secure: true,
subject: "Password Reset",
html:
'<p>Please click on the following link to reset your password:</p>' +
link,
};

transporter.sendMail(mailOptions, function (error, info) {
if (error) {
  res.status(200).json('Error in sending email  ' + error);
} else {
  console.log("Email sent: " + info.response);
}
});

res.status(200).json("email has been sent successfully to client!");
}catch (error) { }

});

// get request for reser-password
router.get("/reset-password/:id/:token", async(req, res) => {
const {id,token} = req.params; 
const oldUser = await User.findOne({_id: id});
if (!oldUser) {
return res.status(200).json( "User Not Exists!!" );
}
const secret = process.env.JWT_SECRET+oldUser.password;
try{
const verify = jwt.verify(token,secret);
res.render("index",{ email: verify.email, status: "Not Verified" })

}catch (error) {
console.log(error);
res.status(200).json("Not Verified ");
}

});

// post request for reset-password

router.post("/reset-password/:id/:token", async (req, res) => {
const {id,token} = req.params; 
const {password} = req.body;
const oldUser = await User.findOne({_id: id});
if (!oldUser) {
return  res.status(200).json( "User Not Exists!!" );
}
const secret = process.env.JWT_SECRET+oldUser.password;
try{
const verify = jwt.verify(token,secret);
const encryptedPassword = await bcrypt.hash(password, 10);
await User.updateOne(
{
 _id: id,
},
{
  $set: {
   password: encryptedPassword,
  },
}
);
res.render("index", { email: verify.email, status: "verified" });

} catch (error) {
console.log(error);
res.status(200).json({ status: "Something Went Wrong" });
}


});


module.exports = router;

