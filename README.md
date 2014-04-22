# Cortex Search Utils

Utils functions for cortex search

## Installation

```
npm install cortex-search-utils --save
```


## Usage

```
var search = require('cortex-search-utils')(url, options);
// or
var search = require('cortex-search-utils')(couch); // couch is a CouchDB instance

search.searchByWord(['app', 'data'], function(err, rows) {
    // handle results
});

```

## APIs


### searchByWord(words, [options, cb])


Search packages that contains words in name or keywords

* words: String|Array
* options: Object
* cb: function

### searchByName(names, [options, cb])

Search packages whose name is in _names_

* names: String|Array
* options: Object
* cb: function


### searchByKeyword(keywords, [options, cb])

Search packages which contains keywords in _keywords_

* keywords: String|Array
* options: Object
* cb: function

### searchByAuthor(authors, [options, cb])

Search packages which is maintained by user in _authors_

* authors: String|Array
* options: Object
* cb: function


### License 

(The MIT License)
