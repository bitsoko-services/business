var express = require('express');
var app = express();
jade = require('pug');
var LE = require('greenlock');
var insPORT = 8081;
var PORT = 8080;
allDomains = [];

primaryColor = '#0f5f76';

heartBeat = 20000;
var bitsokoEmail = 'bitsokokenya@gmail.com';
var mainDomain = 'https://bitsoko.io'
var compress = require('compression');
nCmd = require('node-cmd');
https = require('https');
mysql = require('mysql');
var request = require("request");
imgDownloader = require('image-downloader');
var forceSSL = require('express-force-ssl');
fs = require('fs');
when = require("promised-io/promise").when;
Deferred = require("promised-io/promise").Deferred;
gcm = require('node-gcm');
googlePushKey = 'AAAAbt9hX9o:APA91bE-V876epaCGolDrXSsbb0gXlnLM46BqAU-3H9MudpCru6pbEXaNHW5OBiNgDvDbNShnQo3Q3PMRicmp2itH7tW0IYU83i3WNgPdW_5zZHjVrJlGy9RwhUA7aX-PAMYWhrqh7qP5yF9LRseM34ILObz9V4vYA';
fileDownloader = require('download-file');
html2jade = require('html2jade');

//Global variables
stores = [];
Cid = '476194103258-98t0j7p1lrela49ispgj3jfokl2r3ils.apps.googleusercontent.com';
writeFile = require('write');

//database credentials
dbHost = '104.199.152.117';
dbUser = 'root';
dbPass = '12sokorus12';
dbName = 'bitsoko';

//Load Service Dependencies

//Globally available helper scripts
entFunc = require("/root/business/libs/enterpriseFunctions.js");

//Server Cleaner - manages logs and reporting
serverManager = require("/root/business/bots/serverManager.js").init();

//Messaging support - sms and notifications
messageManager = require("/root/business/libs/messageManager.js");

//Contract support - contract information
contractManager = require("/root/business/libs/messageManager.js");
//Load bots

//this bots manages the pending and delivering orders
orderManager = require("/root/business/bots/orderManager.js").init();

serverFiles = [
	'/bitsAssets/js/md5.min.js',
	'/bitsAssets/js/google.js',
	'/reliable-signaler/signaler.js',
	'/bitsAssets/js/ethjs-provider-signer.js',
	'/bitsAssets/js/ethereumjs-tx.js',
	'/sw.js',
	'/bitsAssets/js/webcomponents.js',
	'/bitsAssets/js/storeManager.js',
	'/bitsAssets/js/hooked-web3-provider/build/hooked-web3-provider.js',
	'/bitsAssets/js/browserDetect.js',
	'/bitsAssets/js/web3/web3.js',
	'/bitsAssets/js/materialize/materialize.min.js',
	'/bitsAssets/css/materialize/materialize.min.css',
	'/socket.io/socket.io.js',
	'/bitsAssets/js/lightwallet/lightwallet.min.js',
	'/bitsAssets/js/async/lib/async.js',
	'/bitsAssets/js/jquery-2.1.1.min.js',
	'/bitsAssets/html/connect.html',
	'/bitsAssets/js/broadcastChannel.js',
	'/bitsAssets/js/qrcodesvg.js',
	'/bitsAssets/js/globalVariables.js',
	'/bitsAssets/js/bits-addMobiVeri.js',
	'/bitsAssets/js/pushManager/google-fcm.js',
	'/bitsAssets/js/jspdf/jspdf.js',
	'/bitsAssets/js/jspdf/jspdf.min.js',
	'/bitsAssets/js/moment.js',
	'/bitsAssets/js/raphQR.js',
	'/bitsAssets/js/locationManager.js',
	'/bitsAssets/js/jspdf/jspdf.plugin.autotable.js',
	'/bitsAssets/js/globalServices.js',
	'/bitsAssets/js/knockout-3.1.0.js',
	'/bitsAssets/html/token-market-widget.html'

];


