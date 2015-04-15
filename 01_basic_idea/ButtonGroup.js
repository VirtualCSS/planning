/**
 * @jsx React.DOM
 */
'use strict';

var StyleSheet = require('react-style');
var React = require('react');

var ButtonGroupStyles = module.exports = StyleSheet.create({
  normalStyle: {
    display: 'inline'
  }
});

class ButtonGroup extends React.Component {
  render() {
    return (
      <div className={ButtonGroupStyles.normalStyle.className}>
        {this.props.children}
      </div>
    );
  }
}
