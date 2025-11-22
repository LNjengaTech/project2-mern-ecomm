// /client/src/screens/OrderScreen.jsx

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js' // SDK Import
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET } from '../constants/orderConstants'
// Note: You must update your .env file with REACT_APP_PAYPAL_CLIENT_ID=<Your ID>

const OrderScreen = () => {
  const { id: orderId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [sdkReady, setSdkReady] = useState(false)

  // Redux State Selectors
  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  if (!loading && order) {
    // Calculate total items price on the frontend for display consistency
    order.itemsPrice = order.orderItems.reduce(
      (acc, item) => acc + item.price * item.qty, 
      0
    )
  }

  // --- useEffect Hook for Fetching Order and PayPal Client ID ---
  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }

    // Function to fetch the PayPal Client ID
    const addPayPalScript = async () => {
      // API call to the backend to get the PayPal Client ID
      const { data: clientId } = await axios.get('/api/config/paypal')
      
      // If client ID is received, set SDK as ready
      if (clientId) {
        setSdkReady(true)
      }
    }
    
    // Check if we need to refetch the order
    if (!order || order._id !== orderId || successPay) {
      // Reset payment status if payment was successful
      if (successPay) {
        dispatch({ type: ORDER_PAY_RESET })
      }
      dispatch(getOrderDetails(orderId)) // Fetch the order details
    } else if (!order.isPaid) {
      // If order is not paid, check if PayPal script is ready
      if (!sdkReady) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [dispatch, orderId, successPay, order, navigate, userInfo, sdkReady])
  
  // --- PayPal Handlers ---

  const successPaymentHandler = (details) => {
    // This function is called after successful payment via PayPal's UI
    dispatch(payOrder(orderId, details))
  }
  
  // Placeholder for PayPal environment options
  const initialOptions = {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
    currency: "USD",
  };


  return loading ? (
    <div className="text-center text-xl text-blue-600 py-10">Loading order...</div>
  ) : error ? (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">{error}</div>
  ) : (
    <div className="py-10 container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Order ID: {order._id}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1 & 2: Order Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Details */}
          <div className="border p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Shipping</h2>
            <p className="text-gray-700 mb-2">
              <strong className="font-semibold">Name:</strong> {order.user.name}
            </p>
            <p className="text-gray-700 mb-4">
              <strong className="font-semibold">Email:</strong>{' '}
              <a href={`mailto:${order.user.email}`} className="text-blue-600 hover:underline">{order.user.email}</a>
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold">Address:</strong>{' '}
              {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            
            {/* Delivery Status Badge */}
            <div className="mt-4">
              {order.isDelivered ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Delivered on {order.deliveredAt.substring(0, 10)}
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Not Delivered
                </span>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="border p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Payment Method</h2>
            <p className="text-gray-700">
              <strong className="font-semibold">Method:</strong> {order.paymentMethod}
            </p>
            
            {/* Payment Status Badge */}
            <div className="mt-4">
              {order.isPaid ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Paid on {order.paidAt.substring(0, 10)}
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Not Paid
                </span>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="border p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Order Items</h2>
            <ul className="space-y-4">
              {order.orderItems.map((item, index) => (
                <li key={index} className="flex justify-between items-center border-b last:border-b-0 py-2">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-4" />
                    <Link to={`/product/${item.product}`} className="font-medium text-blue-600 hover:underline">
                      {item.name}
                    </Link>
                  </div>
                  <div className="text-right">
                    {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 3: Order Summary and Payment Buttons */}
        <div className="lg:col-span-1">
          <div className="border p-6 rounded-lg shadow-xl sticky top-20">
            <h2 className="text-2xl font-bold mb-4 border-b pb-3 text-center">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between"><span>Items:</span><span>${order.itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping:</span><span>${order.shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between border-b pb-2"><span>Tax:</span><span>${order.taxPrice.toFixed(2)}</span></div>
              <div className="flex justify-between text-xl font-bold pt-2">
                <span>Total:</span>
                <span className="text-green-700">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* PayPal Payment Integration */}
            {!order.isPaid && (
              <div className="mt-6">
                {loadingPay && <div className="text-center text-blue-600 my-4">Processing payment...</div>}
                
                {sdkReady && (
                  <PayPalScriptProvider options={initialOptions}>
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                currency_code: "USD",
                                value: order.totalPrice.toFixed(2), // Pass total amount
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                          successPaymentHandler(details); // Call our success handler
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                )}
                {!sdkReady && (
                   <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
                     Loading PayPal...
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderScreen