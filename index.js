/* eslint-disable import/no-unresolved */
import { StyleSheet } from 'react-native'
/* eslint-enable import/no-unresolved */

import defaultsDeep from 'lodash/defaultsDeep'
import isPlainObject from 'lodash/isPlainObject'
import mapValues from 'lodash/mapValues'

class ExtensibleStyleSheet {
  static create(options = {}) {
    return new ExtensibleStyleSheet(options)
  }

  _variables = {}

  constructor(options = {}) {

    // Store original options for extension later
    this._options = { ...options }

    // Extract variables
    Object.keys(options)
      .filter(key => key[0] === '$')
      .forEach(name => {
        this._variables[name] = options[name]
        delete options[name]
      })

    // Replace variables in values
    this._styles = StyleSheet.create(this.replaceValues(options))

    /* @todo once the Proxy object is available in JavaScriptCore, change this
     * copy behaviour to proxy all property access accordingly */
    Object.assign(this, this._variables, this._styles)
  }

  extend(options) {
    return new ExtensibleStyleSheet(defaultsDeep({}, options, this._options))
  }

  replaceValues(object) {
    return mapValues(object, value => {
      if (isPlainObject(value)) {
        return this.replaceValues(value)
      }

      return this._variables[value] || value
    })
  }
}

for (const s in StyleSheet) {
  ExtensibleStyleSheet[s] = ExtensibleStyleSheet[s] || StyleSheet[s]
}

export default ExtensibleStyleSheet
