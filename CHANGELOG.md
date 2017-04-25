

# Upcoming release

 - switch from `:root` to `:not(#\20)` to get more specificity in selectors
   - Thanks to [@subzey][] for the [idea][] and [@iamstarkov][] for the contribution [#9][]

[idea]: https://twitter.com/subzey/status/829050478721896448
[@subzey]: https://github.com/subzey
[@iamstarkov]: https://github.com/iamstarkov
[#9]: https://github.com/MadLittleMods/postcss-increase-specificity/pull/9

# v0.3.0 - 2016-9-9

 - Update to postcss@5.x
    - Thanks to [@laucheukhim](https://github.com/laucheukhim) for the contribution #5


# v0.2.2 - 2015-8-1

 - Add `options.stackableRoot` to customize the stackable selector used. Defaults to `:root`
 - Add [`postcss-plugin-context`](https://github.com/postcss/postcss-plugin-context) example. Only apply plugin to certain areas of the CSS.
 - Add note about the default `:root` not supported in IE8-


# v0.2.1 - 2015-7-31

 - Switch to [`string.prototype.repeat`](https://www.npmjs.com/package/string.prototype.repeat) and [`object-assign`](https://www.npmjs.com/package/object-assign)
 - Use the PostCSS `decl.important` property instead of value finagling


# v0.2.0 - 2015-7-30

 - Use [`repeat-string`](https://www.npmjs.com/package/repeat-string) instead of `String.prototype.repeat` which doesn't work in node.js


# v0.1.2 - 2015-7-30

 - Add tests
 - npm release
 - Add badges to readme


# v0.1.0 - 2015-7-30

 - First release
