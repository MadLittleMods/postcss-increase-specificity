// postcss-increase-specificity v0.2.2

var postcss = require('postcss');
var objectAssign = require('object-assign');
var escapeStringRegexp = require('escape-string-regexp');
require('string.prototype.repeat');

var CSS_ESCAPED_TAB = '\\9';


function increaseSpecifityOfRule(rule, opts) {
	rule.selectors = rule.selectors.map(function(selector) {
		// Ignore a selector if it is in the ignore list
		if (opts.ignoreList.length > 0) {
			var isInIgnoreList = opts.ignoreList.some(function(item) {
				var regEx = new RegExp(item.replace('.', '\\.') + '\\b', 'gi');
				return selector.search(regEx) > -1;
			});

			if (isInIgnoreList) {
				return selector;
			}
		}
		// Apply it to the selector itself if the selector is a `root` level component
		// `html:not(#\\9):not(#\\9):not(#\\9)`
		if(
			selector === 'html' ||
			selector === ':root' ||
			selector === ':host' ||
			selector === opts.stackableRoot
		) {
			return selector + opts.stackableRoot.repeat(opts.repeat);
		}

		// Otherwise just make it a descendant (this is what will happen most of the time)
		// `:not(#\\9):not(#\\9):not(#\\9) .foo`
		return opts.stackableRoot.repeat(opts.repeat) + ' ' + selector;
	});

	if(opts.overrideIds) {
		if(
			// If an id is in there somewhere
			(new RegExp('#(?!' + escapeStringRegexp(CSS_ESCAPED_TAB) + ')')).test(rule.selector) ||
			// Or it is an attribute selector with an id
			(/\[id/).test(rule.selector)
		) {
			rule.walkDecls(function(decl) {
				decl.important = true;
			});
		}
	}
}


// Plugin that adds `:not(#\\9)` selectors to the front of the rule thus increasing specificity
module.exports = postcss.plugin('postcss-increase-specificity', function(options) {
	var defaults = {
		// The number of times `:not(#\\9)` is appended in front of the selector
		repeat: 3,
		// Whether to add !important to declarations in rules with id selectors
		overrideIds: true,
		// The thing we repeat over and over to make up the piece that increases specificity
		stackableRoot: ':not(#' + CSS_ESCAPED_TAB + ')',
		// List of ignored selectors
		ignoreList: [],
	};

	var opts = objectAssign({}, defaults, options);

	return function(css) {
		css.walkRules(function(rule) {
			// Avoid adding additional selectors (stackableRoot) to descendant rules of @keyframe {}
			// i.e. `from`, `to`, or `{number}%`
			var isInsideKeyframes = rule.parent.type === 'atrule' && rule.parent.name === 'keyframes';

			if(!isInsideKeyframes) {
				increaseSpecifityOfRule(rule, opts);
			}
		});
	};
});
