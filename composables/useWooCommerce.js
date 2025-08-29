// WooCommerce API Configuration
const WOO_CONFIG = {
  baseUrl: 'https://timob10.sg-host.com/wp-json/wc/v3',
  consumerKey: 'ck_17e70b1dcd1b0d0aab92da0c8ac7bda10a280827',
  consumerSecret: 'cs_e7d6fe86192848c4d06c5b0eb4692d32d2b42a50'
}

// WooCommerce API Service
const wooService = {
  async fetchCategories() {
    try {
      const response = await fetch(
        `${WOO_CONFIG.baseUrl}/products/categories?per_page=100`,
        {
          headers: {
            'Authorization': 'Basic ' + btoa(`${WOO_CONFIG.consumerKey}:${WOO_CONFIG.consumerSecret}`)
          }
        }
      )
      if (!response.ok) throw new Error('Failed to fetch categories')
      return await response.json()
    } catch (err) {
      console.error('Error fetching categories:', err)
      throw err
    }
  },

  async fetchAllProducts(params = {}) {
    let allProducts = []
    let page = 1
    let totalPages = 1
    do {
      const queryParams = new URLSearchParams({
        per_page: 100, // max allowed by WooCommerce
        page,
        ...params
      }).toString()
      const response = await fetch(
        `${WOO_CONFIG.baseUrl}/products?${queryParams}`,
        {
          headers: {
            'Authorization': 'Basic ' + btoa(`${WOO_CONFIG.consumerKey}:${WOO_CONFIG.consumerSecret}`)
          }
        }
      )
      if (!response.ok) throw new Error('Failed to fetch products')
      const products = await response.json()
      allProducts = allProducts.concat(products)
      totalPages = parseInt(response.headers.get('X-WP-TotalPages')) || 1
      page++
    } while (page <= totalPages)
    return allProducts
  },

  async fetchProduct(id) {
    try {
      const response = await fetch(
        `${WOO_CONFIG.baseUrl}/products/${id}`,
        {
          headers: {
            'Authorization': 'Basic ' + btoa(`${WOO_CONFIG.consumerKey}:${WOO_CONFIG.consumerSecret}`)
          }
        }
      )
      if (!response.ok) throw new Error('Failed to fetch product')
      return await response.json()
    } catch (err) {
      console.error('Error fetching product:', err)
      throw err
    }
  }
}

// Utility function to get relevant Unsplash fallback images
const getFallbackImage = (category) => {
  const fallbackImages = {
    't-shirts': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
    'hoodies': 'https://images.unsplash.com/photo-1556156026-e01c89f5f19c?q=80&w=800&auto=format&fit=crop',
    'tassen': 'https://images.unsplash.com/photo-1594225019830-798c8a1fe4a0?q=80&w=800&auto=format&fit=crop',
    'stofftaschen': 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
    'caps': 'https://images.unsplash.com/photo-1521369909049-ecaf380c8536?q=80&w=800&auto=format&fit=crop',
    'clothing': 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop',
    'accessories': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop'
  }

  return fallbackImages[category] || fallbackImages.clothing
}

// Format product data from WooCommerce
const formatProduct = (product) => {
  const customizable = product.meta_data?.some(meta => meta.key === '_customizable' && meta.value === 'yes')
  
  // Get category name for fallback image
  const categoryName = product.categories[0]?.name?.toLowerCase() || 'clothing'
  
  return {
    id: product.id,
    category: product.categories[0]?.id.toString() || 'all',
    name: product.name,
    price: product.price,
    image: product.images[0]?.src || getFallbackImage(categoryName),
    description: product.description,
    gallery: product.images.map(img => img.src),
    customizable,
    sizes: product.attributes?.find(attr => attr.name === 'Size')?.options || [],
    colors: product.attributes?.find(attr => attr.name === 'Color')?.options || [],
    stock_status: product.stock_status,
    stock_quantity: product.stock_quantity,
    sku: product.sku,
    weight: product.weight,
    dimensions: product.dimensions,
    tags: product.tags?.map(tag => tag.slug) || []
  }
}

export const useWooCommerce = () => {
  return {
    wooService,
    formatProduct,
    getFallbackImage
  }
}
