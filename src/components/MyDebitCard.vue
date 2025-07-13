<template>
  <q-card class="main-dashboard-card shadow-6 q-pa-xl">
    <div class="row wrap justify-between desktop-layout">
      <!-- Main Card -->
      <div class="main-card bg-white desktop-main-card">
        <div class="card-div">
          <div
            class="show-card-number text-blue-primary cursor-pointer q-mb-sm text-green-primary justify-end"
            @click="toggleCardDetails"
          >
            <img
              :src="getIconLink(`../assets/remove_red_eye-24px.svg`)"
              :alt="showCardDetails ? 'show card number' : 'hide card number'"
              class="card-type eye q-mr-xs"
            />
            {{ t('dashboard.showCardNumberButton') }}
          </div>
          <!-- Card Visual -->
          <q-carousel
            :model-value="selectedCardIndex"
            animated
            navigation
            height="300px"
            navigation-color="#01D167"
            @update:model-value="(value) => emit('update:selectedCardIndex', Number(value))"
          >
            <q-carousel-slide
              v-for="(card, index) in existingDebitCards"
              :key="index"
              :name="index"
            >
              <div
                class="bg-green-primary text-white q-pa-lg q-mt-xs rounded-borders-12"
                :class="{ 'frozen-card': card.isFrozen }"
              >
                <div class="row items-center justify-end">
                  <img :src="card.logo" alt="aspire" class="logo-img" />
                </div>
                <div class="card-holder row justify-start">{{ card.holder }}</div>
                <div class="card-number">
                  <template v-if="showCardDetails">
                    <span class="digit-group">{{
                      card.number.replace(/\s/g, '').slice(0, 4)
                    }}</span>
                    <span class="digit-group">{{
                      card.number.replace(/\s/g, '').slice(4, 8)
                    }}</span>
                    <span class="digit-group">{{
                      card.number.replace(/\s/g, '').slice(8, 12)
                    }}</span>
                    <span class="digit-group">{{
                      card.number.replace(/\s/g, '').slice(12, 16)
                    }}</span>
                  </template>
                  <template v-else>
                    <span class="digit-group dots">••••</span>
                    <span class="digit-group dots">••••</span>
                    <span class="digit-group dots">••••</span>
                    <span class="digit-group">{{
                      card.number.replace(/\s/g, '').slice(-4)
                    }}</span>
                  </template>
                </div>
                <div class="row items-center text-body2 thru-cvv">
                  <span class="thru"
                    >{{ t('dashboard.cardVisual.expiryLabel') }}: {{ card.expiry }}</span
                  >
                  <span class="cvv">
                    {{ t('dashboard.cardVisual.cvvLabel') }}:
                    <span :class="{ star: !showCardDetails }">{{
                      showCardDetails ? card.cvv : '***'
                    }}</span>
                  </span>
                </div>
                <div class="row items-center justify-end">
                  <img
                    :src="getIconLink(`../assets/visa-logo.svg`)"
                    :alt="card.type"
                    class="card-type"
                  />
                </div>
              </div>
            </q-carousel-slide>
          </q-carousel>
        </div>
        <!-- Card Actions -->
        <div class="row col-6 justify-between q-mb-md card-actions">
          <div v-for="(action, index) in cardActions" :key="action.labelKey" class="action-item">
            <img
              size="lg"
              :src="getIconLink(action.icon)"
              :alt="action.labelKey"
              class="cursor-pointer"
              @click="(event) => (index === 0 ? toggleCardFreeze(event) : null)"
            />
            <div class="action-label">{{ t(action.labelKey) }}</div>
          </div>
        </div>
      </div>
      <!-- Card Details & Transactions -->
      <div class="desktop-side-section mt-26">
        <q-expansion-item
          class="side-card bg-blue-very-light q-mb-md"
          :label="t('dashboard.cardDetailsTitle')"
          header-class="text-navy-dark"
          :expand-icon="`img:${getIconLink('../assets/down-arrow.svg')}`"
          expand-icon-class="expand-icon"
          @after-show="isCardDetailsExpanded = true"
          @after-hide="isCardDetailsExpanded = false"
        >
          <template #header>
            <div class="row justify-between full-width h-72">
              <div class="row items-center justify-start">
                <img
                  :src="getIconLink(`../assets/group-11889.svg`)"
                  alt="Card details"
                  class="card-details-icon"
                />
                <span>{{ t('dashboard.cardDetailsTitle') }}</span>
              </div>
            </div>
          </template>
          <q-card class="bg-blue-very-light">
            <div class="text-body2 text-gray-medium">
              <q-list separator>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="credit_card" color="blue-primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{
                      t('dashboard.cardDetails.cardNumber')
                    }}</q-item-label>
                    <q-item-label caption>
                      {{ selectedCard?.number }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="person" color="blue-primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{
                      t('dashboard.cardDetails.cardHolder')
                    }}</q-item-label>
                    <q-item-label caption>{{ selectedCard?.holder }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="schedule" color="blue-primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{
                      t('dashboard.cardDetails.expiryDate')
                    }}</q-item-label>
                    <q-item-label caption>{{ selectedCard?.expiry }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="lock" color="blue-primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">
                      {{ t('dashboard.cardDetails.cvv') }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ selectedCard?.cvv }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="payment" color="blue-primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{
                      t('dashboard.cardDetails.cardType')
                    }}</q-item-label>
                    <q-item-label caption>
                      {{
                        t(
                          'dashboard.cardVisual.type' +
                            selectedCard?.type.charAt(0).toUpperCase() +
                            selectedCard?.type.slice(1)
                        )
                      }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon
                      :name="selectedCard?.isFrozen ? 'ac_unit' : 'check_circle'"
                      :color="selectedCard?.isFrozen ? 'orange' : 'green'"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{
                      t('dashboard.cardDetails.status')
                    }}</q-item-label>
                    <q-item-label
                      caption
                      :class="selectedCard?.isFrozen ? 'text-orange' : 'text-green'"
                    >
                      {{
                        selectedCard?.isFrozen
                          ? t('dashboard.cardDetails.frozen')
                          : t('dashboard.cardDetails.active')
                      }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="calendar_today" color="blue-primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{
                      t('dashboard.cardDetails.year')
                    }}</q-item-label>
                    <q-item-label caption>{{ selectedCard?.year }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          class="side-card bg-blue-very-light"
          header-class="text-navy-dark"
          :expand-icon="`img:${getIconLink('../assets/down-arrow.svg')}`"
          expand-icon-class="expand-icon"
        >
          <template #header>
            <div class="row justify-between full-width h-72">
              <div class="row items-center justify-start">
                <img
                  :src="getIconLink(`../assets/group-11889-1.svg`)"
                  alt="Card details"
                  class="recent-transactions-icon card-details-icon"
                />
                <span>{{ t('dashboard.recentTransactionsTitle') }}</span>
              </div>
            </div>
          </template>
          <q-card class="bg-blue-very-light">
            <q-list separator>
              <q-item v-for="(tx, i) in transactions.slice(0, 4)" :key="i" class="">
                <div class="row items-center justify-between full-width">
                  <q-item-section avatar class="q-pr-none">
                    <div
                      class="q-pa-lg recent-transactions-icon-div"
                      :style="{ backgroundColor: tx.background }"
                    >
                      <img :src="getIconLink(tx.icon)" :alt="tx.type" class="tx-icon" />
                    </div>
                  </q-item-section>
                  <q-item-section>
                    <div class="row items-center justify-between">
                      <div class="column items-start">
                        <div class="text-caption text-black text-weight-bold">{{ tx.title }}</div>
                        <div class="text-caption text-gray-medium">{{ tx.date }}</div>
                        <div
                          class="text-caption text-blue-primary charged cursor-pointer row items-center justify-start full-width q-mt-sm"
                        >
                          <div class="note-type-icon q-mr-sm">
                            <img
                              :src="getIconLink('../assets/business-and-finance.svg')"
                              :alt="tx.type"
                              class="tx-icon"
                            />
                          </div>
                          {{ t(`dashboard.transactionNotes.${tx.type}`) }}
                        </div>
                      </div>
                      <div
                        class="text-weight-bold row items-center justify-end"
                        :class="tx.type === 'refund' ? 'text-green' : 'text-black'"
                      >
                        {{ tx.amount }}
                        <img :src="getIconLink('../assets/next.svg')" class="next-icon q-ml-sm" />
                      </div>
                    </div>
                  </q-item-section>
                </div>
              </q-item>
            </q-list>
            <q-btn
              no-caps
              flat
              class="bg-green-very-light text-green-primary full-width q-py-md"
              :label="t('dashboard.viewAllTransactionsButton')"
            />
          </q-card>
        </q-expansion-item>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCardsPageStore } from '../stores/cardsPage'
