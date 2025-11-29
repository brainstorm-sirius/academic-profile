<script setup>
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label class="block text-sm font-medium text-slate-600">
    <span class="mb-2 block font-semibold text-primary-dark">{{ label }}</span>
    <div
      class="relative rounded-2xl border border-border bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-secondary"
    >
      <select
        class="w-full border-none bg-transparent text-base text-primary-dark focus:outline-none"
        :required="required"
        :value="modelValue"
        @change="emit('update:modelValue', $event.target.value)"
      >
        <option value="" disabled hidden>{{ placeholder || 'Выберите значение' }}</option>
        <option
          v-for="option in options"
          :key="option.value || option"
          :value="option.value || option"
        >
          {{ option.label || option }}
        </option>
      </select>
    </div>
    <span v-if="error" class="mt-1 block text-sm text-red-500">{{ error }}</span>
  </label>
</template>







