var search = require('./search');

module.exports = function(registry, options) {
    search.registry = registry;
    search.options = options;
    return search;
};
