<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>User Management</h1>
      <div class="filters">
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search users..."
            @input="handleSearch"
          />
        </div>
        <div class="sort-controls">
          <select v-model="sortBy" @change="handleSort">
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="company.name">Company</option>
          </select>
          <button @click="toggleSortOrder" class="sort-order-btn">
            {{ sortOrder === 'asc' ? '↑' : '↓' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      Loading users...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="user-grid">
      <div v-for="user in filteredUsers" :key="user.id" class="user-card" @click="navigateToUserDetail(user.id)">
        <h3>{{ user.name }}</h3>
        <p class="email">{{ user.email }}</p>
        <p class="company">{{ user.company.name }}</p>
        <div class="user-details">
          <p><strong>Phone:</strong> {{ user.phone }}</p>
          <p><strong>Website:</strong> {{ user.website }}</p>
          <p><strong>Address:</strong> {{ formatAddress(user.address) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const searchQuery = ref('')
const sortBy = ref('name')
const sortOrder = ref('asc')
const router = useRouter()

const loading = computed(() => userStore.loading)
const error = computed(() => userStore.error)
const filteredUsers = computed(() => userStore.filteredUsers)

const handleSearch = () => {
  userStore.setFilter({ search: searchQuery.value })
}

const handleSort = () => {
  userStore.setFilter({ sortBy: sortBy.value })
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  userStore.setFilter({ sortOrder: sortOrder.value })
}

const formatAddress = (address) => {
  return `${address.street}, ${address.suite}, ${address.city}, ${address.zipcode}`
}

const navigateToUserDetail = (userId) => {
  router.push(`/user/${userId}`)
}

onMounted(() => {
  userStore.fetchUsers()
})
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 2rem 0;
}

.dashboard-header {
  margin-bottom: 2rem;

  h1 {
    margin-bottom: 1rem;
  }
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.search-box {
  flex: 1;
  min-width: 200px;

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
}

.sort-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;

  select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    background-color: white;
  }

  .sort-order-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
      background-color: #f5f5f5;
    }
  }
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
  }

  h3 {
    margin-bottom: 0.5rem;
    color: var(--primary-color);
  }

  .email {
    color: #666;
    margin-bottom: 0.5rem;
  }

  .company {
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .user-details {
    font-size: 0.9rem;
    
    p {
      margin-bottom: 0.25rem;
    }
  }
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #dc3545;
}
</style> 