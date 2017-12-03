//Set up requirements
var express = require('express');
var Request = require('request');
var bodyParser = require('body-parser');
var _ = require('underscore');
var getJsonClasses = require("./getClasses");


//Create an 'express' object
var app = express();

//Set up the public directory
app.set("public", __dirname + '/public');
//Set EJS as templating language WITH html as an extension
app.engine('.html', require('ejs').__express);
app.set('public engine', 'html');
//the above used to be (view engine, html), I changed it to public.

//Add connection to the public folder for css & js files
app.use(express.static(__dirname + '/public'));

// Enable json body parsing of application/json
app.use(bodyParser.json());

//DATABASE CONFIG

// var cloudant_USER = 'YOUR-USER-NAME';
// var cloudant_DB = 'YOUR-DB-NAME';
// var cloudant_KEY = 'YOUR-KEY';
// var cloudant_PASSWORD = 'YOUR-PASSWORD';
// var cloudant_URL = "https://" + cloudant_USER + ".cloudant.com/" + cloudant_DB;

//ADD CORS TO ALL ROUTES
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//Declare a route


app.get('/', function(req, res){
	console.log("is this the real life");
	res.render('index', {page: 'get all data'});
});

//Main Page Route - Show SINGLE word via Clientside Request
app.get("/myPage", function(req, res){
	//determine who the user is
	const user= null; 
	res.render('userProfile', {page: user});
});


//SAVE an object to the db
app.post("/save", function(req,res){

	//Get the data from the body
	var data = req.body;
	console.log(data);

	//Send the data to the db
	// Request.post({
	// 	url: cloudant_URL,
	// 	auth: {
	// 		user: cloudant_KEY,
	// 		pass: cloudant_PASSWORD
	// 	},
	// 	json: true,
	// 	body: data
	// },
	// function (error, response, body){
	// 	if (response.statusCode == 201){
	// 		console.log("Saved!");
	// 		res.json(body);
	// 	}
	// 	else{
	// 		console.log("Uh oh...");
	// 		console.log("Error: " + res.statusCode);
	// 		res.send("Something went wrong...");
	// 	}
 // });
 	console.log("this is where the saving should have happened");
});


//GET objects from the database
//Also a JSON Serving route (ALL Data)
app.get("/api/all", function(req,res){
	console.log('Making a db request for all entries');
	
	// Use the Request lib to GET the data in the CouchDB on Cloudant
	// Request.get({
	// 	url: cloudant_URL + "/_all_docs?include_docs=true",
	// 	auth: {
	// 		user: cloudant_KEY,
	// 		pass: cloudant_PASSWORD
	// 	},
	// 	json: true
	// },
	// function (error, response, body){
	// 	var theRows = body.rows;
	// 	//Send the data
	// 	res.json(theRows);
	// });

});



//GET objects from the database
//Also a JSON Serving route (ALL Data)
app.get("/course-ad", function(req,res){
	// this should serve as a point where I query db.

	const parsedClassesJson = getJsonClasses();
	res.json(parsedClassesJson);

});



app.get('*', function(request, response){
	console.log("whoooaattt");
	response.send("don't you snoop around! There's nothing for you here!");
});




//Start the server
app.listen(3000);
console.log("Express App running at localhost:3000");