var async = require('async');
var couch = require('couch-db');
var View = couch.View;
var List = couch.List;
var _ = require('underscore');


var searchByWord = genViewSearch(
    'wordSearch', 6, function(data) {
        return {
            name: data.key[1],
            description: data.key[2],
            url: '/package/' + data.key[1],
            latest: data.key[3],
            authors: data.key[4],
            keywords: data.key[5] ? data.key[5].split(' ') : []
        };
    });

module.exports = searchByWord.bind(searchByWord);

module.exports.searchByWord = searchByWord;

module.exports.searchByName = genViewSearch('browseAll', 2, function(data) {
    return {
        name: data.key[0],
        description: data.key[1],
        url: '/package/' + data.key[0]
    };
});

module.exports.searchByKeyword = genViewSearch('byKeyword', 3, trans);

module.exports.searchByAuthor = genViewSearch('browseAuthors', 3, function(data) {
    return {
        name: data.key[1],
        description: data.key[2] || '',
        url: '/package/' + data.key[1],
        authors: data.key[0]
    };
});


module.exports.searchAll = function(query, options, cb) {
    var registry = this.registry;
    var opt = this.options;
    if (arguments.length == 2 && typeof options == 'function') {
        cb = options;
        options = undefined;
    }

    options = options || {};

    if (options.hasOwnProperty('skip')) {
        options.listSkip = options.skip;
        delete options.skip;
    }

    if (options.hasOwnProperty('limit')) {
        options.listLimit = options.limit;
        delete options.limit;
    }


    if (!cb)
        return gr;
    else
        gr(cb);

    function gr(done) {
        new List(registry + '/-/_list/search', opt).view('listAll', {
            qs: _.extend(query, options)
        }, function(err, data) {
            if (err) return done(err);
            var dedup = {};
            done(err, data.map(function(r) {
                if(dedup[r.id]) return;
                dedup[r.id] = true;
                return {
                    name: r.id,
                    description: r.description,
                    url: '/package/' + r.id
                };
            }).filter(Boolean));
        });
    }
};


function genViewSearch(view, groupLevel, transFn) {
    return function(keys, options, cb) {
        var opt = this.options;
        var registry = this.registry;
        if (arguments.length == 2 && typeof options == 'function') {
            cb = options;
            options = undefined;
        }

        options = options || {};

        if (typeof keys == 'string')
            keys = [keys];

        if (!cb)
            return gr;
        else gr(cb);

        function gr(done) {
            async.parallel(keys.map(function(k) {
                return function(cb) {
                    new View(registry + '/-/_view/' + view, view, opt).query(options).groupLevel(groupLevel)
                        .startkey([k]).endkey([k].concat({}))
                        .exec(function(err, data) {
                            if (err) return cb(err);
                            if (!data)
                                return cb(undefined, []);
                            return cb(undefined, data.map(transFn));
                        });
                };
            }), function(err, results) {
                if (err) return done(err);
                var dedup = {};
                done(err, results.reduce(function(memo, r) {
                    return memo.concat(r);
                }, []).filter(function(data) {
                    if(dedup[data.name]) return false;
                    dedup[data.name] = true;
                    return true;
                }));
            });
        };
    };
}

function trans(data) {
    return {
        name: data.key[1],
        description: data.key[2],
        url: '/package/' + data.key[1]
    };
}
