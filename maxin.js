var fs = require('fs');

var predo = require('./predo.js');

var str = fs.readFileSync('./css/maxin.css')+'';

var output = predo(str);

console.log(output);

