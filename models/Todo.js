const mongoose=require('mongoose');

const TodoSchema = new mongoose.Schema({
    title: {
		type: String,
		required: true
	},
    description: {
        type: String,
        required: false
    },
    Hours: {
       type: Number,
       required: false ,
     
    },
    Minutes: {
        type: Number,
        required: false ,
      
     },
     Seconds: {
        type: Number,
        required: false ,
     },
     timeoutObj: {
         type: Number,
         required: false
     },
    isDone: {
        type: Boolean,
        default:false,
        required: false 
        
    },
    user: {
        type: String,
        required: true
    }
});


module.exports = new mongoose.model("Todo",TodoSchema);