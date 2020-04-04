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

function deleteOldSummary(){
  db.get_summary( function(summary) {
    if (summary) {
      lib.syncLoop(summary.length, function (loop) {
        var i = loop.iteration();
        // summary already exists
        console.log("found id " + summary[i]._id + " created at " + summary[i].createdAt);
        if ((Date.now() - summary[i].createdAt) > 86400){
          db.delete_summary(summary[i].createdAt, function(rb){
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
    request({uri: 'http://127.0.0.1:' + settings.port + '/ext/summary', json: true}, function (error, response, body) {
       deleteOldSummary();
       if (body) {
         var data = body.data;
         //console.log(data[0].masternodeinfo['enabled']);
         var blocksPerDay = 86400 / parseFloat(data[0].averageTime)
         var mnBlockPerDay = blocksPerDay / parseFloat(data[0].masternodeinfo['enabled'])
              db.create_summary({
                masternodecount: data[0].masternodeinfo['enabled'],
                btcprice: data[0].lastPrice,
                marketcap: (parseFloat(data[0].supply) * parseFloat(data[0].lastPrice)),
                avgblocktime: data[0].averageTime,
                mnblockperday: mnBlockPerDay
              }, function(){
                exit();
              });
            }
      }, function() {
        //exit();
      });
    }
  });
