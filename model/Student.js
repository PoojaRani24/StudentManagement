var mongoose = require('mongoose')

var StudentSchema =new mongoose.Schema({
	studentimage:String,
	name:String,
	standard:String,
	mothername:String,
	fathername:String,
	number:String
	/*teacher:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Teacher"
		},
		username:String
	}
	*/
})
	

module.exports = mongoose.model("Student",StudentSchema);

