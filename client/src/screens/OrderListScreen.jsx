// /client/src/screens/OrderListScreen.jsx (UPDATED)

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { listOrders, deliverOrder } from '../actions/orderActions' // 🔑 Import deliverOrder action
import { ORDER_DELIVER_RESET } from '../constants/orderConstants' // 🔑 Import RESET constant

const OrderListScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const orderList = useSelector((state) => state.orderList)
    const { loading, error, orders } = orderList
    
    // 🔑 Get status of the delivery action
    const orderDeliver = useSelector((state) => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver, error: errorDeliver } = orderDeliver

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        // Reset the delivery status if successful, then refresh the list
        if (successDeliver) {
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(listOrders())
        }

        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrders())
        } else {
            navigate('/login')
        }
    }, [dispatch, navigate, userInfo, successDeliver]) // 🔑 Dependency on successDeliver

    // 🔑 Handler for marking as delivered
    const deliverHandler = (orderId) => {
        if (window.confirm('Are you sure the payment has been collected and the order is delivered?')) {
            dispatch(deliverOrder(orderId))
        }
    }

    return (
        <div className='p-4'>
            <h1 className='text-3xl font-bold mb-6'>Orders</h1>

            {loadingDeliver && <Loader />}
            {errorDeliver && <Message variant='danger'>{errorDeliver}</Message>}

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <div className='overflow-x-auto shadow-md rounded-lg'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='border px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    ID
                                </th>
                                <th className='border px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    USER
                                </th>
                                <th className='border px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    DATE
                                </th>
                                <th className='border px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    TOTAL
                                </th>
                                <th className='border px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    PAID
                                </th>
                                <th className='border px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    DELIVERED
                                </th>
                                <th className='border px-6 py-3'></th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {orders.map((order) => (
                                <tr key={order._id} className='hover:bg-gray-50'>
                                    {/* ... existing table data cells (ID, USER, DATE, TOTAL, PAID, DELIVERED) ... */}
                                    
                                    <td className='border px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {order._id}
                                    </td>
                                    <td className='border px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                        {order.user && order.user.name} 
                                    </td>
                                    <td className='border px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {order.createdAt.substring(0, 10)}
                                    </td>
                                    <td className='border px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        ${order.totalPrice.toFixed(2)}
                                    </td>
                                    <td className='border px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {order.isPaid ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                Paid on {order.paidAt.substring(0, 10)}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                                Unpaid
                                            </span>
                                        )}
                                    </td>
                                    <td className='border px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {order.isDelivered ? (
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                Delivered on {order.deliveredAt.substring(0, 10)}
                                            </span>
                                        ) : (
                                             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                                Not Delivered
                                             </span>
                                        )}
                                    </td>

                                    {/* 🔑 ACTIONS COLUMN (Updated) */}
                                    <td className='border px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2'>
                                        
                                        {/* Details Button */}
                                        <button
                                            onClick={() => navigate(`/admin/order/${order._id}`)}
                                            className='text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-100'
                                        >
                                            Details
                                        </button>
                                        
                                        {/* 🔑 Conditional Mark as Delivered Button (NEW) */}
                                        {order.paymentMethod === 'Payment on Delivery' && !order.isDelivered && (
                                            <button
                                                onClick={() => deliverHandler(order._id)}
                                                className='text-white bg-green-600 hover:bg-green-700 py-2 px-3 rounded-md text-xs transition duration-150'
                                            >
                                                Mark as Delivered
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default OrderListScreen