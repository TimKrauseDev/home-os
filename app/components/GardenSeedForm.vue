<script setup lang="ts">
import type {
  NewSowingWindow,
  SeedCatalogRow,
  SeedForm,
  SeedInsert,
  SeedUpdate
} from '~/types/gardening'
import { cleanText } from '~/utils/form'
import {
  optionalSeedDepthItems,
  optionalSowMethodItems,
  sowDirectionItems,
  sowMethodFormItems,
  sowReferenceItems,
  sunTypeItems
} from '~/utils/options/gardening'

const props = defineProps<{
  seed?: SeedCatalogRow | null
  resetKey?: number
}>()

const emit = defineEmits<{
  cancel: []
  saved: []
}>()

const isSavingSeed = ref(false)
const isFetchingPreviewImage = ref(false)
const seedFormError = ref<string | null>(null)
const toast = useToast()

const buildEmptySeedForm = (): SeedForm => ({
  location_number: '',
  type: '',
  variety: '',
  recommended_sow_method: null,
  is_succession_planted: false,
  succession_interval_days: null,
  days_to_emerge: null,
  days_to_maturity: null,
  seed_depth_inches: null,
  row_spacing_inches: null,
  is_deer_resistant: false,
  sun_type: 'unknown',
  purchased_from: '',
  source_page_url: '',
  source_image_url: '',
  overall_rating: null,
  notes: ''
})

const buildEmptySowingWindow = (): NewSowingWindow => ({
  sow_method: 'inside',
  sow_reference: 'last_frost',
  sow_direction: 'before',
  sow_start_weeks: 0,
  sow_end_weeks: 0,
  notes: ''
})

const seedForm = reactive<SeedForm>(buildEmptySeedForm())
const newSowingWindows = ref<NewSowingWindow[]>([buildEmptySowingWindow()])
const isEditing = computed(() => Boolean(props.seed))
const submitLabel = computed(() => isEditing.value ? 'Update Seed' : 'Save Seed')

const populateSeedForm = (seed: SeedCatalogRow) => {
  Object.assign(seedForm, {
    location_number: seed.location_number ?? '',
    type: seed.type,
    variety: seed.variety,
    recommended_sow_method: seed.recommended_sow_method,
    is_succession_planted: seed.is_succession_planted,
    succession_interval_days: seed.succession_interval_days,
    days_to_emerge: seed.days_to_emerge,
    days_to_maturity: seed.days_to_maturity,
    seed_depth_inches: seed.seed_depth_inches,
    row_spacing_inches: seed.row_spacing_inches,
    is_deer_resistant: seed.is_deer_resistant ?? false,
    sun_type: seed.sun_type,
    purchased_from: seed.purchased_from ?? '',
    source_page_url: seed.source_page_url ?? '',
    source_image_url: seed.source_image_url ?? '',
    overall_rating: seed.overall_rating,
    notes: seed.notes ?? ''
  })
  newSowingWindows.value = seed.garden_seed_sowing_windows.length
    ? seed.garden_seed_sowing_windows.map(window => ({
        sow_method: window.sow_method,
        sow_reference: window.sow_reference,
        sow_direction: window.sow_direction,
        sow_start_weeks: window.sow_start_weeks,
        sow_end_weeks: window.sow_end_weeks,
        notes: window.notes ?? ''
      }))
    : [buildEmptySowingWindow()]
}

const resetSeedForm = () => {
  if (props.seed) {
    populateSeedForm(props.seed)
  } else {
    Object.assign(seedForm, buildEmptySeedForm())
    newSowingWindows.value = [buildEmptySowingWindow()]
  }

  seedFormError.value = null
}

watch(() => props.resetKey, () => {
  resetSeedForm()
})

watch(() => props.seed, () => {
  resetSeedForm()
}, { immediate: true })

const addSowingWindow = () => {
  newSowingWindows.value.push(buildEmptySowingWindow())
}

const removeSowingWindow = (index: number) => {
  newSowingWindows.value.splice(index, 1)
}

