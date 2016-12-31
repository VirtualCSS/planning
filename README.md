# Planning for VirtualCSS

Repository for planning and brainstorming on VirtualCSS.

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

For initial thoughts on the VirtualCSS system see the blog post [here](https://medium.com/@jviereck/modularise-css-the-react-way-1e817b317b04).

# Goal

1. Ability to declare CSS styles in a way that a static CSS file can be produce during build time on the server.
2. Support the full feature when declaring CSS styles except cascading. That means in particular support pseudo selectors like :hover, media queries, and multiple declarations of the same style.
3. Support functions in the style declarations (see the `createSimpleButton` example [here](https://github.com/VirtualCSS/planning/issues/1#issuecomment-88999335)). This is in particular important to support CSS preprocessors similar to SASS on top of VirtualCSS but I also see value for pure CSS-in-JS solutions (e.g. a function for `gradients` that then will emit style definitions for gradients with all the vendor prefixes).
4. Ability to extend/overwrite style definitions. E.g. create a static substyle of "Button" called "BigButton" that is an enlarged version of "Button"
5. Ability to optimize the static CSS by rewriting the declared styles at build time.
6. Ability to provide developer tools extensions for browsers that makes tweeking the style definitions easy during development. 

# Non-Goals

5. Do not support generation of inline styles. The problem is that by using inline styles covering the full feature set of CSS (e.g. pseudo selectors) is non trivial. As the [`react-style`](https://github.com/js-next/react-style) project shows, it is doable, so maybe a future version of VirtualCSS can work together with `react-style` to support inline styles. But for now to focus the scope of the VirtualCSS project I doubt it is a good idea to support both inline styles and static css.
7. Provide high level APIs to developers to interact with VirtualCSS. Developers should not interact with VirtualCSS directly but use a different library that builds on top of VirtualCSS and talks to the lower bits provided by VirtualCSS. This way VirtualCSS can concentrate on the essential parts and don't have to deal with user ergonomics.

# License

Please note that the license for the VirtualCSS project is MIT and
by contributing to the project you agree with the license. MIT was chosen
as many other css-in-js libraries also use the MIT license.
