var exports = module.exports = {};

exports.bitsStoreDet = function(d,e){


  var deferred = new Deferred();

  console.log(d);
	if(d==undefined){
	deferred.reject('no store found');
	    return;
	}

 bsConn.mysql.query('SELECT * FROM services WHERE id = ?',
        [ JSON.parse(d) ],
        function(err, results) { 
        
    if(err || results.length==0){
        console.log(err);
	    
  deferred.reject('no store found');
	    return;
 }
      // console.log(results);
     var ret=results[0];
	 ret.ret=e;
  deferred.resolve(ret);
   
   }); 
    
      

 return deferred; 
}