//TO-DO
// get the store id from the process command
// storeId = process.argv[2];

entDevID = '000x-000x';

bitsUpdated = false;
sokoUpdated = false;
tmUpdated = false;
entSettings = {};
serverRunning = false;


var prepDirC = `
            cd business
            mkdir bitsAssets
            cd bitsAssets
            mkdir tmp
            cd tmp
            mkdir products
            mkdir services
            mkdir promotions
            mkdir html
            cd html
            mkdir bits
            mkdir soko
        `;
//variables
allManagers = [];
allNewManagers = [];
allPromos = [];
allProdCat=[];
nCmd.get(prepDirC, function (data, err, stderr) {
    if (!err) {
        console.log('created directories');

        request(mainDomain + "/getEnterprise/?servEntID=" + entDevID, function (error, response, body) {
            if (!error) {
                allServices = JSON.parse(body).services;

                stores = new Array();
                for (var servi in allServices) {


                    stores.push(servi.id);
                }

                allSettings = JSON.parse(body).settings;
                allInfo = JSON.parse(body).enterpriseInfo;
                entContract = JSON.parse(body).enterpriseContract;
                //console.log(allInfo, allSettings);


                //create database settings

                writeFile('db/certs/dbClientKey.pem', allInfo.dbClientKey, function (err) {
                    if (err) console.log('!ERR unable to write database client key', err);

                    writeFile('db/certs/dbClientCert.pem', allInfo.dbClientCert, function (err) {
                        if (err) console.log('!ERR unable to write database client certificate', err);

                        writeFile('db/certs/dbServerCA.pem', allInfo.dbServerCA, function (err) {
                            if (err) console.log('!ERR unable to write database server CA', err);

                            //Database support
                            connectionSQL = require("/root/business/libs/database.js").getClient();



                            bsConn = {
                                /*
  maria: function (){
      
     var q= new Client({
  host: dbHost,
  user: dbUser, 
  password: dbPass,
  db: 'bitsoko'
});
      q.on("error", function (err) {
    console.log('connection error:', err);
    });
      q.connect();
      return q;
      
                    }(),
    */
                                mysql: connectionSQL

                            }

                            console.log('Database access provisioned');


                        });

                    });

                });




                if (allInfo.showManagers == 'true') {

                    entSettings.managersDisabled = false;
                } else {

                    entSettings.managersDisabled = true;
                }

                if (allInfo.showTokens == 'true') {

                    entSettings.tokensDisabled = false;
                } else {

                    entSettings.tokensDisabled = true;
                }

                //----------------------------------//



                //---------add the about Title------//
                try {

                    if (allInfo.entAboutTitle.length < 3) {

                        entSettings.entAboutTitle = allInfo.entAboutTitle;
                    } else {

                        entSettings.entAboutTitle = allInfo.entAboutTitle;
                    }

                } catch (err) {
                    console.log('!INFO unable to get about title', err);
                }
                //-----------------------------------------//

                //---------add the about body------//
                try {

                    if (allInfo.entAboutBody.length < 3) {

                        entSettings.entAboutBody = allInfo.entAboutBody;
                    } else {

                        entSettings.entAboutBody = allInfo.entAboutBody;
                    }

                } catch (err) {
                    console.log('!INFO unable to get about body', err);
                }
                //-----------------------------------------//

                //---------add the section images------//
                try {

                    //console.log('!INFO section1 data ', allInfo.entImageList);

                    var imgItms = JSON.parse(allInfo.entImageList);
                    if (imgItms.length > 1) {

                        entSettings.entImageListDisabled = false;
                        entSettings.entImageList = imgItms;

                    } else {

                        entSettings.entImageListDisabled = true;
                    }

                } catch (err) {
                    console.log('!INFO unable to get images section', err);

                    entSettings.entImageListDisabled = true;
                }
                //-----------------------------------------//

                //---------add the section icons------//
                try {

                    var icnItms = JSON.parse(allInfo.entIconList);
                    if (icnItms.length > 1) {

                        entSettings.entIconListDisabled = false;
                        entSettings.entIconList = icnItms;

                    } else {

                        entSettings.entIconListDisabled = true;
                    }

                } catch (err) {
                    console.log('!INFO unable to get icons section', err);

                    entSettings.entIconListDisabled = true;
                }
                //-----------------------------------------//


                for (var ii in allServices) {
                    
                    var eaCat=allServices[ii].productCategories;
                    
                    for (var ix in eaCat) {
                    
                        eaCat[ix]['servList']=[];
                        allProdCat.push(eaCat);
                }
                }

                
function squashByName(arr) {
    var tmp = [];
    var tmpID = [];
    for (var i = 0; i < arr.length; i++) {
        if (tmpID.indexOf(arr[i].name) == -1) {
            tmp.push(arr[i]);
            tmpID.push(arr[i].name);
        }
    }
    return tmp;
}
                
                allProdCat=squashByName(allProdCat);
                
                console.log(allProdCat);
                
                
                
                aPs = JSON.parse(body).enterprisePromos;
                allDomains = allInfo.domains;
                for (var ii in allServices) {
                    allServices[ii].banner = allServices[ii].bannerPath;
                    allServices[ii].desc = allServices[ii].description
                    allServices[ii].title = allServices[ii].name;
                    console.log("================================");
                    console.log(allServices[ii]);
                    //console.log(allServices[ii].promotions,"======== Promotions ====");
                    var aMans = allServices[ii].managers
                    console.log(allServices[ii].productCategories)
                    var cats=allServices[ii].productCategories;
                    for(var pc in cats){
                        
                        if(allProdCat[pc].name==cats[pc].name){
                           allProdCat[pc]['servList'].push(allServices[ii]);
                           }
                    }
                    
                    for (var iii in aMans) {
                        aMans[iii].sID = allServices[ii].id;
                        allManagers.push(aMans[iii]);
                    }
                    // Download to a directory and save with the original filename
                    var options = {
                        url: mainDomain + allServices[ii].banner,
                        dest: 'business/bitsAssets/tmp/services/',
                        //dest: '/' 
                    }
                    imgDownloader.image(options).then(function (filename, image) {
                        //console.log('File saved to', filename)
                    }).catch(function (err) {
                        console.log(err)
                    })
                    // Download smaller image
                    var options = {
                        url: mainDomain + allServices[ii].banner.replace(".png", "-128.png"),
                        dest: 'business/bitsAssets/tmp/services/',
                        //dest: '/' 
                    }
                    imgDownloader.image(options).then(function (filename, image) {
                        //console.log('File saved to', filename)
                    }).catch(function (err) {
                        console.log(err)
                    })
                }
                //console.log(allServices);


                conaole.log(allProdCat);


                try {
                    //var aPs = allPromos;
                    for (var iiii in aPs) {

                        console.log(aPs[iiii]);

                        if (aPs[iiii].promoStatus == "active") {

                            allPromos.push(aPs[iiii]);
                        }

                        // enable or disable the promotions section

                        if (allPromos.length > 1) {

                            entSettings.promotionsDisabled = false;
                        } else {

                            entSettings.promotionsDisabled = true;
                        }

                        // Download promo picture and save with the original filename
                        var options = {
                            url: mainDomain + aPs[iiii].promoBanner,
                            dest: 'business/bitsAssets/tmp/promotions/',
                            //dest: '/' 
                        }
                        imgDownloader.image(options).then(function (filename, image) {
                            //console.log('Promo File saved to', filename)
                        }).catch(function (err) {
                            console.log(err)
                        })
                    }
                } catch (err) {
                    console.log(err)
                }





                try {
                    fs.accessSync(__dirname + '/bits/index.html', fs.F_OK);
                    fs.accessSync(__dirname + '/soko/index.html', fs.F_OK);
                    //OpenInsecure();
                    try {
                        OpenSecure();
                    } catch (err) {
                        console.log(err);
                        console.log('security certificates not found! initiating letsencrypt..', err);
                        installCerts();
                    }
                } catch (err) {

                    console.log(err);

                    //update apps with main branch every 1 hours

                    setInterval(function () {
                        updateApps();
                    }, 1000 * 60 * 60 * 1);
                    updateApps();

                }
            } else {
                console.log('ERR! critical error connecting to bitsoko');
            }
        });
    } else {
        console.log(err);
    }
});
var bitsC = `
            rm -rf business/bits
            cd business
            git clone -b StableVersion1 https://github.com/bitsoko-services/bits.git bits
        `;
