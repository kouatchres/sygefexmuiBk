
import puppeteer from 'puppeteer'

const createPDF =async ()=>{

          try {
const url = "http://localhost:10000/show/results/candResults?id=ckair7hdb78s9099213tu7dt4"
          const browser =await puppeteer.launch()
          const page = await browser.newPage() 
          await page.goto(url,{waitUntil:'load'})
     const pdfPage = await page.pdf({
                    background:true,
                    format:"A4"
          });
          console.log('done')

          await browser.close()
          return pdfPage
        
} catch (error) {
          console.log('Puppeteer had an Error: ', error)


module.exports = createPDF

      