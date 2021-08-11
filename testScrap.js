const puppeteer=require('puppeteer');

(async ()=>{
    const browser=await puppeteer.launch({headless:false});
    const page=await browser.newPage();
    await page.goto("https://www.amazon.ca/");
    // type on search bar
    await page.type("#twotabsearchtextbox","aloe vera gel");
    await page.click("#nav-search-submit-button");
    await page.waitForSelector('.s-image-square-aspect img');
    await page.click(".s-image-square-aspect img");
    
    //await page.screenshot({path:'sc.png'});
    //await browser.close();
})();