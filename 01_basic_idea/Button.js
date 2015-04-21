/**
 * @jsx React.DOM
 */
'use strict';

var StyleSheet = require('virtual-css');
var React = require('react');

class Button extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      disabled: false
    };
  }

  render() {
    var className, props = this.props, state = this.state;

    var styleDef = props.styleDef || ButtonStyles.button;

    if (this.disabled) {
      className = styleDef.disabled.className;
    } else {
      className = styleDef.className;
    }

    return (
      <button {...props} className={className} styles={props.styles} >
        {props.children}
      </button>
    );
  }
}

module.exports = Button;

var ButtonStyles = module.exports.styles = StyleSheet.create({
  button: {
    // This is the basic/base styles that all the following rules inherit from.
    '!BASE': {
      backgroundColor: '#E6E6E6',
      border: 'none rgba(0, 0, 0, 0)',
      borderRadius: 3,
      color: 'rgba(0, 0, 0, 0.70)',
      cursor: 'pointer',
      display: 'inline-block',
      fontFamily: 'inherit',
      fontSize: '100%',
      lineHeight: 'normal',
      padding: '0.5em 1em',
      userSelect: 'none',
      textAlign: 'center',
      textDecoration: 'none',
      verticalAlign: 'baseline',
      whiteSpace: 'nowrap',
      zoom: 1
    },

    // Define pseudo selectors. These inherit the styles from '!BASE'
    // automatically as this is the default behavior in normal CSS as well.
    ':active': {
      boxShadow: '0 0 0 1px rgba(0,0,0, 0.15) inset, 0 0 6px rgba(0,0,0, 0.20) inset'
    },

    ':hover': {
      color: '#000',
      backgroundImage: 'linear-gradient(transparent, rgba(0,0,0, 0.05) 40%, rgba(0,0,0, 0.10))'
    },

    ':focus': {
      backgroundImage: 'linear-gradient(transparent, rgba(0,0,0, 0.05) 40%, rgba(0,0,0, 0.10))',
      outline: 'none'
    },

    // Define states. States can inherit the styles from the '!BASE' definitions.
    // Possible states might be "checked" or "disabled". Note that things like
    // "BigButton" are not states as they modify the '!BASE' definition by
    // composing from `ButtonStyles.button`.

    'disabled': {
      '!BASE': {
        color: 'gray'
      },

      ':hover': {
        // TODO(jviereck): Support a way to reset all the inherited rules.
        // '!RESET': true
      }
    }
  }
});
