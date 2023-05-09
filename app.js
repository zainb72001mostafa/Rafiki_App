const express = require("express");
const mongoose=require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
var session = require('express-session');
require('dotenv').config();
const multer = require('multer');
const app = express();
const PORT = 4000;



app.use(session({ secret: process.env.secret, resave: false, saveUninitialized: true }));

// connection to mongodb
var DB_URL=process.env.DB_URL;
mongoose.connect(DB_URL, { //need to change
    useNewUrlParser: true,
    useUnifiedTopology: true,  
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('[INFO] Connect to DB success!');
});


app.use(cors());
app.set("view engine", "ejs");


/**** Middlewares*****/

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//serv images folder
app.use(express.static('uploads'));


// routes
app.use(require("./routes/authRoute"));
app.use(require("./routes/userRoute"));
app.use(require("./routes/todo"));
app.use(require("./routes/cards"));



// Server Configurations 
app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("🚀 Server listening on PORT", PORT);
});

