// /client/src/screens/account/AccountDashboardScreen.jsx (NEW FILE)

import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const AccountDashboardScreen = () => {
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin
    
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Dashboard</h2>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="font-semibold text-lg text-blue-800">Hello, {userInfo.name}!</p>
                <p className="text-sm text-blue-700 mt-2">
                    From your account dashboard, you can REVIEW your <Link to="/account/orders" className="text-blue-600 hover:underline">RECENT ORDERS</Link>, manage your shipping <Link to="/account/addresses" className="text-blue-600 hover:underline">ADDRESSES</Link>, and edit your <Link to="/account/details" className="text-blue-600 hover:underline">ACCOUNT DETAILS AND PASSWORD</Link>.
                </p>
            </div>

            {/* Placeholder for quick links or recent activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <Link to="/account/orders" className='text-gray-800'>
                        <h3 className="text-xl font-semibold mb-2">Recent Orders</h3>
                        <p className="text-gray-600">Click to view your last order details.</p>
                    </Link>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <Link to="/account/addresses" className='text-gray-800'>
                        <h3 className="text-xl font-semibold mb-2">Address Book</h3>
                        <p className="text-gray-600">Update your primary shipping address.</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AccountDashboardScreen