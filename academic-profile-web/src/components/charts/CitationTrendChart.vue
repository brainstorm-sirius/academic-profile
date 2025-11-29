<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

const props = defineProps({
  series: {
    type: Array,
    default: () => []
  }
})

const chartData = computed(() => ({
  labels: props.series.map((item) => item.year),
  datasets: [
    {
      label: 'Citations',
      data: props.series.map((item) => item.value),
      borderColor: '#0E1C36',
      backgroundColor: 'rgba(14, 28, 54, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#5BC0F8',
      pointRadius: 5
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => ` ${context.raw} citations`
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#6B7280' },
      grid: { display: false }
    },
    y: {
      ticks: { color: '#6B7280' },
      grid: { color: 'rgba(148, 163, 184, 0.2)', drawBorder: false },
      beginAtZero: true
    }
  }
}
</script>

<template>
  <section class="rounded-2xl bg-white p-6 shadow-card">
    <header class="mb-4">
      <p class="text-sm uppercase tracking-[0.4em] text-secondary">Citations</p>
    </header>
    <div class="h-64">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </section>
</template>

