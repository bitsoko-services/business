var exports = module.exports = {};


// We need this to build our post string

function getBitsWinOpt(str,aKey){    
			try{    
		   var ps=str.split("?")[1];
 var pairs = ps.split("&");
            }catch(e){
return false;
}  
  		     
            
for(var i = 0, aKey=aKey; i < pairs.length; ++i) {
var key=pairs[i].split("=")[0];
	
    var value=pairs[i].split("=")[1];
 if (key==aKey){
     
     return value;
 
 }  
    
}
		     }

	
	


exports.createEnterprisePage = function(req) {
      
  var deferred = new Deferred();


		
            fs.readFile(__dirname + '/themes/default/templates/index.amp.pug', function (error, source) {
                //TO-DO switch to new default
                //fs.readFile(__dirname + '/themes/default/templates/index.amp.pug', function (error, source) {
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
                    productCat: allProdCat,
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
                    cid: '000',
                    entBanner:"https://photogallerylinks.com/pics/1564.jpg",
                    entIconLst:[  { icon: 'https://lh6.googleusercontent.com/-u_vqwC6YAv0/AAAAAAAAAAI/AAAAAAAAAAA/AAnnY7psnnp0lLLYYuF6NVo0fncsVRNJMg/s96-c/photo.jpg',name: 'Bit Coin' },{ icon: 'https://lh6.googleusercontent.com/-u_vqwC6YAv0/AAAAAAAAAAI/AAAAAAAAAAA/AAnnY7psnnp0lLLYYuF6NVo0fncsVRNJMg/s96-c/photo.jpg',name: 'Bit Coin' },{ icon: 'https://lh6.googleusercontent.com/-u_vqwC6YAv0/AAAAAAAAAAI/AAAAAAAAAAA/AAnnY7psnnp0lLLYYuF6NVo0fncsVRNJMg/s96-c/photo.jpg',name: 'Bit Coin' } ],
                    entImgLst:entImageList
                
                }
                data.body = process.argv[2];
                //jade.render
                var template = jade.compile(source);
                var html = template(data);
                //res.writeHead(200);
		    writeFile('business/index.html', html, function (err) {
                    if (err) console.log('!ERR unable to create enterprise page', err);

	deferred.resolve(html);
		});
		    
              
            });	
	
     return deferred;
	
}


exports.createStorePage = function(req) {
   
  var deferred = new Deferred(); 
	
	
		      
		  var indxPth='/bits/index.html';	
	 //redirecting to sokopos store profile page
		  
			     if(getBitsWinOpt(req.url,'s')=='3'){
				     //this is a sokopos link
				var sid=getBitsWinOpt(req.url,'a'); 
				}else{
					//this is a enterprise store link
				var sid=getBitsWinOpt(req.url,'s'); 
				}
	
		      
	//console.log('creating store page 1 ',sid,indxPth);	    	
	      when(entFunc.returnMerchantServices('',{service:sid,id:sid}), function(r){
		      
		      
	//console.log('creating store page 2 ',sid,indxPth);
		      
		     var thePrds = r.res.list;
			 r.res.list=[];
		      var ii=0;
		      
		      for(var ix in thePrds){
			    
		      if(thePrds[ix].productCategory==null || thePrds[ix].productCategory=='null'){
			        ++ii;
		      r.res.list.push(thePrds[ix])
			      if(ii>6){
			      break;
			      }
		      }
		      }
			
			
	    when(entFunc.bitsStoreDet(sid),function(rr){
		    
	//console.log('creating store page from '+'bitsoko' + indxPth);
		fs.readFile('business' + indxPth, function(error, source){
			
			if(error)console.log(error);
  
html2jade.convertHtml(source, {}, function (err, jd) {
	var thm = rr.theme;
	if(thm== null || thm== 'null' || thm== ''){
	thm = primaryColor;
	}
	//console.log('setting page theme '+thm);
  var data = {
  name: rr.name,
  desc: rr.description,
    img: rr.bannerPath.replace('.png','-128.webp'),
    theme: thm,
    stMeta: JSON.stringify(r),
      cid: Cid
}
data.body = process.argv[2];
//jade.render
    var template = jade.compile(jd);
    var html = template(data);
    //res.writeHead(200);
	
	html = html.replace(/https:\/\/bitsoko.io\/bitsAssets/g, "/bitsAssets")
	html = html.replace(/https:\/\/bitsoko.co.ke\/bitsAssets/g, "/bitsAssets")
	
		
	
	// lets inline the stylesheets to improve performance
		fs.readFile('business/bitsAssets/css/materialize/materialize.min.css', function(error, source){
			
			if(error)console.log(error);
		html = html.replace('<link href="/bitsAssets/css/materialize/materialize.min.css" rel="stylesheet" type="text/css">','<style>'+source+'</style>')
	
		// lets inline the stylesheets to improve performance
		fs.readFile('business/bitsAssets/html/connect.html', function(error, source){
			
			if(error)console.log(error);
		html = html.replace('<link href="/bitsAssets/html/connect.html" rel="import">',source)
		
		// lets inline the stylesheets to improve performance
		fs.readFile('business/bits/css/style.css', function(error, source){
			
			if(error)console.log(error);
		html = html.replace('<link href="css/style.css" media="screen,projection" rel="stylesheet" type="text/css">','<style>'+source+'</style>')
		
		
		
			   console.log('!info saving new store page to '+'/business/tmp/html/bits/?s='+sid);			     
		writeFile('business/bitsAssets/tmp/html/bits/?s='+sid+'.html', html, function (err) {
                    if (err) console.log('!ERR unable to write database client key', err);

	deferred.resolve(html);
		});
			
  
	})
		     
		
		
			
  
	})
		     
		
			
  
	})
		     
	
	
});
});     
		    
		    
	    },function(err){
	    console.log('err! cannot show merchant share info! merchant '+sid+' not found!');
	    })
  	
	
}, function(error){
		console.log('ERR: service profile error',error);
    
}); 	

	
	
     return deferred;
	
}

