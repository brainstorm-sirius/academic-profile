<script setup>
import { computed, ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
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
  },
  showPasswordToggle: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: String,
    default: 'off'
  }
})

const emit = defineEmits(['update:modelValue'])
const reveal = ref(false)

const inputType = computed(() => {
  if (props.showPasswordToggle && props.type === 'password') {
    return reveal.value ? 'text' : 'password'
  }
  return props.type
})

const toggleReveal = () => {
  reveal.value = !reveal.value
}
</script>

<template>
  <label class="block text-sm font-medium text-slate-600">
    <span class="mb-2 block font-semibold text-primary-dark">{{ label }}</span>
    <div
      class="relative flex items-center rounded-2xl border border-border bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-secondary"
    >
      <input
        :type="inputType"
        class="w-full border-none bg-transparent text-base text-primary-dark placeholder:text-muted focus:outline-none"
        :placeholder="placeholder"
        :value="modelValue"
        :required="required"
        :autocomplete="autocomplete"
        @input="emit('update:modelValue', $event.target.value)"
      />
      <button
        v-if="showPasswordToggle"
        type="button"
        class="ml-3 text-slate-500 transition hover:text-primary"
        @click="toggleReveal"
      >
        <Eye v-if="!reveal" class="h-5 w-5" />
        <EyeOff v-else class="h-5 w-5" />
      </button>
    </div>
    <span v-if="error" class="mt-1 block text-sm text-red-500">{{ error }}</span>
  </label>
</template>







