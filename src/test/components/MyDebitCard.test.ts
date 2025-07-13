import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { Quasar } from 'quasar'
import MyDebitCard from '@/components/MyDebitCard.vue'
import { CardType, TransactionType } from '@/types/dashboard'
import type { CardDetail, Transaction } from '@/types/dashboard'

// Mock the composables
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@/composables/useIconPath', () => ({
  useIconPath: () => ({
    getIconLink: (path: string) => `resolved-${path}`,
  }),
}))

// Mock the store
const mockUpdateCard = vi.fn()
vi.mock('@/stores/cardsPage', () => ({
  useCardsPageStore: () => ({
    updateCard: mockUpdateCard,
  }),
}))

describe('MyDebitCard.vue - TypeScript Tests', () => {
  let wrapper: any

  const defaultProps = {
    existingDebitCards: [
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
      {
        holder: 'Another User',
        logo: '/test-logo2.svg',
        number: '9876 5432 1098 7654',
        expiry: '06/26',
        cvv: '456',
        year: '2026',
        type: CardType.MASTERCARD,
        isFrozen: true,
      },
    ],
    selectedCardIndex: 0,
    showCardDetails: false,
    currencyType: 'S$',
    transactions: [
      {
        title: 'Test Transaction',
        date: '2024-01-01',
        amount: 150,
        icon: '../assets/file-storage.svg',
        iconColor: '#009DFF',
        noteKey: 'dashboard.transactions.fileStorage',
        type: TransactionType.CHARGED,
      },
      {
        title: 'Refund Transaction',
        date: '2024-01-02',
        amount: 50,
        icon: '../assets/flights.svg',
        iconColor: '#00D6B5',
        noteKey: 'dashboard.transactions.flights',
        type: TransactionType.REFUND,
      },
    ],
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    wrapper = mount(MyDebitCard, {
      props: defaultProps,
      global: {
        plugins: [Quasar],
        stubs: {
          'q-card': true,
          'q-carousel': true,
          'q-carousel-slide': true,
          'q-expansion-item': true,
          'q-list': true,
          'q-item': true,
          'q-item-section': true,
          'q-item-label': true,
          'q-btn': true,
          'q-icon': true,
        },
      },
    })
  })

  describe('Type Definitions', () => {
    it('has correct CardDetail array type', () => {
      expect(Array.isArray(wrapper.props('existingDebitCards'))).toBe(true)
      expect(wrapper.props('existingDebitCards')).toHaveLength(2)

      const firstCard = wrapper.props('existingDebitCards')[0]
      expect(typeof firstCard.holder).toBe('string')
      expect(typeof firstCard.logo).toBe('string')
      expect(typeof firstCard.number).toBe('string')
      expect(typeof firstCard.expiry).toBe('string')
      expect(typeof firstCard.cvv).toBe('string')
      expect(typeof firstCard.year).toBe('string')
      expect(typeof firstCard.type).toBe('string')
      expect(typeof firstCard.isFrozen).toBe('boolean')
    })

    it('has correct CardIndex type', () => {
      expect(typeof wrapper.props('selectedCardIndex')).toBe('number')
      expect(wrapper.props('selectedCardIndex')).toBe(0)
    })

    it('has correct boolean props', () => {
      expect(typeof wrapper.props('showCardDetails')).toBe('boolean')
      expect(wrapper.props('showCardDetails')).toBe(false)
    })

    it('has correct string props', () => {
      expect(typeof wrapper.props('currencyType')).toBe('string')
      expect(wrapper.props('currencyType')).toBe('S$')
    })

    it('has correct Transaction array type', () => {
      expect(Array.isArray(wrapper.props('transactions'))).toBe(true)
      expect(wrapper.props('transactions')).toHaveLength(2)

      const firstTransaction = wrapper.props('transactions')[0]
      expect(typeof firstTransaction.title).toBe('string')
      expect(typeof firstTransaction.date).toBe('string')
      expect(typeof firstTransaction.amount).toBe('number')
      expect(typeof firstTransaction.icon).toBe('string')
      expect(typeof firstTransaction.iconColor).toBe('string')
      expect(typeof firstTransaction.noteKey).toBe('string')
      expect(typeof firstTransaction.type).toBe('string')
    })
  })

  describe('Computed Properties', () => {
    it('computes selectedCard correctly', () => {
      const selectedCard = wrapper.vm.selectedCard
      expect(selectedCard).toBeDefined()
      expect(selectedCard.holder).toBe('Test User')
      expect(selectedCard.type).toBe(CardType.VISA)
      expect(selectedCard.isFrozen).toBe(false)
    })

    it('computes cardActions correctly', () => {
      const cardActions = wrapper.vm.cardActions
      expect(Array.isArray(cardActions)).toBe(true)
      expect(cardActions.length).toBeGreaterThan(0)

      const firstAction = cardActions[0]
      expect(typeof firstAction.icon).toBe('string')
      expect(typeof firstAction.color).toBe('string')
      expect(typeof firstAction.iconColor).toBe('string')
      expect(typeof firstAction.labelKey).toBe('string')
    })

    it('updates cardActions based on card freeze status', async () => {
      // Test with frozen card
      await wrapper.setProps({
        existingDebitCards: [
          {
            ...defaultProps.existingDebitCards[0],
            isFrozen: true,
          },
        ],
      })

      const cardActions = wrapper.vm.cardActions
      const freezeAction = cardActions[0]
      expect(freezeAction.labelKey).toBe('dashboard.cardActions.unfreeze')
    })
  })

  describe('Event Handling', () => {
    it('emits update:selectedCardIndex with correct type', async () => {
      await wrapper.vm.$emit('update:selectedCardIndex', 1)

      expect(wrapper.emitted('update:selectedCardIndex')).toBeTruthy()
      expect(wrapper.emitted('update:selectedCardIndex')[0]).toEqual([1])
      expect(typeof wrapper.emitted('update:selectedCardIndex')[0][0]).toBe('number')
    })

    it('emits update:showCardDetails with correct type', async () => {
      await wrapper.vm.$emit('update:showCardDetails', true)

      expect(wrapper.emitted('update:showCardDetails')).toBeTruthy()
      expect(wrapper.emitted('update:showCardDetails')[0]).toEqual([true])
      expect(typeof wrapper.emitted('update:showCardDetails')[0][0]).toBe('boolean')
    })
  })

  describe('Methods', () => {
    it('toggleCardDetails emits correct event', () => {
      wrapper.vm.toggleCardDetails()

      expect(wrapper.emitted('update:showCardDetails')).toBeTruthy()
      expect(wrapper.emitted('update:showCardDetails')[0]).toEqual([true])
    })

    it('toggleCardFreeze calls store method with correct types', () => {
      const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() }
      wrapper.vm.toggleCardFreeze(event)

      expect(mockUpdateCard).toHaveBeenCalledWith(
        0,
        expect.objectContaining({
          holder: 'Test User',
          isFrozen: true,
        })
      )
      expect(event.preventDefault).toHaveBeenCalled()
      expect(event.stopPropagation).toHaveBeenCalled()
    })

    it('toggleCardFreeze handles undefined event', () => {
      wrapper.vm.toggleCardFreeze()

      expect(mockUpdateCard).toHaveBeenCalledWith(
        0,
        expect.objectContaining({
          holder: 'Test User',
          isFrozen: true,
        })
      )
    })
  })

  describe('Props Validation', () => {
    it('validates CardDetail interface', () => {
      const validCard: CardDetail = {
        holder: 'Valid User',
        logo: '/valid-logo.svg',
        number: '1111 2222 3333 4444',
        expiry: '12/26',
        cvv: '789',
        year: '2026',
        type: CardType.VISA,
        isFrozen: false,
      }

      expect(typeof validCard.holder).toBe('string')
      expect(typeof validCard.logo).toBe('string')
      expect(typeof validCard.number).toBe('string')
      expect(typeof validCard.expiry).toBe('string')
      expect(typeof validCard.cvv).toBe('string')
      expect(typeof validCard.year).toBe('string')
      expect(typeof validCard.type).toBe('string')
      expect(typeof validCard.isFrozen).toBe('boolean')
    })

    it('validates Transaction interface', () => {
      const validTransaction: Transaction = {
        title: 'Valid Transaction',
        date: '2024-01-01',
        amount: 100,
        icon: '../assets/valid-icon.svg',
        iconColor: '#FF0000',
        noteKey: 'dashboard.transactions.valid',
        type: TransactionType.CHARGED,
      }

      expect(typeof validTransaction.title).toBe('string')
      expect(typeof validTransaction.date).toBe('string')
      expect(typeof validTransaction.amount).toBe('number')
      expect(typeof validTransaction.icon).toBe('string')
      expect(typeof validTransaction.iconColor).toBe('string')
      expect(typeof validTransaction.noteKey).toBe('string')
      expect(typeof validTransaction.type).toBe('string')
    })
  })

  describe('Reactive Data', () => {
    it('has correct reactive ref types', () => {
      expect(typeof wrapper.vm.isCardDetailsExpanded).toBe('boolean')
      expect(wrapper.vm.isCardDetailsExpanded).toBe(false)
    })

    it('updates reactive data with correct types', async () => {
      wrapper.vm.isCardDetailsExpanded = true
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isCardDetailsExpanded).toBe(true)
      expect(typeof wrapper.vm.isCardDetailsExpanded).toBe('boolean')
    })
  })

  describe('Enum Usage', () => {
    it('uses CardType enum correctly', () => {
      expect(CardType.VISA).toBe('visa')
      expect(CardType.MASTERCARD).toBe('mastercard')
    })

    it('uses TransactionType enum correctly', () => {
      expect(TransactionType.CHARGED).toBe('charged')
      expect(TransactionType.REFUND).toBe('refund')
    })
  })
})
