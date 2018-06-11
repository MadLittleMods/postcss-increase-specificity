// postcss-increase-specificity v0.2.2

var postcss = require('postcss');
var objectAssign = require('object-assign');
var escapeStringRegexp = require('escape-string-regexp');
require('string.prototype.repeat');

var CSS_ESCAPED_TAB = '\\9';

var DISABLE_PLUGIN_RE = /postcss-increase-specificity disable/;
var ENABLE_PLUGIN_RE = /postcss-increase-specificity enable/;

function increaseSpecifityOfRule(rule, opts) {
	rule.selectors = rule.selectors.map(function(selector) {
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

/**
 * Checks for the presence of enable/disable comments up to the previous rule.
 * @param  {node} node 		PostCSS Node
 * @return {Null|Boolean} Null if no matching comment; otherwise boolean (toggle status)
 */
function checkForEnableDisableComments(node) {
	if (!node) return null;

	for (var prev = node; prev = prev.prev(); ) {
		if (prev.type !== 'comment' && prev.type !== 'decl') return null;
		if (DISABLE_PLUGIN_RE.test(prev.text)) {
			return true;
		} else if (ENABLE_PLUGIN_RE.test(prev.text)) {
			return false;
		}
	}

	return null;
}

// Plugin that adds `:not(#\\9)` selectors to the front of the rule thus increasing specificity
module.exports = postcss.plugin('postcss-increase-specificity', function(options) {
	var defaults = {
		// The number of times `:not(#\\9)` is appended in front of the selector
		repeat: 3,
		// Whether to add !important to declarations in rules with id selectors
		overrideIds: true,
		// The thing we repeat over and over to make up the piece that increases specificity
		stackableRoot: ':not(#' + CSS_ESCAPED_TAB + ')'
	};

	var opts = objectAssign({}, defaults, options);

	return function(css) {
		var isPluginDisabled = false;

		css.walkRules(function(rule) {
			// Avoid adding additional selectors (stackableRoot) to descendant rules of @keyframe {}
			// i.e. `from`, `to`, or `{number}%`
			var isInsideKeyframes = rule.parent.type === 'atrule' && rule.parent.name === 'keyframes';

			var enableDisableResult = checkForEnableDisableComments(rule);
			isPluginDisabled = (enableDisableResult !== null) ? enableDisableResult : isPluginDisabled;

			if(!isInsideKeyframes && !isPluginDisabled) {
				increaseSpecifityOfRule(rule, opts);
			}
		});
	};
});
