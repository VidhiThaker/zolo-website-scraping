const puppeteer=require('puppeteer');
const xlsx=require("xlsx");
main();
async function main(){
    
    const links = await getLinks();
    const browser=await puppeteer.launch({headless:true});
    const page=await browser.newPage();
    const scrappeddata=[];
    for(let link of links)
    {
        const data=await getPageData(link,page);
        //await page.waitFor(3000);
        scrappeddata.push(data);
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

async function getLinks()
{
    const browser=await puppeteer.launch({headless:false});
    const page=await browser.newPage();
    await page.goto("http://books.toscrape.com/");
    const links = await page.$$eval('.product_pod .image_container a', allAs=>allAs.map(a => a.href));
    return links;
}

async function getPageData(url,page){
    
    await page.goto(url);

    const h1 = await page.$eval(".product_main h1", h1 => h1.textContent);
    const price = await page.$eval(".price_color",price => price.textContent);
    const inStock = await page.$eval(".instock.availability", inStock => inStock.innerText);

    return {
        h1:h1,
        price:price,
        inStock:inStock
    }

    
};