// /client/src/screens/ProfileScreen.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

const ProfileScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null) // Success or validation message

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile

  useEffect(() => {
    // 1. Protection: If user is not logged in, redirect
    if (!userInfo) {
      navigate('/login')
    } else {
      // 2. Load Details: Check if user data has been loaded or needs to be loaded
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET }) // Reset update status
        dispatch(getUserDetails('profile')) // Fetch user details from /api/users/profile
      } else {
        // 3. Populate Form: Set form fields once data is fetched
        setName(user.name)
        setEmail(user.email)
      }
    }
  }, [dispatch, navigate, userInfo, user, success])

  const submitHandler = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      setMessage(null)
      // Dispatch update profile action
      dispatch(
        updateUserProfile({
          id: user._id,
          name,
          email,
          password,
        })
      )
    }
  }

  return (
    <div className="py-10 container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Column 1: Profile Update Form */}
        <div className="md:col-span-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">User Profile</h2>

          {/* Display messages */}
          {message && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{message}</div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">Profile Updated Successfully</div>
          )}
          {loading && <div className="text-center text-blue-600 mb-4">Loading...</div>}

          <form onSubmit={submitHandler} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} className="shadow border rounded w-full py-2 px-3" required />
            </div>
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow border rounded w-full py-2 px-3" required />
            </div>
            {/* Password Field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password (New)</label>
              <input type="password" id="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow border rounded w-full py-2 px-3" />
            </div>
            {/* Confirm Password Field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm New Password</label>
              <input type="password" id="confirmPassword" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="shadow border rounded w-full py-2 px-3" />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150">
              Update Profile
            </button>
          </form>
        </div>

        {/* Column 2 & 3: Order History */}
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">My Orders</h2>
          {/* Order List Placeholder (Will be implemented in Phase 3.6) */}
          <div className="bg-gray-50 p-4 rounded-lg border border-dashed text-gray-600 text-center">
            Order history will be displayed here in Phase 3.6
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProfileScreen