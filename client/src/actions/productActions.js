//PRODUCT ACTIONS (API calls)

import axios from 'axios'
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  // ... (We'll add details actions later)
} from '../constants/productConstants'

// This is the thunk function
export const listProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST }) // Set loading state

    // 🔗 API Call to the Express Backend!
    const { data } = await axios.get('/api/products') // The proxy setup handles localhost:5000

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