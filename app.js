var express    = require('express'),
mongoose       = require('mongoose'),
ejs            = require('ejs'),
passport       = require('passport'),
localStratergy = require('passport-local'),
methodOverride = require('method-override'),
bodyParser     = require('body-parser'),
flash          = require('connect-flash')
app            = express();
Student        = require('./model/Student')
VacationTask   = require('./model/VacationTask');
Assignment     = require('./model/Assignment');
User           = require('./model/User');

//=======================================
//mongodb
//=======================================
mongoose.connect("mongodb://localhost:27017/Stu_Man_Sys",{useNewUrlParser:true})

//========================================
//App Config
//========================================
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"));
app.set("view engine","ejs");
app.use(flash());

//PASSPORT CONFIG
app.use(require('express-session')({
	secret:"Silk is the best doggo ever",
	resave:false,
	saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error      =req.flash("error");
    res.locals.success    =req.flash("success");
    res.locals.info       =req.flash("info");
	next();
})

//====================================================
//SignUp Route
//====================================================

//shows register form
app.get("/register",function(req,res){
	res.render("register");
})

//handles signup logic
app.post("/register",function(req,res){
	var newUser= new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,retuser){
		if(err){
			 req.flash("error", err.message);
			res.redirect("back");
		}
		passport.authenticate("local")(req,res,function(){
		 req.flash("success","Welcome "+ retuser.username+" !")
			res.redirect("/dashboard");
		})
	})
})

//======================================================
//SignIn Routes
//======================================================

//shows login form
app.get("/login",function(req,res){
	res.render("login");
})

//handles login logic
app.post("/login",passport.authenticate("local",{
               successRedirect:"/dashboard",
               failureRedirect:"/register"
}),function(req,res){
	
})

//======================================================
//SignOut Route
//======================================================
app.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/");
})

//====================================================
//Middleware
//====================================================

function isLoggedIn (req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error","You need to be logged in to do that!");
  res.redirect("/login");
}

//==========================================
//Routes
//==========================================
app.get("/",function(req,res){
	res.render("landing");
})

app.get("/dashboard",isLoggedIn,function(req,res){
	res.render("dashboard");
})

app.get("/dashboard/task",isLoggedIn,function(req,res){
	res.render("task");
})


app.get("/dashboard/task/assignment",isLoggedIn,function(req,res){
	Assignment.find({},function(err,rettask){
		if(err){
			console.log("an error occurred");
			res.render("back");
		}
		else{
			res.render("assignment",{tasks:rettask})
		}
	})
})


app.get("/dashboard/task/assignment/new",isLoggedIn,function(req,res){
	res.render("newassignment");
})
app.post("/dashboard/task/assignment",isLoggedIn,function(req,res){
	console.log(req.body);
	var standard = req.body.standard;
	var body     = req.body.body;
    var newtask={standard:standard,body:body};
	Assignment.create(newtask,function(err,rettask){
		if(err){
			res.redirect("back");
			console.log("Error occurred")
		}
		else{
			console.log("successfully created a task");
			res.redirect("/dashboard/task/assignment");
		}
	})
})

app.get("/dashboard/task/assignment/:id",isLoggedIn,function(req,res){
	Assignment.findById(req.params.id,function(err,rettask){
		if(err){
			console.log("Error occurred");
			req.redirect("back");
		}
		else{
			res.render("show",{task:rettask});
		}
	})

})


app.get("/dashboard/task/vacationtask",isLoggedIn,function(req,res){
	VacationTask.find({},function(err,rettask){
		if(err){
			console.log("an error occurred");
			res.render("back");
		}
		else{
			res.render("vacationtask",{tasks:rettask})
		}
	})
})


app.get("/dashboard/task/vacationtask/new",isLoggedIn,function(req,res){
	res.render("newvacationtask");
})
app.post("/dashboard/task/vacationtask",function(req,res){
	console.log(req.body);
	var standard = req.body.standard;
	var body     = req.body.body;
    var newtask={standard:standard,body:body};
	VacationTask.create(newtask,function(err,rettask){
		if(err){
			res.redirect("back");
			console.log("Error occurred")
		}
		else{
			console.log("successfully created a task");
			res.redirect("/dashboard/task/vacationtask");
		}
	})
})

app.get("/dashboard/task/vacationtask/:id",isLoggedIn,function(req,res){
	VacationTask.findById(req.params.id,function(err,rettask){
		if(err){
			console.log("Error occurred");
			req.redirect("back");
		}
		else{
			res.render("show",{task:rettask});
		}
	})

})
//=======================================================
app.get("/dashboard/student/new",isLoggedIn,function(req,res){
	res.render("newstudent");
})

