var dragElement = null;
var classBoxes= []; 
var fourYears= []; //contains yearBoxes
var unselectedClasses = null; //object that contains selected classes that hasn't been allocated yet.
var offsetX, offsetY;  // Mouseclick offset
var dragging = false;
var classes= []; //global total classes object
var selectClasses=[];
var classesReady=false;

///////////////////////////From Previous Project/////////////////////////

var category = JSON.parse('{"Previous Core Curriculum":["42","43","44","45","46","47","48"],"Islamic Studies":["49"],"Language":["50","51","52","53","161"],"Art and Art History":["59","60","61","62","159","160"],"Arts and Humanities Colloquia":["63"],"Biology":["64","65","66","67"],"Chemistry":["68","69"],"Civil Engineering":["70","71"],"Computer Engineering":["72"],"Computer Science":["73","74"],"Economics":["75","76","77","78"],"Electrical Engineering":["79","80"],"Film and New Media":["81","82","83","84","85"],"Foundations of Science":["86"],"General Engineering":["87","88","89","90"],"History":["91","92","93","94","95","96","97","98","162"],"Literature and Creative Writing":["99","100","101","102","103","158"],"Mathematics":["104","105"],"Mechanical Engineering":["106","107"],"Music":["108","109","110","111","112","113","114","115","116","117"],"Philosophy":["118","119","120","121","122","123","124"],"Physics":["125"],"Political Science":["126","127","128","129","130","131","132"],"Psychology":["134","135","136","137"],"Social Research and Public Policy":["138","139","140"],"Theater":["141","142","143"],"Visual Arts":["144","145","146","147"],"Arab Crossroads":["55","56","57","58","157"],"Physical Education":["148"],"Pre-Professional Courses":["149","150","151","152","154","155","156"],"Core Curriculum":["163","164","165","166","167","168"]}');

var int2semester = {
  0: 'Fall',
  1: 'J-term',
  2: 'Spring',
  3: 'Summer'
}

var years = ["Freshman", "Sophomore", "Junior", "Senior"];

function get_course_element(course, id_num) {
  var id = course.ID;
  var title = course.title;
  var semester = [];
  for (var i = 0; i < 4; i++) {
    if (course.semester[i]) {
      semester.push(int2semester[i]);
    }
  }

  var course_li = document.createElement('li');
  course_li.setAttribute('class', 'course');
  course_li.setAttribute('id', 'course' + id_num);
  // course_li.setAttribute('draggable', 'true');
  // course_li.setAttribute('ondragstart', 'dragstart_handler(event);');
  // course_li.setAttribute('offering', )

  var course_h4 = document.createElement('h4');
  course_h4.setAttribute('class', 'course-heading');

  var course_span_id = document.createElement('span');
  var course_span_title = document.createElement('span');
  course_span_id.setAttribute('class', 'course-id');
  course_span_id.appendChild(document.createTextNode(id + ' '));
  course_span_title.setAttribute('class', 'course-title');
  course_span_title.appendChild(document.createTextNode(title));

  var course_p = document.createElement('p');
  course_p.setAttribute('class', 'semester-offered');
  course_p.appendChild(document.createTextNode(semester.join(', ')));

  course_h4.appendChild(course_span_id);
  course_h4.appendChild(course_span_title);
  course_li.appendChild(course_h4);
  course_li.appendChild(course_p);

  return course_li;
}

function populate_course_list() {
    //gets called once at the page load.

    //classes is a global object that gets filled when we make the json call.
    var course_box = document.getElementById('course-box');
    for (var i = 0; i < classes.length; i++) {
      course_box.appendChild(get_course_element(classes[i], i));
    }
  
}

function populate_type_dropdown() {
  //gets called once at the page load.

  var dropdown = document.getElementById('course-type');
  var types = Object.keys(category);

  types.forEach(function(type) {
    var option = document.createElement('option');
    // todo: add value to element
    var text = document.createTextNode(type);
    option.appendChild(text);
    dropdown.append(option);
  });

}

function get_criteria () {

  var type = document.getElementById('course-type').value;
  var semester = document.getElementById('course-semester').value;
  var keyword = document.getElementById('course-name').value;
  return {'title': keyword, 'semester': parseInt(semester), 'type': category[type]}

}