import { useIconPath } from '../composables/useIconPath'
import type { CardDetail, CardAction, Transaction, CardIndex } from '../types/dashboard'

const { t } = useI18n()

// Store
const cardsPageStore = useCardsPageStore()

// Use the icon path composable
const { getIconLink } = useIconPath()

// Track expansion state
const isCardDetailsExpanded = ref(false)

// Props
interface Props {
  existingDebitCards: CardDetail[]
  selectedCardIndex: CardIndex
  showCardDetails: boolean
  currencyType: string
  transactions: Transaction[]
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:selectedCardIndex': [value: CardIndex]
  'update:showCardDetails': [value: boolean]
}>()

// Computed properties
const selectedCard = computed(() => {
  return props.existingDebitCards[props.selectedCardIndex]
})

const toggleCardDetails = (): void => {
  emit('update:showCardDetails', !props.showCardDetails)
}

const toggleCardFreeze = (event?: Event): void => {
  // Prevent event propagation and default behavior
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  const currentCard: CardDetail | undefined = props.existingDebitCards[props.selectedCardIndex]
  if (currentCard) {
    const updatedCard = { ...currentCard, isFrozen: !currentCard.isFrozen }
    cardsPageStore.updateCard(props.selectedCardIndex, updatedCard)
  }
}

