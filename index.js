/**
 * Created by cFrost on 2016/12/1.
 */
// index.js
var lodash = require('lodash');

var output = lodash.without([1, 2, 3], 1);
console.log(output);

exports.printMsg = function() {
    console.log("This is a message from the demo package");
}