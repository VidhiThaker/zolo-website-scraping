const puppeteer=require('puppeteer');
const xlsx=require("xlsx");
main();
async function main(){
    const browser=await puppeteer.launch({headless:true});
    const page=await browser.newPage();
    await page.goto("https://www.zolo.ca/toronto-real-estate/sold");
    await page.click(".card-listing .card-listing--details .card-listing--values li a");
    await page.type(".input-wrapper .text-input","vidhithaker1909@gmail.com");
    await page.click("#submitEmail");
    await page.waitForTimeout(5000);
    const scrappeddata=[];
    //console.log("scrappeddata");
    var n=1;
    //console.log("n=1") 
    //main.gut section.supplementary-nav .md-inline-block.xs-hide.md-block a
     while(n<=30)
     {
         console.log("while loop");
         n++;
        const links = await 
        page.$$eval('#gallery .listings-wrapper .listings .listing-column .card-listing .card-listing--image a',
         allAs=>allAs.map(a => a.href));
        console.log(links.length);
         for(var i=1;i<=links.length;i++)
{
        
        var address="Not Available";
        if(await page.$("#gallery .listings-wrapper .listings li:nth-child("+i+") .card-listing .card-listing--details .card-listing--location a.address")!=null)
        address = await page.$eval("#gallery .listings-wrapper .listings li:nth-child("+i+") .card-listing .card-listing--details .card-listing--location a.address", address => address.innerText);
        //console.log(address);
        var soldAmt="Not Available";
        if(await page.$("#gallery .listings-wrapper .listings li:nth-child("+i+") .card-listing .card-listing--details .card-listing--values .price")!=null)
        soldAmt = await page.$eval("#gallery .listings-wrapper .listings li:nth-child("+i+") .card-listing .card-listing--details .card-listing--values .price", soldAmt => soldAmt.innerText);
        //console.log(soldAmt);
        var listingAmt="Not Available";
        if(await page.$("#gallery .listings-wrapper .listings li:nth-child("+i+") .card-listing .card-listing--details .card-listing--values li:nth-child(2) .decoration-line-through")!=null)
        listingAmt = await page.$eval("#gallery .listings-wrapper .listings li:nth-child("+i+") .card-listing .card-listing--details .card-listing--values li:nth-child(2) .decoration-line-through", listingAmt => listingAmt.textContent);
        //console.log(listingAmt);
        var noOfBed="Not Available";
        if(await page.$("#gallery .listings-wrapper .listings li:nth-child("+i+") .card-listing .card-listing--details .card-listing--values li:nth-child(3)")!=null)
         noOfBed = await page.$eval("#gallery .listings-wrapper .listings li:nth-child("+i+") .card-listing .card-listing--details .card-listing--values li:nth-child(3)",noOfBed => noOfBed.textContent);
        //console.log(noOfBed);
        var noOfBath=" Not Available";
        if(await page.$("#gallery .listings-wrapper .listings li:nth-child("+i+") .card-listing .card-listing--details .card-listing--values li:nth-child(4)")!=null)
        noOfBath=await page.$eval("#gallery .listings-wrapper .listings li:nth-child("+i+") .card-listing .card-listing--details .card-listing--values li:nth-child(4)", noOfBath => noOfBath.innerText);
        noOfBath=noOfBath.slice(1,noOfBath.length);
        //console.log(noOfBath);
        var sqft = " Not Available";
        if(await page.$("#gallery .listings-wrapper .listings li:nth-child("+i+") .card-listing .card-listing--details .card-listing--values li:nth-child(5)")!=null)
        sqft=await page.$eval("#gallery .listings-wrapper .listings li:nth-child("+i+") .card-listing .card-listing--details .card-listing--values li:nth-child(5)", sqft => sqft.textContent);
        sqft=sqft.slice(1,sqft.length);
        //console.log(sqft);
        var soldOn="Not Available";
        if(await page.$("#gallery .listings-wrapper .listings li:nth-child("+i+") .card-listing .card-listing--details .fill-red")!=null)
        soldOn=await page.$eval("#gallery .listings-wrapper .listings li:nth-child("+i+") .card-listing .card-listing--details .fill-red", soldOn => soldOn.textContent);
        if(soldOn!="Not Available")
        soldOn=soldOn.slice(8,soldOn.length);
        //console.log(soldOn);
         scrappeddata.push({address:address,
             soldAmt:soldAmt,
             listingAmt:listingAmt,
             noOfBed:noOfBed,
             noOfBath:noOfBath,
             sqft:sqft,
             soldOn:soldOn,
             url:links[i]});
             console.log(scrappeddata);
      }
//}
      await  page.click(".gut .supplementary-nav nav.pager a:last-child");
      await page.waitForTimeout(500);
     }
    


     exportToExcel(scrappeddata);

    //await browser.close();
   }

   async function exportToExcel(scrappeddata){

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(scrappeddata);
    xlsx.utils.book_append_sheet(wb,ws);
    xlsx.writeFile(wb,"zolo.xlsx");

   }