const cardActions = computed<CardAction[]>(() => {
  const isFrozen: boolean = selectedCard.value?.isFrozen ?? false

  return [
    {
      icon: '../assets/freeze-card.svg',
      color: 'blue-light',
      iconColor: 'blue-primary',
      labelKey: isFrozen ? 'dashboard.cardActions.unfreeze' : 'dashboard.cardActions.freeze',
    },
    {
      icon: '../assets/set-spend-limit.svg',
      color: 'blue-light',
      iconColor: 'blue-primary',
      labelKey: 'dashboard.cardActions.setSpendLimit',
    },
    {
      icon: '../assets/gPay.svg',
      color: 'blue-light',
      iconColor: 'blue-primary',
      labelKey: 'dashboard.cardActions.addToGooglePay',
    },
    {
      icon: '../assets/replace-card.svg',
      color: 'blue-light',
      iconColor: 'blue-primary',
      labelKey: 'dashboard.cardActions.replaceCard',
    },
    {
      icon: '../assets/deactivate-card.svg',
      color: 'blue-light',
      iconColor: 'blue-primary',
      labelKey: 'dashboard.cardActions.cancelCard',
    },
  ]
})
</script>

<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/color-utilities';
@import '../styles/variables';

.q-panel {
  border-radius: 12px;
}
.main-card {
  max-width: 414px;
  width: 100%;

  @media (min-width: 1024px) {
    max-width: none;
    width: 100%;
  }

  .card-actions {
    margin-top: 16px;
    background-color: $color-blue-light;
    border-radius: 0 0 12px 12px;
    padding: 20px 27px;
    border-radius: 16px;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .action-label {
        font-size: 13px;
        color: $color-navy-dark;
        white-space: normal;
        word-break: break-word;
        max-width: 61px;
        font-size: 13px;
        opacity: 100%;
        margin-top: 8px;
      }
    }
  }
}

.side-card {
  border-radius: $border-radius-lg;
  margin-bottom: 1.5rem;
}

.show-card-number {
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-family: 'Open Sans', sans-serif;
  font-weight: 700;
}

:deep(.q-carousel) {
  border-radius: $border-radius-lg;
}

.q-carousel__slide {
  padding: 0px !important;
  overflow: hidden;
}

:deep(.q-carousel__navigation--bottom) {
  bottom: 20px;
}

.card-carousel {
  border-radius: $border-radius-lg;
  margin-bottom: 1.5rem;

  .q-carousel__arrow {
    background: rgba(255, 255, 255, 0.9);
    color: $color-navy-dark;
  }

  .q-carousel__control {
    color: $color-green-primary !important;
    background: $color-white !important;
  }

  // Arrow buttons styling
  .q-carousel__arrow {
    background: rgba(255, 255, 255, 0.9) !important;
    color: $color-navy-dark !important;

    &:hover {
      background: rgba(255, 255, 255, 1) !important;
    }
  }
}
:deep(.q-carousel__navigation) {
  color: $color-green-primary !important;
}

