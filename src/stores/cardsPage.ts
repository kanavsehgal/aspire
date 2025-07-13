import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CardDetail, Transaction } from '../types/dashboard'
import cardsPageService, { type UserData } from '../services/cardsPage'

export const useCardsPageStore = defineStore('cardsPageStore', () => {
  // State
  const debitCards = ref<CardDetail[]>([])
  const transactions = ref<Transaction[]>([])
  const userData = ref<UserData | null>(null)

  // Loading states
  const loadingCards = ref(false)
  const loadingTransactions = ref(false)
  const loadingUserData = ref(false)

  // Error states
  const cardsError = ref<string | null>(null)
  const transactionsError = ref<string | null>(null)
  const userDataError = ref<string | null>(null)

  // Getters
  const isLoading = computed(
    () => loadingCards.value || loadingTransactions.value || loadingUserData.value
  )

  const hasErrors = computed(
    () => cardsError.value || transactionsError.value || userDataError.value
  )

  const currencyType = computed(() => userData.value?.currencyType || 'S$')
  const balanceAmount = computed(() => userData.value?.balanceAmount || 0)

  // Actions
  const fetchDebitCards = async (): Promise<void> => {
    loadingCards.value = true
    cardsError.value = null

    try {
      const cards = await cardsPageService.getDebitCards()
      debitCards.value = cards
    } catch (error) {
      console.error('Error fetching debit cards:', error)
      cardsError.value = 'Failed to load debit cards'
    } finally {
      loadingCards.value = false
    }
  }

  const fetchTransactions = async (): Promise<void> => {
    loadingTransactions.value = true
    transactionsError.value = null

    try {
      const txns = await cardsPageService.getTransactions()
      transactions.value = txns
    } catch (error) {
      console.error('Error fetching transactions:', error)
      transactionsError.value = 'Failed to load transactions'
    } finally {
      loadingTransactions.value = false
    }
  }

  const fetchUserData = async (): Promise<void> => {
    loadingUserData.value = true
    userDataError.value = null

    try {
      const data = await cardsPageService.getUserData()
      userData.value = data
    } catch (error) {
      console.error('Error fetching user data:', error)
      userDataError.value = 'Failed to load user data'
    } finally {
      loadingUserData.value = false
    }
  }

  const fetchAllData = async (): Promise<void> => {
    await Promise.all([fetchDebitCards(), fetchTransactions(), fetchUserData()])
  }

  const addCard = (newCard: CardDetail): void => {
    debitCards.value.push(newCard)
  }

  const updateCard = (index: number, updatedCard: CardDetail): void => {
    if (index >= 0 && index < debitCards.value.length) {
      debitCards.value[index] = updatedCard
    }
  }

  const removeCard = (index: number): void => {
    if (index >= 0 && index < debitCards.value.length) {
      debitCards.value.splice(index, 1)
    }
  }

  const replaceCards = (newCards: CardDetail[]): void => {
    debitCards.value = [...newCards]
  }

  const clearErrors = (): void => {
    cardsError.value = null
    transactionsError.value = null
    userDataError.value = null
  }

  const reset = (): void => {
    debitCards.value = []
    transactions.value = []
    userData.value = null
    loadingCards.value = false
    loadingTransactions.value = false
    loadingUserData.value = false
    clearErrors()
  }

  return {
    // State
    debitCards,
    transactions,
    userData,
    loadingCards,
    loadingTransactions,
    loadingUserData,
    cardsError,
    transactionsError,
    userDataError,

    // Getters
    isLoading,
    hasErrors,
    currencyType,
    balanceAmount,

    // Actions
    fetchDebitCards,
    fetchTransactions,
    fetchUserData,
    fetchAllData,
    addCard,
    updateCard,
    removeCard,
    replaceCards,
    clearErrors,
    reset,
  }
})
