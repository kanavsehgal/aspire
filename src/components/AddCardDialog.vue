<template>
  <q-dialog v-model="showModal">
    <q-card class="q-pa-md" style="max-width: 400px">
      <q-card-section class="text-h6 text-navy-dark">
        {{ t('dashboard.newCardModalTitle') }}
      </q-card-section>
      <q-card-section>
        <q-form @submit="handleSubmit">
          <q-input
            v-model="form.holder"
            :label="t('dashboard.newCardModalHolderLabel') + ' *'"
            class="q-mb-md required-field"
            outlined
            dense
            :rules="[
              (val) => !!val || t('dashboard.newCardModalHolderError'),
              (val) => val.length >= 2 || t('dashboard.newCardModalHolderMinLengthError'),
              (val) => /^[a-zA-Z\s]+$/.test(val) || t('dashboard.newCardModalHolderFormatError'),
            ]"
          />
          <q-input
            v-model="form.cardNumber"
            :label="t('dashboard.newCardModalCardNumberLabel') + ' *'"
            class="q-mb-md required-field"
            outlined
            dense
            mask="#### #### #### ####"
            :rules="[
              (val) => !!val || t('dashboard.newCardModalCardNumberError'),
              (val) =>
                val.replace(/\s/g, '').length === 16 ||
                t('dashboard.newCardModalCardNumberLengthError'),
              (val) =>
                /^\d+$/.test(val.replace(/\s/g, '')) ||
                t('dashboard.newCardModalCardNumberFormatError'),
            ]"
          />
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input
                v-model="form.validThru"
                :label="t('dashboard.newCardModalValidThruLabel') + ' *'"
                class="q-mb-md required-field"
                outlined
                dense
                mask="##/##"
                :rules="[
                  (val) => !!val || t('dashboard.newCardModalValidThruError'),
                  (val) =>
                    /^\d{2}\/\d{2}$/.test(val) || t('dashboard.newCardModalValidThruFormatError'),
                  (val) => {
                    const [month, _year] = val.split('/')
                    const monthNum = parseInt(month)
                    return (
                      (monthNum >= 1 && monthNum <= 12) ||
                      t('dashboard.newCardModalValidThruMonthError')
                    )
                  },
                  (val) => {
                    const [_month, year] = val.split('/')
                    const yearNum = parseInt(year)
                    const currentYear = new Date().getFullYear() % 100
                    return yearNum >= currentYear || t('dashboard.newCardModalValidThruYearError')
                  },
                ]"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="form.cvv"
                :label="t('dashboard.newCardModalCvvLabel') + ' *'"
                class="q-mb-md required-field"
                outlined
                dense
                mask="###"
                :rules="[
                  (val) => !!val || t('dashboard.newCardModalCvvError'),
                  (val) => val.length === 3 || t('dashboard.newCardModalCvvLengthError'),
                  (val) => /^\d{3}$/.test(val) || t('dashboard.newCardModalCvvFormatError'),
                ]"
              />
            </div>
          </div>
          <q-select
            v-model="form.cardProvider"
            :options="cardProviderOptions"
            :label="t('dashboard.newCardModalCardProviderLabel') + ' *'"
            class="q-mb-md card-provider-select required-field"
            outlined
            dense
            :rules="[(val) => !!val || t('dashboard.newCardModalCardProviderError')]"
            option-value="value"
            option-label="label"
          >
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label :class="{ 'text-secondary': !scope.selected }">
                    {{ scope.opt.label }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input
            v-model="form.bank"
            :label="t('dashboard.newCardModalBankLabel') + ' *'"
            class="q-mb-md required-field"
            outlined
            dense
            :rules="[
              (val) => !!val || t('dashboard.newCardModalBankError'),
              (val) => val.length >= 2 || t('dashboard.newCardModalBankMinLengthError'),
              (val) => /^[a-zA-Z\s]+$/.test(val) || t('dashboard.newCardModalBankFormatError'),
            ]"
          />
          <div class="row justify-end q-gutter-sm">
            <q-btn
              flat
              class="btn-cancel"
              :label="t('dashboard.newCardModalCancelButton')"
              @click="handleCancel"
            />
            <q-btn
              type="submit"
              class="btn-submit"
              :label="t('dashboard.newCardModalAddButton')"
              :disabled="!isFormValid"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { CardType } from '../types/dashboard'
import type { NewCardForm, CardProviderOption, CardDetail } from '../types/dashboard'

const { t } = useI18n()
const $q = useQuasar()

// Props
interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:existingDebitCards': [cards: CardDetail[]]
  'update:selectedCardIndex': [index: number]
}>()

// Reactive data
const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const cardProviderOptions: CardProviderOption[] = [
  { label: 'Visa', value: CardType.VISA },
  { label: 'Mastercard', value: CardType.MASTERCARD },
]

