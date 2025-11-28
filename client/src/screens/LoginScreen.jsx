import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../actions/userActions'
// Helper component to center content (we'll define this next)
// import FormContainer from '../components/FormContainer' 

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get userLogin state from Redux
  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  // Determine where to redirect after login (e.g., from checkout flow)
  const redirect = location.search ? location.search.split('=')[1] : '/'

  // Effect runs when userInfo changes
  useEffect(() => {
    if (userInfo) {
      // If user is already logged in, redirect them
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password)) // Dispatch the login action
  }

  return (
    <div className="flex justify-center items-center py-10">
      {/* Using a simple div instead of a dedicated FormContainer component for simplicity */}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign In</h1>

        {/* Display error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        {/* Display loading state */}
        {loading && <div className="text-center text-blue-600 mb-4">Loading...</div>}

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-gray-800 text-center">
          New Customer?{' '}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            className="text-blue-600 hover:text-blue-800 font-bold"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen