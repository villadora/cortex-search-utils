var async = require('async');

module.exports.searchByWord = genViewSearch(
    'app/wordSearch', 6, function(data) {
        return {
            name: data.key[1],
            description: data.key[2],
            url: '/package/' + data.key[1],
            latest: data.key[3],
            maintainer: data.key[4],
            keywords: data.key[5] ? data.key[5].split(' ') : []
        };
    });

module.exports.searchByName = genViewSearch('app/browseAll', 2, trans);

module.exports.searchByKeyword = genViewSearch('app/byKeyword', 3, trans);

module.exports.searchByAuthor = genViewSearch('app/browseAuthors', 3, function(data) {
    return {
        name: data.key[1],
        description: data.key[2] || '',
        url: '/package' + data.key[1],
        author: data.key[0]
    };
});


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