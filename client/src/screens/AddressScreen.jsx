// /client/src/screens/account/AddressScreen.jsx (NEW FILE)

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import Message from '../components/Message'
import Loader from '../components/Loader'

const AddressScreen = () => {
    const [address, setAddress] = useState('')
    const [town, setTown] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [phone, setPhone] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    // Selectors
    const userDetails = useSelector((state) => state.userDetails)
    const { loading, error, user } = userDetails

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
    const { success } = userUpdateProfile

    useEffect(() => {
        // Fetch user details if not available or if an update was just successful
        if (!user || success) {
            dispatch({ type: USER_UPDATE_PROFILE_RESET })
            dispatch(getUserDetails('profile'))
        } 
        
        // Populate form fields once user details are loaded
        if (user && user.shippingAddress) {
            setAddress(user.shippingAddress.address || '')
            setTown(user.shippingAddress.town || '')
            setCity(user.shippingAddress.city || '')
            setCountry(user.shippingAddress.country || '')
            setPhone(user.shippingAddress.phone || '')
        }
        
    }, [dispatch, user, success])

    const submitHandler = (e) => {
        e.preventDefault()
        setMessage(null)

        if (!address || !town || !city || !country || !phone) {
            setMessage('All address fields are required.')
            return
        }

        // Dispatch update profile action with the new shipping address structure
        dispatch(
            updateUserProfile({
                id: user._id,
                shippingAddress: {
                    address,
                    town,
                    city,
                    country,
                    phone,
                },
            })
        )
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">My Addresses</h2>
            
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {success && <Message variant='success'>Address Updated Successfully</Message>}
            {loading && <Loader />}

            <form onSubmit={submitHandler} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Address Field */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">Street Address</label>
                        <input type="text" id="address" placeholder="Enter street address" value={address} onChange={(e) => setAddress(e.target.value)} className="bg-white border text-gray-600 rounded-none w-full py-2 px-3" required />
                    </div>
                    {/* Town Field */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="town">Town/Area</label>
                        <input type="text" id="town" placeholder="Enter town or area" value={town} onChange={(e) => setTown(e.target.value)} className="bg-white border text-gray-600 rounded-none w-full py-2 px-3" required />
                    </div>
                    {/* City Field */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">City/County</label>
                        <input type="text" id="city" placeholder="Enter city or county" value={city} onChange={(e) => setCity(e.target.value)} className="bg-white border text-gray-600 rounded-none w-full py-2 px-3" required />
                    </div>
                    {/* Phone Field */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-white border text-gray-600 rounded-none w-full py-2 px-3" required />
                    </div>
                </div>

                {/* Country Field (kept separate for full width) */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">Country</label>
                    <input type="text" id="country" placeholder="Enter country" value={country} onChange={(e) => setCountry(e.target.value)} className="bg-white border text-gray-600 rounded-none w-full py-2 px-3" required />
                </div>
                

                <button type="submit" className="w-full md:w-auto bg-black hover:bg-gray-800 border-none text-white font-bold py-2 px-4 rounded transition duration-150">
                    Update Address
                </button>
            </form>
        </div>
    )
}

export default AddressScreen