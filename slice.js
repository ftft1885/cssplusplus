var str = "var-asd asdas";
/*
var commentReg = /^\/\*[^]*?\*\//;

var comment = str.match(commentReg);

str = str.slice(comment[0].length);
*/

var reg = /^[\#|\.|:|-]*[\w|-]+/;
//var reg = /^[\#|\.|:]\w+/;
var m = str.match(reg);
console.log(m);
//console.log(str);
