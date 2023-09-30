/// ATTEMPT 1

// const jsdom = require('jsdom')
// const {JSDOM} = jsdom

// // const htmlContent =
//     // '<html><head><link rel="stylesheet" href="styles.css"></head><body><div id="target">Hello, world!</div></body></html>'
// // const dom = new JSDOM(htmlContent, {runScripts: 'outside-only'})

// const dom = new JSDOM(``, {
//     url: "https://www.rei.com/events/search?previousLocation=87501&cm_mmc=email_com_rm-_-StoreEvents_GeneralAwareness-_-092223-_-opo_mod4_cta&ev36=34175338&rmid=20230922_FEE_FeaturedEventsSeptember2&rrid=424901195&ev11=&mi_u=424901195&course.session.anyLocation=200.000000~35.713544~-105.840772;geo_r",
//     referrer: "https://www.rei.com/events/search?previousLocation=87501&cm_mmc=email_com_rm-_-StoreEvents_GeneralAwareness-_-092223-_-opo_mod4_cta&ev36=34175338&rmid=20230922_FEE_FeaturedEventsSeptember2&rrid=424901195&ev11=&mi_u=424901195&course.session.anyLocation=200.000000~35.713544~-105.840772;geo_r",
//     contentType: "text/html",
//     includeNodeLocations: true,
//     storageQuota: 10000000
//   });

// // Extract and apply CSS styles to the DOM elements here

// // Create a new HTML document and insert the modified DOM
// const newDocument = dom.window.document.implementation.createHTMLDocument('New Page')
// newDocument.body.appendChild(dom.window.document.querySelector('html'))

// console.log(newDocument.styleSheets)

// debugger;
// // get the css from htmlContent using jsdom

// // const css = dom.css.styleSheet.cssRules[0].cssText

// // console.log(css)

//// ATTEMPT 2

// const jsdom = require('jsdom');
// const { JSDOM } = jsdom;
// const axios = require('axios'); // You might need to install axios if you haven't already

// const targetURL = 'https://www.rei.com/events/search?previousLocation=87501&cm_mmc=email_com_rm-_-StoreEvents_GeneralAwareness-_-092223-_-opo_mod4_cta&ev36=34175338&rmid=20230922_FEE_FeaturedEventsSeptember2&rrid=424901195&ev11=&mi_u=424901195&course.session.anyLocation=200.000000~35.713544~-105.840772;geo_r'; // Replace with the target URL

// // Fetch the HTML content and external stylesheet
// axios.get(targetURL, {headers: { 'X-Requested-With': 'XMLHttpRequest' }})
//   .then((response) => {
//     const htmlContent = response.data;
//     console.log('htmlContent', htmlContent)

//     const dom = new JSDOM(htmlContent, { runScripts: 'outside-only', url: targetURL });

//     // Extract and apply CSS styles to the DOM elements here

//     // You can access the DOM of the loaded page through dom.window.document
//     // For example: dom.window.document.querySelector('body')

//     // Create a new HTML document and insert the modified DOM
//     const newDocument = dom.window.document.implementation.createHTMLDocument('New Page');
//     newDocument.body.appendChild(dom.window.document.querySelector('html'));

//     // Now you can use newDocument or render it in an iframe
//   })
//   .catch((error) => {
//     console.error('Failed to fetch the target URL:', error);
//   });

//// ATTEMPT 3

// const puppeteer = require('puppeteer');
// // const fakeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36'
// const fakeUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
// // const agents = ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36", "Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/79.0.3945.73 Mobile/15E148 Safari/604.1"]

// async function scrapeWebsite(url) {
//   const browser = await puppeteer.launch({ headless: true, args: [fakeUserAgent]});
//   const page = await browser.newPage();

//   await page.evaluateOnNewDocument(fakeUserAgent => {
//     let open = window.open;
//     window.open = (...args) => {
//         let newPage = open(...args)
//         Object.defineProperty(newPage.navigator, 'userAgent', {get: () => fakeUserAgent})
//         return newPage
//     }
//   })
//   await page.setUserAgent(fakeUserAgent)
//   await page.goto(url, {waitUntil: 'domcontentloaded'});

//   // Extract event data using JavaScript selectors
//   const eventTitles = await page.$eval('head', (element) => {
//     console.log('element', element)
//     return element.textContent
//   });
//   debugger
//   await browser.close();

//   // Process and return the extracted data
//   return {};
// }

// scrapeWebsite('https://www.rei.com/events/search?previousLocation=87501') // Replace with the target URL

// const HCCrawler = require('headless-chrome-crawler');

// (async () => {
//   const crawler = await HCCrawler.launch({
//     // Function to be evaluated in browsers
//     evaluatePage: (() => {
//         console.log($(document).html())
//         debugger;
//         return ({
//             title: $('title').text(),
//         })
//     }),
//     // Function to be called with evaluated results from browsers
//     onSuccess: (result => {
//       console.log(result);
//     }),
//   });
//   // Queue a request
//   await crawler.queue('https://www.rei.com/events/search?previousLocation=87501');
// //   // Queue multiple requests
// //   await crawler.queue(['https://example.net/', 'https://example.org/']);
// //   // Queue a request with custom options
// //   await crawler.queue({
// //     url: 'https://example.com/',
// //     // Emulate a tablet device
// //     device: 'Nexus 7',
// //     // Enable screenshot by passing options
// //     screenshot: {
// //       path: './tmp/example-com.png'
// //     },
// //   });
//   await crawler.onIdle(); // Resolved when no queue is left
//   await crawler.close(); // Close the crawler
// })();

// var x = require('x-ray')()

// x('https://www.rei.com/events/search?previousLocation=87501', 'html')(function(err, html) {
//   console.log(html) // Google
// })