function filter_course_list(event) {
  event.preventDefault();
  var criteria = get_criteria();

  var all_courses = classes;
  selectClasses=[];

    all_courses.forEach(function(course) {
      // check for title
      var title = (course.title.toLowerCase().indexOf(criteria.title.toLowerCase()) !== -1);
      // check for semester
      var semester = (criteria.semester === -1 || course.semester[criteria.semester] === 1);
      // check for requirement
      var req = false;

      if (criteria.type === undefined) {
        req = true;
      } else {
        course.requirements.forEach(function(r) {
          if (criteria.type.includes(r)) {
            req = true;
          }
        });
      }

      if (title && semester && req) {
        selectClasses.push(course);
      }
    });

    $('#course-box').empty();
    
    for (var i = 0; i < selectClasses.length; i++) { //classes
      $('#course-box').append(get_course_element(selectClasses[i], i));
    }

  return false;

}



////////////////////////////////////////////////////////////


 function getClassData(){
  $.ajax({
    url: '/course-ad',
    type: 'GET',
    dataType: 'json',
    error: function(data){
      alert("Couldn't get data! Try a refresh.");
    },
    success: function(data){
      //You could do this on the server
      classes = data;
      selectClasses = data;
      classesReady = true;  

      createEmptyFourYears();
      populate_type_dropdown();
      populate_course_list();
    
    }
  });
}



function createEmptyFourYears(){
  //create an array of four semesters per year, and then append it to fourYears.
  for(var i=0; i<4; i++){
    var year = new YearBox(i);
    for(var j=0; j<4; j++){
      year.semesters.push(new SemesterBox(i,j));
    }
    fourYears.push(year);
  }
}



$(document).ready(function(){
  getClassData();
  unselectedClasses = new UnselectedClassesBox();
});


function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

}


function setup() {
   createCanvas(windowWidth,windowHeight);
   noFill();
}


function mousePressed(){
  for (var i = 0; i < classBoxes.length; i++){

    if (classBoxes[i].hovered){
        
        //check if we're deleting this box.
        if( mouseX > classBoxes[i].xBoxX && mouseY < classBoxes[i].xBoxY){

          classBoxes[i].deleteBox();

        }else{

          dragElement= classBoxes[i];
          offsetX = classBoxes[i].x-mouseX;
          offsetY = classBoxes[i].y-mouseY;
          dragging = true;
         
        }
    }
  }
}

function mouseReleased() {

  //if released at a semester, add the classBlock to the semester.
  //if not, remove it

  for(var i=0; i<fourYears.length; i++){

    //drop the class on this semester.
    if (dragging && fourYears[i].hovered){

      if( fourYears[i].semesterId == ( dragElement.placedAt - (dragElement.placedAt%10) )/10){
        //the class is from this semester. Don't bother changing stuff
        
      }else{

        removeClassFromPrevSemester();
        addClassToSemester(fourYears[i]);

      }

    }


  }
  // Quit dragging
  dragging = false;
  dragElement= null;

}


function draw() {
  background(225,225,225);
  //Check if the data is ready
  if (classesReady){
      unselectedClasses.display();
      //Loop through semester object and 
      for (var i=0; i<fourYears.length; i++) {
        fourYears[i].display();
        // console.log(fourYears[i]);
      }
  }
}


function removeClassFromPrevSemester(){
  //search through fourYears, find id.
  
  //review this calculation
  const index = (dragElement.placedAt - dragElement.placedAt%10 ) /10;

  fourYears[index].splice( dragElement.placedAt%10, 1);

}

function addClassToSemester(semester){

    semester.push(dragElement);
    dragElement.placedAt = semester.semesterId * 10 + semester.classes.length -1 ;

}


/*


classObj{

  classReal: boolean;
  className: string;
  classNumber: string;
  classOfferedAt: int; -> integer determines when it is offered.
  preReqs: [list of prereqs];
  coReqs: [list of coreqs];

}

*/

function UnselectedClassesBox(){
  this.classes=[];
  this.full = false;
}

UnselectedClassesBox.prototype.display = function(){
  stroke('#222222');
  strokeWeight(2);

  var x = 30 + width * 3/5; ;
  var y = 60;
  var widthUnselected = width - x - 20;
  var heightUnselected = height - y - 20;
  rect (x,y, widthUnselected,heightUnselected);
  
  for(var i=0; i<this.classes.length; i++){
    //calculate x, y, width, height
    var classX = (x + 10);
    var classY = (y + i * (classWidth+2));
    var classWidth= (widthUnselected - this.classes.length *2) / Math.max( 4 , this.classes.length )
    var classHeight= (height * 2 / 9 ) * 1/4;
    this.classes[i].display(classX,classY,classWidth,classHeight);
  }

} 

