
var express = require('express');

var app = express();

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
	 
	 
	    
    require('node-cmd').get(bitsC,function(data, err, stderr){
            if (!err) {
		    var hMsg ='updated bits';
               console.log(hMsg);
		    
	   
            } else {
		    
               
       console.log(err); 
            }
 
        });
	    
    require('node-cmd').get(sokoC,function(data, err, stderr){
            if (!err) {
		    var hMsg ='updated soko';
               console.log(hMsg);
		    
	   
            } else {
		    
               
       console.log(err); 
            }
 
        });
