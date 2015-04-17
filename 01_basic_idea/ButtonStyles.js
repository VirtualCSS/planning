'use strict';

var StyleSheet = require('react-style');

// SEE the comment in index.js what the motivation behind the `StyleSheet.composer`
// is about.

var ButtonStyles = module.exports = StyleSheet.create({
  primary: StyleSheet.composer({
    ':BASE:': {
      // Need this here now to avoid overwriting the rules inherited from the
      // ButtonStyles definitions.
      ':INHERIT-PARENT:': true,

      backgroundColor: 'rgb(0, 120, 231)',
      color: '#fff'
    }
  }),

  success: StyleSheet.composer({
    ':BASE:': {
      ':INHERIT-PARENT:': true,

      color: 'white',
      background: 'rgb(28, 184, 65)'
    }
  }),

  error: StyleSheet.composer({
    ':BASE:': {
      ':INHERIT-PARENT:': true,

      color: 'white',
      background: 'rgb(202, 60, 60)'
    }
  })
});