const form = ref<NewCardForm>({
  holder: '',
  cvv: '',
  validThru: '',
  cardNumber: '',
  cardProvider: CardType.VISA,
  bank: '',
})

// Computed property to check if form is valid
const isFormValid = computed((): boolean => {
  const formData = form.value
  return Boolean(
    formData.holder.trim() &&
      formData.cardNumber.trim() &&
      formData.validThru.trim() &&
      formData.cvv.trim() &&
      formData.cardProvider &&
      formData.bank.trim()
  )
})

// Utility to generate a random 16-digit card number in format '#### #### #### ####'
function generateRandomCardNumber(): string {
  let num = ''
  for (let i = 0; i < 16; i++) {
    num += Math.floor(Math.random() * 10)
    if ((i + 1) % 4 === 0 && i !== 15) num += ' '
  }
  return num
}

// Utility to generate a random valid expiration date (MM/YY), at least current month/year or later
function generateRandomValidThru(): string {
  const now = new Date()
  const currentYear = now.getFullYear() % 100
  const currentMonth = now.getMonth() + 1
  // Pick a random year between this year and +5 years
  const year = currentYear + Math.floor(Math.random() * 6)
  // If this year, pick a month >= currentMonth, else 1-12
  const month = year === currentYear
    ? currentMonth + Math.floor(Math.random() * (13 - currentMonth))
    : 1 + Math.floor(Math.random() * 12)
  return `${month.toString().padStart(2, '0')}/${year.toString().padStart(2, '0')}`
}

// Watch for modal state changes to reset form
watch(showModal, (newValue: boolean) => {
  if (newValue) {
    // Modal is shown, generate random card number and validThru
    form.value.cardNumber = generateRandomCardNumber()
    form.value.validThru = generateRandomValidThru()
  } else {
    // Modal is hidden, reset the form data only (don't close modal again)
    resetForm(false)
  }
})

// Helper functions
const resetForm = (closeModal: boolean = true): void => {
  form.value = {
    holder: '',
    cvv: '',
    validThru: generateRandomValidThru(),
    cardNumber: generateRandomCardNumber(),
    cardProvider: CardType.VISA,
    bank: '',
  }
  if (closeModal) {
    showModal.value = false
  }
}

const handleSubmit = (): void => {
  const formData = form.value
  if (
    formData.holder.trim() &&
    formData.cvv.trim() &&
    formData.validThru.trim() &&
    formData.cardNumber.trim() &&
    formData.bank.trim()
  ) {
    const newCard: CardDetail = {
      holder: formData.holder,
      logo: '/src/assets/aspireLogo1.svg',
      number: formData.cardNumber,
      expiry: formData.validThru,
      cvv: formData.cvv,
      year: new Date().getFullYear().toString(),
      type: formData.cardProvider,
      isFrozen: false,
    }

    // Emit the new card and update selected index
    emit('update:existingDebitCards', [newCard])
    emit('update:selectedCardIndex', 0)

    // Reset form and close modal
    resetForm()

    // Show success notification
    $q.notify({
      message: t('dashboard.newCardSuccessMessage'),
      color: 'green',
      icon: 'check_circle',
      position: 'top-right',
      timeout: 3000,
    })
  }
}

const handleCancel = (): void => {
  resetForm()
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@import '../styles/colors';
@import '../styles/color-utilities';
@import '../styles/_variables.scss';

.btn-cancel {
  background: $color-gray-light !important;
  color: $color-gray-medium !important;
  border: 1px solid $color-gray-light !important;

  &:hover {
    background: $color-gray-medium !important;
    color: $color-white-pure !important;
  }
}

.btn-submit {
  background: $color-blue-primary !important;
  color: $color-white-pure !important;
  border: 1px solid $color-blue-primary !important;

  &:hover {
    background: color.adjust($color-blue-primary, $lightness: -10%) !important;
  }

  &:disabled {
    background: $color-gray-light !important;
    color: $color-gray-medium !important;
    border: 1px solid $color-gray-light !important;
    cursor: not-allowed;

    &:hover {
      background: $color-gray-light !important;
    }
  }
}

.card-provider-select {
  .q-field__control {
    color: $color-navy-dark !important;
  }

  .q-item {
    color: $color-gray-medium !important;
    text-transform: none !important;

    &.q-item--active {
      color: $color-navy-dark !important;
      background: $color-blue-light !important;
    }

    &:hover {
      background: $color-blue-very-light !important;
    }
  }

  .q-field__native {
    color: $color-navy-dark !important;
    text-transform: none !important;
  }

  .q-item-label {
    text-transform: none !important;
    font-variant: normal !important;
  }
}

.required-field {
  .q-field__label {
    &::after {
      content: ' *';
      color: $color-red-primary;
    }
  }
}
</style>
