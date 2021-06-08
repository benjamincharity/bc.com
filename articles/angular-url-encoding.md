---
title: Angular URL Encoding
description: Quickly encode or decode a URI using AngularJS
tags: [angularjs]
published: true
publishDate: 2016-02-13
previousUrl: https://blog.benjamincharity.com/angular-url-encoding/
---

# Angular URL Encoding

Recently a project I was working on required the ability to URL-encode various strings in order to create `mailTo:`
links on the fly. Because more than one of our modules needed this ability, I decided to create a simple
component to share the code between modules.

This is dead simple thanks to JavaScript's `encodeURI` and `decodeURI`. Take a look:

<iframe style="width: 100%; height: 600px" src="https://embed.plnkr.co/oPJZWt/?show=preview" frameborder="0" allowfullscren="allowfullscren"></iframe>

Feel free to [grab it on Github][gh] or [offer any improvements][issues].

---

### Further Reading

- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI>

[gh]: https://github.com/benjamincharity/angular-url-encode
[issues]: https://github.com/benjamincharity/angular-url-encode/issues
