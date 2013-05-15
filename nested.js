var fs = require('fs');

//var lex = require('./lex.js');

//var parser = require('./parser.js');
var compile = require('./compile.js');

var str = fs.readFileSync('./nested.css')+'';

var stmt = compile(str);

//console.log(stmt);
