'use strict';

var StyleSheet = require('virtual-css');

// SEE the comment in index.js what the motivation behind the `StyleSheet.composer`
// is about.

module.exports.primary = StyleSheet.composer({
  '!BASE': {
    backgroundColor: 'rgb(0, 120, 231)',
    color: '#fff'
  }
});

module.exports.success = StyleSheet.composer({
  '!BASE': {
    color: 'white',
    background: 'rgb(28, 184, 65)'
  }
});

module.exports.error = StyleSheet.composer({
  '!BASE': {
    color: 'white',
    background: 'rgb(202, 60, 60)'
  }
});
