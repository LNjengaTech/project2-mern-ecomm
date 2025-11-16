// /client/src/store.js

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { thunk } from 'redux-thunk' // Note: thunk is now often imported as named export
import { productListReducer, productDetailsReducer } from './reducers/productReducers' // <-- New Import

import { cartReducer } from './reducers/cartReducers'
// We will add other reducers (user, product, order) here soon

const reducer = combineReducers({
  cart: cartReducer,
  productList: productListReducer, // <-- Add this
  productDetails: productDetailsReducer, // <-- Add this
  // Placeholder for other reducers:
  // userLogin: userLoginReducer,
  // productList: productListReducer,
})

// Get cart items from localStorage if they exist
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []

// Get user info from localStorage if it exists
// const userInfoFromStorage = localStorage.getItem('userInfo')
//   ? JSON.parse(localStorage.getItem('userInfo'))
//   : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {}

const initialState = {
  cart: { 
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
  // userLogin: { userInfo: userInfoFromStorage },
}

const middleware = [thunk]

// 1. Get the Redux DevTools extension function from the browser window (if it exists)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware)) // <-- Use composeEnhancers
)

export default store