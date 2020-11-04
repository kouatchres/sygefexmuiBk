const puppeteer = require("puppeteer");

const printPDF = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(
    "http://localhost:10000/show/results/candResults?id=ckfzupb6z8e2t0a35hr13yvq3",
    { waitUntil: "networkidle0" }
  );
  await page.addStyleTag({
    content:
      ".nav { display: none} .navbar { border: 0px} #print-button {display: none}",
  });
  const pdfPage = await page.pdf({ format: "A4" });

  await browser.close();
  return pdfPage;
};

printPDF.then((pdfPage) => {
  res.set({
    "Content-Type": "application/pdf",
    "Content-Length": pdfPage.length,
  });
  res.send(pdfPage);
});
