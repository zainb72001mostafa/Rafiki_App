const notifier = require('node-notifier');
const path = require('path');
 const isEmpty = require("is-empty");
 const Todo = require('./models/Todo');


// Return Time in Milliseconds
 
const toMilliseconds =(Hours,Minutes,Seconds) => { return (Hours*60*60 + Minutes*60 + Seconds)*1000 };

 const If_Conditional_Timer= ( Data, id ) => {
    let Hours = !isEmpty(Data.Hours) ? Data.Hours : 0 ;
    let Minutes = !isEmpty(Data.Minutes) ? Data.Minutes : 0 ;
    let Seconds = !isEmpty(Data.Seconds) ? Data.Seconds : 0 ;
     if( Hours > 0 || Minutes > 0 || Seconds > 0 ){
       if(id){
      const {timeoutObj} = Todo.find({ _id: id})
          if({timeoutObj}) clearTimeout({timeoutObj});
        }
      let timeoutObj = setTimeout(Notifier_fun,toMilliseconds(Hours,Minutes,Seconds) );
       return timeoutObj;
        }

}

// Notifier Function

function Notifier_fun(){
  notifier.notify({
    sound: true,
    wait: true,
    title: 'Notification',
    message: 'Time out !',
    icon: path.join(__dirname + './notifier-img.png')
  });
  
}

module.exports = If_Conditional_Timer;
    