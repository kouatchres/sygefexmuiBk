// Initialize the module
const puppeteer = require('puppeteer');

// A Post Route to Open the Headless Browser
app.post('/printPdf', function (req, res, next) {

   const generatePdf= async ()=> {
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Open a new page with the headless browser
    const page = await browser.newPage();

    // Route the headless browser to the webpage for printing
    await page.goto('http://www.example.com'); // add your url

    // Print the page as pdf
    const buffer = await page.pdf({ 
      printBackground: true, 
      format: 'Letter', 
      PreferCSSPageSize: true 
    }); 

    // send the pdf
    res.type('application/pdf');
    res.send(buffer);
    // Close the headless browser
    browser.close();
    console.log('done')
  };
  generatePdf();
});