var sokoC = `
            rm -rf business/soko
            cd business
            git clone -b StableVersion1 https://github.com/bitsoko-services/soko.git soko
        `;

var tmC = `
            rm -rf business/tm
            cd business
            git clone -b stableVersion1 https://github.com/bitsoko-services/token-market.git tm
        `;


function getBitsWinOpt(str, aKey) {
    try {
        var ps = str.split("?")[1];
        var pairs = ps.split("&");
    } catch (e) {
        return false;
    }


    for (var i = 0, aKey = aKey; i < pairs.length; ++i) {
        var key = pairs[i].split("=")[0];

        var value = pairs[i].split("=")[1];
        if (key == aKey) {

            return value;

        }

    }
}

function updateApps() {
    //update server dependecies
    loadServerDeps()


    console.log('updating bits..');
    nCmd.get(bitsC, function (data, err, stderr) {
        if (!err) {
            var hMsg = 'updated bits';
            console.log(hMsg);
            bitsUpdated = true;
            if (bitsUpdated && sokoUpdated && tmUpdated) {
                //OpenInsecure();
                if (!serverRunning) {
                    try {
                        OpenSecure();
                    } catch (err) {
                        console.log(err);
                        console.log('security certificates not found! initiating letsencrypt..', err);
                        installCerts();
                    }
                }
            }
        } else {
            console.log(err);
        }
    });
    console.log('updating soko..');
    nCmd.get(sokoC, function (data, err, stderr) {
        if (!err) {
            var hMsg = 'updated soko';
            console.log(hMsg);
            sokoUpdated = true;
            if (bitsUpdated && sokoUpdated && tmUpdated) {
                //OpenInsecure();
                if (!serverRunning) {
                    try {
                        OpenSecure();
                    } catch (err) {
                        console.log(err);
                        console.log('security certificates not found! initiating letsencrypt..', err);
                        installCerts();
                    }
                }
            }
        } else {
            console.log(err);
        }
    });
    console.log('updating token market..');
    nCmd.get(tmC, function (data, err, stderr) {
        if (!err) {
            var hMsg = 'updated token market';
            console.log(hMsg);
            tmUpdated = true;
            if (bitsUpdated && sokoUpdated && tmUpdated) {
                //OpenInsecure();
                if (!serverRunning) {
                    try {
                        OpenSecure();
                    } catch (err) {
                        console.log(err);
                        console.log('security certificates not found! initiating letsencrypt..', err);
                        installCerts();
                    }
                }
            }
        } else {
            console.log(err);
        }
    });
}
le = LE.create({
    agreeToTerms: leAgree // hook to allow user to view and accept LE TOS
        ,
    server: LE.productionServerUrl // or LE.productionServerUrl
        //        ,
        //    server: LE.stagingServerUrl
        //, store: leStore 
        ,
    challenges: {
        'http-01': require('le-challenge-fs').create({
            webrootPath: '/root/business'
        })
    },
    store: require('le-store-certbot').create({
            webrootPath: '/root/business'
        })
        // handles saving of config, accounts, and certificates
        //, challenges: { 'http-01': leChallenge }                  // handles /.well-known/acme-challege keys and tokens
        ,
    challengeType: 'http-01' // default to this challenge type
        //, sni: require('le-sni-auto').create({})                // handles sni callback
        ,
    debug: true
});


ReqRes = function ReqRes(req, res) {
    try {
        console.log(req.params[0]);
        if (req.params[0] == '/index.html' || req.params[0] == '/') {
            console.log('serving homepage')
            fs.readFile(__dirname + '/themes/default/templates/index.amp.pug', function (error, source) {
                //TO-DO switch to new default
                //fs.readFile(__dirname + '/themes/default/templates/index.amp.pug', function (error, source) {
                //console.log(allPromos);
                //console.log(allManagers);
                matchShops();
                var data = {
                    name: allInfo.name,
                    cover: allInfo.cover,
                    tagline: allInfo.tagline,
                    socialLinks: ['/bits/images/facebook.png', '/bits/images/twitter.png', '/bits/images/linkedin.png'],
                    reviews: [{
                        revIcon: '/bits/images/facebook.png',
                        revName: 'john doe',
                        revMsg: 'good service'
                    }, {
                        revIcon: '/bits/images/facebook.png',
                        revName: 'john doe',
                        revMsg: 'good service'
                    }],
                    productCat: progCatProc,
                    phone: allInfo.phone,
                    email: allInfo.email,
                    managerState: allInfo.managerState,
                    rate: allInfo.contractRate,
                    entContract: entContract,
                    desc: 'desc',
                    img: allInfo.icon,
                    stores: allServices,
                    promos: allPromos,
                    entSettings: entSettings,
                    managers: allNewManagers,
                    cid: '000'
                }
                data.body = process.argv[2];
                //jade.render
                var template = jade.compile(source);
                var html = template(data);
                //res.writeHead(200);
                return res.end(html);
            });
        } else if (req.url.includes('/bits/?s=')) {


            try {

                //getting store index page information
                var sendFl = __dirname + '/bitsAssets/tmp/html/bits/?s=' + getBitsWinOpt(req.url, 's') + '.html';
                console.log(sendFl);
                fs.accessSync(sendFl, fs.F_OK);
                res.sendFile(sendFl);



            } catch (e) {
                // cannot find store page. creating it so we can save to cache and reload faster next time
                when(entFunc.createStorePage(req), function (r) {

                    res.flush();
                    res.end(r);

                }, function (err) {
                    console.log('err! Unable to create store page', err);
                })


            }

            /*	
		
			     if(getBitsWinOpt(req.url,'s')=='3'){
				     //this is a sokopos link
				var sid=getBitsWinOpt(req.url,'a'); 
				}else{
					//this is a enterprise store link
				var sid=getBitsWinOpt(req.url,'s'); 
				}
		    
         //getting store information
		   if(req.url.includes('/bitsBeta/')) {
	var indxPth='/bitsBeta/index.html';			     
				     }else{
	var indxPth='/bits/index.html';			     
				     }
		    
		    	
		console.log('SERVICEID!!!!!!!!!',req.url,sid);
		    	
	      when(entFunc.returnMerchantServices('',{service:sid,id:sid}), function(r){
		      
		      
			
			
	    when(entFunc.bitsStoreDet(sid),function(rr){
		fs.readFile(__dirname + indxPth, function(error, source){
  
html2jade.convertHtml(source, {}, function (err, jd) {
	var thm = rr.theme;
	if(thm== null || thm== 'null' || thm== ''){
	thm = primaryColor;
	}
	//console.log('setting page theme '+thm);
  var data = {
  name: rr.name,
  desc: rr.description,
    img: rr.bannerPath.replace('.png','-128.png'),
    theme: thm,
    stMeta: JSON.stringify(r),
      cid: Cid
}
data.body = process.argv[2];
//jade.render
    var template = jade.compile(jd);
    var html = template(data);
    //res.writeHead(200);
    res.end(html);
});
});     
		    
		    
	    },function(err){
	    console.log('err! cannot show merchant share info! merchant '+sid+' not found!');
	    })
  	
	console.log('INFO!!!! ',JSON.stringify(r.res));  
	
		
    
}, function(error){
		console.log('ERR: service profile error',error);
    
}); 	
	
*/
            //console.log('SOKO Request, ', req.params[0]);
            //fs.accessSync(__dirname + req.params[0], fs.F_OK);
            //return res.sendFile(__dirname + req.params[0]);


        } else if (req.url.includes('/soko')) {

            console.log('SOKO Request, ', req.params[0]);
            fs.accessSync(__dirname + req.params[0], fs.F_OK);
            return res.sendFile(__dirname + req.params[0]);


        } else if (req.url.includes('/tm/')) {

            console.log('Token Market Request, ', req.params[0]);

            if (req.url.includes('/tm/?')) {



                //if(getBitsWinOpt(req.url,'cid')){
                when(messageManager.contByAdr(getBitsWinOpt(req.url, 'cid'), ''), function (r) {


                    when(messageManager.merchantOwner(r.res.contractCreator), function (result) {

                        fs.readFile(__dirname + '/tm/index.html', function (error, source) {

                            html2jade.convertHtml(source, {}, function (err, jd) {
                                var data = {
                                    name: 'Invest with ' + result.res.name,
                                    desc: 'earn upto ' + result.res.contractRate + '% profits every week by buying ' + r.res.name + ' token',
                                    img: result.res.icon,
                                    cid: Cid
                                }

                                data.body = process.argv[2];
                                console.log(JSON.stringify(data));
                                var template = jade.compile(jd);
                                var html = template(data);
                                //res.writeHead(200);
                                return res.end(html);

                            });
                        });

                    }, function (error) {
                        console.log(error);
                    });

                }, function (error) {
                    console.log(error);
                });

            } else {

                fs.accessSync(__dirname + req.params[0], fs.F_OK);
                return res.sendFile(__dirname + req.params[0]);
            }



        } else {
            try {
                fs.accessSync(__dirname + req.params[0], fs.F_OK);
                res.sendFile(__dirname + req.params[0]);
            } catch (err) {
                console.log(err);
                res.status(500);

                return res.end('error');

                //res.writeHead(301, {
                //   location: "/bits/index.html"
                //});
                //return res.end();
            }
        }
    } catch (err) {
        console.log('ERR loading response ', err)
    }
}
installCerts = function () {
    console.log('initiating cert installer');
    'use strict';
    var LE = require('greenlock');
    /*
    // Storage Backend
    var leStore = require('le-store-certbot').create({
      configDir: '/root/certs'                          // or /etc/letsencrypt or wherever
    , debug: true
    });
    // ACME Challenge Handlers
    var leChallenge = require('le-challenge-fs').create({
      webrootPath: '/root/letsencrypt/var'                       // or template string such as
    , debug: true                                            // '/srv/www/:hostname/.well-known/acme-challenge'
    });
    */
    function leAgree(opts, agreeCb) {
        // opts = { email, domains, tosUrl }
        opts = {
            domains: allDomains,
            email: bitsokoEmail // user@example.com
                ,
            agreeTos: true
        }
        agreeCb(null, opts.tosUrl);
    }
    le = LE.create({
        agreeToTerms: leAgree // hook to allow user to view and accept LE TOS
            ,
        server: LE.productionServerUrl // or LE.productionServerUrl
            //, server: LE.stagingServerUrl 
            //, store: leStore 
            ,
        challenges: {
            'http-01': require('le-challenge-fs').create({
                webrootPath: '/root/business'
            })
        },
        store: require('le-store-certbot').create({
                webrootPath: '/root/business'
            })
            // handles saving of config, accounts, and certificates
            //, challenges: { 'http-01': leChallenge }                  // handles /.well-known/acme-challege keys and tokens
            ,
        challengeType: 'http-01' // default to this challenge type
            //, sni: require('le-sni-auto').create({})                // handles sni callback
            ,
        debug: true
    });
    critiMSG = "RUNNING ON INSECURE ENVIROMENT!!";
    /*
      
    insapp = express();
    insapp.use(compress());
    // If using express you should use the middleware
    	 
    insapp.use('/', le.middleware(require('redirect-https')()));
    http = require('http');    
    inserver = http.createServer(insapp);
    io = require('socket.io')(inserver);
    insapp.get(/^(.+)$/, function (req, res) {
      ReqRes(req, res);   
     
    });
     inserver.listen(insPORT, '127.0.0.1', function(err) {
      if (err) throw err;
     console.log("Listening for ACME http-01 challenges on", this.address());
    });
    */
    // handles acme-challenge and redirects to https 
    require('http').createServer(le.middleware(require('redirect-https')())).listen(insPORT, function () {
        console.log("Listening for ACME http-01 challenges on", this.address());
    });
    var app = require('express')();
    app.use('/', function (req, res) {
        res.end('waiting to become secure');
    });
    //
    // Otherwise you should see the test file for usage of this:
    // le.challenges['http-01'].get(opts.domain, key, val, done)
    // Check in-memory cache of certificates for the named domain
    le.check({
        domains: allDomains
    }).then(function (results) {
        if (results) {
            // we already have certificates
            console.log(results);
            return;
        }
        // Register Certificate manually
        console.log('failed to register LE Certificate automatically, now trying manual registration');
        le.register({
            domains: allDomains // CHANGE TO YOUR DOMAIN (list for SANS)
                ,
            email: bitsokoEmail // CHANGE TO YOUR EMAIL
                ,
            agreeTos: true // set to tosUrl string (or true) to pre-approve (and skip agreeToTerms)
                ,
            rsaKeySize: 2048 // 2048 or higher
                ,
            challengeType: 'http-01' // http-01, tls-sni-01, or dns-01
        }).then(function (results) {
            console.log('success: certificates installed. Restarting service');
            throw 'success: certificates installed. Restarting service';
        }, function (err) {
            // Note: you must either use le.middleware() with express,
            // manually use le.challenges['http-01'].get(opts, domain, key, val, done)
            // or have a webserver running and responding
            // to /.well-known/acme-challenge at `webrootPath`
            console.error(err);
            console.error('[Error]: node-letsencrypt/examples/standalone');
            console.error(err.stack);
            //console.log('certification failed. will try again in one hour');
            //setTimeout(installCerts(), (60 * 60 * 1000));
        });
    });
}

