const puppeteer = require('puppeteer')
const startBrowser = (browser) => {
    return new Promise( async (resolve,reject)=>{

        try{

            browser.instance = await puppeteer.launch({

                //slowMo: 100, // to slowdown the process
    
                headless: false,    //  set as false to open a chromium
        
                ignoreDefaultArgs: ["--enable-automation"],
        
                defaultViewport: null,
        
                args: ["--no-sandbox",
        
                    "--disable-setuid-sandbox",
        
                    "--start-maximized",
        
                    '--window-size=1920,1080',
        
                    "--disable-gpu",
        
                    "--disable-dev-profile",
        
                ]
        
            });
    
            browser.instance.on('disconnected', function(){
                browser.instance = undefined;
            }); 
            browser.page = await browser.instance.newPage();
        
            await browser.page.setViewport({ width: 1920, height: 1080 });
        
            browser.page.setUserAgent(
        
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36"
        
            );

            resolve()

        }catch(e){

            reject()
        }
    })
}
module.exports = startBrowser