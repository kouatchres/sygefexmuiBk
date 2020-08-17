module.exports = {
          createPDF: async function(req, res, next) {
            const content = fs.readFileSync(
              path.resolve(__dirname, "../invoices/templates/basic-template.html"),
              "utf-8"
            );
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.setContent(content);
            const buffer = await page.pdf({
              format: "A4",
              printBackground: true,
              margin: {
                left: "0px",
                top: "0px",
                right: "0px",
                bottom: "0px"
              }
            });
            await browser.close();
            res.end(buffer);
          }
        };
        