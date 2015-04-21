/**
 * @jsx React.DOM
 */
'use strict';

var StyleSheet = require('virtual-css');
var React = require('react');

class ButtonGroup extends React.Component {
  render() {
    return (
      <div className={ButtonGroupStyles.normalStyle.className}>
        {this.props.children}
      </div>
    );
  }
}
module.exports = ButtonGroup;

var ButtonGroupStyles = module.exports.styles = StyleSheet.create({
  normalStyle: {
    '!BASE': {
      display: 'inline'
    }
  }
});
