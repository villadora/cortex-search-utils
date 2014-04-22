var couch = require('couch-db');
var search = require('./search');
var CouchDB = couch.CouchDB;

module.exports = function(db, options) {
    if (typeof db == 'object' && db.bind && db.database) {
        // assume is a CouchDB instance
        search.db = db.bind('registry');
        search.registry = db.registry;
    } else if (typeof db == 'string') {
        search.db = new CouchDB(db, options).bind('registry');
        search.registry = search.db.registry;
    } else {
        throw new Error('Can not get CouchDB instance from: ' + db);
    }


    return search;
};