app.post("/dashboard/student",isLoggedIn,function(req,res){
	var studentimage= req.body.studentimage;
	var name = req.body.name;
	var standard = req.body.standard;
	var mothername     = req.body.mothername;
	var fathername = req.body.fathername;
    var number = req.body.number;
	
    var newstudent={studentimage:studentimage,name:name,standard:standard,mothername:mothername,fathername:fathername,number:number};
	Student.create(newstudent,function(err,retstudent){
		if(err){
			res.redirect("back");
			console.log("Error occurred")
		}
		else{
			console.log(retstudent);
			console.log("successfully created a student");
			res.redirect("/dashboard/student");
		}
	})
})

//=========================================================

app.get("/dashboard/student",isLoggedIn, function(req,res){
	res.render("studentview");
})

app.get("/dashboard/student/class1",isLoggedIn, function(req,res){
	Student.find({standard:"1"},function(err,retstudent){
		if(err){
			console.log("error occurred");
			res.redirect("back");
		}
		else{
			console.log(retstudent);
			res.render("class1",{students:retstudent});
		}
	})
})
app.get("/dashboard/student/class2",isLoggedIn, function(req,res){
	Student.find({standard:"2"},function(err,retstudent){
		if(err){
			console.log("error occurred");
			res.redirect("back");
		}
		else{
			console.log(retstudent);
			res.render("class2",{students:retstudent});
		}
	})
})
app.get("/dashboard/student/class3", isLoggedIn,function(req,res){
	Student.find({standard:"3"},function(err,retstudent){
		if(err){
			console.log("error occurred");
			res.redirect("back");
		}
		else{
			console.log(retstudent);
			res.render("class3",{students:retstudent});
		}
	})
})

app.get("/dashboard/student/class4",isLoggedIn, function(req,res){
	Student.find({standard:"4"},function(err,retstudent){
		if(err){
			console.log("error occurred");
			res.redirect("back");
		}
		else{
			console.log(retstudent);
			res.render("class4",{students:retstudent});
		}
	})
})

app.get("/dashboard/student/class5", isLoggedIn,function(req,res){
	Student.find({standard:"5"},function(err,retstudent){
		if(err){
			console.log("error occurred");
			res.redirect("back");
		}
		else{
			console.log(retstudent);
			res.render("class5",{students:retstudent});
		}
	})
})

app.get("/dashboard/student/class6",isLoggedIn, function(req,res){
	Student.find({standard:"6"},function(err,retstudent){
		if(err){
			console.log("error occurred");
			res.redirect("back");
		}
		else{
			console.log(retstudent);
			res.render("class6",{students:retstudent});
		}
	})
})

app.get("/dashboard/student/class7", isLoggedIn,function(req,res){
	Student.find({standard:"7"},function(err,retstudent){
		if(err){
			console.log("error occurred");
			res.redirect("back");
		}
		else{
			console.log(retstudent);
			res.render("class7",{students:retstudent});
		}
	})
})

app.get("/dashboard/student/class8",isLoggedIn, function(req,res){
	Student.find({standard:"8"},function(err,retstudent){
		if(err){
			console.log("error occurred");
			res.redirect("back");
		}
		else{
			console.log(retstudent);
			res.render("class8",{students:retstudent});
		}
	})
})

app.get("/dashboard/student/class9", isLoggedIn,function(req,res){
	Student.find({standard:"9"},function(err,retstudent){
		if(err){
			console.log("error occurred");
			res.redirect("back");
		}
		else{
			console.log(retstudent);
			res.render("class9",{students:retstudent});
		}
	})
})

app.get("/dashboard/student/class10",isLoggedIn, function(req,res){
	Student.find({standard:"10"},function(err,retstudent){
		if(err){
			console.log("error occurred");
			res.redirect("back");
		}
		else{
			console.log(retstudent);
			res.render("class10",{students:retstudent});
		}
	})
})

app.get("/dashboard/student/class11",isLoggedIn, function(req,res){
	Student.find({standard:"11"},function(err,retstudent){
		if(err){
			console.log("error occurred");
			res.redirect("back");
		}
		else{
			console.log(retstudent);
			res.render("class11",{students:retstudent});
		}
	})
})

app.get("/dashboard/student/class12", isLoggedIn,function(req,res){
	Student.find({standard:"12"},function(err,retstudent){
		if(err){
			console.log("error occurred");
			res.redirect("back");
		}
		else{
			console.log(retstudent);
			res.render("class12",{students:retstudent});
		}
	})
})

app.get("/dashboard/student/:class/:id",isLoggedIn,function(req,res){
	Student.findById(req.params.id,function(err,retstudent){
		if(err){
			console.log("error");
			res.redirect("back");
		}
		else{
			res.render("details",{student:retstudent});

		}

	})
})
//==========================================
//Server
//==========================================
app.listen(3000,function(){
	console.log("Student Management System App has started!")
})