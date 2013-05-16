var lex = require('./lex.js');

module.exports = function (str) {

  var tokens = lex(str); // all tokens
  console.log(tokens);
  var table = {'@test': '#testval'};

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

  walk();
  function walk() {

    while (tokens.length > 3) {
      // walk all tokens
      var type = guess();
      switch (type) {
        case 'rule': 
          matchRule();
          break;
        case 'init':
          matchInit();
          break;
        default: 
          // may skip one line anyday
          show();
          throw new Error('Parse ERROR: cannot match any type');
      }
      //matchRule();
    }

  }
  //console.log(cssRules);
  return cssRules;

  function guess() {
    var i = 1;
    var token = look(i);
    while (token[1] !== '{' && token[1] !== '=' && token[1] !== ':') {
      i++;
      token = look(i);
    }
    // get key token
    var sym = token[1];
    if (sym === '{') {
      return 'rule';
    } else if (state.length === 0) {
      return 'init';
    } else {
      return 'error';
    }
    /*
    if (1) {

      //selector1 selector2 .. selectorN { ...  }
      // even sel1 > sel2
      return 'rule';

    } else if (1) {

      // state = [] && var str = str; || str = str; || str : str;
      // there are all init
      // remember `;` is must without `{}` because it will be compress
      
      
    }
    */
  }

  function matchInit() {

    // state = [] && var str = str; || str = str; || str : str;
    var key = next()[1];
    if (key === 'var') {
      key = next()[1];
    }
    next(); // `:` or `=`
    var val = next()[1];
    table[key] = val;
    console.log(table);
    next(); // `;`
    
  }

  function matchProp() {
    
    // match key: val;
    // 一觉醒来发现这个函数错了,val必须要读到`;`结束,并吃掉`;`才行
    if (look(1)[1] === ';') next(); // 所以这句话是错的

    if (look(1)[0] === 'string' && look(2)[1] === ':') {
      // key: val
      var key = next()[1];
      next(); // symbol: ':'
      var val = [];
      while (look(1)[1] !== ';') {
        var _val = next()[1];
        //val.push(next()[1]);
        if (_val in table) {
          val.push(table[_val]);
        } else {
          val.push(_val);
        }
      }
      cssRules.push([state.concat(key), val.join(' ')]);
      next(); // pass ;
      /*
      var val = next();
      if (val[0] === 'string') {
        //console.log(state, state.concat(key[1]));
        var _val = val[1];
        if (_val in table) {
          _val = table[_val];
        }
        cssRules.push([state.concat(key[1]), _val]);
      }
      */

    } else {
      // console.log(guess());
      if (guess() === 'rule')
      matchRule();
    }
 
  }

  function matchRule() {

    // match sel1 sel2 ... selN { ...prop.. }
    var stateCount = 0;
    while (look(1)[1] !== '{') {

      // push multi selectors
      var sel = next();
      if (sel[0] === 'string' || sel[0] === 'symbol') {
        state.push(sel[1]);
        stateCount ++;
      }
    }
    next(); // `{`
    /*
    var selector = next();
    state.push(selector[1]);
    next(); // '{'
    */
    // expect prop
    matchProp();
    // after maybe } or ;
    //var after = next(';');
    while (look(1, ';')[1] !== '}') {

      // not end
      matchProp();
    }
    next(';'); // '}'
    //console.log(state);
    // may pop multi selectors too
    // state.pop();
    state.splice(state.length - stateCount);
    
  }
/*
  function walk() {
    while (tokens.length > 0) {
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
*/
  return tokens;

  function look(n, skip) {

    // see form 1, won't change tokens
    var max = n || 1;
    var ignore = skip;
    /*
    if (typeof n === 'number') {
      max = n;
    } else if (typeof n === 'string') {
      ignore = n;
    }
    */
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
