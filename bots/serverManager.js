var exports = module.exports = {};



exports.logCleanerBot = function() {
    
    // This bot saves the server logs to db then deletes the server logs folder every one hour
    // TO-DO send logs to server
    
    
   var dura=heartBeat*(3*60) 
 setInterval(function(){ 
 
 console.log('deleting logs');
     
     var clearC = `
            cd logs
            rm -rf business.log
        `;
     
    nCmd.get(clearC, function (data, err, stderr) {
        if (!err) {
            var hMsg = 'deleted logs';
            console.log(hMsg);
            
        } else {
            console.log(err);
        }
    });
     
     
 }, dura);   
    
  console.log('log monitor initialized..');   
    
}


exports.init = function () {


        console.log('INFO: starting log cleaner bot');
        exports.logCleanerBot();

}
