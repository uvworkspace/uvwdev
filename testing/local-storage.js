'use strict';

module.exports = function () {
  var vals = {};
  return {
    setItem: function (key, val) {
      vals[key] = val;
    },
    getItem: function (key) {
      return vals[key];
    }
  };
};
