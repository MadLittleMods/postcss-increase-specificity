// postcss-increase-specificity v0.2.2

var postcss = require('postcss');
var objectAssign = require('object-assign');
require('string.prototype.repeat');

// Plugin that adds `:not(#\\20)` selectors to the front of the rule thus increasing specificity
module.exports = postcss.plugin('postcss-increase-specifity', function(options) {
	var defaults = {
		// The number of times `:not(#\\20)` is appended in front of the selector
		repeat: 3,
		// Whether to add !important to declarations in rules with id selectors
		overrideIds: true,
		// The thing we repeat over and over to make up the piece that increases specificity
		// > Consider use :not(#\20), :not(.\20) and :not(\20)
		// > Rationale: \20 is a css escape for U+0020 Space, and neither classname, nor id, nor tagname can contain a space
		// > — https://twitter.com/subzey/status/829050478721896448
		stackableRoot: ':not(#\\20)'
	};

	var opts = objectAssign({}, defaults, options);

	return function(css) {
		css.walkRules(function(rule) {
			rule.selectors = rule.selectors.map(function(selector) {
				// Apply it to the selector itself if the selector is a `root` level component
				// `html:not(#\\20):not(#\\20):not(#\\20)`
				if(
					selector === 'html' ||
					selector === ':not(#\\20)' ||
					selector === ':host' ||
					selector === opts.stackableRoot
				) {
					return selector + opts.stackableRoot.repeat(opts.repeat);
				}

				// Otherwise just make it a descendant (this is what will happen most of the time)
				// `:not(#\\20):not(#\\20):not(#\\20) .foo`
				return opts.stackableRoot.repeat(opts.repeat) + ' ' + selector;
			});

			if(opts.overrideIds) {
				if(
					// If an id is in there somewhere
					(/#(?!\\)/).test(rule.selector) ||
					// Or it is an attribute selector with an id
					(/\[id/).test(rule.selector)
				) {
					rule.walkDecls(function(decl) {
						decl.important = true;
					});
				}
			}
		});

	};
});
