var postcss = require('postcss');
var extend = require('extend');
var repeat = require('repeat-string');

// Plugin that adds `:root` selectors to the front of the rule thus increasing specificity
module.exports = postcss.plugin('postcss-increase-specifity', function(options) {
	var defaults = {
		// The number of times `:root` is appended in front of the selector
		repeat: 3,
		// Whether to add !important to declarations in rules with id selectors
		overrideIds: true
	};

	var opts = extend({}, defaults, options);

	return function(css) {
		css.eachRule(function(rule) {
			rule.selectors = rule.selectors.map(function(selector) {
				// Apply it to the selector itself if the selector is a `root` level component
				// `html:root:root:root`
				if(
					selector === 'html' ||
					selector === ':root' ||
					selector === ':host'
				) {
					return selector + repeat(':root', opts.repeat);
				}

				// Otherwise just make it a descendant (this is what will happen most of the time)
				// `:root:root:root .foo`
				return repeat(':root', opts.repeat) + ' ' + selector;
			});

			if(opts.overrideIds) {
				if(
					// If an id is in there somewhere
					(/#/).test(rule.selector) ||
					// Or it is an attribute selector with an id
					(/\[id/).test(rule.selector)
				) {
					rule.eachDecl(function(decl) {
						// Don't mangle already important declarations
						if(!decl.important) {
							decl.value += ' !important';
						}
					});
				}
			}
		});

	};
});
