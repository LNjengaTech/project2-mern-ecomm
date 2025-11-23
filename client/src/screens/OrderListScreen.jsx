import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listOrders } from '../actions/orderActions'

const OrderListScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const orderList = useSelector((state) => state.orderList)
    const { loading, error, orders } = orderList

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        // Ensure only Admin users can access this screen
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrders())
        } else {
            navigate('/login')
        }
    }, [dispatch, navigate, userInfo])

    return (
        <div className='p-4'>
            <h1 className='text-3xl font-bold mb-6'>Orders</h1>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <div className='overflow-x-auto shadow-md rounded-lg'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    ID
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    USER
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    DATE
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    TOTAL
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    PAID
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    DELIVERED
                                </th>
                                <th className='px-6 py-3'></th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {orders.map((order) => (
                                <tr key={order._id} className='hover:bg-gray-50'>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {order._id}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                        {order.user && order.user.name} 
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {order.createdAt.substring(0, 10)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        ${order.totalPrice.toFixed(2)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-center text-sm'>
                                        {order.isPaid ? (
                                            <i className='fas fa-check text-green-500'></i>
                                        ) : (
                                            <i className='fas fa-times text-red-500'></i>
                                        )}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-center text-sm'>
                                        {order.isDelivered ? (
                                            <i className='fas fa-check text-green-500'></i>
                                        ) : (
                                            <i className='fas fa-times text-red-500'></i>
                                        )}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                        <button
                                            onClick={() => navigate(`/order/${order._id}`)}
                                            className='text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-100'
                                        >
                                            Details
                                        </button>
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