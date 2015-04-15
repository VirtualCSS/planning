/**
 * @jsx React.DOM
 */
'use strict';

var StyleSheet = require('react-style');
var React = require('react');

class ButtonGroup extends React.Component {

  render() {
    return (
      <div styles={ButtonGroupStyles.normalStyle}>
        {this.props.children}
      </div>
    );
  }
}

var ButtonGroupStyles = StyleSheet.create({

  normalStyle: {
    display: 'inline'
  }

});

module.exports = ButtonGroup;
