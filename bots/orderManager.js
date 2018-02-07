var exports = module.exports = {};


exports.orderBot = function () {
    // This bot checks the the incoming transactions database and alers the admin whenever there are pending transactions at every heartbeat
    var dura = heartBeat * 3;
    setInterval(function () {

        for (var store in stores) {
            bsConn.mysql.query('SELECT * FROM orders WHERE state=? OR state=? AND toservice=?', ['pending', 'delivering', stores],
                function (err, resu) {

                    if (resu && resu.length > 0) {
                        console.log('bot found orders!! ' + resu.length);

                        for (var i in resu) {
                            // console.log('requesting from '+results[i].reqfrom);   

                            when(entFunc.bitsStoreDet(resu[i].toservice, resu[i]), function (e) {
                                //console.log(e);
                                var frm = e.ret.fromU;
                                var delBy = e.ret.deliveredBy;

                                //start send message to user
                                var data = {
                                    "req": "userOrder",
                                    "app": "bits",
                                    "state": e.ret.state,
                                    "deliveredBy": e.ret.deliveredBy,
                                    "orderImg": e.ret.orderImg,
                                    "store": e.ret.toservice,
                                    "oid": e.ret.id
                                };
                                data.state = e.ret.state;
                                when(messageManager.sendPush(frm, data),
                                    function (r) {
                                        //console.log('sent '+data+' to '+frm);
                                    },
                                    function (e) {

                                        console.log('pusing failed ' + data + ' to ' + frm);
                                    });
                                //end send message to user

                                //start send message to managers

                                try {

                                    var managers = [];
                                    var managersA = JSON.parse(e.managers);

                                    for (var ii in managersA) {
                                        if (managersA[ii].state == "active") {

                                            managers.push(managersA[ii].id);
                                        }
                                    }
                                } catch (err) {
                                    var managers = [];
                                }

                                if (managers.length == 0) {
                                    managers.push(e.owner);
                                }


                                for (var ii in managers) {



                                    var data = {
                                        "req": "deliverOrder",
                                        "app": "bits",
                                        "state": e.ret.state,
                                        "msg": "Click here to manage this order",
                                        "orderImg": e.ret.orderImg,
                                        "store": e.ret.toservice,
                                        "oid": e.ret.id,
                                        "toLoc": e.ret.location
                                    };
                                    data.state = e.ret.state;
                                    when(messageManager.sendPush(managers[ii], data),
                                        function (r) {
                                            //console.log('sent '+data+' to '+frm);
                                        },
                                        function (e) {

                                            console.log('pusing failed ' + data + ' to ' + frm);
                                        });
                                }


                                //end send message to managers

                                if (e.ret.state == 'delivering') {
                                    //start send message to delivery
                                    var data = {
                                        "req": "delOrder",
                                        "app": "bits",
                                        "state": e.ret.state,
                                        "deliveredBy": e.ret.deliveredBy,
                                        "orderImg": e.ret.orderImg,
                                        "store": e.ret.toservice,
                                        "oid": e.ret.id,
                                        "toLoc": e.ret.location
                                    };
                                    data.state = e.ret.state;
                                    when(messageManager.sendPush(delBy, data),
                                        function (r) {
                                            //console.log('sent '+data+' to '+frm);
                                        },
                                        function (e) {

                                            console.log('pusing failed ' + data + ' to ' + frm);
                                        });
                                    //end send message to delivery

                                }

                            }, function (error) {
                                deferred.reject(error);
                            });
                        }


                    }

                });
        }
    }, dura);

    console.log('orderManager bot initialized every ' + (dura) / 60000 + ' min');

}


/*
exports.heartBot = function() {
    // This bot checks the the pending transactions database and alers the admin whenever there are pending transactions at evert heartbeat
   var dura=heartBeat*(3*60) 
 setInterval(function(){ 
 
 console.log('pinging admin');
     
     
  var data = {"req":"heartbeat", "app":"bits", "backLog": bacCount, "ncstLog": ncstCount, "btc": "online"};
	// var dtt=JSON.stringify(['title','description','tag','icon',[],true,true]);
 // var data = {"req":"merchantMessage", "app":"bits", "pid": "1", "msg":"hi"};
     
 if(critiMSG.length>0) {
    data.crMsg=critiMSG;
 }   
     
  when( bitsoko.sendPush(bitsokoROOT, data),
	     function(r){
	//console.log('sent '+data+' to '+bitsokoROOT);
	},
	     function(e){
	
	console.log('ERR: pusing failed for admin '+data+' to '+bitsokoROOT);
	});
 }, dura);   
    
  console.log('life monitor initialized..');   
    
}
*/

exports.init = function () {


    setTimeout(function () {
        console.log('INFO: starting order bot');
        exports.orderBot();

    }, 10000);
}
