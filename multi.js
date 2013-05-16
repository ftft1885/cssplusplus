var compile = require('./compile.js');
var fs = require('fs');

var str = fs.readFileSync('./css/multi.css')+'';

var css = compile(str);

//console.log(css);
