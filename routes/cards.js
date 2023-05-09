const express = require('express');
const multer = require('multer');
const storage = require('../middlewares/cardsControl').storage;
const fileFilter = require('../middlewares/cardsControl').fileFilter;
const upload = multer({ storage: storage, fileFilter: fileFilter });
const cardsControl = require('../middlewares/cardsControl');
const router = express.Router();


//GET  all cards of specific user    
router.get('/:user/cards',cardsControl.getCards);

//GET  get only one card
router.get('/:user/card/:cardId', cardsControl.getCard);

//POST card 
router.post('/:user/card/add',upload.single('image'),cardsControl.postCard);

//PUT
router.put('/card/:cardId/update',upload.single('image'),cardsControl.updateCard);

//DELETE
router.delete('/card/:cardId/delete',cardsControl.deleteCard);

module.exports = router;
