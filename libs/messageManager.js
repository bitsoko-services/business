var exports = module.exports = {};




exports.doPush = function(message,pid) {


	   var deferred = new Deferred();	
 
// Set up the sender with you API key, prepare your recipients' registration tokens. 
var sender = new gcm.Sender(googlePushKey);
var regTokens = [pid.pushID];
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
