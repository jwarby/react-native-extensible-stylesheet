import mockery from 'mockery'

import { StyleSheet } from './_mocks'

// Enable mocking of node_modules
mockery.enable({
  warnOnUnregistered: false
})

mockery.registerMock('react-native', {
  StyleSheet
})
