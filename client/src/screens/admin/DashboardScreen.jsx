// /client/src/screens/admin/DashboardScreen.jsx (UPDATED)
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import StatCard from '/src/components/StatCard' 
import Loader from '/src/components/Loader'
import Message from '/src/components/Message'
import { getDashboardData } from '/src/actions/dashboardActions'
import RevenueChart from '/src/components/RevenueChart'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTruck, faCheckCircle, faDollarSign, faMoneyBillWave, faClock, faTimesCircle, faHourglassHalf, faBan } from '@fortawesome/free-solid-svg-icons'

const DashboardScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    // 🔑 SELECT THE DASHBOARD DATA STATE
    const dashboardData = useSelector(state => state.dashboardData)
    const { loading, error, summary, orders, revenue } = dashboardData

    // Ensure the user is an admin
    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(getDashboardData()) // 🔑 Dispatch the fetch action
        } else {
            navigate('/login')
        }
    }, [dispatch, navigate, userInfo])


    // 🔑 Map the summary data to the stat card structure
    const statMapping = summary ? [
        // Top Row Cards
        { title: 'Total Orders', value: summary.totalOrders || 0, icon: faTruck, iconColor: 'text-indigo-600', isCurrency: false, path: '/admin/orderlist' },
        { title: 'Delivered Orders', value: summary.deliveredOrders || 0, icon: faCheckCircle, iconColor: 'text-indigo-600', isCurrency: false, path: '/admin/orderlist' },
        { title: 'Total Amount', value: summary.totalSales || 0, icon: faDollarSign, iconColor: 'text-indigo-600', isCurrency: true },
        { title: 'Delivered Orders Amount', value: summary.deliveredSales || 0, icon: faMoneyBillWave, iconColor: 'text-indigo-600', isCurrency: true },
        
        // Side Row Cards
        { title: 'Pending Orders', value: summary.pendingOrders || 0, icon: faClock, iconColor: 'text-indigo-600', isCurrency: false, path: '/admin/orderlist' },
        { title: 'Canceled Orders', value: summary.cancelledOrders || 0, icon: faTimesCircle, iconColor: 'text-indigo-600', isCurrency: false, path: '/admin/orderlist' },
        { title: 'Pending Orders Amount', value: summary.pendingSales || 0, icon: faHourglassHalf, iconColor: 'text-indigo-600', isCurrency: true },
        { title: 'Canceled Orders Amount', value: summary.cancelledSales || 0, icon: faBan, iconColor: 'text-indigo-600', isCurrency: true },
    ] : []



   let chartLegend = [];

    if (statMapping && statMapping.length >= 6) { // Check if indices 1, 2, 4, 5 exist
        chartLegend = [
            { label: 'Total Sales', color: 'bg-indigo-600', value: statMapping[2].value },
            { label: 'Delivered', color: 'bg-green-600', value: statMapping[1].value },
            { label: 'Pending', color: 'bg-yellow-500', value: statMapping[4].value },
            { label: 'Canceled', color: 'bg-red-600', value: statMapping[5].value },
        ];
    }
    
    // --- Render Logic ---
    if (loading) return <Loader />
    if (error) return <Message variant='danger'>{error}</Message>

    return (
        <div className='space-y-8'>
            
            {/* 1. TOP STAT CARDS GRID */}
            
            
            {/* 2. REVENUE CHART AND REMAINING STATS */}
            <div className='grid border grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6'>

                
                {/* 🔑 CHART COMPONENT INTEGRATION */}
                   
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {statMapping.slice(0, 8).map((stat, index) => (
                            // We can wrap StatCard in Link if path is provided
                            <StatCard key={index} {...stat} />
                        ))}
                    </div>
                     <div className='h-96 xl:h-full col-span-1 xl:col-span-1 bg-white p-6 rounded-lg shadow-md'>
                        {/* Pass the revenue data fetched from Redux state */}
                        <RevenueChart revenueData={revenue || []} />
                    </div>
            </div>

            {/* 3. RECENT ORDERS TABLE */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold text-gray-800'>Recent orders</h2>
                    <Link to="/admin/orderlist" className='text-indigo-600 hover:text-indigo-800 text-sm font-medium'>
                        View all
                    </Link>
                </div>
                
                {/* Table Structure */}
                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                            <tr>
                                {['OrderNo', 'Name', 'Phone No', 'Subtotal', 'Tax', 'Total', 'Status', 'Order Date', 'Total Items', 'Delivered On'].map(header => (
                                    <th
                                        key={header}
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
    {orders && orders.length === 0 ? (
        <tr>
            <td colSpan={10} className='px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500'>
                No recent orders found.
            </td>
        </tr>
    ) : (
        orders && orders.slice(0, 5).map((order) => (
            <tr key={order._id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{order._id.substring(18)}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{order.user && order.user.name}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{order.shippingAddress && order.shippingAddress.phone}</td>
                
                {/* 
                  Fix applied here: Ensure the value exists before calling .toLocaleString()
                  If undefined/null, use 0 instead, then format.
                */}
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>Ksh. {(order.itemsPrice || 0).toLocaleString()}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>Ksh. {(order.taxPrice || 0).toLocaleString()}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900'>Ksh. {(order.totalPrice || 0).toLocaleString()}</td>
                
                <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    {order.isDelivered ? (
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>Delivered</span>
                    ) : order.isPaid ? (
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'>Processing</span>
                    ) : (
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'>Unpaid</span>
                    )}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{order.createdAt.substring(0, 10)}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{order.orderItems.reduce((acc, item) => acc + item.qty, 0)}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                    {order.deliveredAt ? order.deliveredAt.substring(0, 10) : '-'}
                </td>
            </tr>
        ))
    )}
</tbody>

                    </table>
                </div>
            </div>
            
        </div>
    )
}

export default DashboardScreen