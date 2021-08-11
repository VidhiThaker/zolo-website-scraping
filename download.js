

const puppetter = require("puppeteer");

(async() => {

    const browser = await puppetter.launch({headless:false});
    const page = await browser.newPage();
    await page.goto("http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html");

    const imageURL = await page.$eval(".thumbnail .item.active img",img => img.src);

    console.log(imageURL);

})();