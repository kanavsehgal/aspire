<template>
  <div class="top-bar row items-center justify-between q-mb-lg">
    <div class="balance-info">
      <div class="balance-label text-left">
        {{ t('dashboard.balanceLabel') }}
      </div>
      <div class="row items-center q-mt-sm">
        <q-badge class="bg-green-primary text-white q-mr-sm currency-sign-badge text-weight-bold">
          {{ currencyType }}
        </q-badge>
        <span class="balance-amount text-h4 text-navy-dark q-ml-xs q-mb-xs">
          {{ balanceAmount.toLocaleString() }}
        </span>
      </div>
    </div>
    <q-btn class="btn-new-card text-weight-bold" no-caps @click="openNewCardModal" push>
      <img
        size="lg"
        :src="getIconLink('../assets/box.svg')"
        :alt="t('dashboard.addCard')"
        class="cursor-pointer btn-new-card-img"
      />
      {{ t('dashboard.newCardButton') }}
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useIconPath } from '../composables/useIconPath'

const { t } = useI18n()
const { getIconLink } = useIconPath()
// Props
interface Props {
  currencyType: string
  balanceAmount: number
}

defineProps<Props>()

// Emits
const emit = defineEmits<{
  openNewCardModal: []
}>()

const openNewCardModal = (): void => {
  emit('openNewCardModal')
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@import '../styles/colors';
@import '../styles/color-utilities';
@import '../styles/variables';

.top-bar {
  margin-bottom: 37px;
}

.balance-info {
  .balance-amount {
    font-size: 26px;
    font-weight: 700;
    color: $color-navy-dark;
    font-family: 'Open Sans', sans-serif;
  }
}

.balance-label {
  color: $color-grey-darkest;
  font-family: 'Open Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
}

.btn-new-card {
  background: $color-blue-primary !important;
  color: $color-white-pure !important;
  border: 1px solid $color-blue-primary !important;
  padding: 10px 12px 9px 12px;
  display: flex;
  align-items: center;

  &:hover {
    background: color.adjust($color-blue-primary, $lightness: -10%) !important;
  }
}

.btn-new-card-img {
  margin-right: 8px;
}

.currency-sign-badge {
  font-size: 13px;
  padding: 4px 13px;
  font-family: 'Open Sans', sans-serif;
  height: 24px;
}
</style>
