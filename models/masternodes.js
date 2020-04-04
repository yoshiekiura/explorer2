var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var mnSchema = new Schema({
  createdAt: { type: Date, default: Date.now()},
  rank: { type: Number, default: 0 },
  network: { type: String, default: "" },
  txhash: { type: String, default: "" },
  status: { type: String, default: "" },
  addr: { type: String, default: "" },
  version: { type: Number, default: 0 },
  activetime: { type: Number, default: 0 }
});

module.exports = mongoose.model('masternodes', mnSchema);
