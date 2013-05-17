module.exports = function (str) {

  var maxins = {};

  var commentReg1 = /\/\*[^]*?\*\//g;
  var commentReg2 = /\/\/[^]*?\n/g;
  str = str.replace(commentReg1, '');
  str = str.replace(commentReg2, '');

  var maxinReg = /(\w+)\s*\(([^]*?)\)\s*{([^]*?)}/g;

  // get all maxin init
  var _maxins = str.match(maxinReg);

  // erase the init block
  str = str.replace(maxinReg, '');

  // store all maxins
  if (_maxins && _maxins.length > 0) {
    _maxins.forEach(function (maxin) {
      //console.log(maxin);    
      // detail
      var maxinReg = /(\w+)\s*\(([^]*?)\)\s*{([^]*?)}/;
      var _maxin = maxin.match(maxinReg);
      var _var = _maxin[2].trim();

      // get var init [key, value]
      var _arr = _var.split(/\s*:\s*/);
      if (_arr.length !== 2) {
        _arr = _var.split(/\s*=\s*/);
      }
  //    console.log(_arr);

      //console.log(_var);
      maxins[_maxin[1]] = {
        key: _arr[0],
        val: _arr[1], 
        content: _maxin[3]
      };
      //console.log(_maxin);
      
    });
  }
//  console.log(str);
//  console.log(maxins);

  // get use maxin stmt -------------------
  var useMaxins = [];
  
  var useMaxinReg1 = /\n[\s+|;]\w+\s*;/g;
  var useMaxinReg2 = /\n[\s+|;]\w+\s*\(\s*\w*\s*\);/g;
  var _maxins1 = str.match(useMaxinReg1);
  var _maxins2 = str.match(useMaxinReg2);
  if (_maxins1 && _maxins1.length > 0) {
    _maxins1.forEach(function (maxin) {
        var type = maxin.match(/[\s+|;](\w+)\s*;/)[1];
//        console.log(type);
        var content = getType(type);
        // replace self to content
        str = str.replace(maxin, content);
    });
  }
  if (_maxins2 && _maxins2.length > 0) {
    _maxins2.forEach(function (maxin) {
        // rule ( value ) ;
        var _arr = maxin.match(/[\s+|;](\w+)\s*\(\s*(\w*)\s*\);/);
        //console.log(_arr);
        var content = getType(_arr[1], _arr[2]);
        str = str.replace(maxin, content);
    })
  }
  //console.log(str);
  function getType(type, _val) {
    if (type in maxins) {
      var val = _val || maxins[type].val;
      var output = maxins[type].content;
      var _reg = new RegExp(maxins[type].key, 'g');
      output = output.replace(_reg, val);
      return output;
    }
  }

  return str;
}
