<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  author: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const goToAuthor = () => {
  const authorId = props.author.author_id || props.author.id
  if (authorId) {
    router.push(`/author?id=${authorId}`)
  }
}

const getAuthorName = () => {
  if (props.author.author_name) {
    return props.author.author_name
  }
  if (props.author.name) {
    return props.author.name
  }
  if (props.author.first_name && props.author.last_name) {
    return `${props.author.first_name} ${props.author.last_name}`
  }
  return 'Unknown Author'
}
</script>

<template>
  <article
    class="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card transition hover:shadow-lg cursor-pointer"
    @click="goToAuthor"
  >
    <div class="flex-shrink-0">
      <img
        src="/src/assets/img/avatar.png"
        :alt="getAuthorName()"
        class="h-16 w-16 rounded-full object-cover"
      />
    </div>
    <div class="flex-1">
      <h3 class="text-lg font-semibold text-primary-dark">{{ getAuthorName() }}</h3>
      <p v-if="author.main_interest || author.interest" class="mt-1 text-sm text-muted">
        {{ author.main_interest || author.interest }}
      </p>
    </div>
  </article>
</template>

