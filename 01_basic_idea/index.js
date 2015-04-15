/**
 * @jsx React.DOM
 */
'use strict';

require('normalize.css/normalize.css');

var StyleSheet   = require('react-style');
var React        = require('react');
var Button       = require('./Button');
var ButtonStyles = require('./ButtonStyles');
var ButtonGroup  = require('./ButtonGroup');

var TextAlignSwitcher = React.createClass({

  render() {
    var props = this.props;

    return (
      <ButtonGroup styles={props.styles}>
        <Button
          active={props.textAlign === 'left'}
          onClick={() => {props.onTextAlign('left')}}
          styles={[TextAlignSwitcherStyles.childStyle, TextAlignSwitcherStyles.firstChildStyle]}>
          Left
        </Button>
        <Button
          active={props.textAlign === 'center'}
          onClick={() => {props.onTextAlign('center')}}
          styles={[TextAlignSwitcherStyles.childStyle]}>
          Center
        </Button>
        <Button
          active={props.textAlign === 'right'}
          onClick={() => {props.onTextAlign('right')}}
          styles={[TextAlignSwitcherStyles.childStyle, TextAlignSwitcherStyles.lastChildStyle]}>
          Right
        </Button>
      </ButtonGroup>
    );
  }
});

var TextAlignSwitcherStyles = StyleSheet.create({

  childStyle: {
    borderRadius: 0,
    margin: 0
  },

  firstChildStyle: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3
  },

  lastChildStyle: {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3
  }

});

var Application = React.createClass({

  getInitialState() {
    return {
      textAlign: 'left'
    };
  },

  render() {
    return (
      <div styles={ApplicationStyles.normalStyle}>
        <h1 styles={{textAlign: this.state.textAlign}}>Application</h1>
        <Button styles={[ButtonStyles.success]}>
          OK
        </Button>
        <Button styles={[ButtonStyles.error, ApplicationStyles.childStyle]}>
          Cancel
        </Button>
        <TextAlignSwitcher
          styles={ApplicationStyles.lastChild}
          onTextAlign={(textAlign) => this.setState({textAlign: textAlign})}
          />
      </div>
    );
  }

});


var ApplicationStyles = StyleSheet.create({

  normalStyle: {
    backgroundColor: 'white',
    fontSize: '10pt',
    padding: '1em',
    margin: 10
  },

  childStyle: {
    marginRight: '0.5em'
  },

  lastChildStyle: {
    marginRight: 0
  },

  '@media screen and (min-width: 800px)': {
    normalStyle: {
      backgroundColor: 'purple'
    },
    childStyle: {
      marginLeft: 50
    }
  }
    
});
  

if (typeof window !== 'undefined') {
  React.render(<Application />, document.getElementById('app'));
}
