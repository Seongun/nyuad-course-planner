//Set up requirements
var express = require('express');
var Request = require('request');
var bodyParser = require('body-parser');

var _ = require('underscore');
var getJsonClasses = require("./getClasses");
// var crawler = require("./albertScraper");

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

var cloudant_USER = '63282ab8-00b3-41dd-8750-bb9ed6f79fb0-bluemix';
var cloudant_DB = 'mashups_final';
var cloudant_KEY = 'dearienteringdoweendains';
var cloudant_PASSWORD = '87dbe20c67c5499aa65698458a46ac4598459b01';
var cloudant_URL = "https://" + cloudant_USER + ".cloudant.com/" + cloudant_DB;


//ADD CORS TO ALL ROUTES
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//Declare a route


app.get('/', function(req, res){

	res.render('index', {page: 'get all data'});
});

//Main Page Route - Show SINGLE word via Clientside Request
app.get("/about", function(req, res){	
	res.render('about');

});


//SAVE an object to the db
app.post("/save", function(req,res){

	//Get the data from the body
	var data = req.body;
});




//GET objects from the database
//Also a JSON Serving route (ALL Data)
app.get("/api/course-ad", function(req,res){
	// this should serve as a point where I query db.

	const parsedClassesJson = getJsonClasses();
	res.json(parsedClassesJson);


});



app.get('*', function(request, response){
	response.send("don't you snoop around! There's nothing for you here!");
});




//Start the server
var port= process.env.PORT || 3000;
app.listen(port);// changed for the sake of heroku
console.log("Express App running at localhost:3000");





