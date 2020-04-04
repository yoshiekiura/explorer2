var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var SammarySchema = new Schema({
  createdAt: { type: Date, default: Date.now()},
  masternodecount: { type: Number, default: 0 },
  btcprice: { type: String, default: "" },
  marketcap: { type: String, default: "" },
  avgblocktime: { type: String, default: "" },
  mnblockperday: { type: Number, default: 0 }
});

module.exports = mongoose.model('Summary', SammarySchema);
