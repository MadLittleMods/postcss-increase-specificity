var postcss = require("postcss");
var objectAssign = require("object-assign");
var classRepeat = require("class-repeat");
var isPresent = require("is-present");
var hasClass = require("has-class-selector");
require("string.prototype.repeat");

let opts;

function specifyByClassRepeat(root) {
  root.walkRules(function (node) {
    if (isPresent(node.selectors)) {
      node.selectors = node.selectors.map(function (selector) {
        return hasClass(selector) ? classRepeat(selector, opts) : selector;
      });
    }
    return node;
  });
}

function specifyById(css) {
  opts.id = opts.id[0] !== "#" ? "#" + opts.id : opts.id;
  css.walkRules(function (rule) {
    var isInsideKeyframes =
      rule.parent.type === "atrule" &&
      (rule.parent.name === "keyframes" ||
        rule.parent.name === "-webkit-keyframes" ||
        rule.parent.name === "webkit-keyframes" ||
        rule.parent.name === "-moz-keyframes" ||
        rule.parent.name === "-o-keyframes");

    if (!isInsideKeyframes) {
      increaseSpecifityOfRule(rule, opts);
    }
  });
}

function increaseSpecifityOfRule(rule, opts) {
  rule.selectors = rule.selectors.map(function (selector) {
    if (
      selector.includes(":root") ||
      selector === "html" ||
      selector === "body"
    ) {
      return selector;
    }
    if (opts.withoutCssLoaderPrefix) {
      return `:global(${opts.id.repeat(opts.repeat)})` + " " + selector;
    }

    return opts.id.repeat(opts.repeat) + " " + selector;
  });
}

module.exports = postcss.plugin("postcss-increase-specificity", function (
  options
) {
  const defaults = {
    repeat: 2,
  };

  opts = objectAssign({}, defaults, options);

  let specifyBy = opts.id ? specifyById : specifyByClassRepeat;

  return specifyBy;
});