function leAgree(opts, agreeCb) {
    // opts = { email, domains, tosUrl }
    opts = {
        domains: allDomains,
        email: bitsokoEmail // user@example.com
            ,
        agreeTos: true
    }
    agreeCb(null, opts.tosUrl);
}

function createCert() {
    critiMSG = "RUNNING ON INSECURE ENVIROMENT!!";
    // handles acme-challenge and redirects to https 
    require('http').createServer(le.middleware(require('redirect-https')())).listen(insPORT, function () {
        console.log("Listening for ACME http-01 challenges on", this.address());
    });
    var app = require('express')();
    app.use('/', function (req, res) {
        res.end('waiting to become secure');
    });
    //
    // Otherwise you should see the test file for usage of this:
    // le.challenges['http-01'].get(opts.domain, key, val, done)
    // Check in-memory cache of certificates for the named domain
    le.check({
        domains: allDomains
    }).then(function (results) {
        if (results) {
            // we already have certificates
            console.log(results);
            return;
        }
        // Register Certificate manually
        console.log('failed to register LE Certificate automatically, now trying manual registration');
        le.register({
            domains: allDomains // CHANGE TO YOUR DOMAIN (list for SANS)
                ,
            email: bitsokoEmail // CHANGE TO YOUR EMAIL
                ,
            agreeTos: true // set to tosUrl string (or true) to pre-approve (and skip agreeToTerms)
                ,
            rsaKeySize: 2048 // 2048 or higher
                ,
            challengeType: 'http-01' // http-01, tls-sni-01, or dns-01
        }).then(function (results) {
            console.log('success: certificates installed. Restarting service');
            throw 'success: certificates installed. Restarting service';
        }, function (err) {
            // Note: you must either use le.middleware() with express,
            // manually use le.challenges['http-01'].get(opts, domain, key, val, done)
            // or have a webserver running and responding
            // to /.well-known/acme-challenge at `webrootPath`
            console.error(err);
            console.error('[Error]: node-letsencrypt/examples/standalone');
            console.error(err.stack);
        });
    });
}

