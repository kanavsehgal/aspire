import type { CardDetail, Transaction } from '../types/dashboard'
import { CardType } from '../types/dashboard'
import { TransactionType } from '../types/dashboard'

// Import JSON data
import debitCardsData from '../data/debitCards.json'
import transactionsData from '../data/transactions.json'
import userData from '../data/userData.json'

// Mock user data interface
export interface UserData {
  id: string
  name: string
  email: string
  currencyType: string
  balanceAmount: number
}

class CardsPageService {
  private readonly resource = '/cards'

  /**
   * Get user debit cards
   */
  async getDebitCards(): Promise<CardDetail[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Read from JSON file and map to proper types
    return debitCardsData.map((card: any) => ({
      ...card,
      type: card.type === 'visa' ? CardType.VISA : CardType.MASTERCARD,
    })) as CardDetail[]
  }

  /**
   * Get user transactions
   */
  async getTransactions(): Promise<Transaction[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Read from JSON file and map to proper types
    return transactionsData.map((transaction: any) => ({
      ...transaction,
      type: transaction.type === 'refund' ? TransactionType.REFUND : TransactionType.CHARGED,
    })) as Transaction[]
  }

  /**
   * Get user data
   */
  async getUserData(): Promise<UserData> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Read from JSON file
    return userData as UserData
  }
}

// Export singleton instance
export const cardsPageService = new CardsPageService()
export default cardsPageService
