const puppeteer=require('puppeteer');
const xlsx=require("xlsx");
main();
async function main(){
    const browser=await puppeteer.launch({headless:false});
    const page=await browser.newPage();
    await page.goto("https://www.zolo.ca/toronto-real-estate/sold");
    await page.click(".card-listing .card-listing--details .card-listing--values li a");
    await page.type(".input-wrapper .text-input","vidhithaker1909@gmail.com");
    await page.click("#submitEmail");
    const scrappeddata=[];
    //console.log(await page.url());.md-inline-block.xs-hide.md-block   .icon-keyboard-arrow-right
    // while(await page.$("section.supplementary-nav .md-inline-block.xs-hide.md-block a"))
     //{
      const currenturl =await page.url();
      const links = await getLinks(currenturl,page);

    
      for(let link of links)
      {
          const data=await getPageData(link,browser);
          console.log(data);
          //console.log("got scrapping data");
          //await page.waitFor(3000);
          scrappeddata.push(data);
      }
     // await  page.click(".gut .supplementary-nav nav.pager a:last-child");
     // await page.waitForTimeout(500);
     //}
    


     exportToExcel(scrappeddata);

    await browser.close();
   }

   async function exportToExcel(scrappeddata){

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(scrappeddata);
    xlsx.utils.book_append_sheet(wb,ws);
    xlsx.writeFile(wb,"zoloSiteData.xlsx");

   }

async function getLinks(url,page)
{
    //console.log("getting Links");
    // const browser=await puppeteer.launch({headless:false});
    // const page=await browser.newPage();
    //await page.goto(url);
    const links = await 
    page.$$eval('#gallery .listings-wrapper .listings .listing-column .card-listing .card-listing--image a',
     allAs=>allAs.map(a => a.href));
    //console.log(links);
    return links;
}

async function getPageData(url,browser){
    const page2=await browser.newPage();
    await page2.goto(url);
    if(await page2.$(".form .input-wrapper")!=null)
    {
    await page2.type(".form .input-wrapper","vidhithaker1909@gmail.com");
    if(await page2.$(".form #formprop1submit")!=null)
    {
        await page2.click(".form #formprop1submit");
    }
    }
    var address="Not Available";
    if(await page2.$(".section-main .container .main-column .listing-summary-grid .listing-location h1")!=null)
    {
     address = await page2.$eval(".section-main .container .main-column .listing-summary-grid .listing-location h1", address => address.textContent);
    }
    var area = "Not Available";
    if(await page2.$(".section-main .container .main-column .listing-summary-grid .listing-location .area")!=null)
    {
     area = await page2.$eval(".section-main .container .main-column .listing-summary-grid .listing-location .area", area => area.textContent);
    }
     //.link-primary
    // await page2.$eval(".section-main .container .main-column .listing-summary-grid .listing-location div:nth-child(2).area .link-primary", area => area.textContent);
    var soldAmt='0';
    if(await page2.$(".listing-price .priv"))
    {
     soldAmt = await page2.$eval(".listing-price .priv", soldAmt => soldAmt.innerText);
    }
    var listingAmt = '0';
    if(await page2.$(".text-secondary .strike .priv"))
    {
     listingAmt = await page2.$eval(".text-secondary .strike .priv", listingAmt => listingAmt.textContent);
    }
    var noOfBed = "0";
    if(await page2.$(".list-unstyled li:nth-child(1).tile-data .priv"))
    {
    noOfBed = await page2.$eval(".list-unstyled li:nth-child(1).tile-data .priv",noOfBed => noOfBed.textContent);
    }
    var noOfBath = "0";
    if(await page2.$(".list-unstyled li:nth-child(2).tile-data .priv"))
    {
        noOfBath=await page2.$eval(".list-unstyled li:nth-child(2).tile-data .priv", noOfBath => noOfBath.textContent);
    }
    var sqft = "0";
    if(await page2.$(".list-unstyled li:nth-child(3).tile-data .priv"))
    {
        sqft=await page2.$eval(".list-unstyled li:nth-child(3).tile-data .priv", sqft => sqft.textContent);
    }
    var soldOn = "0";
    if(await page2.$(".listing-price div:nth-child(3).text-secondary .priv"))
    {
        soldOn=await page2.$eval(".listing-price div:nth-child(3).text-secondary .priv", soldOn => soldOn.textContent);
    }
    await page2.close();
    return {
        address:address,
        area:area,
        soldAmt:soldAmt=="0"?"Data Not Available":'$'+soldAmt,
        listingAmt:listingAmt=="0"?"Data Not Available":'$'+listingAmt,
        noOfBed:noOfBed=="0"?"Data Not Available":noOfBed+' Bed',
        noOfBath:noOfBath=="0"?"Data Not Available":noOfBath+' Bath',
        sqft:sqft=="0"?"Data Not Available":sqft+' sqft',
        soldOn:soldOn=="0"?"Not Sold":soldOn,
        url:await page2.url()
        }

    
};