var assert = require('chai').assert;

var search = require('../lib')('http://registry.cortex.dp');

describe('search.js', function() {
    this.timeout(40000);

    it('searchAll', function(done) {
        search.searchAll({
            keyword: 'cortex',
            name: 'cortex'
        }, function(err, rows) {
            assert(rows && rows.length);
            done(err);
        });
    });


    it('searchByName', function(done) {
        search.searchByName(['cortex', 'angularjs'], function(err, rows) {
            assert(rows && rows.length);
            done(err);
        });
    });

    it('searchByAuthor', function(done) {
        search.searchByAuthor('cortex-admin', function(err, rows) {
            assert(rows && rows.length);
            done(err);
        });
    });


    it('searchByKeyword', function(done) {
        search.searchByKeyword('android', {
            limit: 40
        }, function(err, rows) {
            assert(rows && rows.length);
            done(err);
        });
    });

    it('searchByWord', function(done) {
        search.searchByWord('angularjs', {
            limit: 40
        }, function(err, rows) {
            assert(rows && rows.length);
            done(err);
        });
    });
});
