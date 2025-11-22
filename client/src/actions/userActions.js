// /client/src/actions/userActions.js

import axios from 'axios'
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_RESET,

  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,

  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
 

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

// --- LOGIN ACTION ---
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post(
      '/api/users/login',
      { email, password },
      config
    )

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    })

    // Save user info and token to local storage
    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// --- LOGOUT ACTION ---
export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo')
  dispatch({ type: USER_LOGOUT })
  dispatch({ type: USER_DETAILS_RESET }) // Clear profile details state on logout
  // Add other cleanup/reset dispatchers here later (e.g., clearing orders)

  // Navigate to home page or login after logout (handled in the component)
}

// --- REGISTER ACTION ---
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post(
      '/api/users', // POST to /api/users for registration
      { name, email, password },
      config
    )

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    })

    // Immediately log the user in after successful registration
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

/**
 * Action to fetch a single user's details (Used by Admin for editing)
 * We modify the existing getUserDetails action if it doesn't already take an ID
 */
export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST })

    // Get the token from the currently logged-in user state
    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        // Send the JWT token in the header
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    // This endpoint should be protected and return the user details for the given ID
    const { data } = await axios.get(`/api/users/${id}`, config)

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

/**
 * Admin action to update a user's details (Admin only)
 */
export const updateUser = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_REQUEST,
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

        // The user object must contain the ID (user._id) for the PUT request
        const { data } = await axios.put(
            `/api/users/${user._id}`, 
            user, 
            config
        )

        dispatch({
            type: USER_UPDATE_SUCCESS,
        })

        // Also dispatch success to the user details reducer to update the cache
        dispatch({ 
            type: USER_DETAILS_SUCCESS, 
            payload: data 
        })

    } catch (error) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message :
                error.message,
        })
    }
}



// --- UPDATE PROFILE ACTION ---
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST })

    // Get the token from the currently logged-in user state
    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    // PUT request to the profile endpoint: /api/users/profile
    const { data } = await axios.put(`/api/users/profile`, user, config)

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    })

    // Also update the login state with the new details (e.g., new name/token)
    dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
    })

    // Update local storage with the new user info
    localStorage.setItem('userInfo', JSON.stringify(data))

  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

/**
 * Admin action to fetch all users
 */
export const listUsers = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_LIST_REQUEST,
        })

        // Get the token from the currently logged-in admin user state
        const {
            userLogin: {
                userInfo
            },
        } = getState()

        const config = {
            headers: {
              // Send the JWT token in the header
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        // Make the GET request to the backend API (e.g., /api/users)
        const {
            data
        } = await axios.get(`/api/users`, config)

        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data, // data will be an array of user objects
        })
    } catch (error) {
        dispatch({
            type: USER_LIST_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message :
                error.message,
        })
    }
}

/**
 * Admin action to delete a user by ID
 */
export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DELETE_REQUEST,
        })

        // Get the token from the currently logged-in admin user state
        const {
            userLogin: {
                userInfo
            },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        // Make the DELETE request to the backend API (e.g., /api/users/:id)
        await axios.delete(`/api/users/${id}`, config)

        dispatch({
            type: USER_DELETE_SUCCESS,
        })
        
        // After successful deletion, we MUST refresh the user list
        dispatch(listUsers())

    } catch (error) {
        dispatch({
            type: USER_DELETE_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message :
                error.message,
        })
    }
}