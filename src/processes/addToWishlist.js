const startBrowser = require("../browserOperations/stratBrowser")
const closeBrowser = require("../browserOperations/closeBrowser")
const waitForPage = require("../pageOperations/waitForPage")
const SELECTOR = require("../selectors.js")

const addToWishlist = async (browser) => {
    return new Promise( async (resolve,reject)=>{
        
        try {

            try{
                
                await startBrowser(browser)
                //browserTimeout(browser,1500000)
                await browser.page.setDefaultNavigationTimeout(1500000);
            
            }catch(e){

                console.error(new Date().toLocaleString() + ': ', e);
                return reject({ status: 'failure', info: 'Invalid Proxy' });
            }

            try{

                //console.log(new Date().toLocaleString() + ': ', 'connecting login page ...');
                
                await browser.page.goto('https://www.buzzfeed.com/nusrat21/things-so-amazing-youll-break-into-song-dance');

            }catch(e){

                console.error(new Date().toLocaleString() + ': ', e);
                
                await closeBrowser(browser);

                return reject({ status: 'failure', info: 'Invalid Proxy' });
            
            }

            await browser.page.setViewport({

                width: 1400,

                height: 966

            })

            let page = browser.page

            await page.waitForSelector(SELECTOR.SUBBUZZ_WRAPPER,{
        
                visible: true,
                
                timeout: 5000
            
            })

            const subBuzzes = await page.$$(SELECTOR.SUBBUZZ_WRAPPER)

            console.log(new Date().toLocaleString() + ': ',subBuzzes.length)

            for (let i = 0; i < subBuzzes.length-1; i++) {
                
                let subBuzz = subBuzzes[i]

                let price = await subBuzz.$eval(SELECTOR.AFFILIATE_LINK, i => i.getAttribute('data-vars-price.value'))

                price = parseFloat(price)

                console.log(new Date().toLocaleString() + ': ',price)

                if(price > 25){
                    
                    let wishListButton =  await subBuzz.$(SELECTOR.ADD_TO_WISHLIST_BUTTON)

                    await wishListButton.click()

                    console.log(new Date().toLocaleString() + ': Clicked')
                }

                //

            }

            await waitForPage(page)

            return resolve("Resolved")

        } catch (e) {

            console.error(new Date().toLocaleString() + ': ', e)

            return reject("Error");
            
        }
        
    })
}

module.exports = addToWishlist