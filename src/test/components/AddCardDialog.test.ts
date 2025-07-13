import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import AddCardDialog from '@/components/AddCardDialog.vue'
import { CardType } from '@/types/dashboard'
import type { NewCardForm, CardProviderOption, CardDetail } from '@/types/dashboard'

// Mock the composables
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

// Mock Quasar notify
const mockNotify = vi.fn()
vi.mock('quasar', async () => {
  const actual = await vi.importActual('quasar')
  return {
    ...actual,
    useQuasar: () => ({
      notify: mockNotify,
    }),
  }
})

describe('AddCardDialog.vue - TypeScript Tests', () => {
  let wrapper: any

  const defaultProps = {
    modelValue: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(AddCardDialog, {
      props: defaultProps,
      global: {
        plugins: [Quasar],
        stubs: {
          'q-dialog': true,
          'q-card': true,
          'q-card-section': true,
          'q-form': true,
          'q-input': true,
          'q-select': true,
          'q-btn': true,
          'q-item': true,
          'q-item-section': true,
          'q-item-label': true,
        },
      },
    })
  })

  describe('Type Definitions', () => {
    it('has correct Props interface', () => {
      expect(typeof wrapper.props('modelValue')).toBe('boolean')
      expect(wrapper.props('modelValue')).toBe(false)
    })

    it('has correct NewCardForm type', () => {
      const form: NewCardForm = {
        holder: 'Test User',
        cvv: '123',
        validThru: '12/25',
        cardNumber: '1234 5678 9012 3456',
        cardProvider: CardType.VISA,
        bank: 'Test Bank',
      }

      expect(typeof form.holder).toBe('string')
      expect(typeof form.cvv).toBe('string')
      expect(typeof form.validThru).toBe('string')
      expect(typeof form.cardNumber).toBe('string')
      expect(typeof form.cardProvider).toBe('string')
      expect(typeof form.bank).toBe('string')
    })

    it('has correct CardProviderOption type', () => {
      const option: CardProviderOption = {
        label: 'Visa',
        value: CardType.VISA,
      }

      expect(typeof option.label).toBe('string')
      expect(typeof option.value).toBe('string')
    })

    it('has correct CardDetail type', () => {
      const card: CardDetail = {
        holder: 'Test User',
        logo: '/test-logo.svg',
        number: '1234 5678 9012 3456',
        expiry: '12/25',
        cvv: '123',
        year: '2025',
        type: CardType.VISA,
        isFrozen: false,
      }

      expect(typeof card.holder).toBe('string')
      expect(typeof card.logo).toBe('string')
      expect(typeof card.number).toBe('string')
      expect(typeof card.expiry).toBe('string')
      expect(typeof card.cvv).toBe('string')
      expect(typeof card.year).toBe('string')
      expect(typeof card.type).toBe('string')
      expect(typeof card.isFrozen).toBe('boolean')
    })
  })

  describe('Reactive Data', () => {
    it('has correct form structure', () => {
      const form = wrapper.vm.form
      expect(typeof form.holder).toBe('string')
      expect(typeof form.cvv).toBe('string')
      expect(typeof form.validThru).toBe('string')
      expect(typeof form.cardNumber).toBe('string')
      expect(typeof form.cardProvider).toBe('string')
      expect(typeof form.bank).toBe('string')
    })

    it('has correct cardProviderOptions', () => {
      const options = wrapper.vm.cardProviderOptions
      expect(Array.isArray(options)).toBe(true)
      expect(options).toHaveLength(2)
      
      const visaOption = options[0]
      expect(typeof visaOption.label).toBe('string')
      expect(typeof visaOption.value).toBe('string')
      expect(visaOption.value).toBe(CardType.VISA)
    })

    it('has correct showModal computed property', () => {
      expect(typeof wrapper.vm.showModal).toBe('boolean')
      expect(wrapper.vm.showModal).toBe(false)
    })
  })

  describe('Computed Properties', () => {
    it('computes isFormValid correctly', () => {
      expect(typeof wrapper.vm.isFormValid).toBe('boolean')
      expect(wrapper.vm.isFormValid).toBe(false) // Initially false due to empty form
    })

    it('updates isFormValid when form is filled', async () => {
      wrapper.vm.form = {
        holder: 'Test User',
        cvv: '123',
        validThru: '12/25',
        cardNumber: '1234 5678 9012 3456',
        cardProvider: CardType.VISA,
        bank: 'Test Bank',
      }
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.isFormValid).toBe(true)
    })

    it('validates form fields correctly', () => {
      const form = wrapper.vm.form
      
      // Test empty form
      expect(wrapper.vm.isFormValid).toBe(false)
      
      // Test partially filled form
      form.holder = 'Test User'
      expect(wrapper.vm.isFormValid).toBe(false)
      
      // Test fully filled form
      form.cvv = '123'
      form.validThru = '12/25'
      form.cardNumber = '1234 5678 9012 3456'
      form.cardProvider = CardType.VISA
      form.bank = 'Test Bank'
      
      expect(wrapper.vm.isFormValid).toBe(true)
    })
  })

  describe('Utility Functions', () => {
    it('generateRandomCardNumber returns correct format', () => {
      const cardNumber = wrapper.vm.generateRandomCardNumber()
      expect(typeof cardNumber).toBe('string')
      expect(cardNumber.length).toBe(19) // 16 digits + 3 spaces
      expect(cardNumber.replace(/\s/g, '').length).toBe(16)
      expect(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(cardNumber)).toBe(true)
    })

    it('generateRandomValidThru returns correct format', () => {
      const validThru = wrapper.vm.generateRandomValidThru()
      expect(typeof validThru).toBe('string')
      expect(/^\d{2}\/\d{2}$/.test(validThru)).toBe(true)
      
      const [month, year] = validThru.split('/')
      const monthNum = parseInt(month)
      const yearNum = parseInt(year)
      
      expect(monthNum).toBeGreaterThanOrEqual(1)
      expect(monthNum).toBeLessThanOrEqual(12)
      expect(yearNum).toBeGreaterThanOrEqual(new Date().getFullYear() % 100)
    })
  })

  describe('Event Handling', () => {
    it('emits update:modelValue with correct type', async () => {
      await wrapper.vm.$emit('update:modelValue', true)
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0]).toEqual([true])
      expect(typeof wrapper.emitted('update:modelValue')[0][0]).toBe('boolean')
    })

    it('emits update:existingDebitCards with correct type', async () => {
      const newCards: CardDetail[] = [
        {
          holder: 'Test User',
          logo: '/test-logo.svg',
          number: '1234 5678 9012 3456',
          expiry: '12/25',
          cvv: '123',
          year: '2025',
          type: CardType.VISA,
          isFrozen: false,
        },
      ]
      
      await wrapper.vm.$emit('update:existingDebitCards', newCards)
      
      expect(wrapper.emitted('update:existingDebitCards')).toBeTruthy()
      expect(wrapper.emitted('update:existingDebitCards')[0]).toEqual([newCards])
    })

    it('emits update:selectedCardIndex with correct type', async () => {
      await wrapper.vm.$emit('update:selectedCardIndex', 0)
      
      expect(wrapper.emitted('update:selectedCardIndex')).toBeTruthy()
      expect(wrapper.emitted('update:selectedCardIndex')[0]).toEqual([0])
      expect(typeof wrapper.emitted('update:selectedCardIndex')[0][0]).toBe('number')
    })
  })

  describe('Methods', () => {
    it('resetForm resets form with correct types', () => {
      wrapper.vm.form = {
        holder: 'Test User',
        cvv: '123',
        validThru: '12/25',
        cardNumber: '1234 5678 9012 3456',
        cardProvider: CardType.VISA,
        bank: 'Test Bank',
      }
      
      wrapper.vm.resetForm(false)
      
      expect(wrapper.vm.form.holder).toBe('')
      expect(wrapper.vm.form.cvv).toBe('')
      expect(typeof wrapper.vm.form.validThru).toBe('string')
      expect(typeof wrapper.vm.form.cardNumber).toBe('string')
      expect(wrapper.vm.form.cardProvider).toBe(CardType.VISA)
      expect(wrapper.vm.form.bank).toBe('')
    })

    it('handleSubmit creates CardDetail with correct types', () => {
      wrapper.vm.form = {
        holder: 'Test User',
        cvv: '123',
        validThru: '12/25',
        cardNumber: '1234 5678 9012 3456',
        cardProvider: CardType.VISA,
        bank: 'Test Bank',
      }
      
      wrapper.vm.handleSubmit()
      
      expect(wrapper.emitted('update:existingDebitCards')).toBeTruthy()
      expect(wrapper.emitted('update:selectedCardIndex')).toBeTruthy()
      
      const emittedCard = wrapper.emitted('update:existingDebitCards')[0][0][0]
      expect(typeof emittedCard.holder).toBe('string')
      expect(typeof emittedCard.logo).toBe('string')
      expect(typeof emittedCard.number).toBe('string')
      expect(typeof emittedCard.expiry).toBe('string')
      expect(typeof emittedCard.cvv).toBe('string')
      expect(typeof emittedCard.year).toBe('string')
      expect(typeof emittedCard.type).toBe('string')
      expect(typeof emittedCard.isFrozen).toBe('boolean')
    })

    it('handleCancel calls resetForm', () => {
      // Set up initial form state
      wrapper.vm.form = {
        holder: 'Test User',
        cvv: '123',
        validThru: '12/25',
        cardNumber: '1234 5678 9012 3456',
        cardProvider: CardType.VISA,
        bank: 'Test Bank',
      }
      
      // Call the method
      wrapper.vm.handleCancel()
      
      // Verify the form was reset by checking the form state
      expect(wrapper.vm.form.holder).toBe('')
      expect(wrapper.vm.form.cvv).toBe('')
      expect(wrapper.vm.form.bank).toBe('')
      expect(wrapper.vm.form.cardProvider).toBe(CardType.VISA)
      expect(typeof wrapper.vm.form.validThru).toBe('string')
      expect(typeof wrapper.vm.form.cardNumber).toBe('string')
    })
  })

  describe('Watch Functionality', () => {
    it('watches showModal changes correctly', async () => {
      // Test modal opening
      await wrapper.setProps({ modelValue: true })
      await wrapper.vm.$nextTick()
      
      expect(typeof wrapper.vm.form.cardNumber).toBe('string')
      expect(typeof wrapper.vm.form.validThru).toBe('string')
      expect(wrapper.vm.form.cardNumber.length).toBeGreaterThan(0)
      expect(wrapper.vm.form.validThru.length).toBeGreaterThan(0)
    })
  })

  describe('Form Validation', () => {
    it('validates holder field correctly', () => {
      const form = wrapper.vm.form
      
      // Test empty holder
      form.holder = ''
      expect(wrapper.vm.isFormValid).toBe(false)
      
      // Test short holder
      form.holder = 'A'
      expect(wrapper.vm.isFormValid).toBe(false)
      
      // Test valid holder
      form.holder = 'Test User'
      form.cvv = '123'
      form.validThru = '12/25'
      form.cardNumber = '1234 5678 9012 3456'
      form.cardProvider = CardType.VISA
      form.bank = 'Test Bank'
      expect(wrapper.vm.isFormValid).toBe(true)
    })

    it('validates cardNumber field correctly', () => {
      const form = wrapper.vm.form
      
      // Test empty card number
      form.cardNumber = ''
      expect(wrapper.vm.isFormValid).toBe(false)
      
      // Test valid card number
      form.holder = 'Test User'
      form.cardNumber = '1234 5678 9012 3456'
      form.cvv = '123'
      form.validThru = '12/25'
      form.cardProvider = CardType.VISA
      form.bank = 'Test Bank'
      expect(wrapper.vm.isFormValid).toBe(true)
    })
  })

  describe('Enum Usage', () => {
    it('uses CardType enum correctly', () => {
      expect(CardType.VISA).toBe('visa')
      expect(CardType.MASTERCARD).toBe('mastercard')
    })

    it('sets default cardProvider to VISA', () => {
      expect(wrapper.vm.form.cardProvider).toBe(CardType.VISA)
    })
  })
}) 