function OpenSecure() {
    servCerts = {
        key: fs.readFileSync('/root/letsencrypt/etc/live/' + allDomains[0] + '/privkey.pem'),
        cert: fs.readFileSync('/root/letsencrypt/etc/live/' + allDomains[0] + '/fullchain.pem'),
        ca: [fs.readFileSync('/root/letsencrypt/etc/live/' + allDomains[0] + '/chain.pem')] // <----- note this part
    };
    app.use(compress());
    server = https.createServer(servCerts, app);
    io = require('socket.io')(server);
    server.setTimeout(0, socketTimeout);
    app.get(/^(.+)$/, function (req, res) {
        ReqRes(req, res);
    });
    server.listen(PORT, function (err) {
        if (err) throw err;
        console.log('Secure now online at https://localhost:' + PORT);
        OpenInsecure();

        serverRunning = true;
    });
}

function OpenInsecure() {
    insapp = express();
    insapp.use(compress());
    insapp.use(forceSSL);
    // If using express you should use the middleware
    insapp.use('/', le.middleware());
    http = require('http');
    inserver = http.createServer(insapp);
    //io = require('socket.io')(inserver);
    //insapp.get(/^(.+)$/, function (req, res) {
    //    ReqRes(req, res);
    //});
    inserver.listen(insPORT, '0.0.0.0', function (err) {
        if (err) throw err;
        console.log('insec port online at http://localhost:' + insPORT);
    });
}

