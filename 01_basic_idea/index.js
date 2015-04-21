/**
 * @jsx React.DOM
 */
'use strict';

var StyleSheet   = require('virtual-css');
var React        = require('react');
var Button       = require('./Button');
var ButtonStyles = require('./ButtonStyles');
var ButtonGroup  = require('./ButtonGroup');

// SEE:
// "Mixins Are Dead. Long Live Composition"
// https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
//
// Instead of mixin to an existing style def, the style defs are "composed".
// The amasing benefit of this is the ability to reuse these composer functions
// for different base style definitions.
//
// The idea is inspired from linearization Type Systems in OOP languages like
// Scale (you find more about the topic here:
// http://tech.pro/blog/2114/scala-linearization-technique-to-avoid-multiple-inheritance)

// A composer is called on an existing StyleDef and defines how the resulting
// StyleDef should look like.
var SwitcherButtonComposer = StyleSheet.composer({
  '!BASE': {
    borderRadius: 0,
    margin: 0,
  }
});

var FirstChildComposer = StyleSheet.composer({
  '!BASE': {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3
  }
});

// Use the composers now to extend the basic `ButtonStyles.button` style definition.

var TextAlignChildStyleDef = SwitcherButtonComposer(Button.styles.button);

var TextAlignSwitcherStyles = StyleSheet.create({
  childStyle: TextAlignChildStyleDef,

  // Of course applying a composer function on the result from another composer
  // is possible without problem.
  firstChildStyle: FirstChildComposer(TextAlignChildStyleDef),

  // The above is the same as:
  //
  //   firstChildStyle: FirstChildComposer(
  //     SwitcherButtonComposer(ButtonStyles.button));

  // Example to define the composition right away inline.
  // Here it is `StyleSheet.compose` and not `StyleSheet.compose[r]`!!!
  lastChildStyle: StyleSheet.compose(TextAlignChildStyleDef, {
    '!BASE': {
      borderTopLeftRadius: 3,
      borderBottomLeftRadius: 3
    }
  })
});

var TextAlignSwitcher = React.createClass({
  render() {
    var props = this.props;

    return (
      <ButtonGroup styleDef={props.styleDef}>
        <Button
          active={props.textAlign === 'left'}
          onClick={() => {props.onTextAlign('left')}}
          styleDef={TextAlignSwitcherStyles.firstChildStyle}>
          Left
        </Button>
        <Button
          active={props.textAlign === 'center'}
          onClick={() => {props.onTextAlign('center')}}
          styleDef={TextAlignSwitcherStyles.childStyle}>
          Center
        </Button>
        <Button
          active={props.textAlign === 'right'}
          onClick={() => {props.onTextAlign('right')}}
          styleDef={TextAlignSwitcherStyles.lastChildStyle}>
          Right
        </Button>
      </ButtonGroup>
    );
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
      <div className={ApplicationStyles.normalStyle.className}>
        <h1 styles={{textAlign: this.state.textAlign}}>Application</h1>
        <Button styleDef={ButtonStyles.success(Button.styles.button)}>
          OK
        </Button>
        <Button styleDef={ButtonStyles.error(ApplicationStyles.childStyle)}>
          Cancel
        </Button>
        <TextAlignSwitcher
          styleDef={ApplicationStyles.lastChild}
          onTextAlign={(textAlign) => this.setState({textAlign: textAlign})}
          />
      </div>
    );
  }

});


var ApplicationStyles = StyleSheet.create({

  normalStyle: {
    '!BASE': {
      // backgroundColor: 'white',  << Use this once @media is supported.
      backgroundColor: 'purple',
      fontSize: '10pt',
      padding: '1em',
      margin: 10
    }
  },

  childStyle: StyleSheet.compose(Button.styles.button, {
    '!BASE': {
      marginRight: '0.5em',
      marginLeft: 50
    }
  })

  // TODO: Deal with @media queries.
  //
  // '@media screen and (min-width: 800px)': {
  //   normalStyle: {
  //     backgroundColor: 'purple'
  //   },
  //   childStyle: {
  //     marginLeft: 50
  //   }
  // }

});


if (typeof window !== 'undefined') {
  React.render(<Application />, document.getElementById('app'));
}