exports.returnMerchantServices = function(bb,dataa) {
      
  var deferred = new Deferred();
	
	    var priServ = parseInt(dataa.service);
	    var priAcc = parseInt(dataa.id);
	 if (priServ==3){
	    var priServ = priAcc;
	 }
	
bsConn.mysql.query('SELECT * FROM services WHERE id=?',[priServ],
        function(err, results) { 
         if(err){
             console.log(err);
		 
 deferred.reject({ret:bb,res:{ "msg" : 'no merchant with this id'}}); 
         }else{
		 
		     	
	when(entFunc.bitsStoreDet(priServ,dataa), function(resu){
	//var dataa=e.ret;  
	

             resu=results[0];
		 try{
             delete resu.banner
		 }catch(err){
	     console.log(dataa.action+" error: banner image for "+priServ+" not removed");
	     }	
		
	  when(entFunc.merchantOwner(resu.owner), function(ee){
			  
			  
                  when(entFunc.productsByStore(resu), function(e){
				  
	var pAry=[];		 
for(var i in e) {
       pAry.push(e[i].id);
             delete e[i].image;
}	
			  

exports.merchantPromos = function(e,f) {
	
	// e = store ID
    	// f = an array of retailing product ids to include as sponsored promos
    
  var deferred = new Deferred();
    try{
       	
		   var sql='SELECT * FROM promotions';
		
		try{
			if(f.length>0){
				var inclP=f;
			}else{
			var inclP=[];
			}
		}catch(err){
		var inclP=[];
		}
	     
	 
 bsConn.mysql.query(sql,
        function(err, resul) { 
	
   var retPromotions=[];
	 if (err){
	 console.log(err);
		 
		 
      deferred.resolve(retPromotions);
		 return;
	 }
	 
	
	
	 
	 var results=[]; 	 
		 
	for(var iii in resul){
		var hasSpPr=false;
	
		try{
		
		var hldSpPro=JSON.parse(resul[iii].items);
		}catch(e){
		var hldSpPro=[];
			
		console.log('skipped adding promo ',resul[iii].items,e);
		continue;
			
		}
		
		function idd(a, b){
			var d = {};
    var results = [];
    for (var i = 0; i < b.length; i++) {
        d[b[i]] = true;
    }
    for (var j = 0; j < a.length; j++) {
        if (d[a[j]]) 
            results.push(a[j]);
    }
    return results;
			
}
		
		if(inclP==undefined || inclP=='undefined' || hldSpPro==undefined || hldSpPro=='undefined' ){
		continue;
		}
	
		if( parseInt(resul[iii].owner)==parseInt(e) || idd(JSON.parse(hldSpPro),inclP).length > 0){
		//console.log('matched ',idd(hldSpPro,inclP));
	results.push(resul[iii]);
			
		}
	
		
	}	 
		 
	
     	 
      if(results.length==0){
      deferred.resolve(retPromotions);
		 return;  
      } 
	
     for(var i = 0,retPromotions=retPromotions; i < results.length; ++i) {
	     	
		
         var proBanner={};
			var idiscount=results[i].discount;
			   if(idiscount=='' || idiscount== 0 || idiscount== '0'){
			 idiscount=0;  
			   }
			   var msg=results[i].msg;
			
			   var nm=results[i].name;
			//   if(nm==''){
			 //nm=f.names;  
			 //  }
			var sbs = results[i].subscribers;
			
			try{
			sbs=JSON.parse(sbs);
				if(sbs.length==0)sbs = [];
			}catch(err){
				var sbs = [];
			}
			
         proBanner.id=results[i].id;
         proBanner.discount=idiscount;
         proBanner.promoName=nm;
         proBanner.promoBanner=results[i].customImagePath;
         proBanner.promoPrice=results[i].totPrice;
         proBanner.promoOwner=results[i].owner;
	     //start TODO: fix this hack 
         proBanner.promoItems=results[i].items.replace('"','').replace('"','');
	     //end TODO:
         proBanner.promoDesc=msg;
         proBanner.promoSubs=sbs;
         proBanner.promoStatus=results[i].status;
         proBanner.promoLogo='https://bitsoko.io/bitsAssets/img/promologo.png';
             
         retPromotions.push(proBanner);  
    if(results.length==retPromotions.length){
    
      deferred.resolve(retPromotions);
    }
             /* 
	    
    
    
}, function(error){
    
      reject("error fetching promotions: "+error); 
}); 
      
	
	
	
	
	
	
         deferred.resolve(results); 
	 */       
     } 
     		
			
    });       
          
    }catch(e){
	    console.log(e);
       deferred.reject(e); 
    }
    
    
    return deferred;
}


			  	
when(entFunc.merchantPromos(priServ,pAry), function(ep){		  

             	var epp=[];
	
	console.log('INFO: functions.js 165',ep);
for(var ix in ep) {
	try{
	if(ep[ix].promoStatus=='active'){
	epp.push(ep[ix]);
	}
	}catch(err){
		console.log(err);
	
	}
       
}	
	console.log('INFO: functions.js 176',epp);
       
             delete resu.pushID;
             resu.list=e;
			  resu.promotions=epp;
		 
			  resu.icon=ee.res.icon;
		 
			  resu.eName=ee.res.name;
		 
			  resu.eDesc=ee.res.tagline;
			  resu.storeAddress=ee.res.address;
	try{
	var dm=JSON.parse(resu.deliveryMembers);
		var locDt=resu.lonlat.split(',');
	}catch(err){
	var dm=[];
	}
	if(dm.length>0 && resu.deliveryRate>0 && locDt.length==2){
		
		resu.deliveries="true";
	   
	   
	   }else{
	   resu.deliveries="false";
	   
	   }
	
 deferred.resolve({ret:bb,res:resu}); 
		  
}, function(error){
console.log(error);    
}); 
	
		  
}, function(error){
console.log('error getting products at bits ',error);    
}); 
			  
}, function(error){
  console.log(error);  
}); 
    	
		
		
		
	
    
}, function(error){
		
 deferred.reject({ret:bb,res:{ "msg" : 'No such store found'}}); 
		
});
		//console.log(resu);
                
    //var result = {address: data.pubkey, privhash: data.privkey, userid: uid, type: data.type, username: data.name, pwallet: 'true'};
     
             
         }

    }); 

 return deferred;
	
}


exports.productsByStore = function(e) {
    
  var deferred = new Deferred();
    try{
       
   	
		
		   var sql='SELECT * FROM products WHERE owner=?';
		var sqlA=[parseInt(e.id)];
		try{
		var inclP=JSON.parse(e.retailing);
		}catch(err){
		var inclP=[];
		}
	     
    for(var j = 0,sqlA=sqlA,sql=sql; j < inclP.length; ++j) {
      
	sql=sql+' OR id = ?';
    sqlA.push(inclP[j].id);
        
    }
 
	 
 bsConn.mysql.query(sql,sqlA,
        function(err, results) { 
        
    if(err){
        console.log(err);
	 return;}
   var retProducts=[];
     
    for(var j = 0; j < results.length; ++j) {
      
	delete results[j].image
    retProducts.push(results[j]);
        
    }

      if(retProducts.length>0){
      
	      deferred.resolve(retProducts); 
          

      }  else{
     deferred.reject('no products!!?!');      
   }
     
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
		c.cover = results[0].entBanner;
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
	c.enterprised = results[0].enterprised;
	c.dbClientKey = results[0].dbClientKey;
	c.dbClientCert = results[0].dbClientCert;
	c.dbServerCA = results[0].dbServerCA;
		
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
