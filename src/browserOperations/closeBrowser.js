const closeBrowser = (browser)=>{

    return new Promise(async (resolve, reject) => {

        try{

            console.log(new Date().toLocaleString() + ' Closing browser..');

            //console.log(new Date().toLocaleString() + ' Browser uuid: ', browser.email);

            //browserInstances.splice(browserInstances.indexOf(browserInstances.find(brw => brw.uuid === browser.uuid)),1);

            //console.log(new Date().toLocaleString() + ' Number of Instances Running: ', browserInstances.length);

            browser.instance.close();

            return resolve("Browser Closed");

        }catch(e){

            console.error(new Date().toLocaleString() + ': ', e);

            return reject(e);
        }
    });
}

module.exports = closeBrowser