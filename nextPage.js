const puppeteer=require('puppeteer');

(async ()=>{
    const browser=await puppeteer.launch({headless:false});
    const page=await browser.newPage();
    await page.goto("http://books.toscrape.com/");
   while(await page.$("ul.pager li.next a"))
   {
       
    await  page.click("ul.pager li.next a");
    await page.waitForTimeout(2000);
   }
})();