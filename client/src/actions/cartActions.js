// /client/src/actions/cartActions.js

import axios from 'axios'
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../constants/cartConstants'

// Thunk action creator
export const addToCart = (id, qty) => async (dispatch, getState) => {
  // Fetch the product data from the backend
  const { data } = await axios.get(`/api/products/${id}`)

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id, // Product ID
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty, // Quantity selected
    },
  })

  // Save the entire cart array to local storage
  localStorage.setItem(
    'cartItems',
    JSON.stringify(getState().cart.cartItems)
  )
}

// Thunk action creator to remove item
export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  })

  // Update local storage after removal
  localStorage.setItem(
    'cartItems',
    JSON.stringify(getState().cart.cartItems)
  )
}