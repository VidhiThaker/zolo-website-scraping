const puppeteer=require('puppeteer');
const xlsx=require("xlsx");
main();
async function main(){
    const browser=await puppeteer.launch({headless:false});
    const page=await browser.newPage();
    await page.goto("http://books.toscrape.com/");
    const scrappeddata=[];
    while(await page.$(".pager .next a"))
    {
         const currenturl =await page.url();
     const links = await getLinks(currenturl,page);

    
     for(let link of links)
     {
         const data=await getPageData(link,browser);
         console.log(data);
         console.log("got scrapping data");
         //await page.waitFor(3000);
         scrappeddata.push(data);
     }
     let tabs = browser.pages();
     console.log(tabs);
     await  page.click("ul.pager li.next a");
     await page.waitForTimeout(1000);
    }
    


    exportToExcel(scrappeddata);

    await browser.close();
   }

   async function exportToExcel(scrappeddata){

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(scrappeddata);
    xlsx.utils.book_append_sheet(wb,ws);
    xlsx.writeFile(wb,"scrappedData.xlsx");

   }

async function getLinks(url,page)
{
    console.log("getting Links");
    // const browser=await puppeteer.launch({headless:false});
    // const page=await browser.newPage();
    //await page.goto(url);
    const links = await page.$$eval('.product_pod .image_container a', allAs=>allAs.map(a => a.href));
    console.log(links);
    return links;
}

async function getPageData(url,browser){
    const page2=await browser.newPage();
    await page2.goto(url);
    console.log("getting page data");
    const h1 = await page2.$eval(".product_main h1", h1 => h1.textContent);
    const price = await page2.$eval(".price_color",price => price.textContent);
    const inStock = await page2.$eval(".instock.availability", inStock => inStock.innerText);
    await page2.close();
    return {
        h1:h1,
        price:price,
        inStock:inStock
    }

    
};