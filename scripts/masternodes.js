var mongoose = require('mongoose')
  , lib = require('../lib/explorer')
  , db = require('../lib/database')
  , settings = require('../lib/settings')
  , request = require('request');

var COUNT = 5000; //number of blocks to index

function exit() {
  mongoose.disconnect();
  process.exit(0);
}

function deleteOldmasternodes(){
  db.get_masternodes( function(masternodes) {
    if (masternodes) {
      lib.syncLoop(masternodes.length, function (loop) {
        var i = loop.iteration();
        // masternodes already exists
        console.log("found id " + masternodes[i]._id + " created at " + masternodes[i].createdAt);
        if ((Date.now() - masternodes[i].createdAt) > 86400){
          db.delete_masternodes(masternodes[i].createdAt, function(rb){
            console.log("rb = " + rb);
          }
        );
        }
        loop.next();
        });
      }
    });
}
var dbString = 'mongodb://' + settings.dbsettings.user;
dbString = dbString + ':' + settings.dbsettings.password;
dbString = dbString + '@' + settings.dbsettings.address;
dbString = dbString + ':' + settings.dbsettings.port;
dbString = dbString + '/' + settings.dbsettings.database;

mongoose.connect(dbString, function(err) {
  if (err) {
    console.log('Unable to connect to database: %s', dbString);
    console.log('Aborting');
    exit();
  } else {
    request({uri: 'http://127.0.0.1:' + settings.port + '/api/masternode?mode=list', json: true}, function (error, response, body) {
       deleteOldmasternodes();
       if (body) {
         //console.log("found mn body", body);
         var data = body;
         lib.syncLoop(data.length, function (loop) {
           var i = loop.iteration();
           var address = data[i].addr;
            db.find_masternodes(address, function(masternodes) {
              if (masternodes) {
                // peer already exists
                console.log("found id " + masternodes.addr + " createdat " + masternodes.createdAt);
                if ((Date.now() - masternodes.createdAt) > 86400){
                  db.delete_peer(masternodes.addr, function(rb){
                    console.log("rb = " + rb);
                  }
                );
                }
                loop.next();
              } else {
              console.log(data[i].addr);
              db.create_masternodes({
        
                rank: data[i].level,
                network: data[i].network,
                txhash: data[i].txhash,
                status: data[i].status,
                addr: data[i].addr,
                version: data[i].version,
                activetime: data[i].activetime

              }, function(){
                loop.next();
              });
            }
          });
      }, function() {
        exit();
      });
    }
  });
}
});
