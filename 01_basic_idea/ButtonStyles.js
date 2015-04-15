'use strict';

var StyleSheet = require('react-style');

var ButtonStyles = StyleSheet.create({

  primary: {
    backgroundColor: 'rgb(0, 120, 231)',
    color: '#fff'
  },

  success: {
    color: 'white',
    background: 'rgb(28, 184, 65)'
  },

  error: {
    color: 'white',
    background: 'rgb(202, 60, 60)'
  }

});

module.exports = ButtonStyles;