// Navigation dots styling
.q-carousel__navigation-inner {
  .q-carousel__navigation-item {
    background: $color-green-primary;

    &--active {
      background: $color-green-primary;
    }

    &--frozen {
      background: $color-gray-light;
    }
  }
}

:deep(.q-expansion-item__content) {
  background-color: $color-white !important;
  border-radius: 0 0 12px 12px;
  .q-list {
    background-color: $color-white !important;
    border-radius: 0 0 12px 12px;
  }
}
.frozen-card {
  opacity: 0.5 !important;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.down-arrow-icon {
  transition: transform 0.3s ease;
}

.main-dashboard-card {
  padding: 40px;
  border-radius: 8px;
  border: 1px solid rgba(252, 252, 252, 1);
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08) !important;
  position: relative;
  z-index: 1;
  background-color: white;
  width: 100%;
  min-width: 100%;
  flex: 1;
}

// Desktop responsive layout
.desktop-layout {
  @media (min-width: 1024px) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 46px;
    width: 100%;
  }
}

.desktop-main-card {
  @media (min-width: 1024px) {
    flex: 1;
    max-width: calc(50% - 23px);
    min-width: 0;
    width: 100%;
  }
}

.desktop-side-section {
  @media (min-width: 1024px) {
    flex: 1;
    max-width: calc(50% - 23px);
    min-width: 0;
    width: 100%;
  }
}

.custom-card-design {
  width: 100%;
  padding: 8px;
  border: 1px solid transparent;
  border-radius: 0 2px 12px 0;
  box-sizing: border-box;
}

.eye {
  width: 16px;
  height: 16px;
}

.card-div {
  width: 414px;

  @media (min-width: 1024px) {
    width: 100%;
  }
}

.q-expansion-item {
  width: 366px;
  background-color: $color-gray;

  @media (min-width: 1024px) {
    width: 100%;
  }
}

:deep(.q-expansion-item__container) {
  border-radius: 12px;
  border: 1px solid $color-gray;
  &:hover {
    border-radius: 12px;
  }
}

:deep(.q-expansion-item__container) .q-item {
  align-items: center;
  padding: 24px 0px !important;
  transition: border-radius 0.2s;

  &:first-child {
    padding-left: 24px !important;
    padding-right: 24px !important;
  }

  &:not(:first-child) {
    margin-left: 24px;
    margin-right: 24px;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  &:first-child:hover {
    border-radius: 12px;
  }
}

.card-details-icon {
  margin-right: 12px;
}

:deep(.q-expansion-item__content) {
  .q-card {
    border-radius: 12px;
    background-color: $color-white;
  }
}

.recent-transactions-icon-div {
  width: 40px;
  height: 40px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.note-type-icon {
  width: 20px;
  height: 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-blue-primary;
}

.charged {
  font-size: 12px;
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
}

.h-72 {
  height: 48px;
}

.mt-26 {
  margin-top: 30px;
}

.q-item__section--avatar {
  min-width: 52px;
}

.logo-img {
  height: 24px;
  width: 84px;
}

.card-holder {
  margin-top: 28px;
  margin-bottom: 28px;
  font-size: 24px;
  font-weight: 700;
  font-family: 'Open Sans', sans-serif;
  color: $color-white;
}

.card-number {
  font-size: 14px;
  font-weight: 700;
  font-family: 'Open Sans', sans-serif;
  color: $color-white;
  white-space: nowrap;
  letter-spacing: 0.2em;
  display: flex;
  width: 80%;
  align-items: center;
  margin-bottom: 18px;

  .digit-group {
    display: inline-block;
    margin-right: 28px;

    &:last-child {
      margin-right: 0;
    }
  }
  .dots {
    font-size: 26px;
    line-height: 12px;
    margin-right: 21px !important;
  }
}
.thru-cvv {
  font-size: 13px;
  font-weight: 700;
  font-family: 'Open Sans', sans-serif;
  color: $color-white;
}

.star {
  font-size: 24px;
  font-weight: 700;
  font-family: 'Open Sans', sans-serif;
  color: $color-white;
  position: absolute;
  margin-left: 10px;
  margin-top: 3px;
}
.thru {
  margin-right: 30px;
}

.rounded-borders-12 {
  border-radius: 12px;
}

:deep(.q-carousel__navigation .q-btn) {
  margin: unset !important;
  padding: unset !important;
}

:deep(.q-carousel__navigation-inner) {
  .q-btn .q-icon,
  .q-btn .q-spinner {
    font-size: 12px;
  }
}
</style>
