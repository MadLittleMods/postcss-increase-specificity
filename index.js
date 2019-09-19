var postcss = require("postcss");
var objectAssign = require("object-assign");
var classRepeat = require("class-repeat");
var isPresent = require("is-present");
var hasClass = require("has-class-selector");
require("string.prototype.repeat");

let opts;

function specifyByClassRepeat(root) {
  root.walkRules(function(node) {
    if (isPresent(node.selectors)) {
      node.selectors = node.selectors.map(function(selector) {
        return hasClass(selector) ? classRepeat(selector, opts) : selector;
      });
    }
    return node;
  });
}

function specifyById(css) {
  css.walkRules(function(rule) {
    var isInsideKeyframes =
      rule.parent.type === "atrule" && rule.parent.name === "keyframes";

    if (!isInsideKeyframes) {
      increaseSpecifityOfRule(rule, opts);
    }
  });
}

function increaseSpecifityOfRule(rule, opts) {
  rule.selectors = rule.selectors.map(function(selector) {
    opts.id = opts.id[0] !== "#" ? "#" + opts.id : opts.id;
    if (selector === "html" || selector === "body") {
      return selector;
    }
    if (
      selector === opts.id ||
      ((opts.id === "#conversation" &&
        selector.startsWith("[data-spot-im-direction]")) ||
        selector.startsWith("[data-spotim-app"))
    ) {
      return opts.id.repeat(opts.repeat) + selector;
    }

    return opts.id.repeat(opts.repeat) + " " + selector;
  });
}

module.exports = postcss.plugin("postcss-increase-specificity", function(
  options
) {
  const defaults = {
    repeat: 2
  };

  opts = objectAssign({}, defaults, options);

  let specifyBy = opts.id ? specifyById : specifyByClassRepeat;

  return specifyBy;
});
