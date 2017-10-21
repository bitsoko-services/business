var express = require('express');

var fs = require('fs');
var app = express();
var jade = require('pug');
var LE = require('greenlock');
var insPORT = 8081;
var bitsokoDomains = ['manguo.co.ke'];
var bitsokoEmail = 'info@manguo.co.ke';

var compress = require('compression');

var nCmd = require('node-cmd');

var bitsC =
    `
            rm -rf bits
            git clone https://github.com/bitsoko-services/bits.git bits
        `;

var sokoC =
    `
            rm -rf soko
            git clone https://github.com/bitsoko-services/soko.git soko
        `;

function updateApps() {
bitsUpdated=false;
    sokoUpdated=false;



console.log('updating bits..');
    nCmd.get(bitsC, function (data, err, stderr) {
        if (!err) {
            var hMsg = 'updated bits';
            console.log(hMsg);

bitsUpdated=true;
            if(bitsUpdated && sokoUpdated){
         
OpenInsecure();
   
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
            
    sokoUpdated=true;
            if(bitsUpdated && sokoUpdated){
         
OpenInsecure();
   
            }


        } else {


            console.log(err);
        }

    });

}

updateApps();

le = LE.create({
    agreeToTerms: leAgree // hook to allow user to view and accept LE TOS
        ,
    server: LE.productionServerUrl // or LE.productionServerUrl
        //, server: LE.stagingServerUrl 
        //, store: leStore 

        ,
    challenges: {
        'http-01': require('le-challenge-fs').create({
            webrootPath: '/root/bitsoko'
        })
    },
    store: require('le-store-certbot').create({
            webrootPath: '/root/bitsoko'
        })
        // handles saving of config, accounts, and certificates
        //, challenges: { 'http-01': leChallenge }                  // handles /.well-known/acme-challege keys and tokens
        ,
    challengeType: 'http-01' // default to this challenge type
        //, sni: require('le-sni-auto').create({})                // handles sni callback
        ,
    debug: true
});







function OpenInsecure() {

    insapp = express();
    insapp.use(compress());


    // If using express you should use the middleware
   // insapp.use('/', le.middleware());
    http = require('http');
    inserver = http.createServer(insapp);

    io = require('socket.io')(inserver);
    insapp.get(/^(.+)$/, function (req, res) {
        ReqRes(req, res);

    });
    inserver.listen(insPORT, '127.0.0.1', function (err) {
        if (err) throw err;
        console.log('insec port online at http://localhost:' + insPORT);
    });

}


ReqRes = function ReqRes(req, res) {
try{

    console.log(req.params[0]);
    if (req.params[0] == '/bits/index.html') {



        fs.readFile(__dirname + '/bits/amp.pug', function (error, source) {

            //console.log(rr.stores);  
            var data = {
                name: 'test',
                desc: 'desc',
                img: '/img.png',
                stores: [],
                promos: [],
                cid: '000'
            }
            data.body = process.argv[2];
            //jade.render
            var template = jade.compile(source);
            var html = template(data);
            //res.writeHead(200);
            return res.end(html);
        });

    } else {









        try {

            fs.accessSync(__dirname + req.params[0], fs.F_OK);

            res.sendFile(__dirname + req.params[0]);

        } catch (err) {
            // console.log(err);
            res.writeHead(301, {
                location: "/bits/index.html"
            });
            return res.end();
        }

    }
    }catch(err){
console.log('ERR loading response ',err)
}
}



function leAgree(opts, agreeCb) {
    // opts = { email, domains, tosUrl }
    opts = {
        domains: bitsokoDomains,
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
        domains: bitsokoDomains
    }).then(function (results) {
        if (results) {
            // we already have certificates
            console.log(results);
            return;
        }


        // Register Certificate manually
        console.log('failed to register LE Certificate automatically, now trying manual registration');

        le.register({

            domains: bitsokoDomains // CHANGE TO YOUR DOMAIN (list for SANS)
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
