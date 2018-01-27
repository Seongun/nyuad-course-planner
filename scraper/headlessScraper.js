const puppeteer = require('puppeteer');
const CREDS = require('./creds');

// await Promise.all([
//   page.click('.load_more a'),
//   page.waitForNavigation({ waitUntil: 'networkidle' })
// ]);


async function run() {
  const browser = await puppeteer.launch({
  headless: false
});
  const page = await browser.newPage();
  	// await page.goto('https://github.com/login');
	await page.goto('https://m.albert.nyu.edu/app/profile/login',{waitUntil:'networkidle2'});
  	// await page.screenshot({ path: 'screenshots/github.png' });

	const USERNAME_SELECTOR ='body > section > main > form > label:nth-child(3) > div > input';//'#userid';
	const PASSWORD_SELECTOR = 'body > section > main > form > label:nth-child(4) > div > input';
	const BUTTON_SELECTOR = 'body > section > main > form > button';

	console.log("helloWorld");

	//Login
	await page.click(USERNAME_SELECTOR);
	await page.keyboard.type(CREDS.username);

	await page.click(PASSWORD_SELECTOR);
	await page.keyboard.type(CREDS.password);

	await page.click(BUTTON_SELECTOR);

	await page.waitForNavigation();
	// await page.goto('https://sis.nyu.edu/psc/csprod/EMPLOYEE/CSSS/c/NYU_SR.NYU_CLS_SRCH.GBL?Page=NYU_CLS_SRCH&Action=U&ExactKeys=Y&TargetFrameName=None');
	
	//main albert is crazy. We'll take the easy way by looking into mobile.
	var url= 'https://m.albert.nyu.edu/app/catalog/classSearch';
	await page.goto(url, {waitUntil:'networkidle2'});
		

	const LENGTH_SELECTOR_CLASS = 'term'

	var listLength = await page.evaluate((sel) => {
	    return document.getElementById(sel).length;
	  }, LENGTH_SELECTOR_CLASS);

	const LIST_TERM_SELECTOR = '#term > option:nth-child(INDEX)';
	// console.log(listLength);
	semesterArr= [];


	for (let i = 2; i <= listLength; i++) {
    // change the index to the next child
	    let termSelector = LIST_TERM_SELECTOR.replace("INDEX", i);
	    let termNum = await page.evaluate((sel) => {
	        return document.querySelector(sel).getAttribute('value');
	      }, termSelector);
	    semesterArr.push(termNum);

 	 }

 	 // arr has the id of the semesters for which classes exist.
 	 // each semester Id can be used as following: https://m.albert.nyu.edu/app/catalog/classSearch/{semesterId}
 	 
		
	const SEARCH_GROUP_SELECTOR_CLASS = 'search-acad-group'
	const LIST_SCHOOL_SELECTOR = '#search-acad-group > option:nth-child(INDEX)';
	const SUBJECT_SELECTOR='#subject';
	// const LIST_SCHOOL_SELECTOR = '#search-acad-group > option:nth-child(INDEX)';
	const LIST_SUBJECT_SELECTOR = '#subject > option:nth-child(INDEX)';

	const LOAD_CLASS_BUTTON_SELECTOR='#buttonSearch';
	const CLASS_SEARCH_RESULTS_SELECTOR='search-results';
	const LOAD_SCHOOL_BUTTON_SELECTOR='#search-options > div:nth-child(6) > button';
	const LOAD_SUBJECT_BUTTON_SELECTOR='#search-options > div.pull-left > div > button'

	var AllClassesAllYears ={

		name: "all results",
		semesters:[]
	};

	// loop through each semester's search page
	for(var k=0; k<semesterArr.length; k++){
		console.log("at semester "+ k);

		// console.log(i);
		var semester={

			name: k.toString(),
			schools: []

		};

		//enter the semester search page
		await page.goto(url+'/'+semesterArr[k], {waitUntil:'networkidle2'} );
		
		//get a list of academic group ( school names ) available
		var groupListLength = await page.evaluate((sel) => {
		    return document.getElementById(sel).length;
		 }, SEARCH_GROUP_SELECTOR_CLASS);

		var schoolObj={
			name: null,
			subjects: null,
		};

		//loop through the school groups available at this semester
		for (let i = 2; i <= groupListLength; i++) {
			
	    // change the index to the next child
		    let schoolSelector = LIST_SCHOOL_SELECTOR.replace("INDEX", i);

		    //get school name
		    let schoolName = await page.evaluate((sel) => {
		        return document.querySelector(sel).getAttribute('value');
		      }, schoolSelector);
		    
		    console.log("school: "+schoolName);

		    schoolObj.name = schoolName;
		    schoolObj.subjects =[];

		    //select the school option
		    await page.select('select#search-acad-group', schoolName);
		    await page.click(LOAD_SCHOOL_BUTTON_SELECTOR);

		    var subjectOptionsLength = await page.evaluate( (sel) => {
		        return document.querySelector(sel).length;
		      }, SUBJECT_SELECTOR);

		    //loop through the subjects groups available at this school
		    for(let j=2; j<=subjectOptionsLength; j++){

		    	let subjectSelector = LIST_SUBJECT_SELECTOR.replace("INDEX", j);

			    let subjectValue = await page.evaluate((sel) => {
			        return document.querySelector(sel).getAttribute('value');
			      }, subjectSelector);

			    console.log("subject: "+subjectValue);

			    //create subjectObj
			    var subjectObj={
		    		name: subjectValue,
		    		classes: []
		    	};
		    	
		    	await page.select('select#subject', subjectValue);
		    	await page.click(LOAD_SUBJECT_BUTTON_SELECTOR);
		    	await page.waitFor(1000); //see if there is a better alternative


				await page.click(LOAD_CLASS_BUTTON_SELECTOR);	
				await page.waitForFunction('document.getElementById("search-results").children.length > 0');

				//get classes of this subject of this semester of this school
				var classesArr = await page.evaluate( (sel) => {

					var results = document.getElementById(sel).getElementsByTagName('a');
					var resultArr =[];

					for (var l=0; l<results.length; l++){

						var name = results[l].previousSibling.previousElementSibling.innerText;

						var urlClass = results[l].getAttribute('href');
						var dataset= results[l].children[0].getAttribute('dataset');

						// var dataInput = datset? dataset: undefined;
					    var Obj ={

					    	name: name,
					        href: urlClass.slice(urlClass.lastIndexOf('/')),
					    	data: dataset? dataset: undefined,
					    }

					    resultArr.push(Obj);
					}
					return resultArr
				}, CLASS_SEARCH_RESULTS_SELECTOR );

				// console.log(classesArr);
				subjectObj.classes = classesArr;

				// console.log(subjectObj);


				
				

		    }

	 	 semester.schools.push(schoolObj);
	 	 schoolObj.subjects.push(subjectObj);
				fs.writeFile("./"+schoolName+"_"+k.toString()+".json", JSON.stringify(schoolObj), (err) => {
				    if (err) {
				        console.error(err);
				        return;
				    };
				    console.log("File has been created");
		  });

	 	 }

	 	 AllClassesAllYears.semesters.push(semester);


	}

	fs.writeFile("./results.json", JSON.stringify(AllClassesAllYears), (err) => {
	    if (err) {
	        console.error(err);
	        return;
	    };
	    console.log("File has been created");
	});

  browser.close();
}

run();


//#login > table > tbody > tr:nth-child(1) > td:nth-child(2) > input.psloginbutton
// #userid
// #pwd