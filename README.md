
# PostCSS Increase Specificity

[PostCSS](https://github.com/postcss/postcss) plugin to increase the specificity of our selectors.



# Usage

## Basic Example

```
const increaseCssSpecificity = require('@spotim/postcss-increase-specificity');

Webpack usage:

    {
      loader: 'postcss-loader',
      options: {
        plugins: function() {
          return [
            increaseCssSpecificity({specifyById: true , Id: "#conversation" }),
          ];
        },
      },
    },


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
html:#conversation#conversation {
	background: #485674;
	height: 100%;
}

#conversation#conversation .blocks {
	background: #34405B;
}

#conversation#conversation #main-nav {
	color: #ffffff !important;
}

// No space between the rules

	#conversation#conversation[data-spotim-app="conversation"] {
		border: 1px solid #ffffff !important;
	}

	#conversation#conversation[data-spot-im-direction="rtl"] {
		border: 1px solid #ffffff !important;
	}

//

#conversation#conversation .foo,
#conversation#conversation .bar {
	display: inline-block;
	width: 50%;
}

```


# Why?

After leaving iframe, we're trying to avoid css conflicts between our apps and the publiser css rules.


# What it does? *(by default)*

 - repeats every class *repeat* times (default is 2)


# Options

 - `repeat`: number - The number of times Id is being added before each rule /  classes being repeated.
 	 - Default: `2`
 - `specifyById`: boolean - *true*: increase specificity by *Id*.
 			    *false*: increase specificity by repeat classes.
 	 - Default: `false`
	 
 - `Id`: string - prepends to each rule to increase specificity if *specifyById* is true

