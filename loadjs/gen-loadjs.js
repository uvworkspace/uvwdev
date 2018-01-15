'use strict';

var path = require('path');
var fs = require('fs');

module.exports = function (inFile, outFile, nunjucks) {
  var ctx = JSON.parse(fs.readFileSync(inFile, 'utf8'));
  var tmpl = fs.readFileSync(path.join(__dirname, 'loadjs.nunj'), 'utf8');
  var str = nunjucks.renderString(tmpl, ctx);

  console.log('Generating to ' + outFile + ', length ' + str.length);
  fs.writeFileSync(outFile, str);
};
