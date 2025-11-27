import {
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET,

  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_RESET,

  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,

  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,

  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,

  HOMEPAGE_PRODUCTS_REQUEST,
  HOMEPAGE_PRODUCTS_SUCCESS,
  HOMEPAGE_PRODUCTS_FAIL,

  FILTER_OPTIONS_REQUEST,
  FILTER_OPTIONS_SUCCESS,
  FILTER_OPTIONS_FAIL,
} from '../constants/productConstants'

export const homepageProductsReducer = (
  state = { newArrivals: [], bestSellers: [], featuredProducts: [] },
  action
  ) => {
  switch (action.type) {
    case HOMEPAGE_PRODUCTS_REQUEST:
      return { loading: true, newArrivals: [], bestSellers: [], featuredProducts: [] }
      
    case HOMEPAGE_PRODUCTS_SUCCESS:
      return {
        loading: false,
        newArrivals: action.payload.newArrivals,
        bestSellers: action.payload.bestSellers,
        featuredProducts: action.payload.featuredProducts,
      }

    case HOMEPAGE_PRODUCTS_FAIL:
      return { loading: false, error: action.payload }

    default:
      return state
  }
}

/**
 * Reducer for creating a product
 */
export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true }
    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: action.payload }
    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload }
    case PRODUCT_CREATE_RESET:
      return {}
    default:
      return state
  }
}

/**
 * Reducer for updating a product
 */
export const productUpdateReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true }
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true, product: action.payload }
    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case PRODUCT_UPDATE_RESET:
      return { product: {} }
    default:
      return state
  }
}


export const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] } // Set loading to true
    case PRODUCT_LIST_SUCCESS:
      // The payload data should contain the 'products' array
      return {
          loading: false,
          products: action.payload.products, // assuming payload structure { products: [...], page: X, pages: Y }
          pages: action.payload.pages,
          page: action.payload.page,
      }
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload, products:[] } // Error message
    default:
      return state
  }
}

export const productDetailsReducer = (
  state = { product: { reviews: [] } },
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true, ...state }
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload }
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

/**
 * Reducer for deleting a product (Admin only)
 */
export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true }
    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true }
    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}


export const filterOptionsReducer = (
  state = { brands: [], categories: [] }, // Initialize with empty arrays
  action
) => {
  switch (action.type) {
    case FILTER_OPTIONS_REQUEST:
      return { loading: true, brands: [], categories: [] }
      
    case FILTER_OPTIONS_SUCCESS:
      return {
        loading: false,
        brands: action.payload.brands,
        categories: action.payload.categories,
      }

    case FILTER_OPTIONS_FAIL:
      return { loading: false, error: action.payload }

    default:
      return state
  }
}




