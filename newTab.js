const puppeteer=require('puppeteer');

let ctrlKey = process.Platform === "win32" ? "Meta" : "Control";

(async ()=>{

    console.log(process.platform);
     const browser=await puppeteer.launch({headless:false});
     const page=await browser.newPage();
     await page.goto("http://books.toscrape.com/");
     await page.keyboard.down(ctrlKey);
     await page.click(".product_pod .image_container a");
     await page.keyboard.up(ctrlKey);

     let tabs = browser.pages();

     await page.bringToFront()
     await page.waitFor(2000);
     let latestTab = tabs[tabs.length-1];
     await latestTab.bringToFront();
})();