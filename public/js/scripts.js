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

  var course_p = document.createElement('span');
  course_p.setAttribute('class', 'semester-offered');
  course_p.appendChild(document.createTextNode(semester.join(', ')));


  var course_button = document.createElement('button');
  $(course_button).text("Add Class");
  course_button.setAttribute('idVal', id);
  course_button.setAttribute('titleVal', title);
  course_button.setAttribute('semester', semester.join(','));
  course_button.setAttribute('class', 'btn-primary pull-right');
  
  course_button.onclick = modalClassAdded;

  course_h4.appendChild(course_span_id);
  course_h4.appendChild(course_span_title);
  course_li.appendChild(course_h4);
  course_li.appendChild(course_p);
  course_li.appendChild(course_button);

  return course_li;
}
function modalClassAdded(){

  if(unselectedClasses.classes.length>5){

    alert("first handle the classes you have below!");

  }else{

    var element= $(this);
    $(this).parent().hide();
/*
classObj{
  className: string;
  classNumber: string;
  classOfferedAt: []
  preReqs: [list of prereqs];
  coReqs: [list of coreqs];
}
*/
    var classObj=  {
      classNumber: element.attr('idval'),
      className: element.attr('titleval'),
      classOfferedAt: element.attr('semester').split(','),
      preReqs: [],
      coReqs:[],
      semesterId: -1
    };

    var x = 20;
    var y = 20;
    var width = 30;
    var height = 30;
    var classBoxObj= new ClassBox(classObj, x, y, width, height);

    unselectedClasses.classes.push(classBoxObj);
    classBoxes.push(classBoxObj);
   
  }

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
      // check if course is offered in any of the semesters.
      var offered = course.semester[0]===1 || course.semester[1]===1 || course.semester[2]===1 || course.semester[3]===1;
      // check if course has already been selected.
      var notSeen = true;

      if(title =="Jews in the Muslim World in the Middle Ages"){

        console.log("is it offered?");
        console.log(offered);
      }

      for( var i=0; i<classBoxes.length; i++){
        if(classBoxes[i].name == course.title){
          notSeen= false;
          break;
        }
      } 

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

      if (title && semester && req && offered && notSeen) {
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
        
        // remove from the list, re-attach at the
        if( mouseButton ==RIGHT ){

          deleteBox(classBoxes[i]);

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
  console.log("released");
  //if released at a semester, add the classBlock to the semester.
  //if not, remove it
 
  //moving class to the unselectedClasses.
  if(dragging && unselectedClasses.hovered){

      if( dragElement.semesterId  === -1 ){
            
              console.log("I'm back where I belong, I never felt so good");

      }else{
      
          console.log("relocated element to unselected")
          relocateClassBox(dragElement.semesterId , -1);
      
      }

  //if we had been dragging otherwise
  }else if(dragging){

    for(var i=0; i<fourYears.length; i++){
      for (var j=0; j<fourYears[i].semesters.length;j++){

          //drop the class on this semester.
          if ((fourYears[i].semesters)[j].hovered){
             console.log("moved it to semester "+ 4*i+j); 

            if(  dragElement.semesterId  === (4 * i + j ) ){
              
                console.log("I'm back where I belong, I never felt so good");

            }else{

                console.log("I sense a great shift in the force");
                relocateClassBox( dragElement.semesterId , 4*i + j);

            }

            break;
          }

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
      unselectedClasses.update();
      unselectedClasses.display();
      //Loop through semester object and 
      for (var i=0; i<fourYears.length; i++) {
        fourYears[i].display();
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
  classOfferedAt: []
  preReqs: [list of prereqs];
  coReqs: [list of coreqs];

}

*/


function UnselectedClassesBox(){
  this.classes=[];
  this.full = false;
  this.hovered= false;
  this.x=null;
  this.y=null;
  this.widthUnselected=null;
  this.heightUnselected=null;
}

UnselectedClassesBox.prototype.display = function(){
  stroke('#222222');
  strokeWeight(2);

  this.x = 30 + width * 3/5; ;
  this.y = 60;
  this.widthUnselected = width - this.x - 20;
  this.heightUnselected = height - this.y - 20;
  rect (this.x,this.y, this.widthUnselected,this.heightUnselected);
  
  for(var i=0; i<this.classes.length; i++){
    //calculate x, y, width, height
    var classWidth= (this.widthUnselected - this.classes.length *2) / Math.max( 4 , this.classes.length )
    var classHeight= (height * 2 / 9 ) * 1/4;
    var classX = (this.x + 10);
    var classY = 20+ (this.y + i * (classWidth+2));
    this.classes[i].update();
    this.classes[i].display(classX,classY,classWidth,classHeight);
  }

} 


UnselectedClassesBox.prototype.update = function(){
  this.checkHoverState();
  
};

UnselectedClassesBox.prototype.checkHoverState = function(){
 
 if (mouseX > this.x && mouseX < this.x +this.widthUnselected &&
  mouseY > this.y && mouseY < this.y+this.heightUnselected ){
    this.hovered = true;
    return true;
  }
  else{
    this.hovered = false;
    return false;
  }
};



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
    this.semesters[i].update();
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

SemesterBox.prototype.canPlaceClass= function(){
  var maxClass;
  if(this.semesterId%2==0){
    maxClass=6;
  }else{
    maxClass=2;
  }

  if(this.classes.length >= maxClass ){
    return false
  }

  var semester= int2semester[(this.semesterId%4)];  
  var validSemester = (dragElement.offeredSemester.indexOf(semester) > -1);
  return validSemester;

}

SemesterBox.prototype.display = function(yearBoxWidth, yearBoxHeight){
  // console.log("we should be drawing this!");

  stroke('#222222');
  strokeWeight(2);

  this.x = 20 + ( this.semesterId % 2 === 0 ? 0 : yearBoxWidth * 3/4 );
  this.y = 20 + height/4 * this.year + (this.semester < 2 ? 0: yearBoxHeight/2);
  this.widthSemester =  this.semesterId%2 === 0 ? yearBoxWidth * 3.5/5 : yearBoxWidth * 1/5;
  this.heightSemester = yearBoxHeight / 3;
  if(dragging){
    if(this.canPlaceClass()){
      fill('rgba(50,205,50,0.5)');
    }else{
      fill('rgba(105, 105, 105, 0.5)');
    }
  }else{
    fill('rgba(103, 188, 219, 0.25)');
  }
  // console.log("x: "+x+" y: "+y+" width: "+width+" height: "+height);
  rect(this.x, this.y, this.widthSemester, this.heightSemester);
  noFill();

  for(var i=0; i<this.classes.length; i++){

    var classWidth = (this.widthSemester - this.classes.length *2) / Math.max( 4 , this.classes.length )
    var classHeight = this.heightSemester - 4;
    var classX = this.x + 2 + classWidth * i;
    var classY = this.y + 2;
    
    this.classes[i].update();
    this.classes[i].display(classX,classY,classWidth,classHeight);
  }

};

SemesterBox.prototype.update = function(){
  this.checkHoverState();
  
};

SemesterBox.prototype.checkHoverState = function(){
  // console.log(this.x);
  // console.log(this.y);
  // console.log(this.widthSemester);
  // console.log(this.heightSemster);
 if (mouseX > this.x && mouseX < this.x +this.widthSemester &&
  mouseY > this.y && mouseY < this.y+this.heightSemester ){
    this.hovered = true;
    return true;
  }
  else{
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
    
  this.name =classObj.className;
  this.classNumber= classObj.classNumber;
  this.offeredSemester= classObj.classOfferedAt;
  this.info = null;
  this.semesterId = classObj.semesterId; //semesterId
  this.hasProblem=false;  
  this.preReqs = classObj.preReqs;
  this.hovered = false;

}

ClassBox.prototype.display = function(x,y,width,height){
  //Draw body
  var strokeWeightVal = 1.5;
  if(this === dragElement ){

    stroke('rgb(162, 171, 88)');
    strokeWeight(strokeWeightVal);

    fill('rgba(162, 171, 88, 0.5)');

    //this box is being dragged.
    rect(mouseX+offsetX, mouseY+offsetY, this.width, this.height);
    noFill();
    stroke('black');
    strokeWeight(1);
    textAlign('center');
    textSize(10);
    text(this.classNumber+" :\n"+ this.name, mouseX+offsetX+5, mouseY+offsetY+5, this.width, this.height );

  }else{

     if(this.hovered && !dragging){
      fill('rgba(182, 191, 88, 0.5)');
      rect(mouseX, mouseY, 300, 150);
      stroke('black');
      strokeWeight(1);
      textAlign('center');
      textSize(15);
      text(this.classNumber+" :\n"+ this.name+"\n"+"offered: "+ this.offeredSemester.join(", ")+"\ndescription: "+ this.info+"\npreRequisites: "+this.preReqs.join(", "), mouseX, mouseY, 300, 300 );
      strokeWeightVal+=2;
      noFill();
    }


    //update the values. we could potentially find a better place for this.
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
   
    if(this.hasProblem){

      fill('rgba(228, 68, 36,0.5)');

   
    }else{

      // stroke('rgb(0,255,0)');
      fill('rgba(162, 171, 88, 0.5)');

    }

   
    strokeWeight(strokeWeightVal);
    rect(this.x, this.y, this.width, this.height);
    
    stroke('black');
    strokeWeight(1);
    textAlign('center');
    textSize(10);
    text(this.classNumber+" :\n"+ this.name, this.x+5, this.y+5, this.width, this.height );
    noFill();


  }

  //add Text to this class.

};

ClassBox.prototype.update = function(){

  this.checkHoverState();

};

ClassBox.prototype.checkHoverState = function(){
  if (mouseX > this.x && mouseX < this.x +this.width &&
  mouseY > this.y && mouseY < this.y+this.height ){
    this.hovered = true;
    return true;
  }
  else{
    this.hovered = false;
    return false;
  }
};


function deleteBox(classesBox){
  // console.log("deleted the class");
  // //first get rid of this from the array

  if(classesBox.semesterId===-1){

    var index= unselectedClasses.classes.indexOf(classesBox);

    var index2= classBoxes.indexOf(classesBox);
    console.log(index);
    console.log(index2);

    if(index>-1 && index2 >-1){
         unselectedClasses.classes.splice(index,1);
         classBoxes.splice(index,1);
    }else{
      alert("Error: deleting failed!");
    }
  
  }else{

    var tmpDragging = dragElement;
    dragElement = classesBox;
    relocateClassBox(classesBox.semesterId, -1);
    dragElement=tmpDragging;

  }
  // if(classesBox.semesterId!=-1){
  //     var tmpDragging = dragElement;
  //   dragElement = classesBox;
  //   relocateClassBox(classesBox.semesterId, -1);
  //   dragElement=tmpDragging;
  // }


}


function verifyValidSemester(toSemesterId){
  if(toSemesterId ===-1) return true;

  semester= int2semester[(toSemesterId%4)];  

  var validSemester = (dragElement.offeredSemester.indexOf(semester) > -1);

  if(validSemester){

    console.log("valid semester");
    $('#status').text("");

  }else{

    $('#status').text("this class is not offered in "+ semester+" try "+ dragElement.offeredSemester.join(" or "));
    // $('#status').style('color', 'red');
    // alert("the class is not offered in this semester");

  }
  return validSemester;
}

function relocateClassBox(fromSemesterId, toSemesterId){
  var maxClass;
  var toSemester = toSemesterId%4;
  var toYear = (toSemesterId-toSemester )/4
  var semesterObject = fourYears[toYear].semesters[toSemester];
  if(toSemesterId==-1){
    semesterObject = unselectedClasses;
  }else{


    if(toSemesterId%2==0){
      maxClass=6;
    }else{
      maxClass=2;
    }

  if(semesterObject.classes.length >= maxClass ){
    $('#status').text("This semester is already full! First remove classes.");
    return false
  } 

  }




  if ( verifyValidSemester(toSemesterId) || toSemesterId==-1 ){

  var fromElement, toElement;
  var index;
  //remove from existing array.
  if(fromSemesterId===-1){

    fromElement= unselectedClasses.classes;

  }else{

    var semester= fromSemesterId % 4;
    var year= (fromSemesterId-semester) / 4 ;

    fromElement=(fourYears[year].semesters)[semester].classes;

  }

  index= fromElement.indexOf(dragElement);

  if(index>-1){
      fromElement.splice(index,1)
  }else{
    alert("Error: relocating failed!");
  }

  //be wary and keep an eye out if the fromElement is a copy and thus not reflect the values.

  if(toSemesterId===-1){

    toElement= unselectedClasses.classes;

  }else{

    var semester= toSemesterId % 4;
    var year= (toSemesterId-semester) / 4 ;

    toElement=(fourYears[year].semesters)[semester].classes

  }

  dragElement.semesterId= toSemesterId;
  toElement.push(dragElement);

  }
}
