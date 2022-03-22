const waitForPage = async (page, timeout = 30000) => {

    //console.log(new Date().toLocaleString() + " : Waiting for the page to load..");
    
    const checkDurationMsecs = 1000;
    
    const maxChecks = timeout / checkDurationMsecs;
    
    let lastHTMLSize = 0;
    
    let checkCounts = 1;
    
    let countStableSizeIterations = 0;
    
    const minStableSizeIterations = 3;

    while(checkCounts++ <= maxChecks){
    
        let html = await page.content();
    
        let currentHTMLSize = html.length; 

        let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
        
        if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) 
    
        countStableSizeIterations++;
    
        else 
    
        countStableSizeIterations = 0; //reset the counter

        if(countStableSizeIterations >= minStableSizeIterations) {
    
            console.log(new Date().toLocaleString() + ": Page rendered fully..");

            break;

        }

        lastHTMLSize = currentHTMLSize;
        
        await page.waitForTimeout(checkDurationMsecs);
    
    }  
}

module.exports = waitForPage