var parser = require('./parser.js');

module.exports = function(str) {
  var cssRules = parser(str);
  console.log(cssRules);
  var cssHash = {};
  var cssPretty = [];
  var isEmpty = {}; // check empty css
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
    var isEmpty = true;
//    isEmpty[selector] = true;
    var s = selector + ' {\n';
    for (var key in hash) {
        if (typeof hash[key] === 'string') {

          s += '  ' + key + ': ' + hash[key] + ';\n';
//          isEmpty[selector] = false;
          isEmpty = false;
        } else {

          // key is a selector to
          
          if (key.match(/^&:\w+/)) {
            // like &:hover
            var _key = key.slice(1);
            print(selector + _key, hash[key]); 
          } else {
            print(selector + ' ' + key, hash[key]);
          }
        }
    }
    s += '}\n';
    // console.log(s);
    if (isEmpty === false) {
      cssPretty.push(s);
    }
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
      var val = p.val || 1;
      // replace `"`
      val = val.replace(/"/g, '\\"');
      str = '{"' + p.arr.join('":{"') + '":' + '"'+val+'"' + last;
      p.json[tmp] = JSON.parse(str);
    }
  }
}
