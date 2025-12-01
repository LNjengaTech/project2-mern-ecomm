// /client/src/screens/OrderScreen.jsx (NEW USER SCREEN)

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getOrderDetails } from '../actions/orderActions' // Only need getOrderDetails
import { ORDER_CREATE_RESET } from '../constants/orderConstants' // For banner control
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'

import Loader from '../components/Loader'
import Message from '../components/Message'
import OrderConfirmedBanner from '../components/OrderConfirmedBanner' // The banner we just created

const OrderScreen = () => {
    const { id: orderId } = useParams()
    const dispatch = useDispatch()

    // Redux Selectors
    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails
    
    const orderCreate = useSelector(state => state.orderCreate)
    const { success: successCreate } = orderCreate // To show confirmation banner

// 🔑 1. Local state initialized to false. This must be false.
    const [showBanner, setShowBanner] = useState(false)
    
    // 🔑 2. Local state to track if we've already cleaned up the Redux state for this order.
    // This prevents the timer from running forever on refresh.
    const [isCleanedUp, setIsCleanedUp] = useState(false)

    useEffect(() => {
        if (!order || order._id !== orderId) {
            dispatch(getOrderDetails(orderId))
        }
        
// 🔑 3. Set Banner and Schedule Cleanup (Runs only ONCE per successful order)
        // Checks if Redux success flag is true AND we haven't processed it yet.
        if (successCreate && !isCleanedUp) {
            // A. Instantly show the banner
            setShowBanner(true)
            
            // B. Mark as processed
            setIsCleanedUp(true)

            // C. Schedule the cleanup of the Redux state (which will eventually hide the banner)
            const timer = setTimeout(() => {
                dispatch({ type: ORDER_CREATE_RESET })
                setShowBanner(false) // Hide local state for future rendering consistency
            }, 3000); // 3 seconds to ensure visibility

            return () => clearTimeout(timer)
        }
        
        // 🔑 4. Fallback Cleanup (If user refreshes and successCreate is false but banner is true)
        if (!successCreate && showBanner && isCleanedUp) {
             // This handles the case where the user navigates to an old order 
             // and the banner state might have persisted locally.
             setShowBanner(false)
        }
        
    }, [dispatch, orderId, order, successCreate, isCleanedUp, showBanner]) 
    // Dependencies: Added isCleanedUp and showBanner for the cleanup logic.

    // Calculate prices if the order has loaded
    if (order && !order.itemsPrice) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }

    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>{error}</Message>
    ) : (
        // 🔑 1. Main Container (Centered for confirmation)
        <div className='p-4 text-black max-w-4xl mx-auto my-12'> 
            <div className="pb-12" role="alert">
                <Link to="/products" className="font-bold text-black text-lg border border-black p-4 rounded-lg hover:text-gray-500"><FontAwesomeIcon icon={faArrowLeftLong}/> Back To Shop</Link>
            </div>
            
            {/* 🔑 RENDER: Check the local state which was initialized from Redux successCreate */}
            {order.isDelivered ? (
                <div className='text-sm font-semibold text-green-600'>
                    Order Delivered
                </div>
            ) : (
                <div className='text-sm font-semibold text-red-600'>
                    {<OrderConfirmedBanner />}
                </div>
            )}
            

            {/* --- TOP CONFIRMATION SUMMARY SECTION --- */}
            <div className='border-2 border-dashed  border-gray-300 p-6 mb-8 bg-gray-50'>
                {/* 🔑 Header/Date/Total Display (Matches Image Style) */}
                <div className='flex justify-between text-lg font-semibold border-b border-dashed pb-3 mb-3 text-gray-700'>
                    <div className='w-1/4'>Order Number:</div>
                    <div className='w-1/4'>Date:</div>
                    <div className='w-1/4 text-center'>Total:</div>
                    <div className='w-1/4 text-right'>Payment Method:</div>
                </div>
                
                {/* 🔑 Actual Order Data */}
                <div className='flex justify-between text-sm'>
                    <div className='w-1/4'>{order._id.slice(-6)}</div> {/* Display last 6 digits of ID */}
                    <div className='w-1/4'>{new Date(order.createdAt).toLocaleDateString()}</div>
                    <div className='w-1/4 text-center'>${order.totalPrice.toFixed(2)}</div>
                    <div className='w-1/4 text-right'>{order.paymentMethod}</div>
                </div>
            </div>

            {/* --- ORDER DETAILS AND SHIPPING SECTION --- */}
            <div className='bg-white p-6 shadow-xl border border-gray-200'>
                <h2 className='text-2xl font-extrabold border-b border-gray-200 pb-3 mb-6'>ORDER DETAILS</h2>
                
                {/* Product Line Items */}
                <ul className='space-y-4 mb-8'>
                    {order.orderItems.map((item, index) => (
                        <li key={index} className='flex justify-between items-center text-lg'>
                            <div className='font-medium text-gray-700'>
                                {item.name} x {item.qty} 
                            </div>
                            <div className='font-semibold text-gray-900'>
                                ${(item.qty * item.price).toFixed(2)}
                            </div>
                        </li>
                    ))}
                    <li className='border-t border-gray-200 pt-3'></li>
                </ul>

                {/* Pricing Summary (Right-aligned totals) */}
                <div className='flex justify-end'>
                    <div className='w-full max-w-md space-y-3'>
                        
                        {/* Subtotal */}
                        <div className='flex justify-between text-lg'>
                            <span className='font-medium'>SUBTOTAL</span>
                            <span className='font-semibold'>${order.itemsPrice}</span>
                        </div>
                        
                        {/* Shipping */}
                        <div className='flex justify-between text-lg'>
                            <span className='font-medium'>SHIPPING</span>
                            <span className='font-semibold'>
                                {order.shippingPrice === 0 ? 'Free shipping' : `$${order.shippingPrice.toFixed(2)}`}
                            </span>
                        </div>
                        
                        {/* Tax/VAT */}
                        <div className='flex justify-between text-lg'>
                            <span className='font-medium'>VAT ({((order.taxPrice / order.itemsPrice) * 100).toFixed(0)}%)</span>
                            <span className='font-semibold'>${order.taxPrice.toFixed(2)}</span>
                        </div>
                        
                        {/* Total */}
                        <div className='flex justify-between border-t border-black pt-3 mt-4 text-xl font-extrabold'>
                            <span>TOTAL</span>
                            <span>${order.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                {/* 🔑 New: Shipping Details/Status (You can place this below the order details if you prefer a 'receipt' style) */}
                <div className='mt-8 pt-6 border-t border-gray-200'>
                    <h3 className='text-xl font-bold mb-3'>Delivery Information</h3>
                    <p><strong>Name:</strong> {order.user.name}</p>
                    <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
                    <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.town}, {order.shippingAddress.county}.</p>
                    
                    <div className='mt-4'>
                        {order.isDelivered ? (
                            <div className='text-sm font-semibold text-green-600'>
                                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                            </div>
                        ) : (
                            <div className='text-sm font-semibold text-red-600'>
                                Delivery Pending
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default OrderScreen