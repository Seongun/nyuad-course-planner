const puppeteer = require('puppeteer');
const CREDS = require('./creds');

async function run() {
  const browser = await puppeteer.launch({
  headless: false
});
  const page = await browser.newPage();
  	// await page.goto('https://github.com/login');
	await page.goto('https://admin.portal.nyu.edu/psp/paprod/EMPLOYEE/EMPL/?&cmd=login&errorCode=105&languageCd=ENG');
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
	

	const lenOptions = await page.evaluate(() => document.querySelectorAll("[data-id]").length);
	console.log(lenOptions);
	const LIST_TERM_SELECTOR = '#term > option:nth-child(INDEX)';

	console.log(lenOptions);
	



	arr= [];

	for (let i = 1; i <= lenOptions; i++) {
    // change the index to the next child
	    let termSelector = LIST_TERM_SELECTOR.replace("INDEX", i);

	    let termNum = await page.evaluate((sel) => {
	        return document.querySelector(sel).getAttribute('value');
	      }, usernameSelector);
	    arr.push(termNum);

 	 }

		


	for(var i=0; i<array.length; i++){
		await page.goto(url+'/'+array[i]);


		// const form = await page.$('form-selector');
		// await form.evaluate(form => form.submit());
		await page.select('#term', 'my-value')
		//checkout #search-acad-group dropdown select options,
		// then choose on the #subject dropdown that renders options based on the previous options given
		// ensure that "show open classes only is ticked off-- #filter-enrl-stat"
		// tickedhen click #buttonSearch, wait for load.

		await page.waitForNavigation(); 

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