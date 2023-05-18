const router = require("express").Router();
const isEmpty = require("is-empty");
const Todo = require('../models/Todo');

const validateTodoInput = require("../validation/todoValidation.js");
const If_Conditional_Timer = require("../CallBackFunctions");



/******** routes ************/

/*****  get any single task in todo ******/

  router.get("/:user/todos/:id", (req, res) => {

		Todo.findOne({ _id: req.params.id, user: req.params.user })
				.then(todo => {
					res.status(200).json({
            flag: true,
            todo 
          });
				})
				.catch(err => {
         return res.status(200).json({message:" ERROR",err: err, flag: false});
				});
});


/****** get Not completed todos of user ******/

router.get("/:user/todo/Notcompleted", ( req, res) => {
	Todo.find({ isDone: false, user: req.params.user})
  .then(todos => {
		res.status(200).json({
      flag: true,
      todos
    });
	})
  .catch(err => {
    return res.status(200).json({message:" ERROR",err: err, flag: false});
  });
  
 });



/*********  add New Todo ******/

router.post("/:user/todos/add", (req , res) => {
  
 

  const { errors, isValid } = validateTodoInput(req.body);

  if( !isValid ){
      return res.status(200).json({message:" ERROR",err: errors, flag: false}); // Bad Request Error
  }

   let timerid = If_Conditional_Timer(req.body) ;


    const newTodo = new Todo({
    user: req.params.user,
    title: req.body.title,
    description: req.body.description ,
    Hours: req.body.Hours,
    Minutes: req.body.Minutes,
    Seconds: req.body.Seconds,
    timeoutObj: timerid,
    isDone: req.body.isDone
   
  }); 

  // save the todo
  newTodo
   .save()
   .then(() => {
     res.status(200).json({
      message: "Successfully added todo!",
      flag: true
      });
   // res.redirect("/"); // redirect to home .. like Refresh
   })
   .catch(err => {
     res.status(200).json({message:" ERROR",err: err, flag: false});
  });
});


  /******  Edit a todo ******/

  router.patch("/todos/edit/:id", ( req, res ) => {
   
    const { errors, isValid } = validateTodoInput(req.body);

     // Check if there is any updated data in req.body
    if (!isValid) {
      return res.status(200).json({message:" ERROR",err: errors, flag: false});  // Bad Request Error
    }
    
    let Hours = !isEmpty(req.body.Hours) ? req.body.Hours : 0 ;
    let Minutes = !isEmpty(req.body.Minutes) ? req.body.Minutes : 0 ;
    let Seconds = !isEmpty(req.body.Seconds) ? req.body.Seconds : 0 ;

  If_Conditional_Timer(req.body, req.params.id) ; 


    Todo.updateOne(
      { _id: req.params.id },
      {
        $set: { // $set means update specific data in set
          title: req.body.title,
          description: req.body.description,
          Hours: Hours,
          Minutes: Minutes,
          Seconds: Seconds,
          isDone: req.body.isDone
        }
      }
    )
    
    .then(() => {
      res.status(200).json({
      message:  "Updated Successfully!",
      flag: true
      });
     })
     
     .catch(err => {
      res.status(200).json({message:" ERROR",err: err, flag: false});
    });

  });

  
  /******** delete a todo  *****/

  router.delete("/todos/delete/:id", (req, res) => {
    Todo.deleteOne({ _id: req.params.id })
        .then(() => {
           res.status(200).json({
           message:  "Deleted Todo Successfully!",
           flag: true
            });
          // res.redirect("/");  // redirect to home .. like Refresh
          })
        .catch(err => {
          res.status(200).json({message:" ERROR",err: err, flag: false});
         });
  });

  // task isDone 
  
  router.patch('/todo/done/:id',( req, res ) => {

    Todo.updateOne(
      { _id: req.params.id },
      {
        isDone: true
      })
      .then(() => {
       res.status(200).json({
        message: "Task is done!",
        flag: true
        });
       })
  
     .catch(err => {
      res.status(200).json({message:" ERROR",err: err, flag: false});
      });

});

 // get all completed tasks
  
 router.get("/:user/todo/completed", ( req, res) => {
	Todo.find({ isDone: true, user: req.params.user})
  .then(todos => {
		res.status(200).json({
      flag: true,
      todos
    });
	})
  .catch(err => {
    res.status(200).json({message:" ERROR",err: err, flag: false});
  });
  
 });


 

module.exports = router;