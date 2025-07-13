// =============================================================================
// Dashboard Types and Interfaces
// =============================================================================

// Enums
export enum CardType {
  VISA = 'visa',
  MASTERCARD = 'mastercard'
}

export enum TabType {
  MY_DEBIT_CARD = 'myDebitCard',
  COMPANY_CARDS = 'companyCards'
}

export enum TransactionType {
  REFUND = 'refund',
  CHARGED = 'charged'
}

// TypeScript interfaces
export interface CardDetail {
  holder: string
  logo: string
  number: string
  expiry: string
  cvv: string
  year: string
  type: CardType
  isFrozen?: boolean
}

export interface CardAction {
  icon: string
  color: string
  iconColor: string
  labelKey: string
}

export interface Transaction {
  id: string
  title: string
  date: string
  amount: string
  icon: string
  background: string
  type: TransactionType
  iconColor?: string
  noteKey?: string
}

export interface NewCardForm {
  holder: string
  cvv: string
  validThru: string
  cardNumber: string
  cardProvider: CardType
  bank: string
}

export interface CardProviderOption {
  label: string
  value: CardType
}

export interface BalanceInfo {
  currencyType: string
  amount: number
}

export interface CardCarouselConfig {
  height: string
  navigationColor: string
  animated: boolean
}

// Type aliases for better readability
export type CardIndex = number
export type CardHolderName = string
export type CardNumber = string
export type ExpiryDate = string
export type CVV = string
export type BankName = string

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Form validation types
export interface ValidationRule {
  validator: (value: any) => boolean | string
  message: string
}

export interface FormFieldConfig {
  name: string
  label: string
  type: 'text' | 'select' | 'date' | 'number'
  required: boolean
  rules?: ValidationRule[]
  mask?: string
  options?: CardProviderOption[]
}

// API response types (for future use)
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface CardApiResponse extends ApiResponse<CardDetail[]> {
  totalCards: number
  activeCards: number
  frozenCards: number
}

// State management types
export interface DashboardState {
  selectedTab: TabType
  selectedCardIndex: CardIndex
  showCardDetails: boolean
  showNewCardModal: boolean
  balance: BalanceInfo
  cards: CardDetail[]
  transactions: Transaction[]
}

// Action types for future state management
export interface DashboardActions {
  addCard: (card: CardDetail) => void
  removeCard: (cardIndex: CardIndex) => void
  toggleCardFreeze: (cardIndex: CardIndex) => void
  updateBalance: (balance: BalanceInfo) => void
  setSelectedCard: (index: CardIndex) => void
  toggleCardDetails: () => void
  openNewCardModal: () => void
  closeNewCardModal: () => void
} 