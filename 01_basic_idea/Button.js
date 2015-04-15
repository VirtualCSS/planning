/**
 * @jsx React.DOM
 */
'use strict';

var StyleSheet = require('react-style');
var React = require('react');

var ButtonStyles = StyleSheet.create({

  normalStyle: {
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

  activeStyle: {
    boxShadow: '0 0 0 1px rgba(0,0,0, 0.15) inset, 0 0 6px rgba(0,0,0, 0.20) inset'
  },

  hoverStyle: {
    color: '#000',
    backgroundImage: 'linear-gradient(transparent, rgba(0,0,0, 0.05) 40%, rgba(0,0,0, 0.10))'
  },

  focusStyle: {
    backgroundImage: 'linear-gradient(transparent, rgba(0,0,0, 0.05) 40%, rgba(0,0,0, 0.10))',
    outline: 'none'
  }

});

var ButtonStylesStates = StyleSheet.create({
  /* Use an array to define mixin of different styles */
  active: [ButtonStyles.normalStyle, ButtonStyles.activeStyle],
  hover:  [ButtonStyles.normalStyle, ButtonStyles.hoverStyle],
  focus:  [ButtonStyles.normalStyle, ButtonStyles.focusStyle],

  active_hover: [
    ButtonStyles.normalStyle,
    ButtonStyles.activeStyle,
    ButtonStyles.hoverStyle
  ],
  active_focus: [
    ButtonStyles.normalStyle,
    ButtonStyles.activeStyle,
    ButtonStyles.focusStyle
  ],
  active_hover_focus: [
    ButtonStyles.normalStyle,
    ButtonStyles.activeStyle,
    ButtonStyles.focusStyle,
    ButtonStyles.hoverStyle
  ],
  hover_focus: [
    ButtonStyles.normalStyle,
    ButtonStyles.focusStyle,
    ButtonStyles.hoverStyle
  ]
});

class Button extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      hover: false
    };
  }

  render() {
    var props = this.props;
    var state = this.state;

    // The following maps the possible states to a string.
    var stateString, stateBits = [];
    props.active || stateBits.push('active');
    state.hover  || stateBits.push('hover');
    state.focus  || stateBits.push('focus');
    stateString = stateBits.join('_');  // E.g.: 'active_hover'

    var className = ButtonStylesStates[stateString].className;

    return (
      <button {...props} className={className} styles={props.styles}
        onMouseEnter={() => this.setState({hover: true})}
        onMouseLeave={() => this.setState({hover: false})}
        onFocus={() => this.setState({focus: true})}
        onBlur={() => this.setState({focus: false})}>
        {props.children}
      </button>
    );
  }
}

module.exports = Button;
