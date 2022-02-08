const yargs = require('yargs');
const puppeteer = require('puppeteer');
const swig = require('swig');
const fs = require('fs');
const date = require('date-and-time');
const timediff = require('timediff');
//
const USERNAME_SELECTOR = '#email';

const PASSWORD_SELECTOR = '#pword';

const LOGIN_BUTTON = '#loginBtnId';

const LOGO = '#member-sidebar--menu-signupsid';

const TABS = '#myTab';

const TAB_8 = '#myTab li:nth-child(9) a';

const TABLE = '.SUGtableouter';

const COURT_830_1 = '.SUGtableouter tbody tr:nth-child(2) td:nth-child(2) tr:nth-child(13) input';

const COURT_830_2 = '.table.ng-scope tr:nth-child(1) input';

const COURT_930_1 = '.SUGtableouter tbody tr:nth-child(3) td:nth-child(2) tr:nth-child(13) input';

const COURT_930_2 = '.table.ng-scope tr:nth-child(2) input';

const SUBMIT_AND_SIGNUP_BUTTON = '.giantsubmitbutton';

const SIGNUP_NOW_BUTTON = '.btn.ng-binding';

const EDIT_SIGN_UP_LINK = '.thankYouLink';
//
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function validateInit(email,password,time,court){
    const today = date.parse(time,'HH:mm:ss');
    if(!isNaN(today)){
        console.log("Valid Time");
        if(court >= 1 && court <= 13){
            console.log("Valid Court");
            var timeDate = date.format(new Date(),'YYYY-MM-DD') + ' ' + time;
            console.log("Waiting for two minutes differnce...");
            while(timediff(date.format(new Date(),'YYYY-MM-DD HH:mm:ss'),timeDate,'m').minutes > 2){

            }
            browser = {
                uuid: email,
                pass: password,
                time: time,
                court: court,
                page: undefined
            }
            playTest("https://www.signupgenius.com/register", browser).then(()=>{
                console.log("Logged In");
                reserver(browser).then((returnObj)=>{
                    console.log(returnObj);
                }).catch((returnObj)=>{
                   console.log(returnObj);
                });
            }).catch((returnObj)=>{
                console.log(returnObj)
            });
        }else{
            console.log("Invalid Court");
        }
    }else{
        console.log("Invalid Time");
    }
}

function reserver(browser){

    return new Promise (async (resolve,reject)=>{

        try{

            let page = browser.page;
            const reservationUrl = "https://www.signupgenius.com/tabs/93d70d707a6cbe9c24-santamunicipal";
            await page.goto(reservationUrl);
            await waitTillHTMLRendered(page);
            console.log("Current Time: ",date.format(new Date(), 'HH:mm:ss'));
            console.log("Waiting for the target time....")
            //console.log(date.format(new Date(), 'HH:mm:ss')!=browser.time);
            while(date.format(new Date(), 'HH:mm:ss')!=browser.time){
                //console.log(date.format(new Date(), 'HH:mm:ss'));
            }
            await page.waitForSelector(TABS, {
                visible: true,
            });
            await page.$eval(TAB_8, i => i.click());
            // await page.waitForSelector(TABLE, {
            //     visible: true
            // });
            async function waitForTable(){
                try{
                    await page.waitForSelector(TABLE, {
                        visible: true,
                        timeout: 1000
                    });
                }catch(e){
                    page.reload();
                    await waitForTable();
                }
            }
            await waitForTable();
            var court830 = COURT_830_1.replace("13",browser.court);
            var court930 = COURT_930_1.replace("13",browser.court);
            //8:30 court
            try{
                await page.waitForSelector(court830, {
                    visible: true,
                });
                await page.$eval(court830, i => i.click());
            }catch(e){
                console.log(e.message)
            }
            //9:30 court
            try{
                await page.waitForSelector(court930, {
                    visible: true,
                });
                await page.$eval(court930, i => i.click());
            }catch(e){
                console.log(e.message)
            }
            await page.$eval(SUBMIT_AND_SIGNUP_BUTTON, i => i.click());
            await page.waitForSelector(COURT_830_2, {
                visible: true,
            });
            try{
                // await page.click(COURT_830_2);
                // //await page.evaluate((COURT_830_2) => document.querySelector(COURT_830_2).click(), COURT_830_2); 
                // //await page.$eval(COURT_830_2, i => i.click());
                // await page.waitForSelector(COURT_830_2, {
                //     visible: true,
                // });
                // await page.waitForTimeout(300);
                // await page.keyboard.type("4");

                //
                await page.type(COURT_830_2, '4');
                //

                // await page.focus(COURT_830_2)
                // page.keyboard.type('4')
                
            }catch(e){
                console.log("Error: ",e.message)
            }
            await page.waitForSelector(COURT_930_2, {
                visible: true,
            });
            try{

                // await page.click(COURT_930_2);
                // //await page.evaluate((COURT_930_2) => document.querySelector(COURT_930_2).click(), COURT_930_2); 
                // //await page.$eval(COURT_930_2, i => i.click());
                // await page.waitForSelector(COURT_930_2, {
                //     visible: true,
                // });
                // await page.waitForTimeout(200);
                // await page.keyboard.type("4");

                //
                await page.type(COURT_930_2, '4');
                //

                // await page.focus(COURT_930_2)
                // page.keyboard.type('4')
                
            }catch(e){
                console.log("Error: ",e.message)
            }
            await page.waitForSelector(SIGNUP_NOW_BUTTON, {
                visible: true,
            });
            await page.$eval(SIGNUP_NOW_BUTTON, i => i.click());
            //await closeBrowser(browser);
            await page.waitForSelector(EDIT_SIGN_UP_LINK, {
                visible: true,
            });
            await page.screenshot({ path: `screenshots/finalPage.jpeg` });
            return resolve("Reserved Successfully!");
        }catch(e){
            console.log("Error: ",e.message);
            return reject("Error in reservation");
        }
    });
}
async function startBrowser(browser) {


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
        console.log("Disconnected!");
    }); 
    browser.page = await browser.instance.newPage();

    await browser.page.setViewport({ width: 1920, height: 1080 });

    browser.page.setUserAgent(

        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36"

    );

}

