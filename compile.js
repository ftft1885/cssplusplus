var parser = require('./parser.js');

module.exports = function(str) {
  var cssRules = parser(str);
  //console.log(cssRules);
  var cssHash = {};
  var cssPretty = [];
  cssRules.forEach(function(rule) {
      arr2json({
        arr: rule[0],
        val: rule[1],
        json: cssHash
      });
  });
  //console.log(cssHash);
  for (var key in cssHash) {
    print(key, cssHash[key]);
  }
  console.log(cssPretty.join('\n'));
  return cssHash;
   
  function print(selector, hash) {
    
    // output pretty css
    var s = selector + ' {\n';
    for (var key in hash) {
        if (typeof hash[key] === 'string') {
          s += '  ' + key + ': ' + hash[key] + ';\n';
        } else {
          print(selector+' '+key, hash[key]);
        }
    }
    s += '}\n';
    // console.log(s);
    cssPretty.push(s);
  }
   
}

function arr2json(p) {
  if (p.arr.length === 1) {
    p.json[p.arr[0]] = p.val;
  } else {
    var tmp = p.arr.shift();
    if (typeof p.json[tmp] === 'object') {
      p.json = p.json[tmp];
      arr2json(p);
    } else {
      var last = "", str;
      for (var i = 0; i < p.arr.length; i++) {
         last += '}';
      }
      str = '{"' + p.arr.join('":{"') + '":' + '"1"' + last;
      p.json[tmp] = JSON.parse(str);
    }
  }
}