[![npm version](https://badge.fury.io/js/postcss-increase-specificity.svg)](http://badge.fury.io/js/postcss-increase-specificity) [![Build Status](https://travis-ci.org/MadLittleMods/postcss-increase-specificity.svg)](https://travis-ci.org/MadLittleMods/postcss-increase-specificity)

# PostCSS Increase Specificity

[PostCSS](https://github.com/postcss/postcss) plugin to increase the specificity of your selectors.

[Why?](#why) Dealing with CSS you can't remove(mainly from a 3rd party), [see the why section](#why). 

## Latest Version: v0.2.1

### [Changelog](https://github.com/MadLittleMods/postcss-increase-specificity/blob/master/CHANGELOG.md)

### Install

`npm install postcss-increase-specificity --save-dev`

# Usage

```js
var postcss = require('postcss');
var increaseSpecificity = require('postcss-increase-specificity');

var fs = require('fs');

var mycss = fs.readFileSync('input.css', 'utf8');

// Process your CSS with postcss-increase-specificity
var output = postcss([
        increaseSpecificity(/*options*/)
    ])
    .process(mycss)
    .css;

console.log(output);
```


## Results

Input:

```css
html {
	background: #485674;
	height: 100%;
}

.blocks {
	background: #34405B;
}

#main-nav {
	color: #ffffff;
}

[id="main-nav"] {
	border: 1px solid #ffffff;
}

.foo,
.bar {
	display: inline-block;
	width: 50%;
}

```

Output (result):

```css
html:root:root:root {
	background: #485674;
	height: 100%;
}

:root:root:root .blocks {
	background: #34405B;
}

:root:root:root #main-nav {
	color: #ffffff !important;
}

:root:root:root [id="main-nav"] {
	border: 1px solid #ffffff !important;
}

:root:root:root .foo,
:root:root:root .bar {
	display: inline-block;
	width: 50%;
}

```


# Why? *(my use case)*

I had to use a 3rd party form-creation/data-aggregation service required by the client. The form is embedded in the website, via script tag, which unrolls an iframe with the form. The goal was to make the form match the rest of the site. 

The 3rd party form creation service *did* have an option for custom CSS, but you had to work around their existing layout and theme styles. Unfortunately, there was no blank(unstyled) theme to start from and you could not add any of your own selectors. Another problem was that they used really specific selectors and also some `!important` declarations.

This meant I had to make my own selectors have a lot more specificity in order for my styles to have any effect. I wanted to write relatively clean CSS and still be able to overcome their styles automagically, so I created this plugin, `postcss-increase-specificity`.


# What it does? *(by default)*

 - Prepend a descendant selector piece: `:root` repeated the specified, `options.repeat`, number of times.
 - Add `!important` declarations to any selectors that have to do with an id.



# Options

 - `repeat`: number - The number of times we prepend `:root` in front of your selector
 	 - Default: `3`
 - `overrideIds`: boolean - Whether we should add `!important` to all declarations that use id's in any way. Because id's are so specific, the only way(essentially) to overcome another id is to use `!important`.
 	 - Default: `true`


# Tests

We have a suite of Mocha tests.

`npm test`




