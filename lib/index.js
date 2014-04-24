var search = require('./search');

module.exports = function(registry, options) {
    search.registry = registry;
    search.requestOpts = options;
    return search;
};