<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Network } from 'vis-network'
import 'vis-network/styles/vis-network.css'

const props = defineProps({
  nodes: {
    type: Array,
    default: () => []
  },
  edges: {
    type: Array,
    default: () => []
  }
})

const networkContainer = ref(null)
let network = null

const options = {
  nodes: {
    borderWidth: 2,
    shadow: true,
    font: {
      size: 14,
      face: 'Arial'
    }
  },
  edges: {
    width: 2,
    shadow: true,
    smooth: {
      type: 'continuous',
      roundness: 0.5
    }
  },
  physics: {
    enabled: true,
    stabilization: {
      enabled: true,
      iterations: 200,
      fit: true
    },
    barnesHut: {
      gravitationalConstant: -2000,
      centralGravity: 0.1,
      springLength: 200,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0.5
    }
  },
  interaction: {
    hover: true,
    tooltipDelay: 100,
    zoomView: true,
    dragView: true
  },
  layout: {
    improvedLayout: true,
    hierarchical: {
      enabled: false
    }
  }
}

const initializeNetwork = () => {
  if (!networkContainer.value) return

  const data = {
    nodes: props.nodes,
    edges: props.edges
  }

  network = new Network(networkContainer.value, data, options)

  // Обработчики событий
  network.on('click', (params) => {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0]
      const node = props.nodes.find(n => n.id === nodeId)
      if (node) {
        console.log('Clicked node:', node)
      }
    }
  })

  network.on('hoverNode', (params) => {
    networkContainer.value.style.cursor = 'pointer'
  })

  network.on('blurNode', () => {
    networkContainer.value.style.cursor = 'default'
  })
}

const updateNetwork = () => {
  if (!network) return

  const data = {
    nodes: props.nodes,
    edges: props.edges
  }

  network.setData(data)
}

onMounted(async () => {
  await nextTick()
  if (props.nodes.length > 0 || props.edges.length > 0) {
    initializeNetwork()
  }
})

onBeforeUnmount(() => {
  if (network) {
    network.destroy()
    network = null
  }
})

watch(
  () => [props.nodes, props.edges],
  () => {
    if (network && (props.nodes.length > 0 || props.edges.length > 0)) {
      updateNetwork()
    } else if (!network && (props.nodes.length > 0 || props.edges.length > 0)) {
      initializeNetwork()
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="knowledge-graph-container">
    <div ref="networkContainer" class="network-canvas"></div>
  </div>
</template>

<style scoped>
.knowledge-graph-container {
  width: 100%;
  height: 100%;
}

.network-canvas {
  width: 100%;
  height: 85vh;
  min-height: 800px;
  border-radius: 1rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  display: block;
}

:deep(.vis-network) {
  outline: none;
  width: 100% !important;
  height: 100% !important;
}

:deep(.vis-network canvas) {
  width: 100% !important;
  height: 100% !important;
}

:deep(.vis-tooltip) {
  position: absolute;
  visibility: hidden;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
}
</style>

