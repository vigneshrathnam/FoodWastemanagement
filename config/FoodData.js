var Datastore = require('nedb')
  , db = new Datastore({ filename: './db/formDetails.db', corruptAlertThreshold: 1 ,autoload: true });

module.exports=db;