function closeBrowser(browser) {

    return new Promise(async (resolve, reject) => {

        try{

            browser.instance.close();

            return resolve("Browser Closed");

        }catch(e){

            return reject(e);
        }
    });
}

async function getCookies(browser) {

    let page = browser.page;

    var data = await page._client.send('Network.getAllCookies');


    if (data.cookies) {

        for (let i = 0; i < data.cookies.length; i++) {

            let item = data.cookies[i];

            let cookieName = item.name;

            let cookieValue = item.value;

            cookies[cookieName] = cookieValue

        }

    }

    //console.log(new Date().toLocaleString() + ": Handle Process 5 uuid: "+ browser.uuid," cookies done")



    if (await page.$(RE_ACCEPT_COOKIES_SELECTOR) !== null) {

        const accept_elm = await page.$(RE_ACCEPT_COOKIES_SELECTOR);

        await accept_elm.click({ clickCount: 1 });

    }

    //console.log(new Date().toLocaleString() + ": Handle Process 5 uuid: "+ browser.uuid,"cookies finally")

}

function playTest(url, browser) {

    return new Promise(async (resolve, reject) => {

        try {
            
            try{

                await startBrowser(browser);

                //browserTimeout(browser,1500000);

                await browser.page.setDefaultNavigationTimeout(1500000);
            
            }catch(e){

                //console.error(new Date().toLocaleString() + ': ', e.message);

                return reject("Network Issue");
            
            }

            try{

                //console.log(new Date().toLocaleString() + ': ', 'connecting login page ...');
                
                await browser.page.goto(url);

            }catch(e){


                //console.error(new Date().toLocaleString() + ': ', e);
                
                await closeBrowser(browser);

                return reject("URL unreachable!");
            
            }

            await waitTillHTMLRendered(browser.page);

            await browser.page.setViewport({

                width: 1400,

                height: 966

            });

            playing(browser).then((returnObj)=>{
            
                return resolve(returnObj);
            
            }).catch((returnObj)=>{

                return reject(returnObj);
            
            });


        } catch (e) {

            //console.error(new Date().toLocaleString() + ': ', e);
            return reject("Error in login");
            
        }
    });

}

function playing(browser){

    return new Promise(async (resolve, reject) => {

        try{

            var now = new Date();
        
            let page = browser.page;
        
            await page.waitForSelector(USERNAME_SELECTOR, {
        
                visible: true,
        
            });
            
        
            await page.click(USERNAME_SELECTOR);
        
            await page.keyboard.type(browser.uuid);
        
            await page.click(PASSWORD_SELECTOR);
        
            await page.keyboard.type(browser.pass);
        
        
            const m_login_elm = await page.$(LOGIN_BUTTON);
        
            await m_login_elm.click({ clickCount: 1 });
        
        
            //console.log(new Date().toLocaleString() + ': ', 'logging in ...');
        
        
            try {

                await page.waitForSelector(LOGO, {
        
                    visible: true,
            
                });
                
                let pageURL = page.url();
        
                //console.log(new Date().toLocaleString() + ": Handle Process 5 uuid: "+ browser.uuid," page url: ", pageURL)
        
                if (pageURL === 'https://www.signupgenius.com/index.cfm?go=c.Login') {

                    return reject("Invalid Login Credentials");
        
                }
        
        
            } catch (error) {

                return reject("Invalid Login Credentials");
            
            }      

            return resolve("Logged In Successfully");

        }catch(e){
            
            //console.error(new Date().toLocaleString() + ': ', e);

            return reject("Error in Login");

        }
    });
}

function browserTimeout(browser,timeOut){
    setTimeout(function(){
        if(browser.instance!=undefined){
            closeBrowser(browser);
        }
    },timeOut);
}

const waitTillHTMLRendered = async (page, timeout = 30000) => {

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
    
            //console.log(new Date().toLocaleString() + ": Page rendered fully..");

            break;

        }

        lastHTMLSize = currentHTMLSize;
        
        await page.waitForTimeout(checkDurationMsecs);
    
    }  
};

yargs.command({
    command : 'run',
    describe: 'Run the Automation',
    builder:{
        email:{
            describe: 'Login Email',
            demandOption: true,
            type: 'string'
        },
        password:{
            describe: 'Login Password',
            demandOption: true,
            type: 'string'
        },
        time:{
            describe: 'Time to trigger (Format hh:mm:ss)',
            demandOption: true,
            type: 'string'
        },
        court:{
            describe: 'Enter row number of court to reserve',
            demandOption: true,
            type: 'number'
        }
    },
    handler(argv){
        //console.log(argv);
        validateInit(argv.email,argv.password,argv.time,argv.court);
    }
})
yargs.parse();