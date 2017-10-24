importScripts('https://bitsoko.co.ke/bitsAssets/js/storeManager.js');
importScripts('/bits/server.js');
importScripts('/soko/server.js');
try{
importScripts('/bits/js/bitsCore.js');
}catch(err){
console.log(err);
}

importScripts('https://bitsoko.co.ke/bitsAssets/js/moment.js');

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/3.6.7/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.6.7/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '476194103258'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('service worker Received background message ', payload);
  // Customize notification here
 // const notificationTitle = 'Background Message Title';
 // const notificationOptions = {
//    body: 'Background Message body.',
 //   icon: '/firebase-logo.png'
 // };

 // return self.registration.showNotification(notificationTitle,
   //   notificationOptions);
});

var externalDeps = [

	'https://apis.google.com/js/client:platform.js?onload=startGoogle',
	'https://bitsoko.co.ke/bitsAssets/js/storeManager.js',
	'https://bitsoko.co.ke/bitsAssets/js/hooked-web3-provider/build/hooked-web3-provider.js',
	'https://bitsoko.co.ke/bitsAssets/js/web3/web3.js',
	'https://bitsoko.co.ke/bitsAssets/js/lightwallet/lightwallet.min.js',
	'https://bitsoko.co.ke/bitsAssets/js/async/lib/async.js',
	'https://bitsoko.co.ke/bitsAssets/js/jquery-2.1.1.min.js',
	'https://bitsoko.co.ke/bitsAssets/html/connect.html',
	'https://bitsoko.co.ke/bitsAssets/js/broadcastChannel.js',
	'https://bitsoko.co.ke/bitsAssets/js/qrcodesvg.js',
	'https://bitsoko.co.ke/bitsAssets/js/globalVariables.js',
	'https://bitsoko.co.ke/bitsAssets/js/bits-addMobiVeri.js',
	'https://bitsoko.co.ke/bitsAssets/js/pushManager/google-fcm.js',
	'https://bitsoko.co.ke/bitsAssets/js/jspdf/jspdf.js',
	'https://bitsoko.co.ke/bitsAssets/js/jspdf/jspdf.min.js',
	'https://bitsoko.co.ke/bitsAssets/js/moment.js',
	'https://bitsoko.co.ke/bitsAssets/js/raphQR.js',
	'https://bitsoko.co.ke/bitsAssets/js/locationManager.js',
	'https://bitsoko.co.ke/bitsAssets/js/jspdf/jspdf.plugin.autotable.js',
	'https://bitsoko.co.ke/bitsAssets/js/globalServices.js',
	'https://www.gstatic.com/firebasejs/3.6.7/firebase.js'
]

var appFiles = [
   '/bits/js/bits-FeatureDiscovery.js',
	'/bits/js/bits-follow.js',
	'/bits/js/bits-wallet-on.js',
	'/bits/js/bits-wallet-functions.js',
	'/bits/js/bits-oder-functions.js',
	'/bitsAssets/js/webcomponents.js',
	'/bits/css/materialize.css',
	'/bits/css/materialize-css.css',
	'/bits/css/style.css',
	'/bits/images/merchantsBanner.png',
	'/bits/images/merchants.png',
	'/bits/js/update_services.js',
	'/bits/js/plugins/jquery-1.11.2.min.js',
	'/bits/js/functions.js',
	'/bitsAssets/js/browserDetect.js',
	'/bits/js/materialize-css.js',
	'/bits/js/delRate.js',
	'/socket.io/socket.io.js',
	'/bits/js/products-promo-match.js',
	'/soko/js/plugins/perfect-scrollbar/perfect-scrollbar.min.js',
	'/soko/css/materialize.css',
	'/soko/css/style.css',
	'/soko/css/custom/custom.css',
	'/soko/js/plugins/prism/prism.css',
	'/soko/js/plugins/perfect-scrollbar/perfect-scrollbar.css',
	'/soko/js/plugins/chartist-js/chartist.min.css',
	'/soko/css/materialize.css',
	'/soko/css/materialize-css.css',
	'/soko/js/custom-script.js',
	'/soko/js/bitsoko.js',
	'/soko/js/materialize.js',
	'/soko/js/rewards.js',
	'/soko/js/promo.js',
	'/soko/js/sales.js',
	'/soko/images/icon.png',
	'/soko/js/products.js',
	'/soko/'

];

