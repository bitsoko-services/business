f=require('forever');
conf={
    uid: 'business'
};

var startURL = 'business/app.js';

switch (process.argv[2]) {

    case "test": 
f.start(startURL, conf);     
    setInterval(function(f){ 
console.log('WARNING! TEST MODE!!! : if connection is lost service will go offline! Switch to production mode by running   -index.js start-'); 
    }, 60000);
        break;

    case "start":
        
f.load({root:'logs'});
f.startDaemon(startURL, conf);
        
    setInterval(function(){ 
        
    }, 3000);
        break;

    case "stop":
        f.stopAll(0);
        break;

    case "restart":
       f.stopAll(0);
        
    setTimeout(function(f){ 
 f=require('forever');
f.load({root:'logs'});    
f.startDaemon(startURL, conf);  
    }, 3000);
        break;

    default:
        console.log("Usage: [test|start|stop|restart]");
}
