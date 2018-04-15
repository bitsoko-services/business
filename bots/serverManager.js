var exports = module.exports = {};



exports.logCleanerBot = function() {
    // This bot saves the server logs to db then deletes the server logs folder every one hour
   var dura=heartBeat*(3*60) 
 setInterval(function(){ 
 
 console.log('deleting logs');
     
     
 }, dura);   
    
  console.log('life monitor initialized..');   
    
}


exports.init = function () {


    setTimeout(function () {
        console.log('INFO: starting log cleaner bot');
        exports.logCleanerBot();

    }, 17000);
}
