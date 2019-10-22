
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
            increaseCssSpecificity({id: "#conversation" }),
          ];
        },
      },
    },


## Results

Input:

```css
body {
	background: #485674;
	height: 100%;
}

.blocks {
	background: #34405B;
}

#main-nav {
	color: #ffffff;
}


.foo,
.bar {
	display: inline-block;
	width: 50%;
}

```

Output (result):

```css
body {
	background: #485674;
	height: 100%;
}

#conversation#conversation .blocks {
	background: #34405B;
}

#conversation#conversation #main-nav {
	color: #ffffff;
}


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

 - `repeat`: number - The number of times id is being added before each rule /  classes being repeated.
 	 - Default: `2`
 - `id`: string - if id is provided, the id is being added to each rule to increase specificity
 - `withoutCssLoaderPrefix`: boolean - add your css-loader prefix to your id.
 	- Default: false