function socketTimeout() {
    console.log('sockets timed out: not receiving connecions!!')
};


function matchShops() {
    //matching shops to their managers
    // create empty array for the reconstructed manager array.
    managersShop = new Object();
    managersShop.manager = new Array();
    //step one loop thu managers list and get m.name, shopID and userID	
    for (var iv in allManagers) {
        //console.log("looping managers",allManagers[iv].sID,allManagers[iv].uid,allManagers[iv].name)
        for (var iiiv in allServices) {
            // console.log("looping services ",allServices[iiiv].title,allManagers[iv].uid,allManagers[iv].name )
            if (allManagers[iv].sID == allServices[iiiv].id) {
                //console.log("******** managers *******", allServices[iiiv].title, allManagers[iv].uid, allManagers[iv].name);
                var nm = new Object();
                nm.shop = allServices[iiiv].title;
                nm.id = allManagers[iv].uid
                nm.name = allManagers[iv].name
                nm.icon = allManagers[iv].icon
                managersShop.manager.push(nm);
            }
        }
    }
    var obj = {};
    for (var i = 0, len = managersShop.manager.length; i < len; i++) obj[managersShop.manager[i]['name']] = managersShop.manager[i];
    managersShop.manager = new Array();
    allNewManagers = new Array();
    for (var key in obj) allNewManagers.push(obj[key]); // managersShop.manager.push(obj[key]);
    console.log(allNewManagers, "******** new managers *******")

}

function loadServerDeps() {



    for (var url in serverFiles) {


        var arr = serverFiles[url].split('/');
        arr.pop();


        var options = {
            directory: 'business/' + arr.join('/')
        }
        // console.log(arr, mainDomain + serverFiles[url]);

        fileDownloader(mainDomain + serverFiles[url], options, function (err) {
            if (err) {
                console.log(err)
            } else {
                // console.log('saved ', serverFiles[url], ' to ', arr.join('/'))
            }
        })

    }


}
