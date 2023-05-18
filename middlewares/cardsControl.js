//const { Result } = require('express-validator');

const Card = require('../models/card');
const multer = require('multer');
const fs = require('fs');

//define destination and file name tfor
exports.storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/[\/\\:]/g, "_") + file.originalname);
    }
  });
  
//  filter file uploades Accept only image files
exports.fileFilter = function (req, file, cb) {
    
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

//get all cards
exports.getCards = (req, res, next) =>{
    Card.find({user: req.params.user}).then(cards =>{
        res.status(200).json({flag: true, message: "fetched cards", cards: cards});
    }).catch(err =>{
        res.status(200).json({flag: false, message:" ERROR",err: err});
    });
};

//add new card
exports.postCard = (req,res,next) =>{
    const {title} = req.body;
    const {path} = req.file;
    const {user} = req.params;

    const card = new Card({
        title ,
        imageUrl: path,
        user
    });
    card.save().then(result =>{
        res.status(200).json({flag: true, message: "card created",card: result});
    }).catch(err => {
        res.status(200).json({flag: false, message:" ERROR",err: err});
    });
};

 // get one card
exports.getCard = (req,res,next) =>{
    const cardId =req.params.cardId;
    const user = req.params.user;
    Card.findOne({_id: cardId, user}).then(card =>{
        if(!card){
            console.log("card not found");
            //res.status(200).json({message:"no card found"});
        }
        res.status(200).json({flag: true, message: "one card is fetched", card: card});
    }).catch(err => {
        res.status(200).json({flag: false, message:" ERROR",err: err});
    });
};

//update card
exports.updateCard = (req, res, next) =>{
    const cardId = req.params.cardId;
    let path;
    if(req.file){
        path = req.file.path;
    }else{
        path = req.body.imageUrl;
    }
    
    Card.findById(cardId).then(card =>{
        if(!card){
            console.log("not card found");
        }
        //delete old image
        if(path !== card.imageUrl){
            fs.unlink(card.imageUrl,err => {
                if(err){
                    console.log(err)
                }else{
                    console.log('old image deleted');
                }     
            });
        }
        card.title = req.body.title;
        card.imageUrl = path;
        return card.save();
    }).then(result =>{
        res.status(200).json({flag: true, message: "file updated",card: result});
    }).catch(err =>{
        res.status(200).json({flag: false, message:" ERROR",err: err});
    });

} 

//delete card
exports.deleteCard = (req, res, next) =>{
    const cardId = req.params.cardId;
    Card.findById(cardId).then(card =>{
        if(!card){
            console.log('no card found');
        }
        fs.unlink(card.imageUrl,err => console.log(err));
        return Card.findByIdAndRemove(cardId);
    }).then(result =>{
        console.log(result);
        res.status(200).json({flag: true, message: "card deleted successflly "});
    }).catch(err => {
        res.status(200).json({flag: false, message:" ERROR",err: err});
    });
};