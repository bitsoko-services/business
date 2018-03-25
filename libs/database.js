
/**
 * @fileOverview A simple example module that exposes a getClient function.
 *
 * The client is replaced if it is disconnected.
 
 */
var dbF=__dirname.slice(0,-5)+'/db/certs/';
console.log(__dirname);
console.log(' DATABASE folder is '+dbF);

certs = {
    key: fs.readFileSync(dbF+'dbClientKey.pem'),
    cert: fs.readFileSync(dbF+'dbClientCert.pem'),
    ca: fs.readFileSync(dbF+'dbServerCA.pem')
};

opts={
  host: dbHost,
  database: dbName,
  user: dbUser,
  password: dbPass,
 multipleStatements: true
};

if(dbHost!='localhost'){
    opts.ssl=certs;
}


var client = mysql.createConnection(opts);
 
/**
 * Setup a client to automatically replace itself if it is disconnected.
 *
 * @param {Connection} client
 *   A MySQL connection instance.
 */
function replaceClientOnDisconnect(client) {
  client.on("error", function (err) {
    if (!err.fatal) {
      return;
    }
 
    if (err.code !== "PROTOCOL_CONNECTION_LOST") {
     // throw err;
        process.exit(1);
      //  replaceClientOnDisconnect(client);
    }
 
      
    client = mysql.createConnection(client.config);
    replaceClientOnDisconnect(client);
    client.connect(function (error) {
      if (error) {
        // Well, we tried. The database has probably fallen over.
          console.log('connection failed:',error);
        process.exit(1);
      }
    });
  });
}
 
// And run this on every connection as soon as it is created.
replaceClientOnDisconnect(client);

      setInterval(function () {
    client.query('SELECT 1');
       //   console.log('timing db..');
}, 5000);
 
/**
 * Every operation requiring a client should call this function, and not
 * hold on to the resulting client reference.
 *
 * @return {Connection}
 */
exports.getClient = function () {
  return client;
};
