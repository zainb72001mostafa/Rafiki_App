const router = require("express").Router();
const verifyToken = require("../middlewares/authJwt");
const User = require("../models/userModel");

//get logged in user data
router.get("/api/user", [verifyToken], async (req, res) => {
    const user = await User.findById(req.userId);
    return res.status(200).json({
        flag: true,
        user
    });
});

//get all users
router.get("/api/users", [verifyToken], async (req, res) => {
    const users = await User.find();
    return res.status(200).json({
        flag: true,    
        users
    });
});

//get single user data (user profile)
router.get("/api/user/:userID", [verifyToken], async (req, res) => {
    try{
        const user = await User.findById(req.params.userID);
        
        if(!user){
            return res.status(200).json({message : `User with ID : ${req.params.userID} is not found !`, flag: false})
        }
        return res.status(200).json({
           flag: true,
            user
        });
    } catch(err){
        return res.status(200).json({message : err.message, flag: false});
    }
});

// update logged in user 
router.put("/api/user", [verifyToken], async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate(req.userId, {
            username : req.body.username,
            email : req.body.email 
        }, {new: true, runValidators: true});

        return res.status(200).json({
           flag: true,
            user
        });
    } catch(err){
        return res.status(200).json({
            message: err.message,
            flag: false
        });
    }
})




module.exports = router;

