//PRODUCT ACTIONS (API calls)

import axios from 'axios'
import {
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET,

  HOMEPAGE_PRODUCTS_REQUEST,
  HOMEPAGE_PRODUCTS_SUCCESS,
  HOMEPAGE_PRODUCTS_FAIL,
  
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,

  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,

  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  
  FILTER_OPTIONS_REQUEST,
  FILTER_OPTIONS_SUCCESS,
  FILTER_OPTIONS_FAIL,
} from '../constants/productConstants'

// This are the thunk functions

// @desc    Fetch specialized product lists for the homepage
export const listHomepageProducts = () => async (dispatch) => {
    try {
        dispatch({ type: HOMEPAGE_PRODUCTS_REQUEST })

        // Hit the new backend endpoint
        const { data } = await axios.get('/api/products/homepage')

        dispatch({
            type: HOMEPAGE_PRODUCTS_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: HOMEPAGE_PRODUCTS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}

// @desc    Fetch dynamic brands and categories for filter sidebar
export const listFilterOptions = () => async (dispatch) => {
    try {
        dispatch({ type: FILTER_OPTIONS_REQUEST })

        // Hit the new backend endpoint
        const { data } = await axios.get('/api/products/options')

        dispatch({
            type: FILTER_OPTIONS_SUCCESS,
            payload: data, // payload contains { brands: [], categories: [] }
        })
    } catch (error) {
        dispatch({
            type: FILTER_OPTIONS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}



/**
 * Admin action to create a product
 * 🔑 NOW ACCEPTS THE PRODUCT DATA FROM THE FORM
 */
export const createProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json', // Required to send the body data
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    // 🔑 POST request now sends the product object (containing name, price, etc.)
    const { data } = await axios.post(`/api/products`, product, config) 

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

/**
 * Admin action to update a product
 */
export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_UPDATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    // PUT request sends the updated product data
    const { data } = await axios.put(
      `/api/products/${product._id}`,
      {
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        category: product.category,
        countInStock: product.countInStock,
        description: product.description,
        isFeatured: product.isFeatured, // <-- Ensure this is passed
      },
      config
    )

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data,
    })
    
   // Also update the details state to reflect the new data immediately
    dispatch({ type: 'PRODUCT_DETAILS_SUCCESS', payload: data })

  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload: error.response && error.response.data.message ?
        error.response.data.message :
        error.message,
    })
  }
}

// Update function signature to accept filters (brands, keyword, pageNumber)
export const listProducts = (keyword = '', pageNumber = '', pageSize = '', brands = [], categories = '') => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST }) // Set loading state

    // Build the brands query string (e.g., brands=Apple,Samsung)
    const brandsQuery = brands.length > 0 ? `&brands=${brands.join(',')}` : ''

    // 🔑 UPDATED: Build the categories query string (plural)
    const categoryQuery = categories.length > 0 ? `&categories=${categories.join(',')}` : ''

    // 🔗 API Call to the Express Backend!
    // Construct the full URL query string
        const { data } = await axios.get(
            `/api/products?keyword=${keyword}&pageNumber=${pageNumber}${brandsQuery}${categoryQuery}&pageSize=${pageSize}`
        )

    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data, // Send the array of products to the reducer
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST })

    // 🔗 API Call to the backend: GET /api/products/:id
    const { data } = await axios.get(`/api/products/${id}`)

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

/**
 * Admin action to delete a product by ID
 */
export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    // Make the DELETE request to the backend API
    await axios.delete(`/api/products/${id}`, config)

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    })

    // After successful deletion, refresh the product list
    dispatch(listProducts()) 

  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}