var request = require('request');
var cheerio = require('cheerio');
var Crawler = require("js-crawler");


// request('https://news.ycombinator.com', function (error, response, html) {
//   if (!error && response.statusCode == 200) {
//     console.log(html);
//   }
// });

console.log("hello");



 
new Crawler().configure({depth: 3})
  .crawl("https://students.nyuad.nyu.edu/academics/academic-mentoring/study-away-equivalencies/", function onSuccess(page) {
    console.log(page.url);
  });


