/**
 * @jsx React.DOM
 */
'use strict';

var StyleSheet = require('virtual-css');
var React = require('react');

var ButtonGroupStyles = StyleSheet.create({
  normalStyle: {
    '!BASE': {
      display: 'inline'
    }
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
// The following violates the assumption that all the `StyleSheet.create` results
// must directly be assigned to `module.exports` but let's assume for now
// this is allowed.
ButtonGroup.Styles = ButtonGroupStyles;

module.exports = ButtonGroup;
