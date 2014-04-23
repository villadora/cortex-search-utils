var async = require('async');
var _ = require('underscore');


var searchByWord = genViewSearch(
    'app/wordSearch', 6, function(data) {
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

module.exports.searchByName = genViewSearch('app/browseAll', 2, function(data) {
    return {
        name: data.key[0],
        description: data.key[1],
        url: '/package/' + data.key[0]
    };
});

module.exports.searchByKeyword = genViewSearch('app/byKeyword', 3, trans);

module.exports.searchByAuthor = genViewSearch('app/browseAuthors', 3, function(data) {
    return {
        name: data.key[1],
        description: data.key[2] || '',
        url: '/package/' + data.key[1],
        authors: data.key[0]
    };
});


module.exports.searchAll = function(query, options, cb) {
    var registry = this.registry || this.db.database('registry');
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
        registry.design('scratch').list('search').view('listAll', {
            qs: _.extend(query, options)
        }, function(err, data) {
            if (err) return done(err);

            done(err, data.map(function(r) {
                return {
                    name: r.id,
                    description: r.description,
                    url: '/package/' + r.id
                };
            }));
        });
    }
};


function genViewSearch(view, groupLevel, transFn) {
    return function(keys, options, cb) {
        var registry = this.registry || this.db.database('registry');
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
                    registry.view(view).query(options).groupLevel(groupLevel)
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
                done(err, results.reduce(function(memo, r) {
                    return memo.concat(r);
                }, []));
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