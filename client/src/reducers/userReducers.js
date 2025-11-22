// /client/src/reducers/userReducers.js

import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_RESET,

  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,

  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,

  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_RESET,
} from '../constants/userConstants'

// Reducer for Login/Logout
export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true }
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload }
    case USER_LOGOUT:
      return {} // Clears the user info on logout
    default:
      return state
  }
}

// Reducer for Registration
export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true }
    case USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

// Reducer for User Profile Details
export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { ...state, loading: true }
    case USER_DETAILS_SUCCESS:
      return { loading: false, user: action.payload }
    case USER_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case USER_DETAILS_RESET:
      return { user: {} } // Clears details on logout
    default:
      return state
  }
}


// Reducer for Profile Update
export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { loading: true }
    case USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true, userInfo: action.payload }
    case USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload }
    case USER_UPDATE_PROFILE_RESET:
        return {}
    default:
      return state
  }
}

/**
 * Reducer for getting the list of all users (Admin only)
 */
export const userListReducer = (state = {
    users: []
}, action) => {
    switch (action.type) {
        case USER_LIST_REQUEST:
            return {
                loading: true
            }
        case USER_LIST_SUCCESS:
            return {
                loading: false,
                users: action.payload, // The array of users
            }
        case USER_LIST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case USER_LIST_RESET:
            return {
                users: []
            }
        default:
            return state
    }
}

/**
 * Reducer for deleting a user (Admin only)
 */
export const userDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_DELETE_REQUEST:
            return {
                loading: true
            }
        case USER_DELETE_SUCCESS:
            // We usually return 'success: true' so the component can show a message
            return {
                loading: false,
                success: true
            } 
        case USER_DELETE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}


/**
 * Reducer for Admin updating a user's details
 */
export const userUpdateReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case USER_UPDATE_REQUEST:
            return {
                loading: true
            }
        case USER_UPDATE_SUCCESS:
            return {
                loading: false,
                success: true
            }
        case USER_UPDATE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case USER_UPDATE_RESET:
            // Clear the state after a successful update or navigation
            return {
                user: {}
            } 
        default:
            return state
    }
}