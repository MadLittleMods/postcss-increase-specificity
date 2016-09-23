// postcss-increase-specificity v0.2.2

var postcss = require('postcss');
var objectAssign = require('object-assign');
var minimatch = require('minimatch');
require('string.prototype.repeat');

// Plugin that adds `:root` selectors to the front of the rule thus increasing specificity
module.exports = postcss.plugin('postcss-increase-specifity', function(options) {
	var defaults = {
		// The number of times `:root` is appended in front of the selector
		repeat: 3,
		// Whether to add !important to declarations in rules with id selectors
		overrideIds: true,
		// The thing we repeat over and over to make up the piece that increases specificity
		stackableRoot: ':root',
		ignore: []
	};

	var opts = objectAssign({}, defaults, options);

	return function(css) {
		css.walkRules(function(rule) {
			rule.selectors = rule.selectors.map(function(selector) {
				var shouldBeIgnored = opts.ignore.some(function (pattern) {
					return minimatch(selector, pattern);
				});

				if (shouldBeIgnored) {
					return selector;
				}
				// Apply it to the selector itself if the selector is a `root` level component
				// `html:root:root:root`
				if(
					selector === 'html' ||
					selector === ':root' ||
					selector === ':host' ||
					selector === opts.stackableRoot
				) {
					return selector + opts.stackableRoot.repeat(opts.repeat);
				}

				// Otherwise just make it a descendant (this is what will happen most of the time)
				// `:root:root:root .foo`
				return opts.stackableRoot.repeat(opts.repeat) + ' ' + selector;
			});

			if(opts.overrideIds) {
				if(
					// If an id is in there somewhere
					(/#/).test(rule.selector) ||
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