/*
 Copyright 2014 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// While overkill for this specific sample in which there is only one cache,
// this is one best practice that can be followed in general to keep track of
// multiple caches used by a given service worker, and keep them all versioned.
// It maps a shorthand identifier for a cache to a specific, versioned cache name.

// Note that since global state is discarded in between service worker restarts, these
// variables will be reinitialized each time the service worker handles an event, and you
// should not attempt to change their values inside an event handler. (Treat them as constants.)

// If at any point you want to force pages that use this service worker to start using a fresh
// cache, then increment the CACHE_VERSION value. It will kick off the service worker update28899171
// flow and the old cache(s) will be purged as part of the activate event handler when the
// updated service worker is activated.

var buildNumber = 6255;
var CACHE_VERSION = moment().months()+buildNumber+bitsVersion+sokoVersion;

var CURRENT_CACHES = {
  'bitsoko-app': 'bitsoko-app-v' + CACHE_VERSION
};

var idbDatabase;
var dataidbDatabase;
var IDB_VERSION = 1; 

// Analytics retries, Ten days, in milliseconds.
var STOP_RETRYING_AFTER = 864000000;

var STORE_NAME = 'urls';

var request = indexedDB.open("data");

request.onupgradeneeded = function() {
  // The database did not previously exist, so create object stores and indexes.
   this.result.createObjectStore('data');


};

request.onsuccess = function() {
  dataidbDatabase = request.result;
  

};

request.onerror = function() {
  console.log('error opening data db');
  
};

// Helper method to get the object store that we care about.


function replayAnalyticsRequests() {
  var savedRequests = [];

  getAnaStore('offana', 'readonly').openCursor().onsuccess = function(event) {
    // See https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Using_a_cursor
    var cursor = event.target.result;

    if (cursor) {
      // Keep moving the cursor forward and collecting saved requests.
      savedRequests.push(cursor.value);
      cursor.continue();
    } else {
      // At this point, we have all the saved requests.
      console.log('About to replay %d saved Google Analytics requests...', savedRequests.length);

      savedRequests.forEach(function(savedRequest) {
        var queueTime = Date.now() - savedRequest.timestamp;
        if (queueTime > STOP_RETRYING_AFTER) {
          getAnaStore('offana', 'readwrite').delete(savedRequest.url);
          console.log(' Request has been queued for %d milliseconds. No longer attempting to replay.', queueTime);
        } else {
          // The qt= URL parameter specifies the time delta in between right now, and when the
          // /collect request was initially intended to be sent. See
          // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#qt
          var requestUrl = savedRequest.url + '&qt=' + queueTime;

          console.log(' Replaying', requestUrl);

          fetch(requestUrl).then(function (response) {
            if (response.status < 400) {
              // If sending the /collect request was successful, then remove it from the IndexedDB.
              getAnaStore('offana', 'readwrite').delete(savedRequest.url);
              console.log(' Replaying succeeded.');
            } else {
              // This will be triggered if, e.g., Google Analytics returns a HTTP 50x response.
              // The request will be replayed the next time the service worker starts up.
              console.error(' Replaying failed:', response);
            }
          }).catch(function (error) {
            // This will be triggered if the network is still down. The request will be replayed again
            // the next time the service worker starts up.
            console.error(' Replaying failed:', error);
          });
        }
      });
    }
  };
}

// Open the IndexedDB and check for requests to replay each time the service worker starts up.
// Since the service worker is terminated fairly frequently, it should start up again for most
// page navigations. It also might start up if it's used in a background sync or a push
// notification context.
try{
replayAnalyticsRequests();
} catch(err){
console.log('cant replay');	
	
}
self.addEventListener('notificationclick', function(event) { 
console.log('On notification click: ', event.notification.tag);  
  // Android doesn't close the notification when you click on it  
  // See: http://crbug.com/463146 
   // getObjectStore('data', 'readwrite').put('yes-'+event.notification.tag.split("-")[1], 'noteclick');
	var tagg = event.notification.tag;
	
	var app = tagg.split("-")[0];
	var req = tagg.split("-")[1];
	var act = tagg.split("-")[2];
	var sID = tagg.split("-")[3];
	var eAct = event.action;
	
	
	var openApp=false;
	
        var nDat={};
	     nDat.store=sID;
	     nDat.oID=tagg.split("-")[2];
	     nDat.app=app;
	     nDat.tagg=tagg;
	     nDat.act=act;
	     nDat.req=req;
	     nDat.eAct=eAct;
	
	console.log(nDat);
	
	if (req=='admin' && ( eAct==='soko-admin-update' || eAct==='bits-admin-update')) {
		   
      var title = 'Updating..';
      var message = 'please wait';  
      var icon = 'bitsAssets/images/icon-dunno.png';  
      var notificationTag = nDat.tagg;  
      self.registration.showNotification(title, {  
          body: message,  
          icon: icon,  
          tag: notificationTag  
        });   
    fetch('/appAdmnReq/?s='+app+'&a='+act).then(function(response) { 
	    
        response.clone().json().then(function(re){
		
      var title = 'Updated '+re.s;
      var message = 'Running v'+re.a;  
      var icon = 'bitsAssets/images/icon.png';  
      var notificationTag = nDat.tagg;  
      return self.registration.showNotification(title, {  
          body: message,  
          icon: icon,  
          tag: notificationTag  
        }); 
        
	  });	
		
      
    }).catch(function(err) {  
      console.error('Unable to retrieve data', err);

      var title = 'Ooops!';
      var message = err;  
      var icon = 'bitsAssets/images/icon-bad.png';  
      var notificationTag = nDat.tagg;   
      return self.registration.showNotification(title, {  
          body: message,  
          icon: icon,  
          tag: notificationTag  
        });  
    }); 
	}else{
	event.notification.close();
	
	}

	
if (app=='bits' && req != 'admin') {
	openApp=true;
	  var opURL='/bits/?s='+sID;
	      if(sID===undefined){
	  var opURL='/bits/';      
	      }      if(req=='order'){
	  var opURL=opURL+'#oid='+act;      
	      }
	
	if((eAct=='pay' || eAct=='cancel' || eAct=='reject' || eAct=='rem-pend'  ) && req=='order'){
		if(eAct=='rem-pend'){
		   eAct='cancel';
		   }
	openApp=false;
	   fetch('/orderManager/?oid='+act+'&act='+eAct).then(function(response) {  
     	   response.clone().json().then(function(re){
 console.log(re);
	if(eAct=='cancel'){
		  var dn='cancelled';
		   } else if(eAct=='reject'){
		
		   var dn='rejected';   
		   } else{
		
		   var dn='completed';   
		   }   
      var title = 'order '+act;
      var message = dn+' succesfully.';  
      var icon = 'bitsAssets/images/icon.png';  
      var notificationTag = app+'-update';  
      return self.registration.showNotification(title, {  
          body: message,  
          icon: icon,  
          tag: nDat.tagg  
        }); 
     
		   })
     
      
    }).catch(function(err) {  
      console.error('Unable to retrieve data', err);

      var title = 'Payment not Completed!';
      var message = err;  
      var icon = 'bitsAssets/images/icon-bad.png';  
      var notificationTag = app+'-update';   
      return self.registration.showNotification(title, {  
          body: message,  
          icon: icon,  
          tag: nDat.tagg  
        });  
    }); 	
		
	}else if(req=='order' &&  eAct=='locate'){
	
	//
		var coordi=tagg.replace('(-','(=').split("-")[3].replace('(=','(-').replace("(", "").replace(")", "");
	
 var opURL='https://www.google.com/maps/dir/?api=1&destination='+coordi+'&travelmode=driving';
		
	}else if(req=='order' &&  eAct=='open'){
	openApp=true;
	}else{
	openApp=false;
	}
	
	try{ 
		/*
bitsNotificationClick(nDat).then(function(e){

      console.log(e);
    return;
    }));
    */
		
}catch(err){
console.log('Bits-SW notification click error: ',err);
}
} else if (app=='soko' && req != 'admin') {	
	openApp=true;  
	try{
 	     if(req=='order'){
	     
 var opURL='/soko/#s='+sID+'&page=storefront&id='+act;
		     
	     }else if (req=='device'){

 var opURL='/soko/#s='+sID+'&page=devices&id='+act;
		     
	     } 
     
}catch(err){
console.log('Soko-SW notification click error: ',err);
}
}	


	
     event.waitUntil(
	   
	    clients.matchAll({ 
includeUncontrolled: true, 	
      type: "all"  
    })
    .then(function(clientList) {
  //var sID = event.action.split("-")[3];
	
	
      if (openApp) {
      for (var i in clientList) {  
        var client = clientList[i]; 
		console.log(client);	
client.postMessage('notification clicked');
  var requestURL = new URL(client.url);
	      
   console.log(opURL,client.url);
	 //   if (requestURL.pathname.split("/")[1] == opserv){  
        if (client.url.includes(opURL) && 'focus' in client) {
        
          client.focus();  
          return client.postMessage(nDat);
        }
      }  
      if (clients.openWindow) {
        clients.openWindow(opURL); 
          return client.postMessage(nDat);
      }
    } else{
    console.log('info: dont need to open app');
    }
        
    }));

		
});

