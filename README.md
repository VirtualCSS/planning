# planing for VirtualCSS

Repository for planing and brainstorming on VirtualCSS.

# Goal

There seem many projects that try to define styling in the context of
ReactJS. The goal of VirtualCSS is to serve as a foundation that all
the differnet libraries can talk to and to provide common functionality
like mounting styles in a `<style>` element in the browser, provide 
devtools plugins that work in Chrome/Firefox, optimize the declared
styles for production builds and so on forth.

An initial goal of this repository might be to determine all the requirements and
constraints for the libraries that would build on top of VirtualCSS and
afterwards come up with an API to fit all the requirements.

For initial thoughts on the VirtualCSS system see the blog post [here](https://medium.com/@jviereck/modularise-css-the-react-way-1e817b317b04).

# License

Please note that the license for the VirtualCSS project is BSD and 
by contributing to the project you agree with the license. BSD was chosen
as the React.JS library also uses BSD and by choosing the same license
transfering contributions in both directions becomes possible.
