<script setup>
import { computed } from 'vue'

const props = defineProps({
  collaborators: {
    type: Array,
    default: () => []
  }
})

const size = 320
const center = size / 2
const radius = 110

const nodes = computed(() =>
  props.collaborators.map((person, index, arr) => {
    const angle = (index / arr.length) * 2 * Math.PI - Math.PI / 2
    const x = center + radius * Math.cos(angle)
    const y = center + radius * Math.sin(angle)
    return { ...person, x, y }
  })
)
</script>

<template>
  <section id="graph" class="rounded-2xl bg-white p-6 shadow-card">
    <header class="mb-4">
      <p class="text-sm uppercase tracking-[0.4em] text-secondary">Network</p>
      <h3 class="text-2xl font-bold text-primary-dark">Граф соавторств</h3>
    </header>

    <div class="flex flex-col gap-6 lg:flex-row">
      <div class="relative h-[320px] w-full lg:w-[360px]">
        <svg :viewBox="`0 0 ${size} ${size}`" class="h-full w-full">
          <circle
            :cx="center"
            :cy="center"
            :r="radius + 10"
            class="fill-none stroke-border"
            stroke-dasharray="8 12"
          />
          <g>
            <line
              v-for="node in nodes"
              :key="`line-${node.name}`"
              :x1="center"
              :y1="center"
              :x2="node.x"
              :y2="node.y"
              stroke="#A5B4FC"
              stroke-width="2"
              stroke-linecap="round"
            />
          </g>
          <circle :cx="center" :cy="center" r="40" class="fill-secondary/40" />
          <text
            :x="center"
            :y="center"
            text-anchor="middle"
            dominant-baseline="central"
            class="fill-primary-dark text-sm font-semibold"
          >
            Вы
          </text>
          <g>
            <g v-for="node in nodes" :key="node.name">
              <circle :cx="node.x" :cy="node.y" r="18" class="fill-primary/90" />
              <text
                :x="node.x"
                :y="node.y"
                text-anchor="middle"
                dominant-baseline="central"
                class="fill-white text-[10px] font-semibold"
              >
                {{ node.name.split(' ')[0] }}
              </text>
            </g>
          </g>
        </svg>
      </div>
      <div class="flex-1 space-y-4">
        <article
          v-for="node in collaborators"
          :key="node.name"
          class="rounded-2xl border border-border bg-surface/60 px-4 py-3"
        >
          <p class="text-base font-semibold text-primary-dark">{{ node.name }}</p>
          <p class="text-sm text-muted">{{ node.field }}</p>
          <div class="mt-2 h-2 rounded-full bg-white">
            <div
              class="h-2 rounded-full bg-secondary"
              :style="{ width: `${node.weight * 100}%` }"
            />
          </div>
        </article>
      </div>
    </div>
  </section>
</template>






