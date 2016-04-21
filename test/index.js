import 'harmony-reflect'
import expect from 'expect'
import mockery from 'mockery'

import { StyleSheet as StyleSheetMock } from './_mocks'

let ExtensibleStyleSheet = require('../').default

function remock(StyleSheet = StyleSheetMock) {
  mockery.deregisterMock('react-native')
  mockery.registerMock('react-native', { StyleSheet })

  delete require.cache[require.resolve('../')]

  ExtensibleStyleSheet = require('../').default
}

describe('ExtensibleStyleSheet', () => {
  beforeEach(() => {
    remock()
  })

  describe('constructing', () => {
    it('should have a static create() function', () => {
      expect(ExtensibleStyleSheet.create).toBeA(Function)
    })

    it('create() should return an instance of ExtensibleStyleSheet', () => {
      expect(ExtensibleStyleSheet.create()).toBeAn(ExtensibleStyleSheet)
    })

    it('should be constructable without going via static create() function', () => {
      expect(new ExtensibleStyleSheet()).toBeAn(ExtensibleStyleSheet)
    })
  })

  describe('instances', () => {
    it('should have an extend() function', () => {
      const styles = ExtensibleStyleSheet.create()

      expect(styles.extend).toBeA(Function)
    })

    it('should allow variables to be defined and accessed using a "$" prefix', () => {
      const $textColor = '#FF0000'
      const styles = ExtensibleStyleSheet.create({
        $textColor
      })

      expect(styles.$textColor).toBe($textColor)
    })

    it('should proxy all other properties to the react-native StyleSheet', () => {
      const prop = Symbol('unique value')
      const container = { prop }

      remock({
        create(options) {
          return { container }
        }
      })

      const styles = ExtensibleStyleSheet.create({ container })

      expect(styles.container).toBeAn(Object)
      expect(styles.container.prop).toBe(prop)
    })

    it('should replace values which are variable names with the variable value', () => {
      const $color = '#ff0000'
      const $fontSize = 14

      remock({
        create(options) {
          expect(options.container.backgroundColor).toBe($color)
          expect(options.container.fontSize).toBe($fontSize)
        }
      })

      ExtensibleStyleSheet.create({
        $color,
        $fontSize,

        container: {
          backgroundColor: '$color',
          fontSize: '$fontSize'
        }
      })
    })

    it('should ignore values which look like variable names but do not resolve', () => {
      remock({
        create(options) {
          expect(options.container.backgroundColor).toBe('$color')
        }
      })

      ExtensibleStyleSheet.create({
        container: {
          backgroundColor: '$color'
        }
      })
    })
  })

  describe('extend()', () => {
    it('should return a new ExtensibleStyleSheet instance', () => {
      const src = ExtensibleStyleSheet.create()
      const extended = src.extend()

      expect(extended).toBeAn(ExtensibleStyleSheet)
      expect(extended).toNotBe(src)
    })

    it('should inherit variable definitions from the parent StyleSheet', () => {
      const $color = '#00FF00'

      const src = ExtensibleStyleSheet.create({ $color })
      const extended = src.extend()
      
      expect(extended.$color).toBe($color)
    })

    it('should allow new variables to be defined', () => {
      const $baseColor = '#0F0F0F'
      const $color = '#0000FF'

      const src = ExtensibleStyleSheet.create({ $baseColor })
      const extended = src.extend({ $color })

      expect(extended.$color).toBe($color)

      // Ensure original variable is still there
      expect(extended.$baseColor).toBe($baseColor)
    })

    it('should overwrite variable definitions with the same name', () => {
      const $color = '#0FABC1'
      const src = ExtensibleStyleSheet.create({ $color: '#000000' })

      expect(src.extend({ $color }).$color).toBe($color)
    })

    it('should inherit style definitions from the parent', () => {
      const container = { fontSize: 12 }
      const src = ExtensibleStyleSheet.create({ container })

      const extended = src.extend()

      expect(extended.container).toEqual(container)
    })

    it('should merge style definitions', () => {
      const fontSize = 14
      const fontWeight = 'bold'
      const src = ExtensibleStyleSheet.create({ merged: { fontSize } })

      const extended = src.extend({ merged: { fontWeight } })

      expect(extended.merged).toEqual({ fontSize, fontWeight })
    })

    it('should overwrite style definition values', () => {
      const fontSize = 22
      const src = ExtensibleStyleSheet.create({ container: { fontSize: 32 } })

      const extended = src.extend({ container: { fontSize } })

      expect(extended.container.fontSize).toBe(fontSize)
    })

    it('should be able to extend again', () => {
      const src = ExtensibleStyleSheet.create({
        $color: '#ff0000',
        container: {
          fontSize: 12
        }
      })
      const $color2 = '#00ff00'
      const centered = {
        justifyContent: 'center'
      } 
      const firstExtension = src.extend({
        $color2,
        container: {
          fontWeight: 'bold'
        },
        centered
      })

      expect(firstExtension.extend).toBeA(Function)

      const $color = '#00ffff'
      const $color3 = '#ffffff'
      const fontSize = 24

      const finalExtension = firstExtension.extend({
        $color,
        $color3,
        container: {
          fontSize
        }
      })

      expect(finalExtension.$color).toBe($color)
      expect(finalExtension.$color2).toBe($color2)
      expect(finalExtension.$color3).toBe($color3)

      expect(finalExtension.container).toEqual({
        fontSize,
        fontWeight: 'bold'
      })

      expect(finalExtension.centered).toEqual(centered)
    })
  })
})

