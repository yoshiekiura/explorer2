var request = require('request');
 
var base_url = 'https://api.crypto-bridge.org/api/v1';
function get_summary(coin, exchange, crypyobridge_id, cb) {
    var summary = {};
    request({ uri: base_url + '/ticker', json: true }, function (error, response, body) {
        if (error) {
            return cb(error, null);
        } else {
            body.forEach(function(singlecoin) {
                if(singlecoin['id'] == crypyobridge_id){
                //console.log(singlecoin.id + " found");
                //summary['status'] = "success " + singlecoin.id;
                summary['bid'] = singlecoin['bid'];
                summary['ask'] = singlecoin['ask'];
                summary['volume'] = singlecoin['volume'];
                summary['last'] = singlecoin['last'];
                }
            });
            return cb(null, summary);
        }
    });
        
}

module.exports = {
    get_data: function (coin, exchange, crypyobridge_id, cb) {
        var error = null;
        get_summary(coin, exchange, crypyobridge_id, function (err, stats) {
            if (err) { error = err; }
            return cb(error, { stats: stats });
        });
    }
};

// get_summary("ic", "cryptobridge", "IC_BTC", function (err, result){
//     if (err){
//         console.log(err);
//     } else {
//         console.log(result);
//     }
// });