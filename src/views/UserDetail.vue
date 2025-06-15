<template>
  <div class="user-detail">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="user" class="user-info">
      <h1>{{ user.name }}</h1>
      <div class="info-grid">
        <div class="info-item">
          <strong>Email:</strong>
          <span>{{ user.email }}</span>
        </div>
        <div class="info-item">
          <strong>Phone:</strong>
          <span>{{ user.phone }}</span>
        </div>
        <div class="info-item">
          <strong>Website:</strong>
          <span>{{ user.website }}</span>
        </div>
        <div class="info-item">
          <strong>Company:</strong>
          <span>{{ user.company?.name }}</span>
        </div>
        <div class="info-item">
          <strong>Address:</strong>
          <span>
            {{ user.address?.street }}, {{ user.address?.suite }}<br>
            {{ user.address?.city }}, {{ user.address?.zipcode }}
          </span>
        </div>
        <div class="info-item">
          <strong>Number of posts:</strong>
          <span>
            {{ user.posts?.length }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'

const route = useRoute()
const userId = route.params.id
const userStore = useUserStore()
const { currentUser: user, loading, error } = storeToRefs(userStore)

onMounted(() => {
  userStore.fetchUserDetail(userId)
})
</script>

<style scoped>
.user-detail {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
}

.error {
  color: #dc3545;
}

.info-grid {
  display: grid;
  gap: 20px;
  margin-top: 20px;
}

.info-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.info-item strong {
  display: block;
  margin-bottom: 5px;
  color: #495057;
}
</style>