require('js-yaml');

var messages = require(__dirname + '/../config/message.yml'),
    labels = require(__dirname + '/../config/label.yml');

exports.get = function() {
  var result = messages[arguments[0]] || arguments[0];
  for (var i = 0, n = arguments.length - 1; i < n; i++) {
    result = result.replace('(p' + i + ')', labels[arguments[i + 1]] || arguments[i + 1]);
  }
  return result;
};
