// /client/src/screens/ProfileScreen.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { listMyOrders } from '../actions/orderActions' // 🔑 IMPORT NEW ACTION
import { ORDER_LIST_MY_RESET } from '../constants/orderConstants' // 🔑 IMPORT RESET CONSTANT

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

  // 🔑 NEW: Select Order History State
  const orderListMy = useSelector((state) => state.orderListMy)
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

 useEffect(() => {
    // 1. Protection: If user is not logged in, redirect
    if (!userInfo) {
      navigate('/login')
    } else {
      // 2. Load Details: Check if user data has been loaded or needs to be loaded
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET }) // Reset update status
        
        // 🔑 CRITICAL: Dispatch ORDER_LIST_MY_RESET to clear previous orders on profile update/reload
        dispatch({ type: ORDER_LIST_MY_RESET }) 
        
        dispatch(getUserDetails('profile')) // Fetch user details
        
        // 🔑 Dispatch action to fetch user's orders
        dispatch(listMyOrders()) 
        
      } else {
        // 3. Populate Form: Set form fields once data is fetched
        setName(user.name)
        setEmail(user.email)
        
        // 🔑 Also fetch orders here if they haven't been fetched yet 
        // (Prevents duplicate fetches if page reloads without profile update)
        if (!orders || orders.length === 0) {
            dispatch(listMyOrders())
        }
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
          
          {loadingOrders ? (
            <div className="text-center text-blue-600">Loading Orders...</div>
          ) : errorOrders ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{errorOrders}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order._id.substring(order._id.length - 6)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt.substring(0, 10)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.isPaid ? (
                          <span className="text-green-600 font-bold">
                            {order.paidAt.substring(0, 10)}
                          </span>
                        ) : (
                          <i className="fa-solid fa-xmark text-red-500"></i>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.isDelivered ? (
                          <span className="text-green-600 font-bold">
                            {order.deliveredAt.substring(0, 10)}
                          </span>
                        ) : (
                          <i className="fa-solid fa-xmark text-red-500"></i>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/order/${order._id}`}>
                          <button className="text-blue-600 hover:text-blue-900 bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded text-xs transition duration-150">
                            Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProfileScreen