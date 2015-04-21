'use strict';

var StyleSheet = require('react-style');

// SEE the comment in index.js what the motivation behind the `StyleSheet.composer`
// is about.

var ButtonStyles = module.exports = StyleSheet.create({
  primary: StyleSheet.composer({
    '!BASE': {
      backgroundColor: 'rgb(0, 120, 231)',
      color: '#fff'
    }
  }),

  success: StyleSheet.composer({
    '!BASE': {
      color: 'white',
      background: 'rgb(28, 184, 65)'
    }
  }),

  error: StyleSheet.composer({
    '!BASE': {
      color: 'white',
      background: 'rgb(202, 60, 60)'
    }
  })
});
