var lex = require('./lex.js');

module.exports = function (str) {

  var tokens = lex(str); // all tokens
  //console.log(tokens);
  var table = {};

  // cssRules like this:
  // [['#header', 'div','color'], red]
  // which means [selectors, value]
  var cssRules = [];
  var state = [];
  
  
/*
  for(var i = 0, token; token = tokens[i]; i++) {
    console.log(token[0]);
  }
*/
  // walk();

  while(tokens.length > 3) {
    matchRule();
  }
  //console.log(cssRules);
  return cssRules;

  function matchProp() {
    
    // match key: val;
    if (look(1)[1] === ';') next();
    if (look(1)[0] === 'string' && look(2)[1] === ':') {
      // key: val
      var key = next();
      next(); // symbol: ':'
      var val = next();
      if (val[0] === 'string') {
        //console.log(state, state.concat(key[1]));
        cssRules.push([state.concat(key[1]), val[1]]);
      }
    } else if (look(1)[0] === 'string' && look(2)[1] === '{') {
      // block in prop
      matchRule();
    }
 
  }

  function matchRule() {

    // match selector{prop}     
    var selector = next();
    state.push(selector[1]);
    next(); // '{'

    // expect prop
    matchProp();
    // after maybe } or ;
    //var after = next(';');
    while(look(';')[1] !== '}') {

      // not end
      matchProp();
    }
    next(';'); // '}'
    //console.log(state);
    state.pop();
    
  }

  function walk() {
    while(tokens.length > 0) {
      var token = next();
      if (token) {

        // get a token
        if (state.length === 0) {

          // outside
          if (token[0] === 'string') {

            // selector!
            // cssRules[token[1]] = {};
          } else if (token[0] === 'symbol' && token[1] === '{') {
            state.push(token[1]);
          }

        } else if (state.length > 0) {
          
          // expect key: value
          if (token[0] === 'string') {
            tokens.shift(); // :
            var val = tokens.shift();
            
            cssRules.push(state, val);
            // arr2json[[sel1,sel2,..seln], val]
            // really fucking easy
          }
        }

      }
    }
  }

  return tokens;

  function look(n, m) {

    // see form 1, won't change tokens
    var max = m || 1;
    var ignore = null;
    if (typeof n === 'number') {
      max = n;
    } else if (typeof n === 'string') {
      ignore = n;
    }

    var index = 0;
    for (var i = 0, token; token = tokens[i]; i++) {
      if (token[0] !== 'blank' && token[1] !== ignore) {
        index ++;
        if (index >= max) {
          return token;
        }
      }
    }

  }

  function next(sym) {
    var token = tokens.shift();
    if (token[0] === 'blank') {
      token = tokens.shift();
    }
    if (token[1] === sym) {
      token = next(sym);
    }
    return token;
  }

   function show() {
      console.log(look(1), look(2), look(3));
   }

}
