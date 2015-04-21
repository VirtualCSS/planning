# Basic Idea

The code in this folder is based on the example from `react-style` at

```
https://github.com/js-next/react-style/tree/f957e09dfb4948/examples/0.13/simple
```

and later modified to fit the design idea behind VirtualCSS.

## How to run the example

Install the dependencies via:

```bash
$ npm install
```

To run the webpack-dev-server please also install it via

```bash
$ npm install webpack-dev-server -g
```

Then you can start the development server by executing:

```bash
$ webpack-dev-server
```

Which should serve the example at `http://localhost:8080/webpack-dev-server/`.

## Changes compared to react-style

Overall, the changes listed here are required to make the analysis of the code
to emit a static CSS easier/possible eventually.

1) To make the code easier to analyse, the exports and style definitions
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

2) VirtualCSS works directly on class names and not styles. Therefore instead
of using `styles` inside of JSX definitions use `className` and the `.className`
properties on the style definitions:

```js
// react-style:
  <div styles={ButtonGroupStyles.normalStyle}>

// VirtualCSS:
  <div className={ButtonGroupStyles.normalStyle.className}>
```

3) Instead of combining the styles dynamically it is required to define a
style for each possible state and then choose the correct state at runtime. Also
it is not possible to combine style definitions with passed in style definitions -
combining styles must be done on the call side and the fully computed styles must
be passed in via the `props` arguments. (How to combine styles is discussed
later.)

```js
  render() {
    // react-style:
    var styles = [
      ButtonStyles.normalStyle,
      props.active ? ButtonStyles.activeStyle : null,
      state.hover ? ButtonStyles.hoverStyle : null,
      state.focus ? ButtonStyles.focusStyle : null
    ].concat(props.styles);

    (...)

    // VirtualCSS:

    // Do not combine styles in here. Either use the style definitions as passed in to
    // the component via `props` or use a default style definition.
    var styleDef = this.props.styleDef || ButtonStyles.button;

    // Also, choosing a state like "disabled" must be done explicit.
    if (this.disabled) {
      className = styleDef.disabled.className;
    } else {
      className = styleDef.className;
    }

    (...)
```

This makes the static analysis much easier.

To support state combinations like the case with `active`, `hover` and `focus` a state combination
function, that takes an object literal, can be used:

```js
    // VirtualCSS:

    // At runtime, the `styleDef.stateCombo` function will map to the correct `className`
    // based on the passed in value.
    className = styleDef.stateCombo({
      active: props.active,
      hover: state.hover,
      focus: state.focus
    });
```

4) The object returned from calls to `StyleSheet.create(...)` etc. are all frozen to prevent
later modification by the developer.

5) The default definition of style definition like "button" is defined in a
special `!BASE` entry. This makes extending/overwriting the base style definitions
later more explicit. (At this point I/jviereck am not sure if adding the extra `!BASE`
is worth the overhead and therefore might be removed in a later iteration again.)

```js
// VirtualCSS:
var ButtonStyles = StyleSheet.create({
  button: {
    // This is the basic/base styles that all the following rules inherit from.
    '!BASE' {
      backgroundColor: '#E6E6E6',
      border: 'none rgba(0, 0, 0, 0)',
      // ... more styles here ...
    },

    // Define pseudo selectors. These pseudo selectors the styles from '!BASE'
    // automatically as this is the default behavior in normal CSS as well.
    ':hover': {
      color: '#000',
    },

    ...
  }
});
```

6) A style definition like `button` above can have additional states like "disabled".
States inherit their styles from their parent rules automatically.

```js
// VirtualCSS:
var ButtonStyles = StyleSheet.create({
  button: {
    // This is the basic/base styles that all the following rules inherit from.
    '!BASE' {
      backgroundColor: '#E6E6E6',
      border: 'none rgba(0, 0, 0, 0)',
      // ... more styles here ...
    },

    ':hover': {
      color: '#000',
    },

    // Define states. States can inherit the styles from the '!BASE' definitions.
    // Possible states might be "checked" or "disabled". Note that things like
    // "BigButton" are not states as they modify the '!BASE' definition by
    // composing from `ButtonStyles.button` as described further below.
    'disabled': {
      '!BASE': {
        color: 'gray',
      }

      ':hover': {
        // TODO(jviereck): Support a way to reset all the inherited rules.
        // '!RESET': true
      }
    }
  }
});

```

7) ["Mixins Are Dead. Long Live Composition"](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750):
instead of using mixins, new styles are created by composing and using composition
functions, e.g.:

```js
// VirtualCSS:
var SwitcherButtonComposer = StyleSheet.composer({
  '!BASE' {
    borderRadius: 0,
    margin: 0
  }
});

// Apply the `SwitcherButtonComposer` function on the `ButtonStyles.button`
// style definitions.
var TextAlignChildStyleDef = SwitcherButtonComposer(ButtonStyles.button);
```

See also comments in `index.js` file.

The usage of composition solves the previous open problem of class inheritance.
E.g. the previous code to alter the look of a button:

```js
        // react-style:
        <Button styles={[ButtonStyles.success]}>
          OK
        </Button>
```

is now written this way:

```js
        // VirtualCSS:
        <Button styleDef={ButtonStyles.success(ButtonStyles.button)}>
          OK
        </Button>
```

Note that before the passed in `styles` got mixed into other style definitions
inside of the `<Button>` definition. This makes it very hard to reason about the
look/behavior of the Button when looking only at this piece of code.

In the VirtualCSS version, the styles are computed at the call site by applying
the composer `ButtonStyles.success` to the `ButtonStyles.button` style definitions
and then passing the completly computed style definition to the `<Button>`.
This makes it much easier to reason about the look of the button from the call site
and also allows to generate the static CSS from these definitions much easier.

## Open issues

- Figure out how to define/handle media queries.
- Cover how to define good prop-types to leverage dynamic/static runtime checks.
