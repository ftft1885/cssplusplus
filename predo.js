module.exports = function (str) {
  var maxinReg = /(\w+)\s*\([^]*?\)\s*{[^]*?}/g;
  var maxins = str.match(maxinReg);
  str = str.replace(maxinReg, '');
  console.log(str);
  console.log(maxins);
  return str;
}
