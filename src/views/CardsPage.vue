<template>
  <div class="cards-dashboard">
    <!-- 1. Header Section -->
    <Header
      :currency-type="currencyType"
      :balance-amount="balanceAmount"
      @open-new-card-modal="showNewCardModal = true"
      class="q-mx-sm"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center q-pa-xl">
      <q-spinner-dots size="50px" color="primary" />
      <div class="text-h6 q-mt-md">{{ t('dashboard.loading') }}</div>
    </div>

    <!-- Content when loaded -->
    <div v-else>
      <!-- Tabs Section -->
      <q-tabs
        v-model="tab"
        class="text-navy-dark q-mb-lg q-mx-sm"
        active-color="primary"
        indicator-color="info"
        dense
        no-caps
        align="left"
        active-class="active-tab"
      >
        <q-tab name="myDebitCard" :label="t('dashboard.tabs.myDebitCards')" />
        <q-tab name="companyCards" :label="t('dashboard.tabs.companyCards')" />
      </q-tabs>

      <!-- Tab Panels -->
      <q-tab-panels v-model="tab" animated class="q-pa-none">
        <!-- My Debit Cards Tab -->
        <q-tab-panel name="myDebitCard" class="q-pa-none my-debit-card-panel q-ma-sm">
          <MyDebitCard
            :existing-debit-cards="debitCards"
            :selected-card-index="selectedCardIndex"
            :show-card-details="showCardDetails"
            :currency-type="currencyType"
            :transactions="transactions"
            @update:selected-card-index="selectedCardIndex = $event"
            @update:show-card-details="showCardDetails = $event"
            @update:existing-debit-cards="handleCardsUpdate"
          />
        </q-tab-panel>

        <!-- Company Cards Tab -->
        <q-tab-panel name="companyCards">
          <CompanyCards />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>

  <!-- New Card Modal -->
  <AddCardDialog
    v-model="showNewCardModal"
    @update:existing-debit-cards="handleCardAdded"
    @update:selected-card-index="selectedCardIndex = $event"
  />
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { TabType } from '../types/dashboard'
import type { CardDetail, CardIndex } from '../types/dashboard'
import { useCardsPageStore } from '../stores/cardsPage'

// Import components
import Header from '../components/Header.vue'
import MyDebitCard from '../components/MyDebitCard.vue'
import CompanyCards from '../components/CompanyCards.vue'
import AddCardDialog from '../components/AddCardDialog.vue'

const { t } = useI18n()
const tab: Ref<TabType> = ref<TabType>(TabType.MY_DEBIT_CARD)

// Store
const cardsPageStore = useCardsPageStore()

// Destructure store state using storeToRefs for reactivity
const { debitCards, transactions, currencyType, balanceAmount, isLoading } =
  storeToRefs(cardsPageStore)

const showCardDetails: Ref<boolean> = ref<boolean>(false)
const selectedCardIndex: Ref<CardIndex> = ref<CardIndex>(0)
const showNewCardModal: Ref<boolean> = ref<boolean>(false)

const handleCardAdded = (newCards: CardDetail[]): void => {
  newCards.forEach((card) => cardsPageStore.addCard(card))
  selectedCardIndex.value = debitCards.value.length - 1
}

const handleCardsUpdate = (updatedCards: CardDetail[]): void => {
  cardsPageStore.replaceCards(updatedCards)
}

// Load data on component mount
onMounted(() => {
  cardsPageStore.fetchAllData()
})
</script>

<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/color-utilities';
@import '../styles/variables';

.cards-dashboard {
  min-height: 100vh;
  padding: 52px;
  width: calc(100vw - 340px);
  background: $color-white-pure;
  overflow-x: hidden;
  box-sizing: border-box;
}

@media (max-width: 1200px) {
  .cards-dashboard .row {
    flex-direction: column;
  }

  .main-card,
  .side-card {
    width: 100%;
    margin-bottom: 2rem;
  }
  
  .cards-dashboard {
    width: 100vw;
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .cards-dashboard {
    padding: 10px;
  }
  
  .my-debit-card-panel {
    margin: 0 !important;
  }
}

:deep(.active-tab) {
  font-size: 14px;
  font-family: 'Avenir Next', sans-serif !important;
  font-weight: 600 !important;
  color: $color-grey-darkest !important;
}

.my-debit-card-panel {
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08) !important;
  border-radius: 8px;
  background-color: white;
  position: relative;
  z-index: 1;
  width: auto;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
