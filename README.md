# react-native-extensible-stylesheet [![npm version](https://badge.fury.io/js/react-native-extensible-stylesheet.svg)](https://badge.fury.io/js/react-native-extensible-stylesheet)
[![Build Status](https://travis-ci.org/jwarby/react-native-extensible-stylesheet.svg?branch=master)](https://travis-ci.org/jwarby/react-native-extensible-stylesheet)
> Extensible stylesheets for react-native

## Overview

A simple & tiny drop-in replacement for the `react-native` `StyleSheet` module,
which add support for extending stylesheets and defining variables.  Uses
`react-native`'s `StyleSheet` under the hood.

## Installation

Install via npm:

```bash
npm install --save react-native-extensible-stylesheet
```

## Usage/Examples

We can create a new StyleSheet just as we would with `react-native`'s
`StyleSheet.create()`.  For example, let's create a 'theme' stylesheet:

```javascript
// file: theme.js
import StyleSheet from 'react-native-extensible-stylesheet'

export default StyleSheet.create({
  centeredText: {
    textAlign: 'center'
  },
  fade: {
    opacity: 0.5
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold'
  }
})
```
We can then import the theme stylesheet elsewhere and `extend()` it.  When we
extend a stylesheet we get all the definitions from the original.   We can also
add new definitions, and extend or completely override existing definitions.
In the example below, we just add a new definition, `myNewStyle`.  The
resulting stylesheet will contain `myNewStyle`, plus everything defined in
`theme.js` (`centeredText`, `fade` and `header`).

```javascript
// file: MyAmazingComponent/styles.js
import theme from '../theme.js'

export default theme.extend({
  myNewStyle: {
    color: '#FF0000'
  }
})
```

In the next example we add a new rule to the existing `header` definition to
make the text gray, and override it's `fontSize` value.  The text will still
be **bold** as we will inherit `fontSize: 'bold'` from `theme.js`:

```javascript
// file MyAmazingComponent/styles.js
import theme from '../theme.js'

export default theme.extend({
  header: {
    fontSize: 26, // Overrides fontSize from theme.js
    color: '#AAAAAA'
  }
})
```

### Variables

We can also define variables by prefixing property names with `$`:

```javascript
// file: theme.js
import StyleSheet from 'react-native-extensible-stylesheet'

export default StyleSheet.create({
  $primaryColor: '#FF0000',

  header: {
    color: '$primaryColor' // Variables can be referenced using their names
  }
})
```

Variables are included in any extensions of the stylesheets:

```javascript
// file: MyAmazingComponent/styles.js
import theme from '../theme.js'

export default theme.extend({
  myNewStyle: {
    color: '$primaryColor'
  }
})
```

## Example Project

Coming soon to an `example/` folder near you!

## Contributing

- Run tests using `npm test`
- Run ESLint using `npm run lint`
- All code is in `index.js`

## Changelog

- `2nd August 2016` - `v0.0.3` - Ensure statics from base StyleSheet are copied onto ExtensibleStyleSheet
- `22nd April 2016` - `v0.0.2` - Add missing devDependency `harmony-reflect`
- `22nd April 2016` - `v0.0.1` - First released version