const fetchPreviewImage = async () => {
  seedFormError.value = null

  if (!seedForm.source_page_url.trim()) {
    seedFormError.value = 'Add a source page URL before fetching a preview image.'
    return null
  }

  isFetchingPreviewImage.value = true

  try {
    const previewImage = await $fetch<{ sourceImageUrl: string }>('/api/gardening/preview-image', {
      method: 'POST',
      body: {
        url: seedForm.source_page_url.trim()
      }
    })

    seedForm.source_image_url = previewImage.sourceImageUrl

    return previewImage.sourceImageUrl
  } catch (error) {
    seedFormError.value = error instanceof Error
      ? error.message
      : 'No preview image could be found for that source page.'

    return null
  } finally {
    isFetchingPreviewImage.value = false
  }
}

const validateSeedForm = () => {
  if (!seedForm.type.trim()) return 'Type is required.'
  if (!seedForm.variety.trim()) return 'Variety is required.'

  const invalidWindow = newSowingWindows.value.find(window => window.sow_end_weeks < window.sow_start_weeks)

  if (invalidWindow) return 'Sowing window end week must be greater than or equal to the start week.'

  return null
}

const saveSeed = async () => {
  seedFormError.value = validateSeedForm()

  if (seedFormError.value) return

  isSavingSeed.value = true
  const seedName = `${seedForm.variety.trim()} ${seedForm.type.trim()}`

  try {
    if (seedForm.source_page_url.trim() && !seedForm.source_image_url.trim()) {
      await fetchPreviewImage()
    }

    const seedPayload: SeedInsert | SeedUpdate = {
      location_number: cleanText(seedForm.location_number),
      type: seedForm.type.trim(),
      variety: seedForm.variety.trim(),
      recommended_sow_method: seedForm.recommended_sow_method,
      is_succession_planted: seedForm.is_succession_planted,
      succession_interval_days: seedForm.is_succession_planted ? seedForm.succession_interval_days : null,
      days_to_emerge: seedForm.days_to_emerge,
      days_to_maturity: seedForm.days_to_maturity,
      seed_depth_inches: seedForm.seed_depth_inches,
      row_spacing_inches: seedForm.row_spacing_inches,
      is_deer_resistant: seedForm.is_deer_resistant,
      sun_type: seedForm.sun_type,
      purchased_from: cleanText(seedForm.purchased_from),
      source_page_url: cleanText(seedForm.source_page_url),
      source_image_url: cleanText(seedForm.source_image_url),
      overall_rating: seedForm.overall_rating,
      notes: cleanText(seedForm.notes)
    }
    const seedId = props.seed?.id
    const sowingWindows = newSowingWindows.value.map(window => ({
      sow_method: window.sow_method,
      sow_reference: window.sow_reference,
      sow_direction: window.sow_direction,
      sow_start_weeks: window.sow_start_weeks,
      sow_end_weeks: window.sow_end_weeks,
      notes: cleanText(window.notes)
    }))

    if (isEditing.value && seedId) {
      await $fetch(`/api/gardening/seeds/${seedId}`, {
        method: 'PUT',
        body: {
          seed: seedPayload,
          sowingWindows
        }
      })
    } else {
      await $fetch('/api/gardening/seeds', {
        method: 'POST',
        body: {
          seed: seedPayload as SeedInsert,
          sowingWindows
        }
      })
    }

    resetSeedForm()
    toast.add({
      title: isEditing.value ? 'Seed updated' : 'Seed added',
      description: `${seedName} was ${isEditing.value ? 'updated' : 'added to the catalog'}.`,
      icon: 'i-lucide-sprout',
      color: 'success'
    })
    emit('saved')
  } catch (error) {
    seedFormError.value = error instanceof Error
      ? error.message
      : 'Seed could not be saved.'
    toast.add({
      title: 'Seed could not be saved',
      description: seedFormError.value,
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    isSavingSeed.value = false
  }
}
</script>

<template>
  <div class="max-h-[75vh] overflow-y-auto pr-1">
    <UForm
      :state="seedForm"
      class="flex flex-col gap-5"
      @submit="saveSeed"
    >
      <UAlert
        v-if="seedFormError"
        title="Seed could not be saved"
        :description="seedFormError"
        color="error"
        icon="i-lucide-triangle-alert"
      />

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UFormField label="Location" name="location_number">
          <UInput v-model="seedForm.location_number" placeholder="S-001" />
        </UFormField>

        <UFormField label="Type" name="type" required>
          <UInput v-model="seedForm.type" placeholder="Tomato" />
        </UFormField>

        <UFormField label="Variety" name="variety" required>
          <UInput v-model="seedForm.variety" placeholder="Black Krim" />
        </UFormField>

        <UFormField label="Recommended Sow" name="recommended_sow_method">
          <USelect
            v-model="seedForm.recommended_sow_method"
            :items="optionalSowMethodItems"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Sun" name="sun_type">
          <USelect
            v-model="seedForm.sun_type"
            :items="sunTypeItems"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Seed Depth" name="seed_depth_inches">
          <USelect
            v-model="seedForm.seed_depth_inches"
            :items="optionalSeedDepthItems"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Days To Emerge" name="days_to_emerge">
          <UInputNumber v-model="seedForm.days_to_emerge" :min="1" />
        </UFormField>

        <UFormField label="Days To Maturity" name="days_to_maturity">
          <UInputNumber v-model="seedForm.days_to_maturity" :min="1" />
        </UFormField>

        <UFormField label="Row Spacing" name="row_spacing_inches">
          <UInputNumber v-model="seedForm.row_spacing_inches" :min="0" />
        </UFormField>

        <UFormField label="Rating" name="overall_rating">
          <UInputNumber v-model="seedForm.overall_rating" :min="1" :max="5" />
        </UFormField>

        <UFormField
          label="Purchased From"
          name="purchased_from"
          class="lg:col-span-2"
        >
          <UInput v-model="seedForm.purchased_from" placeholder="Botanical Interests" />
        </UFormField>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <UCheckbox
          v-model="seedForm.is_deer_resistant"
          label="Deer resistant"
        />
        <div class="grid gap-3 sm:grid-cols-[1fr_10rem]">
          <UCheckbox
            v-model="seedForm.is_succession_planted"
            label="Succession planted"
          />
          <UInputNumber
            v-if="seedForm.is_succession_planted"
            v-model="seedForm.succession_interval_days"
            :min="1"
            placeholder="Days"
          />
        </div>
      </div>

      <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
        <UFormField label="Source Page URL" name="source_page_url">
          <UInput v-model="seedForm.source_page_url" placeholder="https://..." />
        </UFormField>

        <UFormField label="Cached Image URL" name="source_image_url">
          <UInput
            v-model="seedForm.source_image_url"
            placeholder="Fetched from source page or entered manually"
          />
        </UFormField>

        <UButton
          label="Fetch Image"
          icon="i-lucide-image-plus"
          color="neutral"
          variant="outline"
          :loading="isFetchingPreviewImage"
          class="w-fit"
          @click="() => { void fetchPreviewImage() }"
        />
      </div>

      <UFormField label="Notes" name="notes">
        <UTextarea v-model="seedForm.notes" :rows="3" />
      </UFormField>

      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between gap-3">
          <p class="font-medium">
            Sowing Windows
          </p>
          <UButton
            label="Add Window"
            icon="i-lucide-plus"
            color="neutral"
            variant="outline"
            size="sm"
            @click="addSowingWindow"
          />
        </div>

        <div
          v-for="(window, index) in newSowingWindows"
          :key="index"
          class="grid gap-3 rounded-md border border-default p-3 lg:grid-cols-[8rem_9rem_8rem_7rem_7rem_minmax(0,1fr)_auto]"
        >
          <UFormField label="Method">
            <USelect
              v-model="window.sow_method"
              :items="sowMethodFormItems"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Reference">
            <USelect
              v-model="window.sow_reference"
              :items="sowReferenceItems"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Direction">
            <USelect
              v-model="window.sow_direction"
              :items="sowDirectionItems"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Start (weeks)">
            <UInputNumber v-model="window.sow_start_weeks" :min="0" />
          </UFormField>
          <UFormField label="End (weeks)">
            <UInputNumber v-model="window.sow_end_weeks" :min="0" />
          </UFormField>
          <UFormField label="Notes">
            <UInput v-model="window.notes" />
          </UFormField>
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            :disabled="newSowingWindows.length === 1"
            aria-label="Remove sowing window"
            class="self-end"
            @click="removeSowingWindow(index)"
          />
        </div>
      </div>

      <div class="flex flex-col-reverse gap-2 border-t border-default pt-4 sm:flex-row sm:justify-end">
        <UButton
          label="Cancel"
          color="neutral"
          variant="outline"
          type="button"
          @click="emit('cancel')"
        />
        <UButton
          :label="submitLabel"
          icon="i-lucide-save"
          type="submit"
          :loading="isSavingSeed"
        />
      </div>
    </UForm>
  </div>
</template>
