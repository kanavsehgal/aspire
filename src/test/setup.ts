import '@testing-library/jest-dom'
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Create the $q mock
const $q = {
  dialog: vi.fn(),
  notify: vi.fn(),
  loading: vi.fn(),
  platform: {
    has: {
      touch: false,
      webStorage: true,
    },
    is: {
      mobile: false,
      desktop: true,
    },
  },
  config: {},
  iconMapFn: () => ({}), // Return an empty object instead of null
  dark: {
    isActive: false,
    mode: 'auto',
  },
}

// Set the $q mock on globalProperties
config.global.mocks = { $q }
config.global.config = { 
  globalProperties: { 
    $q,
    $router: {} as any,
    $route: {} as any
  } 
}

// Mock Quasar components
config.global.components = {
  QBtn: { template: '<button><slot /></button>' },
  QIcon: { template: '<span><slot /></span>' },
  QCard: { template: '<div><slot /></div>' },
  QCardSection: { template: '<div><slot /></div>' },
}
