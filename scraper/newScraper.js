const puppeteer = require('puppeteer');



async function run() {
  const browser = await puppeteer.launch({
  headless: false
});
  const page = await browser.newPage();
  	// await page.goto('https://github.com/login');
	await page.goto('https://sis.nyu.edu/psc/csprod/EMPLOYEE/SA/c/NYU_SR.NYU_CLS_SRCH.GBL',{waitUntil:'networkidle2'});

	const baseLink = "#LINK1"+"\\"+"24 ";
	const RETURN_SELECTOR = "#NYU_CLS_DERIVED_BACK";
	const PAGE_INFO_SELECTOR = "pt_pageinfo_win0"
	const CLASS_INFO_SELECTOR = "ACE_NYU_CLS_SBDTLVW_CRSE_ID$INDEX"
	// const CLASS_DESCRIPTION_SELECTOR ="ACE_NYU_CLS_SBDTLVW_CRSE_ID$INDEX"
// ACE_NYU_CLS_SBDTLVW_CRSE_ID$144

	let FIELD_SELECTOR = null;



	for(var i =0; i < 375; i++){

		FIELD_SELECTOR = baseLink+i.toString();
		console.log("loading: "+FIELD_SELECTOR);

		//load into the major
		await page.click(FIELD_SELECTOR);	
		await page.waitForFunction( 'document.getElementById("pt_pageinfo_win0").getAttribute("page") === "NYU_CLS_DTL"');


		let index=0;
		//loop through individual classes offered.
		while(true){

			
		    // change the index to the next child
			let classSelector = CLASS_INFO_SELECTOR.replace("INDEX", index);

		    let title = await page.evaluate((sel) => {
		    	if(document.getElementById(sel)){
		    	
		    		return document.getElementById(sel).children[0].children[1].children[1].children[0].children[0].children[0].children[0].innerText

		    	}else{

		    		return null
		    	
		    	}

		     }, classSelector);

		 	if(!title){

		 		break;
		 	
		 	}else{

		 		//parse title
		 		
		 		let j; 	
		 		let foundNum= false;
		 		let first=true;
		 		let arr = title.split(" ");
		 		
		 		var courseTitle = "";
		 		var courseNum= "";


		 		for(j=0; j<arr.length; j++){

		 			if(foundNum){

						if(!first){
		 					courseTitle+=" ";
		 				}
		 				courseTitle+=arr[j];

		 			}else if( arr[j].isInteger  ){

		 				foundNum = true;
		 				courseNum +=" "
		 				courseNum += arr[j];
		 				first=true;

		 			}else{

						if(!first){
		 					courseNum+=" ";
		 				}
		 				first = false;
		 				courseNum += arr[j];
		 			
		 			}

		 		}
		 		console.log(courseTitle);
		 		console.log(courseNum);

		 		//get class description, if it exists
		 		 let description = await page.evaluate((sel) => {
		 		 
			    	if(document.getElementById(sel).children[0].children[1].children[1].children[0].children[0].children[0].children[2]){
			    		
			    		return document.getElementById(sel).children[0].children[1].children[1].children[0].children[0].children[0].children[2].children[0].innerText

			    	}else{

			    		return null
			    	
			    	}

			     }, classSelector);

		 		 console.log(description);

		 		 //get term information, if it exists
		 		 let term = await page.evaluate((sel) => {

			    	if(document.getElementById("ACE_NYU_CLS_SBDTLVW_CRSE_ID$"+sel) && document.getElementById("ACE_NYU_CLS_SBDTLVW_CRSE_ID$"+sel).children[0].children[3]){

			    		return document.getElementById("NYU_CLS_DERIVED_TERM$"+sel).getAttribute("title");

			    	}else{

			    		return null
			    	
			    	}

			     }, i.toString() );

		 		 let termResult;

		 		 if(term){

		 		 	 termResult = term.substr( term.search("Terms Offered: ")+15);
		 		 	
		 		 }else{

		 		 	termResult = null;

		 		 }
			    
			    console.log(termResult);

		 	}

		 	index+=1;

		}

		//load out of the major
		await page.click(RETURN_SELECTOR);
		await page.waitForFunction( 'document.getElementById("pt_pageinfo_win0").getAttribute("page") === "NYU_CLS_SRCH"');

	}





	// const LENGTH_SELECTOR_CLASS = 'term'

	// var listLength = await page.evaluate((sel) => {
	//     return document.getElementById(sel).length;
	//   }, LENGTH_SELECTOR_CLASS);

	// const LIST_TERM_SELECTOR = '#term > option:nth-child(INDEX)';
	// // console.log(listLength);
	// semesterArr= [];


	// for (let i = 2; i <= listLength; i++) {
 //    // change the index to the next child
	//     let termSelector = LIST_TERM_SELECTOR.replace("INDEX", i);
	//     let termNum = await page.evaluate((sel) => {
	//         return document.querySelector(sel).getAttribute('value');
	//       }, termSelector);
	//     semesterArr.push(termNum);

 // 	 }

 // 	 // arr has the id of the semesters for which classes exist.
 // 	 // each semester Id can be used as following: https://m.albert.nyu.edu/app/catalog/classSearch/{semesterId}
 	 
		
	// const SEARCH_GROUP_SELECTOR_CLASS = 'search-acad-group'
	// const LIST_SCHOOL_SELECTOR = '#search-acad-group > option:nth-child(INDEX)';
	// const SUBJECT_SELECTOR='#subject';
	// // const LIST_SCHOOL_SELECTOR = '#search-acad-group > option:nth-child(INDEX)';
	// const LIST_SUBJECT_SELECTOR = '#subject > option:nth-child(INDEX)';

	// const LOAD_CLASS_BUTTON_SELECTOR='#buttonSearch';
	// const CLASS_SEARCH_RESULTS_SELECTOR='search-results';
	// const LOAD_SCHOOL_BUTTON_SELECTOR='#search-options > div:nth-child(6) > button';
	// const LOAD_SUBJECT_BUTTON_SELECTOR='#search-options > div.pull-left > div > button'

	// var AllClassesAllYears ={

	// 	name: "all results",
	// 	semesters:[]
	// };

	// // loop through each semester's search page
	// for(var k=0; k<semesterArr.length; k++){
	// 	console.log("at semester "+ k);

	// 	// console.log(i);
	// 	var semester={

	// 		name: k.toString(),
	// 		schools: []

	// 	};

	// 	//enter the semester search page
	// 	await page.goto(url+'/'+semesterArr[k], {waitUntil:'networkidle2'} );
		
	// 	//get a list of academic group ( school names ) available
	// 	var groupListLength = await page.evaluate((sel) => {
	// 	    return document.getElementById(sel).length;
	// 	 }, SEARCH_GROUP_SELECTOR_CLASS);

	// 	var schoolObj={
	// 		name: null,
	// 		subjects: null,
	// 	};

	// 	//loop through the school groups available at this semester
	// 	for (let i = 2; i <= groupListLength; i++) {
			
	//     // change the index to the next child
	// 	    let schoolSelector = LIST_SCHOOL_SELECTOR.replace("INDEX", i);

	// 	    //get school name
	// 	    let schoolName = await page.evaluate((sel) => {
	// 	        return document.querySelector(sel).getAttribute('value');
	// 	      }, schoolSelector);
		    
	// 	    console.log("school: "+schoolName);

	// 	    schoolObj.name = schoolName;
	// 	    schoolObj.subjects =[];

	// 	    //select the school option
	// 	    await page.select('select#search-acad-group', schoolName);
	// 	    await page.click(LOAD_SCHOOL_BUTTON_SELECTOR);

		    // var subjectOptionsLength = await page.evaluate( (sel) => {
		    //     return document.querySelector(sel).length;
		    //   }, SUBJECT_SELECTOR);

		    // //loop through the subjects groups available at this school
		    // for(let j=2; j<=subjectOptionsLength; j++){

		    // 	let subjectSelector = LIST_SUBJECT_SELECTOR.replace("INDEX", j);

			   //  let subjectValue = await page.evaluate((sel) => {
			   //      return document.querySelector(sel).getAttribute('value');
			   //    }, subjectSelector);

			   //  console.log("subject: "+subjectValue);

			   //  //create subjectObj
			   //  var subjectObj={
		    // 		name: subjectValue,
		    // 		classes: []
		    // 	};
		    	
	// 	    	await page.select('select#subject', subjectValue);
	// 	    	await page.click(LOAD_SUBJECT_BUTTON_SELECTOR);
	// 	    	await page.waitFor(1000); //see if there is a better alternative


	// 			await page.click(LOAD_CLASS_BUTTON_SELECTOR);	
	// 			await page.waitForFunction('document.getElementById("search-results").children.length > 0');

	// 			//get classes of this subject of this semester of this school
	// 			var classesArr = await page.evaluate( (sel) => {

	// 				var results = document.getElementById(sel).getElementsByTagName('a');
	// 				var resultArr =[];

	// 				for (var l=0; l<results.length; l++){

	// 					var name = results[l].previousSibling.previousElementSibling.innerText;

	// 					var urlClass = results[l].getAttribute('href');
	// 					var dataset= results[l].children[0].getAttribute('dataset');

	// 					// var dataInput = datset? dataset: undefined;
	// 				    var Obj ={

	// 				    	name: name,
	// 				        href: urlClass.slice(urlClass.lastIndexOf('/')),
	// 				    	data: dataset? dataset: undefined,
	// 				    }

	// 				    resultArr.push(Obj);
	// 				}
	// 				return resultArr
	// 			}, CLASS_SEARCH_RESULTS_SELECTOR );

	// 			// console.log(classesArr);
	// 			subjectObj.classes = classesArr;

	// 			// console.log(subjectObj);


				
				

	// 	    }

	//  	 semester.schools.push(schoolObj);
	//  	 schoolObj.subjects.push(subjectObj);
	// 			fs.writeFile("./"+schoolName+"_"+k.toString()+".json", JSON.stringify(schoolObj), (err) => {
	// 			    if (err) {
	// 			        console.error(err);
	// 			        return;
	// 			    };
	// 			    console.log("File has been created");
	// 	  });

	//  	 }

	//  	 AllClassesAllYears.semesters.push(semester);


	// }

	// fs.writeFile("./results.json", JSON.stringify(AllClassesAllYears), (err) => {
	//     if (err) {
	//         console.error(err);
	//         return;
	//     };
	//     console.log("File has been created");
	// });

  // browser.close();
}

run();


//#login > table > tbody > tr:nth-child(1) > td:nth-child(2) > input.psloginbutton
// #userid
// #pwd