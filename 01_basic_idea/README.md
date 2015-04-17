# Basic Idea

The code in this folder is based on the example from `react-style` at

```
https://github.com/js-next/react-style/tree/f957e09dfb4948/examples/0.13/simple
```

and later modified to fit the design idea behind VirtualCSS.

## Changes compared to react-style

Overall, the changes listed here are required to make the analysis of the code
to emit a static CSS easier/possible eventually.

1. To make the code easier to analyse, the exports and style definitions
must be done on the same line and the style definitions must be done before the
styles are first used in the code.

``` js
// react-style:
var ButtonStyles = StyleSheet.create({
  ...
});

module.exports = ButtonStyles;

// VirtualCSS:
var ButtonStyles = module.exports = StyleSheet.create({
  ...
});

// See ButtonGroup.js for reordering of the style definitions.
```

2. VirtualCSS works directly on class names and not styles. Therefore instead
of using `styles` inside of JSX definitions use `className` and the `.className`
properties on the style definitions:

```js
// react-style:
  <div styles={ButtonGroupStyles.normalStyle}>

// VirtualCSS:
  <div className={ButtonGroupStyles.normalStyle.className}>
```

3. TOOD(jviereck): Rewrite the following point.
Instead of combining the styles dynamically it is required to define a
style for each possible combination:

```js
// react-style:
var styles = [
  ButtonStyles.normalStyle,
  props.active ? ButtonStyles.activeStyle : null,
  state.hover ? ButtonStyles.hoverStyle : null,
  state.focus ? ButtonStyles.focusStyle : null
].concat(props.styles);


// VirtualCSS:
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
  ...
})

// ... and then later in the React.Component to get hold of the correct styles:

	// The following maps the possible states to a string.
  var stateString, stateBits = [];
  props.active || stateBits.push('active');
  state.hover  || stateBits.push('hover');
  state.focus  || stateBits.push('focus');
  stateString = stateBits.join('_');  // E.g.: 'active_hover'

  var className = ButtonStylesStates[stateString].className;
```

This makes the static analysis much easier.

Writing out all the possible state combinations is far from being a nice solution.
However in practise, I doubt there will be so many different states when pseudo
classes are used to encode the styles for `:hover` and such.

4. The object returned from calls to `StyleSheet.foo()` are all frozen to prevent
later modification by the developer.

5. The default definition of style definition like "button" is defined in a
special `:BASE:` entry.

6. ["Mixins Are Dead. Long Live Composition"](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750):
instead of using mixins new styles are created by composing and using composition
functions, e.g.:

```js
var SwitcherButtonComposer = StyleSheet.composer({
  ':BASE:' {
    borderRadius: 0,
    margin: 0,

    // Need this here now to avoid overwriting the rules inherited from the
    // ButtonStyles definitions.
    ':INHERIT-PARENT:': true
  }
});

var TextAlignChildStyleDef = SwitcherButtonComposer(ButtonStyles.button);
```

See also comments in `index.js` file. The usage of composition solves the
previous open problem of class inheritance.


## Open issues

Handling of media queries.
