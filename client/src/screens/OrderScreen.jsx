import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getOrderDetails } from '../actions/orderActions'
import { createProductReview } from '../actions/productActions' // 🔑 IMPORT REVIEW ACTION
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants' // 🔑 IMPORT REVIEW RESET CONSTANT
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'

import { toast } from 'react-toastify' // 🔑 IMPORT TOAST
import Loader from '../components/Loader'
import Message from '../components/Message'
import OrderConfirmedBanner from '../components/OrderConfirmedBanner'
import ReviewForm from '../components/ReviewForm' // 🔑 IMPORT SEPARATE REVIEW FORM COMPONENT

const OrderScreen = () => {
    const { id: orderId } = useParams()
    const dispatch = useDispatch()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    // Redux Selectors
    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails
    
    const orderCreate = useSelector(state => state.orderCreate)
    const { success: successCreate } = orderCreate
    
    // 🔑 NEW: Review State Selectors
    const productReviewCreate = useSelector(state => state.productReviewCreate) || {}
    const { 
        loading: loadingReview, 
        error: errorReview, 
        success: successReview 
    } = productReviewCreate

    // Local State
    const [showBanner, setShowBanner] = useState(false)
    const [isCleanedUp, setIsCleanedUp] = useState(false)
    const [showReviewForm, setShowReviewForm] = useState(null) // 🔑 Holds the productId being reviewed


    useEffect(() => {
        if (!order || order._id !== orderId || successReview) { // 🔑 Check for successReview to reload order
            dispatch(getOrderDetails(orderId))
        }
        
        // --- Logic to control the Confirmation Banner ---
        if (successCreate && !isCleanedUp) {
            setShowBanner(true)
            setIsCleanedUp(true)

            const timer = setTimeout(() => {
                dispatch({ type: ORDER_CREATE_RESET })
                setShowBanner(false)
            }, 3000)

            return () => clearTimeout(timer)
        }
        
        // --- Review Success Logic ---
        if (successReview) {
             console.log('TOAST: Attempting to trigger success toast.'); // 🔑 CHECK THIS
             toast.success('Review Submitted Successfully! (or Updated)') 

             dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
             setShowReviewForm(null)
        }
        // --- Review Error Logic (Optional but recommended) ---
        if (errorReview) {
            // Check if error is a string and display it as an error toast
            toast.error(errorReview)
        }

        
        // --- Fallback Cleanup for non-successful states ---
        if (!successCreate && showBanner && isCleanedUp) {
             setShowBanner(false)
        }
        
    }, [dispatch, orderId, order, successCreate, successReview, errorReview, isCleanedUp, showBanner]) 


    // 🔑 Handler to dispatch the review creation action
    const submitReviewHandler = (productId, reviewData) => {
        dispatch(createProductReview(productId, reviewData))
    }
    
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

            {/* 🔑 Review Loading/Error Messages */}
            {loadingReview && <Loader />}
            {errorReview && <Message variant='danger'>{errorReview}</Message>}

            {/* --- ORDER DETAILS AND SHIPPING SECTION --- */}
            <div className='bg-white p-6 shadow-xl border border-gray-200'>
                <h2 className='text-2xl font-extrabold border-b border-gray-200 pb-3 mb-6'>ORDER DETAILS</h2>
                
               {/* Product Line Items */}
                <ul className='space-y-4 mb-8'>
                    {order.orderItems.map((item, index) => {
                        
                        // 🔑 2. FIND EXISTING REVIEW
                        const existingReview = item.product.reviews.find(
                            (review) => review.user && review.user.toString() === userInfo._id.toString()
                        )
                        
                        const hasReviewed = !!existingReview
                        const buttonText = hasReviewed ? 'Edit Your Review' : 'Write a Review'

                        return (
                            <li key={index} className='text-lg'>
                                <div className='flex justify-between items-center'>
                                    <div className='font-medium text-gray-700'>
                                        {item.name}{/*  x {item.qty}  */}
                                    </div>
                                    <div className='font-semibold text-gray-900'>
                                        ${(item.qty * item.price).toFixed(2)}
                                    </div>
                                </div>

                                {/* REVIEW BUTTON LOGIC */}
                                {order.isDelivered && (
                                    <div className='mt-2 flex justify-end'>
                                        <button 
                                            onClick={() => setShowReviewForm(item.product._id)}
                                            className='text-sm border border-blue-600 text-blue-600 hover:text-blue-900 bg-blue-50 py-1 px-3 rounded transition duration-150'
                                        >
                                            {buttonText}
                                        </button>
                                    </div>
                                )}

                                {/* REVIEW FORM DISPLAY */}
                                {showReviewForm === item.product._id && (
                                    <ReviewForm 
                                        productId={item.product._id}
                                        onSubmit={submitReviewHandler}
                                        onClose={() => setShowReviewForm(null)}
                                        // 🔑 3. PASS EXISTING DATA FOR EDITING
                                        initialRating={hasReviewed ? existingReview.rating : 0}
                                        initialComment={hasReviewed ? existingReview.comment : ''}
                                    />
                                )}
                            </li>
                        )
                    })}
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