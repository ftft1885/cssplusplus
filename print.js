

var header = {
  'color': '#222',
  'width': '20px',
  'button': {
    'background': '#ccc',
    'height': '30px',
    'span': {
       'font-size': '30px'
    }
  },
  ':hover': {
    'color': 'red'
  }
}
var css = {
  'header': header
}

//console.log(css);

print('header', css['header']);

function print(selector, hash) {

//  console.log(selector, hash);

  var s = selector + ' {\n';
  for (var key in hash) {
      if (typeof hash[key] === 'string') {
        s += '  ' + key + ': ' + hash[key] + ';\n';
      } else {
        print(selector+' '+key, hash[key]);
      }
  }
  s += '}\n';
  console.log(s);
}
