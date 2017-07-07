
var express = require('express');

var fs = require('fs');
var app = express();

var compress = require('compression');

var nCmd = require('node-cmd');

var bitsC=
        `
            cd ~/
	    rm -rf bits
            git clone https://github.com/bitsoko-services/bits.git bits
        `; 
	 
var sokoC=
        `
            cd ~/
            rm -rf soko
            git clone https://github.com/bitsoko-services/soko.git soko
        `; 
	 
	 
	    
    nCmd.get(bitsC,function(data, err, stderr){
            if (!err) {
		    var hMsg ='updated bits';
               console.log(hMsg);
		    
	   
            } else {
		    
               
       console.log(err); 
            }
 
        });
	    
    nCmd.get(sokoC,function(data, err, stderr){
            if (!err) {
		    var hMsg ='updated soko';
               console.log(hMsg);
		    
	   
            } else {
		    
               
       console.log(err); 
            }
 
        });



OpenInsecure();








ReqRes = function ReqRes(req,res){
	
  try{
	
    fs.accessSync( __dirname + req.params[0], fs.F_OK);
	
   res.sendFile( __dirname + req.params[0]);

        }catch(err){
           // console.log(err);
        return res.end('Error');     
        }	
	
}






function OpenInsecure(){

critiMSG="RUNNING ON INSECURE ENVIROMENT!!";

  
insapp = express();
insapp.use(compress());


// If using express you should use the middleware
insapp.use('/', le.middleware());
http = require('http');    
inserver = http.createServer(insapp);

io = require('socket.io')(inserver);
insapp.get(/^(.+)$/, function (req, res) {
  ReqRes(req, res);   
 
});
 inserver.listen(insPORT, '127.0.0.1', function(err) {
  if (err) throw err;
console.log('insec port online at http://localhost:' + insPORT);
});

}
