import { ref, computed } from 'vue'

export const useCart = () => {
  const cart = ref([])
  const savedForLater = ref([])
  const recentlyViewed = ref([])

  // Computed properties
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity)
    }, 0)
  })

  const cartItemCount = computed(() => {
    return cart.value.reduce((count, item) => count + item.quantity, 0)
  })

  const shippingCost = computed(() => {
    return cartTotal.value >= 50 ? 0 : 4.99
  })

  const remainingForFreeShipping = computed(() => {
    return Math.max(0, 50 - cartTotal.value)
  })

  const freeShippingProgress = computed(() => {
    return Math.min(100, (cartTotal.value / 50) * 100)
  })

  // Cart Methods
  const addToCart = (product) => {
    cart.value.push({
      ...product,
      quantity: product.quantity || 1,
      selectedSize: product.selectedSize || null,
      selectedColor: product.selectedColor || null
    })
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }

  const removeFromCart = (index) => {
    cart.value.splice(index, 1)
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }

  const updateCartItemQuantity = ({ index, quantity }) => {
    if (quantity < 1) return
    cart.value[index].quantity = quantity
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }

  const clearCart = () => {
    cart.value = []
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }

  const moveToSavedForLater = (index) => {
    const item = cart.value[index]
    savedForLater.value.push(item)
    removeFromCart(index)
    localStorage.setItem('savedForLater', JSON.stringify(savedForLater.value))
  }

  const moveToCart = (index) => {
    const item = savedForLater.value[index]
    addToCart(item)
    savedForLater.value.splice(index, 1)
    localStorage.setItem('savedForLater', JSON.stringify(savedForLater.value))
  }

  const addToRecentlyViewed = (product) => {
    const index = recentlyViewed.value.findIndex(p => p.id === product.id)
    if (index > -1) {
      recentlyViewed.value.splice(index, 1)
    }
    recentlyViewed.value.unshift(product)
    if (recentlyViewed.value.length > 4) {
      recentlyViewed.value.pop()
    }
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed.value))
  }

  // Load cart data from localStorage
  const loadCartData = () => {
    const savedCart = localStorage.getItem('cart')
    const savedForLaterData = localStorage.getItem('savedForLater')
    const recentlyViewedData = localStorage.getItem('recentlyViewed')
    
    if (savedCart) cart.value = JSON.parse(savedCart)
    if (savedForLaterData) savedForLater.value = JSON.parse(savedForLaterData)
    if (recentlyViewedData) recentlyViewed.value = JSON.parse(recentlyViewedData)
  }

  return {
    // State
    cart,
    savedForLater,
    recentlyViewed,
    
    // Computed
    cartTotal,
    cartItemCount,
    shippingCost,
    remainingForFreeShipping,
    freeShippingProgress,
    
    // Methods
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    moveToSavedForLater,
    moveToCart,
    addToRecentlyViewed,
    loadCartData
  }
}
