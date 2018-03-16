var exports = module.exports = {};



exports.contByAdr = function(c,d) {
    
  var deferred = new Deferred();
    try{
       
     
bsConn.mysql.query('SELECT * FROM blockchains WHERE status = ? AND contractAddress = ?',['active',c],
        function(err, results) { 
          if (err)deferred.reject(err);
	
            deferred.resolve({res:results[0],ret:d});
        }); 
    }catch(e){
       deferred.reject(e); 
    }
    
    
    return deferred;
}


exports.merchantOwner = function(d,e) {
    
  var deferred = new Deferred();
    try{
	    
       d=parseInt(d);
	    if(isNaN(d)){
	 
       deferred.reject({ret:e}); 
		return;   
	    }
     
bsConn.mysql.query('SELECT * FROM users WHERE id = ?', [d],
        function(err, results) {  
          if (err){
		  deferred.reject({ret:e});
		   return;
	  }else if(results.length==0){
	  
		  deferred.reject({ret:e});
		   return;
	  }
	//console.log(results);
	var c={};
	var removeNewline = require('newline-remove');
	//removeNewline(results[0].googleMeta)
	//var str = JSON.stringify(results[0].googleMeta).replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
	try{
     
	//console.log(str);
	var str = removeNewline(results[0].googleMeta);
	try{
		c.cover = JSON.parse(str).cover.url;
		//c.tagline = JSON.parse(str).tagline;
	}catch(err){
	
		c.cover = 'not available';
		c.tagline = results[0].tagLine;
	}
	c.icon = JSON.parse(str).image;
	c.email = JSON.parse(str).email;
	c.address = results[0].wallets;
	c.contractRate = results[0].contractRate;
	c.phone = results[0].phoneNumber;
	c.name = JSON.parse(str).name;
	c.showTokens = results[0].showTokens;
	c.showManagers = results[0].showManagers;
	c.entIconList = results[0].entIconList;
	c.entImageList = results[0].entImageList;
	c.entAboutBody = results[0].entAboutBody;
	c.entAboutTitle = results[0].entAboutTitle;
		
		try{
	c.domains = JSON.parse(results[0].domains);
	}catch(err){
	
	c.domains = JSON.parse('[]');
	}
	
	//console.log(str);
	}catch(e){
       deferred.reject({ret:e}); 
		return;
    }
	
            deferred.resolve({res:c,ret:e});
        }); 
    }catch(e){
       deferred.reject({ret:e}); 
    }
    
    
    return deferred;
}

exports.doPush = function(message,pid) {


	   var deferred = new Deferred();	
 
// Set up the sender with you API key, prepare your recipients' registration tokens. 
var sender = new gcm.Sender(googlePushKey);

var regTokens = [];
	
	try{

var pushes=JSON.parse(pid.pushID);
		 for (var dmn in allDomains){
			 
			 if(allDomains[dmn] != undefined || allDomains[dmn] != "undefined" ){
			 
regTokens.push(pushes[allDomains[dmn]]);
				 
			 }
			 
 }	
	

console.log('THESE TOKENS!', allDomains, pid.pushID, pushes, regTokens);		
sender.send(message, { registrationTokens: regTokens }, function (err, response) {
    if(err) {
	   // console.error(err);
	    deferred.reject(err);
    }
    else {	
	    
	    if (response.failure>0){
	    
	    deferred.reject({err:err,dt:pid});
	    }else{
	deferred.resolve(response);
	    }
	    
	 }
});
		
	}catch(er){
	console.log('no bitsoko registrations found for this user '+allDomains);
		
if(regTokens.length==0)
	    deferred.reject({err:er,dt:pid});
		
	}

	
return deferred;
	
}	

	


exports.sendPush = function(pid,dataa,socket) {

	console.log(pid,dataa,socket);
 
	   var deferred = new Deferred();
	  //console.log(pid);
	
if(dataa.app=='soko' && dataa.req!='admin'){
	
	
var sql    = 'SELECT * FROM services WHERE id = ?';

bsConn.mysql.query(sql,[parseInt(pid)], function(err, results) {
    
var message = new gcm.Message({
    data: dataa
});
   for(var i = 0,message=message; i < results.length; ++i) {
	   
	   
        when(messageManager.doPush(message,results[i]), function(res){
	 deferred.resolve(res);
	}, function(err){
		console.log('push failed');
	 deferred.reject({err:err.err,uPhone:err.dt.phone});
	});
		   
   }
});

}else{
	
	
	
var sql    = 'SELECT * FROM users WHERE id = ?';

bsConn.mysql.query(sql,[parseInt(pid)], function(err, results) {
    if(err){
    	 deferred.reject({err:err,uPhone:'false'});
	    return;
    }

var message = new gcm.Message({
    data: dataa
});
   for(var i = 0,message=message; i < results.length; ++i) {
	   
	   
        when(messageManager.doPush(message,results[i]), function(res){
	 deferred.resolve(res);
	}, function(err){
		console.log('push failed');
	 deferred.reject({err:err.err,uPhone:err.dt.phoneNumber});
	});
		   
   }
});
}	
return deferred;	

}
