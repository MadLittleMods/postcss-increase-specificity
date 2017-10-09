# v0.6.0 - 2017-10-9

 - Avoid mangling rules inside `@keyframes`
    - Thanks to [@IvanKalinin](https://github.com/IvanKalinin) for the contribution [#14](https://github.com/MadLittleMods/postcss-increase-specificity/pull/14)


# v0.5.0 - 2017-5-26

 - Switch `options.stackableRoot` from `:not(#\20)` to `:not(#\9)` to save some bytes
    - Thanks to [@valtlai](https://github.com/valtlai) for the contribution [#12](https://github.com/MadLittleMods/postcss-increase-specificity/pull/12)


# v0.4.0 - 2017-5-18

 - Switch `options.stackableRoot` from `:root` to `:not(#\20)` to get more specificity in selectors
   - Thanks to [@subzey](https://github.com/subzey) for the [idea](https://twitter.com/subzey/status/829050478721896448) and [@iamstarkov](https://github.com/iamstarkov) for the contribution [#9](https://github.com/MadLittleMods/postcss-increase-specificity/pull/9)


# v0.3.0 - 2016-9-9

 - Update to postcss@5.x
    - Thanks to [@laucheukhim](https://github.com/laucheukhim) for the contribution [#5](https://github.com/MadLittleMods/postcss-increase-specificity/pull/5)


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