self.addEventListener('push', function(event) {  
  // Since there is no payload data with the first version  
  // of push messages, we'll grab some data from  
  // an API and use it to populate a notification  
	  console.log(event.data);
var payload = event.data ? event.data.text() : 'no payload';
    console.log(payload);
	var payload = JSON.parse(payload).data;
//START bits wallet service worker	
	
	    if (payload.req=='admin') {	
                
        var note = self.registration.showNotification(payload.title, {
            body: payload.msg,
            icon: '/'+payload.app+'/images/icon.png',
            image: '',
            tag: payload.app+"-admin",
            actions: [{
                        action: payload.app+'-'+payload.req+'-update',
                        title: "Update"
                    }],
            sticky: true,
            silent: false
        });


                 

	    }
	
	
    try{
	    if (payload.app=='bits') {	
return bitsPush(payload).then(function(e){
   
getObjectStore('data', 'readwrite').put( Date.now() , 'bits-last-push'); 
      console.log(e);
    
    });
	
}else if(payload.app=='soko'){
	 
	 return sokoPush(payload).then(function(e){
   
getObjectStore('data', 'readwrite').put( Date.now() , 'soko-last-push'); 
      console.log(e);
    
    });
    }else{

    		
      var title = 'Sorry';
      var message = 'undesignated message error';  
      var icon = 'app/images/no.png';  
      var notificationTag = 'error';  
      return self.registration.showNotification(title, {  
          body: message,  
          icon: icon,  
          tag: notificationTag  
        }); 
            
}
	    
    	//handleMsg(JSON.parse(payload));
    	}catch(e){
    		
      var title = 'Bits-SW message error:';
      var message = e;  
      var icon = 'app/images/no.png';  
      var notificationTag = 'error';  
      return self.registration.showNotification(title, {  
          body: message,  
          icon: icon,  
          tag: notificationTag  
        }); 
             
          }
	
	//END bits wallet service worker
  
});

