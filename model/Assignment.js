var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
	 standard:String,
	 body :String,
	 date :String,
	 teacher:{
	 	      id:{
	 	      	type:mongoose.Schema.Types.ObjectId,
	 	       ref:"Teacher"
	 	        },
	 	       username:String
	 	   }
})

module.exports = mongoose.model("Assignment",taskSchema);