//year object
function YearBox(year){

  this.yearId = year;
  this.semesters= [];

}

YearBox.prototype.display = function(){
  
  stroke('#222222');
  strokeWeight(2);

  var x = 10;
  var y = 10 + height / 4  * this.yearId;
  var widthYear = width * 3 /5;
  var heightYear = height * 2 / 9;
  // console.log("x: "+x+" y: "+y+" width: "+width+" height: "+height);
  rect(x, y, widthYear, heightYear);

  for(var i=0; i<this.semesters.length; i++){
    this.semesters[i].display(widthYear, heightYear);
  }

};


//semester object
function SemesterBox(year, semester){
  this.x = null;
  this.y = null;
  this.widthSemester=null;
  this.heightSemester=null;
  this.year= year;
  this.semester = semester;
  this.semesterId = year * 4 + semester; //if odd, then a short semester
  this.classes= [];
  this.hovered= false;

}

SemesterBox.prototype.display = function(yearBoxWidth, yearBoxHeight){
  // console.log("we should be drawing this!");

  stroke('#222222');
  strokeWeight(2);

  this.x = 20 + ( this.semesterId % 2 === 0 ? 0 : yearBoxWidth * 3/4 );
  this.y = 20 + height/4 * this.year + (this.semester < 2 ? 0: yearBoxHeight/2);
  this.widthSemester =  this.semesterId%2 === 0 ? yearBoxWidth * 3.5/5 : yearBoxWidth * 1/5;
  this.heightSemester = yearBoxHeight / 3;

  // console.log("x: "+x+" y: "+y+" width: "+width+" height: "+height);
  rect(this.x, this.y, this.widthSemester, this.heightSemester);

  for(var i=0; i<this.classes.length; i++){
    this.classes[i].display();
  }

};

SemesterBox.prototype.update = function(){

  this.checkHoverState();
  
};

SemesterBox.prototype.checkHoverState = function(){
  if (mouseX > (this.x - this.xWidth/2 - 10) && mouseX < (this.x + this.xWidth/2 + 10) &&
  mouseY > (this.y - this.yHeight/2 -10) && mouseY < (this.y + this.yHeight/2 + 10)){
    this.borderColor = this.borderColor+20;
    this.hovered = true;
    return true;
  }
  else{
    this.borderColor = this.borderColor-20;
    this.hovered = false;
    return false;
  }
};



//classes object
function ClassBox(classObj,x,y,width,height){

  //x and y values have to be updated as well as semIndex and semesterId
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  
  this.name =null;
  this.info = null;
  this.semesterId = null; //semesterId
  this.hasProblem=false;  
  this.preReqs = classObj.preReqs;
  this.hovered = false;

}

ClassBox.prototype.display = function(x,y,width,height){
  //Draw body
  var strokeWeightVal = 4;
  if(this === dragElement ){

    stroke('rgb(0,255,0)');
    strokeWeight(strokeWeightVal);

    //this box is being dragged.
    rect(mouseX+offsetX, mouseY+offsetY, this.width, this.height);

  }else{

    //update the values. we could potentially find a better place for this.
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
   
    if(this.hasProblem){

      stroke('red');   
   
    }else{

      stroke('rgb(0,255,0)');

    }
    strokeWeight(strokeWeightVal);
    rect(this.x, this.y, this.width, this.height);
  }

  //add Text to this class.

};

ClassBox.prototype.update = function(){

  this.checkHoverState();

};

ClassBox.prototype.checkHoverState = function(){
  if (mouseX > (this.x - this.width/2 - 10) && mouseX < (this.x + this.width/2 + 10) &&
  mouseY > (this.y - this.height/2 -10) && mouseY < (this.y + this.height/2 + 10)){
    this.hovered = true;
    return true;
  }
  else{
    this.hovered = false;
    return false;
  }
};


ClassBox.prototype.deleteBox = function(){
  console.log("deleted the class");
  //first get rid of this from the array

  //update class array object to allow for searching this again.

}
