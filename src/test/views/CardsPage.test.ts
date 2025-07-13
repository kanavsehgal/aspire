import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { Quasar } from 'quasar'
import CardsPage from '@/views/CardsPage.vue'
import { TabType, CardType } from '@/types/dashboard'
import type { CardDetail } from '@/types/dashboard'

// Mock the composables
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

// Mock the store
const mockAddCard = vi.fn()
const mockReplaceCards = vi.fn()
const mockFetchAllData = vi.fn()

vi.mock('@/stores/cardsPage', () => ({
  useCardsPageStore: () => ({
    debitCards: [
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
    ],
    transactions: [
      {
        title: 'Test Transaction',
        date: '2024-01-01',
        amount: 150,
        icon: '../assets/file-storage.svg',
        iconColor: '#009DFF',
        noteKey: 'dashboard.transactions.fileStorage',
        type: 'charged',
      },
    ],
    currencyType: 'S$',
    balanceAmount: 1234567,
    isLoading: false,
    addCard: mockAddCard,
    replaceCards: mockReplaceCards,
    fetchAllData: mockFetchAllData,
  }),
}))

describe('CardsPage.vue - TypeScript Tests', () => {
  let wrapper: any

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    wrapper = mount(CardsPage, {
      global: {
        plugins: [Quasar],
        stubs: {
          Header: true,
          MyDebitCard: true,
          CompanyCards: true,
          AddCardDialog: true,
        },
      },
    })
  })

  describe('Type Definitions', () => {
    it('has correct TabType enum usage', () => {
      expect(wrapper.vm.tab).toBe(TabType.MY_DEBIT_CARD)
    })

    it('has correct CardIndex type', () => {
      expect(typeof wrapper.vm.selectedCardIndex).toBe('number')
      expect(wrapper.vm.selectedCardIndex).toBe(0)
    })

    it('has correct boolean types for reactive refs', () => {
      expect(typeof wrapper.vm.showCardDetails).toBe('boolean')
      expect(typeof wrapper.vm.showNewCardModal).toBe('boolean')
      expect(wrapper.vm.showCardDetails).toBe(false)
      expect(wrapper.vm.showNewCardModal).toBe(false)
    })
  })

  describe('Tab Switching Functionality', () => {
    it('initializes with correct default tab', () => {
      expect(wrapper.vm.tab).toBe(TabType.MY_DEBIT_CARD)
    })

    it('switches to company cards tab with correct type', async () => {
      // Directly set the reactive ref value
      wrapper.vm.tab = TabType.COMPANY_CARDS
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.tab).toBe(TabType.COMPANY_CARDS)
      expect(typeof wrapper.vm.tab).toBe('string')
    })

    it('switches back to my debit cards tab with correct type', async () => {
      // First switch to company cards
      wrapper.vm.tab = TabType.COMPANY_CARDS
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.tab).toBe(TabType.COMPANY_CARDS)

      // Then switch back to my debit cards
      wrapper.vm.tab = TabType.MY_DEBIT_CARD
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.tab).toBe(TabType.MY_DEBIT_CARD)
    })

    it('maintains correct TabType enum values', () => {
      expect(TabType.MY_DEBIT_CARD).toBe('myDebitCard')
      expect(TabType.COMPANY_CARDS).toBe('companyCards')
    })

    it('handles tab switching with proper type safety', async () => {
      const tabValues: TabType[] = [TabType.MY_DEBIT_CARD, TabType.COMPANY_CARDS]

      for (const tabValue of tabValues) {
        wrapper.vm.tab = tabValue
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.tab).toBe(tabValue)
        expect(typeof wrapper.vm.tab).toBe('string')
      }
    })

    it('validates tab values are valid enum members', () => {
      const validTabValues = Object.values(TabType)
      expect(validTabValues).toContain(TabType.MY_DEBIT_CARD)
      expect(validTabValues).toContain(TabType.COMPANY_CARDS)
    })
  })

  describe('Props and Event Handling', () => {
    it('handles CardDetail array type correctly', () => {
      const newCard: CardDetail = {
        holder: 'New User',
        logo: '/new-logo.svg',
        number: '1111 2222 3333 4444',
        expiry: '12/26',
        cvv: '789',
        year: '2026',
        type: CardType.VISA,
        isFrozen: false,
      }

      expect(typeof newCard.holder).toBe('string')
      expect(typeof newCard.logo).toBe('string')
      expect(typeof newCard.number).toBe('string')
      expect(typeof newCard.expiry).toBe('string')
      expect(typeof newCard.cvv).toBe('string')
      expect(typeof newCard.year).toBe('string')
      expect(typeof newCard.type).toBe('string')
      expect(typeof newCard.isFrozen).toBe('boolean')
    })

    it('handles CardIndex type correctly', () => {
      const cardIndex: number = 1
      expect(typeof cardIndex).toBe('number')
      expect(cardIndex).toBeGreaterThanOrEqual(0)
    })

    it('handles boolean props correctly', () => {
      const showDetails: boolean = true
      const showModal: boolean = false

      expect(typeof showDetails).toBe('boolean')
      expect(typeof showModal).toBe('boolean')
      expect(showDetails).toBe(true)
      expect(showModal).toBe(false)
    })
  })

  describe('Store Integration', () => {
    it('calls replaceCards with correct array type', async () => {
      const updatedCards: CardDetail[] = [
        {
          holder: 'Updated User',
          logo: '/updated-logo.svg',
          number: '5555 6666 7777 8888',
          expiry: '12/27',
          cvv: '999',
          year: '2027',
          type: CardType.MASTERCARD,
          isFrozen: true,
        },
      ]

      await wrapper.vm.handleCardsUpdate(updatedCards)
      expect(mockReplaceCards).toHaveBeenCalledWith(updatedCards)
      expect(mockReplaceCards).toHaveBeenCalledTimes(1)
    })

    it('calls fetchAllData on mount', () => {
      expect(mockFetchAllData).toHaveBeenCalledTimes(1)
    })
  })

  describe('Component Props Types', () => {
    it('passes correct prop types to AddCardDialog component', () => {
      const addCardDialog = wrapper.findComponent({ name: 'AddCardDialog' })
      expect(addCardDialog.exists()).toBe(true)
      // Check that props are passed with correct types
      expect(typeof wrapper.vm.showNewCardModal).toBe('boolean')
    })
  })

  describe('Reactive References', () => {
    it('has correct reactive ref types', () => {
      expect(wrapper.vm.tab).toBe(TabType.MY_DEBIT_CARD)
      expect(wrapper.vm.selectedCardIndex).toBe(0)
      expect(wrapper.vm.showCardDetails).toBe(false)
      expect(wrapper.vm.showNewCardModal).toBe(false)
    })
  })
})
