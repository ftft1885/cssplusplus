/*
 * 由于css词法预设的符号很少
 * lex做法是从头匹配(正则前加上^)
 * 比如先匹配comment,
 * 再匹配空白
 * 在匹配符号
 * 再匹配字符串
 * 唯一的难点是如何处理顺序
 * 事实上根本不要担心顺序,因为完全不冲突
 */

module.exports = function(str) {
//  console.log(str);

  return scan();

  function scan() {

    // return tokens
    var tokens = [];
    while (str.length > 0) {
      var token = next();
      if (token === null) {

        // nothing match
        console.log(str.slice(0,10));
        throw new Error("cannot match");

      } else {
        tokens.push(token);
      }
    }
    return tokens;
  }
  
  function next() {

    // return one token
    return blank() // first because so many blank
      || comment()
      || string()
      || symbol()
      ;
     /**
      * 顺序按照频率
      * 但是string在symbol前面,因为:hover属于string,color: red说symbol
      */

     /*
      * 需要区分数字和字符串么?
      * 在我看来是不需要的,因为我需要#222这种也能做加法
      * 我只需要单独处理str + str判断是数字相加还是字符串相加就行了
      */
  }

   function blank() {

     // return blank tokena
     var reg = /^\s+/;
     var m = str.match(reg);
     if (m === null) {
       return m;
     }
     str = str.slice(m[0].length);
     return ['blank', m[0]];
     return null;
   }

   function comment() {
     
     // return comment token
     var commentReg = /^\/\*[^]*?\*\//;
     var m = str.match(commentReg);
     if (m === null) {
       return m;
     }
     str = str.slice(m[0].length);
     return ['comment', m[0]];
   }

   function symbol() {

     // return symbol
     // :, -  has different meaning
     var symArr = [';', '{', '}', ':', '=', '+', '-', '*', '/', '>'];
     var _char = str[0];
     var index = symArr.indexOf(_char);
     if (!_char) console.log(str.slice(0,10));
     if (index === -1) {
       return null;
     }
     str = str.slice(1);
     return ['symbol', _char];
   }

   function string() {
     
     // return string
     var reg = [];
     reg[0] = /^[@|\#|\.|:|-]*[\w|-]+/;
     reg[1] = /^["']\S+["']/;
     // like &:hover
     reg[2] = /^&:\w+/;
     var _try = [];
     for (var i = 0; i < reg.length; i++) {
       var m = str.match(reg[i]);
       if (m !== null) {
         str = str.slice(m[0].length);
         return ['string', m[0]];
       }
     }
     return null;
     /*
     var m = str.match(reg);
     if (m === null) {
       return m;
     }
     */
   }
}
