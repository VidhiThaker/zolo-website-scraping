const puppeteer=require('puppeteer');

(async ()=>{
    const browser=await puppeteer.launch({headless:false});
    const page=await browser.newPage();
    await page.goto("http://books.toscrape.com/");
    const page2=await browser.newPage();
    await page2.goto("http://books.toscrape.com/catalogue/category/books/travel_2/index.html");
    page.bringToFront(page);

    let tabs = await browser.pages();
    await tabs[0].bringToFront();
    await tabs[0].goto("http://books.toscrape.com/");
    // for(let t of tabs)
    // {
    //     let title = await t.title();
    //     console.log(title);
    // }
})();