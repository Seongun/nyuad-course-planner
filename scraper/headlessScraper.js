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
	await page.goto('https://admin.portal.nyu.edu/psp/paprod/EMPLOYEE/EMPL/?&cmd=login&errorCode=105&languageCd=ENG',{waitUntil:'networkidle2'});
  	// await page.screenshot({ path: 'screenshots/github.png' });

	const USERNAME_SELECTOR ='#userid';//'#userid';
	const PASSWORD_SELECTOR = '#pwd';
	const BUTTON_SELECTOR = '#login > table > tbody > tr:nth-child(1) > td:nth-child(2) > input.psloginbutton';


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
	console.log(listLength);
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

	var AllClassesAllYears =[];

	// loop through each semester's search page
	for(var i=0; i<semesterArr.length; i++){
		// console.log(i);
		var semester=[];

		//enter the semester search page
		await page.goto(url+'/'+semesterArr[i], {waitUntil:'networkidle2'} );
		
		//get a list of academic group ( school names ) available
		var groupListLength = await page.evaluate((sel) => {
		    return document.getElementById(sel).length;
		 }, SEARCH_GROUP_SELECTOR_CLASS);

		var schoolArr=[];

		var schoolObj={
			name: null,
			classes: [],
		};

		//loop through the academic groups available.
		for (let i = 2; i <= groupListLength; i++) {

	    // change the index to the next child
		    let schoolSelector = LIST_SCHOOL_SELECTOR.replace("INDEX", i);

		    let schoolName = await page.evaluate((sel) => {
		        return document.querySelector(sel).getAttribute('value');
		      }, schoolSelector);

		    //select the school option
		    await page.select('select#search-acad-group', schoolName);
		    await page.click(LOAD_SCHOOL_BUTTON_SELECTOR);

		    var subjectOptionsLength = await page.evaluate( (sel) => {
		        return document.querySelector(sel).length;
		      }, SUBJECT_SELECTOR);
		    console.log("schoolName: "+schoolName);

		    for(let j=2; j<=subjectOptionsLength; j++){
		    	// console.log(subjectOptions[j].value);
		    	console.log("at index: "+j);
		    	let subjectSelector = LIST_SUBJECT_SELECTOR.replace("INDEX", j);

		    	console.log("evaluating: "+ subjectSelector)
			    let subjectValue = await page.evaluate((sel) => {
			        return document.querySelector(sel).getAttribute('value');
			      }, subjectSelector);
			    console.log("got back subject: "+subjectValue);

		    	await page.select('select#subject', subjectValue);
		    	await page.click(LOAD_SUBJECT_BUTTON_SELECTOR);
		    	console.log("selected and clicked subject button");
				
				// navresponse = page.waitForNavigation(['networkidle0', 'load', 'domcontentloaded']);
				// await page.waitForFunction('document.getElementById("buttonSearch")!=null');
			
				await page.click(LOAD_CLASS_BUTTON_SELECTOR);
				console.log("selected and clicked load class button");

				// await navresponse;  
				//await page.waitForSelector('#search-results');	
				await page.waitForFunction('document.getElementById("search-results").children.length > 0');
				console.log("this is the issue");

				var classesArr = await page.evaluate( (sel) => {

					var results = document.getElementById(sel).getElementsByTagName('a');
					var resultArr =[];

					for (var i=0; i<results.length; i++){
						// console.log(i);
						var name = results[i].previousSibling.previousElementSibling.innerText;
						var urlClass = results[i].getAttribute('href');
						var dataset= results[i].children[0].getAttribute('dataset');

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
				console.log("index " +j +"'s classesArr length: "+ classesArr.length);
		    }
		    console.log("_________________\n\n");
	 	 }
	 	 console.log(schoolObj);


	}

	//https://m.albert.nyu.edu/app/catalog/classsection/NYUNV/1184/20306
	//where nyunv is the part describing school
	//1184 is the part describing the semester
	//20306 is the class number of the class




		// await page.click("#LINK1$0");
	// await page.waitForNavigation();

	//redirect to the academics page
	// await page.goto('https://admin.portal.nyu.edu/psp/paprod/EMPLOYEE/CSSS/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL?FolderPath=PORTAL_ROOT_OBJECT.NYU_STUDENT_CTR&IsFolder=false&IgnoreParamTempl=FolderPath,IsFolder', {waituntil: "networkidle"});
	//click "search" in albert
    // const frame = await page.frames().find(f => f.name() === 'TargetContent');
    // console.log(frame);	
    // const button = await frame.$('DERIVED_SSS_SCR_SSS_LINK_ANCHOR2');
    // console.log(button);
    // button.click();	

	// await page.click("#DERIVED_SSS_SCR_SSS_LINK_ANCHOR2");
	// "https://admin.portal.nyu.edu/psp/paprod/EMPLOYEE/CSSS/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL?FolderPath=PORTAL_ROOT_OBJECT.NYU_STUDENT_CTR&IsFolder=false&IgnoreParamTempl=FolderPath,IsFolder"


  // browser.close();
}

run();

//#login > table > tbody > tr:nth-child(1) > td:nth-child(2) > input.psloginbutton
// #userid
// #pwd