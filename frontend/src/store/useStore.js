import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),

      // Cart
      cart: [],
      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id)
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                  : item
              ),
            }
          }
          return { cart: [...state.cart, { ...product, quantity: product.quantity || 1 }] }
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
          ),
        })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const state = get()
        return state.cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
      getCartCount: () => {
        const state = get()
        return state.cart.reduce((count, item) => count + item.quantity, 0)
      },

      // Wishlist
      wishlist: [],
      addToWishlist: (product) =>
        set((state) => {
          const exists = state.wishlist.find((item) => item.id === product.id)
          if (exists) return { wishlist: state.wishlist }
          return { wishlist: [...state.wishlist, product] }
        }),
      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== productId),
        })),
      isInWishlist: (productId) => {
        const state = get()
        return state.wishlist.some((item) => item.id === productId)
      },

      // Theme
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // Filters
      filters: {
        category: '',
        priceRange: [0, 100000],
        rating: 0,
        sortBy: 'newest',
      },
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
      })),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Orders
      orders: [],
      setOrders: (orders) => set({ orders }),
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),
    }),
    {
      name: 'novacart-store',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        isDarkMode: state.isDarkMode,
        token: state.token,
        user: state.user,
      }),
    }
  )
)