self.addEventListener('activate', function(event) {
    
      
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    // `caches` refers to the global CacheStorage object, and is defined at
    // http://slightlyoff.github.io/ServiceWorker/spec/service_worker/#self-caches
    caches.keys().then(function(cacheNames) {
		

if (self.clients && (typeof self.clients.claim == 'function')) {
 
self.clients.claim();
 
}
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) == -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


self.addEventListener('message', function(event) {
    var data = event.data.data.data || event.data.data;
    console.log('service message ',data);
    //event.waitUntil(
//data.e=event;

if (data.app=='bits') {	
	try{
		
return bitsMessage(data).then(function(e){
        event.ports[0].postMessage(e);
      console.log(e);
    
    });

}catch(err){
console.log('Bits-SW message error: ',err);
}
	
}else{

  handleMsg(data).then(function(e){
        event.ports[0].postMessage(e);
      console.log(e);
    
    })
}
	
    //);
});


self.addEventListener('install', function(event) {
  event.waitUntil(
      		
caches.open(CURRENT_CACHES['bitsoko-app']).then(function(cache) {
	
	console.log('installing SW');
	  for (var i = 0, len = externalDeps.length; i < len; i++) {		 
		  
         var request = new Request(externalDeps[i], {mode: 'no-cors'});		
 		cache.add(request).then(function() {		
           		
        });		
 }
	
	
	
	return cache.addAll(appFiles);
		
		
  }).then(function() {
	
	console.log('installed SW');
      return self.skipWaiting();
    }).catch(function(error) {
    // If the promise rejects, handle it by returning a standardized error message to the controlled page.
    console.error('sw installation failed:', error);

  })
      
  );
});

// This sample illustrates an aggressive approach to caching, in which every valid response is
// cached and every request is first checked against the cache.
// This may not be an appropriate approach if your web application makes requests for
// arbitrary URLs as part of its normal operation (e.g. a RSS client or a news aggregator),
// as the cache could end up containing large responses that might not end up ever being accessed.
// Other approaches, like selectively caching based on response headers or only caching
// responses served from a specific domain, might be more appropriate for those use cases.
self.addEventListener('fetch', function(event) {
/*
  var url = new URL(event.request.clone().url);
  
  try {
  
  }
	catch(err){

	}
	*/

  event.respondWith(
   
	
   /*
  
  try{
  var requestURL = new URL(event.request.url);
   
	
	if (requestURL.origin.slice(-14)=='googleapis.com') {
      event.respondWith(
	  console.log('fetched '+requestURL.origin.slice(-14)+' from the network');
		return fetch(event.request);
	);
    //  return;
    }
  }
	catch(err){}
	*/
	
    caches.open(CURRENT_CACHES['bitsoko-app']).then(function(cache) {
try{
	var url = new URL(event.request.clone().url);
		
if (url.pathname.substring(0, 2) == '/p' && url.hostname == location.hostname) {
		

		console.log('physical web url!!');
	var bid=url.pathname.substr(url.pathname.length -3);
	 
	 	      var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 60; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

  return cache.match(event.request.clone()).then(function (response) {
	  
console.log(response);
	  var sendUrl='/p'+bid+'?f=j&p='+text;
	  
 return response || fetch(sendUrl).then(function(response) {
	 
console.log(response.clone().url);
console.log(event.request.clone().url);
console.log(sendUrl);
if(response.clone().url==location.origin+sendUrl ){
	console.log(response.clone().text());
return response.clone().text().then(function(d){
 	
var respJ = JSON.parse(d);
  console.log(respJ);
	
	
	
	
	
	getObjectStore('data', 'readwrite').get("bits-user").onsuccess = function (event) {
		
var visitLog=Response.redirect('/soko/?reqP=sless&uid='+event.target.result+'&sid='+respJ.s);
		
    }
	
	if(respJ.s=='0'){
//This is a sokopos Default url so redirect to homepage
url = location.origin+'/soko/';
var trResp=Response.redirect(url);

return trResp;	   
	   }else if(respJ.s=='3'){
 
url = location.origin+'/bits/?s='+respJ.a+'&p='+respJ.p;
var trResp=Response.redirect(url);
cache.put(event.request.clone(), trResp.clone());

return trResp;
	   
	   }else{
 
url = location.origin+'/bits/?s='+respJ.s+'&p='+respJ.p;
var trResp=Response.redirect(url);
cache.put(event.request.clone(), trResp.clone());

return trResp;
	   
	   }

 	
 });	
	
}


  }).catch(function(err){

  	
//url = 'https://bitsoko.io/bits/index.html#s=3&a=404';
return Response.redirect('/bits/index.html?s=3&a=404');
  });	
//cache.put(orReq, response.clone());
//  console.log(resp.clone());

  });
	
}
}catch(err){
console.log('Bits-SW fetch error: ',err);
}

      return cache.match(event.request.clone()).then(function (cacheResponse) {
		  
//console.log(event.request.clone(),event.response);
		  
        var netRes=fetch(event.request.clone()).then(function(response) {
		
	  try{
	  cache.put(event.request.clone(), response.clone());
	  }catch(e){
	  
	  }
		if (response.status < 400) {
             var turl = new URL(event.request.clone().url);
             if(turl.href.includes('/socket.io/socket.io.js') || turl.pathname.substr(0,7) != '/socket' ){
                 
              cache.put(event.request.clone(), response.clone());

             } else if (turl.href== location.origin+'/b' ){
                 req=event.request.clone();
                 req.url=location.origin+'/b';
      
              cache.put(req, response.clone());
             }
            } else if (response.clone().status >= 500) {
              // If this is a Google Analytics ping then we want to retry it if a HTTP 5xx response
              // was returned, just like we'd retry it if the network was down.
              checkForAnalyticsRequest(event.request.url);
            }
         return response;
        }).catch(function(error) {
            // The catch() will be triggered for network failures. Let's see if it was a request for
            // a Google Analytics ping, and save it to be retried if it was.
            checkForAnalyticsRequest(event.request.url);

            throw error;
          });
	      
	return cacheResponse || netRes;
	      
      })
    })
	
	
	
	
	
	
  );
});


function checkForAnalyticsRequest(requestUrl) {
  // Construct a URL object (https://developer.mozilla.org/en-US/docs/Web/API/URL.URL)
  // to make it easier to check the various components without dealing with string parsing.
  var url = new URL(requestUrl);

  if ((url.hostname == 'www.google-analytics.com' || url.hostname == 'ssl.google-analytics.com') &&
       url.pathname == '/collect') {
    console.log('Storing Google Analytics request in IndexedDB to be replayed later.');
    saveAnalyticsRequest(requestUrl);
  }
}

function saveAnalyticsRequest(requestUrl) {
  getAnaStore('offana', 'readwrite').add({
    url: requestUrl,
    timestamp: Date.now()
  });
}

function updateApp(event) {
	
caches.open(CURRENT_CACHES['bitsoko-app']).then(function(cache) {
	  for (var i = 0, len = appFiles.length; i < len; i++) {
        var request = new Request(appFiles[i], {mode: 'no-cors'});
		cache.add(request).then(function() {
          //event.ports[0].postMessage({
          //  error: null
          //});
        });
}
		
		
  }).catch(function(error) {
    // If the promise rejects, handle it by returning a standardized error message to the controlled page.
    console.error('Message handling failed:', error);

    event.ports[0].postMessage({
      error: error.toString()
    });
  });
	
}

function handleMsge(dat){
    
    
}

function handleMsg(dat){
  //console.log(dat);
    
  id=dat.mid ? dat.mid : randomString(20);
    
   msDat = dat;
    console.log(dat);
return new Promise(function(resolve, reject) {
    //resolve
       try {
console.log('Handling message event:', dat);
           //var msDat = msDat
    switch (dat.req) {
      // This command returns a list of the URLs corresponding to the Request objects
      // that serve as keys for the current cache.
      // This command adds a new request/response pair to the cache.
             
      case 'promServ':
     data = dat;
        var prom=data.prom;
        
            var img = '';
            var svcs = '';
     for(var i = 0, svcs=svcs, img=img; i < prom.length; ++i) {
      svcs+=toTitleCase(prom[i].name)+', ';
      img= prom[getRandomInt(1, 3)].icon;
    };     
            
        var note = self.registration.showNotification(data.count+' Payment Services Available!', {  
          body: svcs+'+MORE! Add your account number to start making payments.',  
          icon:  '/app/images/services/'+img,  
          tag: 'app-promo',
          actions: [{action: 'open', title: "Add"}]
        });
            
     var dt = {service: '0'};
            noteStore('add','promo',dt);
      break;
               
      case 'fundsTrans':
     data = dat;
        var note = self.registration.showNotification(data.sname+' Payment Request', {  
          body: 'Please send '+data.amount+' to '+data.name,  
          icon:  '/app/images/services/'+data.img,  
          tag: 'app-'+ id,
          actions: [{action: 'later', title: "Later"},{action: 'open', title: "Send"}]
        });
            
     var dt = {service: '1', recp: data.recp, meta: data.to, amount: data.amount, curr: 'btc', action: 'send', tld: ''};
            noteStore('add',id,dt);
      break;
            
      case 'merchPend':
     data = dat;
        var note = self.registration.showNotification(data.count+' Pending Transactions', {  
          body: 'you have received payments waiting for you..',  
          icon:  '/bitsAssets/images/icon-dunno.png',  
          tag: 'merch-pending',
          actions: [{action: 'open', title: "Complete"}]
        });
      break;
      case 'newCust':
     data = dat;
        var note = self.registration.showNotification('New Customer', {  
          body: 'Send a welcome message to '+data.username,  
          icon:  data.img,  
          tag: 'merch-'+id,
          actions: [{action: 'open', title: "Ok"},{action: 'later', title: "Later"}]
        });
      break;
      case 'heartbeat':
     data = dat;
            
            var sl = true;
            var status = 'Ok';
            var img = '/bitsAssets/images/icon-ok.png';
            if((data.backLog+data.ncstLog) > 0){
            
            var status = 'Warning';
            var img = '/bitsAssets/images/icon-dunno.png';  
            }
            
            if(data.btc != 'online'){
            var sl = false; 
            var status = 'Error';
            var img = '/bitsAssets/images/icon-bad.png';
            }
            
           var note = self.registration.showNotification('Bitsoko Status: '+status, {  
          body: 'UnCast-'+data.ncstLog+' Backlog-'+data.backLog+' BTC-'+data.btc,  
          icon:  img,  
          tag: 'root-heartbeat',
          actions: [{action: 'open', title: "Open Admin"},{action: 'recheck', title: "Check Again"}],
            sticky: true,
            silent: sl
        });
      break;
      case 'compTrn':
            
     data = dat;
getObjectStore('data', 'readwrite').get("services").onsuccess = function (event) {
          var dt = JSON.parse(event.target.result);
          
      for (var i = 0, data = dat; i < dt.length; i++) {
          if(dt[i].id==data.from.split('-')[1]){
        var note = self.registration.showNotification('Transaction Complete', {  
          body: 'Check balance to confirm. : #'+data.msg,
          icon:  '/app/images/services/'+ dt[i].icon,  
          tag: 'app-'+id,
          actions: [{action: 'open', title: "Check"}]
        });
       }
      }
    }
      break;
      case 'newMsg':
     data = dat;
getObjectStore('data', 'readwrite').get("services").onsuccess = function (event) {
          var dt = JSON.parse(event.target.result);
          
      for (var i = 0, data = dat; i < dt.length; i++) {
          if(dt[i].id==data.from.split('-')[1]){
        var note = self.registration.showNotification(dt[i].name, {  
          body: data.msg,  
          icon:  '/app/images/services/'+ dt[i].icon,  
          tag: 'merch-'+id,
          actions: [{action: 'open', title: "Open"},{action: 'later', title: "Later"}]
        });
       }
      }
    }
      break;
      case 'checkbal':
            
 checkBal();
	 break;
      
      case 'pospay':
            
 posPay(dat,id);
	 break;
      case 'pay':
            
 walPay(dat,id);
	
      break;
      
      case 'install':
        
         console.log('installing app');
            updateApp(dat.e);
      break;
            
      case 'add':
        // If event.data.url isn't a valid URL, new Request() will throw a TypeError which will be handled
        // by the outer .catch().
        // Hardcode {mode: 'no-cors} since the default for new Requests constructed from strings is to require
        // CORS, and we don't have any way of knowing whether an arbitrary URL that a user entered supports CORS.
         console.log('app updated');
            
      break;
            
            // This command adds a new request/response pair to the cache.
            
      case 'test':
		
		
return new Promise(function(resolve, reject) {
              //reject(event.data.error);
           console.log('testing service');
              resolve('ok');
          
        }).then(function(e) {
			
           console.log('tested service '+ e);
			event.ports[0].postMessage(e);
        });
      break;

      // This command goes back to the last page.
      case 'back':
         //event.waitUntil(
  
   
    clients.matchAll({ 
includeUncontrolled: true, 	
      type: "all"  
    })
    .then(function(clientList) {
        
        
  
  var store = getObjectStore('data', 'readwrite').get("newpay");
	  store.onsuccess = function (dt) {

	//return client.focus();
      for (var i = 0; i < clientList.length; i++) {  
        var client = clientList[i]; 
		console.log(dt.target.result.split("-")[3],client.url);	
          //dt.target.result.split("-")[3]
        if (client.url.includes('/xLink.js'))  
        //if (client.url == 'https://bitsoko.co.ke/app/index.html?web=1' && 'focus' in client)  
          return client.parent.focus();  
      }
      }  
    });
  //);
      break;

      default:
        // This will be handled by the outer .catch().
            
checkReminder();
            resolve('done');
        throw 'Unknown command: ' + dat.req;
    }
       } catch(err){
       console.log(err);
       }
        })
}
