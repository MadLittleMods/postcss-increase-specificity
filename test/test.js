var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var postcss = require('postcss');
var increaseSpecifity = require('../');

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var CleanCSS = require('clean-css');



function testPlugin(filePath, expectedFilePath, options) {
	options = options || {};

	return fs.readFileAsync(filePath)
		.then(function(buffer) {
			var contents = String(buffer);
			var actual = postcss([
					increaseSpecifity(options)
				])
				.process(contents);

			return actual.css;
		})
		.then(function(actual) {
			return fs.readFileAsync(expectedFilePath)
				.then(function(buffer) {
					var contents = String(buffer);

					var cleanCss = new CleanCSS({
						advanced: false,
						aggressiveMerging: false,
						mediaMerging: false,
						restructuring: false,
						shorthandCompacting: false,
						//keepBreaks: true,
						compatibility: '-properties.merging'
					});

					expect(cleanCss.minify(actual).styles).to.equal(cleanCss.minify(contents).styles);
					//expect(actual).to.equal(contents);
				});
		});
}


describe('postcss-increase-specificity', function() {
	it('should work with classes `.foo`', function() {
		return testPlugin('./test/fixtures/classes.css', './test/fixtures/classes.expected.css');
	});

	it('should work with multiple classes `.foo, .bar`', function() {
		return testPlugin('./test/fixtures/multiple-classes.css', './test/fixtures/multiple-classes.expected.css');
	});

	it('should work with ids `#foo`', function() {
		return testPlugin('./test/fixtures/ids.css', './test/fixtures/ids.expected.css');
	});

	it('should work with attribute selectors with id `[id=foo]`', function() {
		return testPlugin('./test/fixtures/attribute-id.css', './test/fixtures/attribute-id.expected.css');
	});

	it('should work with root level selectors `html, :not(#\\9), :host`', function() {
		return testPlugin('./test/fixtures/root-level-selectors.css', './test/fixtures/root-level-selectors.expected.css');
	});

	it('should work with `::selection`', function() {
		return testPlugin('./test/fixtures/selection-pseudo.css', './test/fixtures/selection-pseudo.expected.css');
	});

	it('should not mangle a decl that already has an `!important` on it', function() {
		return testPlugin('./test/fixtures/no-mangle-important-decl-in-id.css', './test/fixtures/no-mangle-important-decl-in-id.expected.css');
	});

	it('should repeat `:not(#\\9)` appropriately `options.repeat', function() {
		return testPlugin(
			'./test/fixtures/repeat-option.css',
			'./test/fixtures/repeat-option.expected.css',
			{
				repeat: 5
			}
		);
	});

	it('should not add `!important` when `options.overrideIds = false`', function() {
		return testPlugin(
			'./test/fixtures/ids-no-override-option.css',
			'./test/fixtures/ids-no-override-option.expected.css',
			{
				overrideIds: false
			}
		);
	});

	it('should use stackableRoot `options.stackableRoot`', function() {
		return testPlugin(
			'./test/fixtures/stackable-root.css',
			'./test/fixtures/stackable-root.expected.css',
			{
				stackableRoot: '.my-root'
			}
		);
	});

	it('should consider a selector that uses a `options.stackableRoot` a root', function() {
		return testPlugin(
			'./test/fixtures/stackable-root.css',
			'./test/fixtures/stackable-root.expected.css',
			{
				stackableRoot: '.my-root'
			}
		);
	});

	it('should not change the descendant rules of @keyframes', function() {
		return testPlugin('./test/fixtures/keyframes.css', './test/fixtures/keyframes.expected.css');
	});

	it('should ignore .selector', function() {
		return testPlugin(
			'./test/fixtures/ignore-list.css',
			'./test/fixtures/ignore-list.expected.css',
			{
				repeat: 1,
				stackableRoot: '.my-root',
				ignoreList: ['.selector'],
			}
		);
	})
});
