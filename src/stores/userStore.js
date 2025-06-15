import { defineStore } from 'pinia'
import axios from 'axios'
import { get } from 'lodash-es'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    filters: {
      search: '',
      sortBy: 'name',
      sortOrder: 'asc'
    }
  }),

  getters: {
    filteredUsers: (state) => {
      let result = [...state.users]
      
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        result = result.filter(user => 
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        )
      }
      
      result.sort((a, b) => {
        const aValue = get(a, state.filters.sortBy)
        const bValue = get(b, state.filters.sortBy)
        const modifier = state.filters.sortOrder === 'asc' ? 1 : -1
        
        return aValue.localeCompare(bValue) * modifier
      })
      
      return result
    }
  },

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users')
        this.users = response.data
      } catch (error) {
        this.error = 'Failed to fetch users. Please try again later.'
        console.error('Error fetching users:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchUserDetail(userId) {
      this.loading = true
      this.error = null
      
      try {
        const [userResponse, postsResponse] = await Promise.all([
          axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`),
          axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        ])
        this.currentUser = userResponse.data
        this.currentUser.posts = postsResponse.data
      } catch (error) {
        this.error = 'Failed to fetch user details. Please try again later.'
        console.error('Error fetching user details:', error)
      } finally {
        this.loading = false
      }
    },

    setFilter(filter) {
      this.filters = { ...this.filters, ...filter }
    }
  }
}) 