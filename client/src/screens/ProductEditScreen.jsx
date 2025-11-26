// /client/src/screens/ProductEditScreen.jsx

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer' 
import { listProductDetails, updateProduct, deleteProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faUpload } from '@fortawesome/free-solid-svg-icons' // Added faUpload

const ProductEditScreen = () => {
  const { id: productId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')

  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)

  // 🔑 NEW STATE: For the Featured checkbox
  const [isFeatured, setIsFeatured] = useState(false)

  // Redux State Selectors
  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails
  const productUpdate = useSelector((state) => state.productUpdate)
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      navigate('/admin/productlist')
    } else {
      if (!product || product._id !== productId) { // Simplified check
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)

        // 🔑 INITIALIZE STATE: Set the isFeatured flag from the product data
        setIsFeatured(product.isFeatured)
      }
    }
  }, [dispatch, navigate, productId, product, successUpdate])

  // --- Image Upload Handler ---
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      
      const { data } = await axios.post('/api/upload', formData, config)
      
      setImage(data) 
      setUploading(false)
      // Clear the file input value after successful upload (optional, but good practice)
      e.target.value = null 

    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image, 
        brand,
        category,
        description,
        countInStock,
        // 🔑 INCLUDE in UPDATE DISPATCH
        isFeatured,
      })
    )
  }

  const handleGoBack = () => {
    const isSampleProduct = product.name === 'Sample name' && product.price === 0 && product.description === 'Sample description'

    if (isSampleProduct) {
      if (window.confirm('You have not updated this new product. Are you sure you want to discard it?')) {
        dispatch(deleteProduct(productId))
        navigate('/admin/productlist')
      }
    } else {
      navigate('/admin/productlist')
    }
  }
  
  return (
    <div className='p-4 max-w-4xl mx-auto'>
      <button 
        onClick={handleGoBack} 
        className='text-indigo-600 hover:text-indigo-800 text-base font-medium mb-6 flex items-center p-2 rounded-lg hover:bg-indigo-50 transition'
      >
        <FontAwesomeIcon icon={faArrowLeft} className='mr-2' /> Go Back to Product List
      </button>

      <h1 className='text-3xl font-extrabold mb-8 text-gray-800 border-b pb-3'>Product Editor</h1>

      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <form onSubmit={submitHandler} className='space-y-6 bg-white p-8 shadow-2xl rounded-xl'>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1: Core Details */}
            <div className='space-y-6'>
                {/* Name Field */}
                <div>
                    <label htmlFor='name' className='block text-sm font-semibold text-gray-700 mb-1'>Product Name</label>
                    <input type='text' id='name' placeholder='Enter product name' value={name} onChange={(e) => setName(e.target.value)}
                    className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500' />
                </div>

                {/* Price & Count In Stock (In a Row) */}
                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label htmlFor='price' className='block text-sm font-semibold text-gray-700 mb-1'>Price ($)</label>
                        <input type='number' id='price' placeholder='0.00' value={price} onChange={(e) => setPrice(e.target.value)}
                        className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500' />
                    </div>
                    <div className='flex-1'>
                        <label htmlFor='countInStock' className='block text-sm font-semibold text-gray-700 mb-1'>Stock Count</label>
                        <input type='number' id='countInStock' placeholder='0' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}
                        className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500' />
                    </div>
                </div>
                
                {/* Brand & Category (In a Row) */}
                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label htmlFor='brand' className='block text-sm font-semibold text-gray-700 mb-1'>Brand</label>
                        <input type='text' id='brand' placeholder='Brand name' value={brand} onChange={(e) => setBrand(e.target.value)}
                        className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500' />
                    </div>
                    <div className='flex-1'>
                        <label htmlFor='category' className='block text-sm font-semibold text-gray-700 mb-1'>Category</label>
                        <input type='text' id='category' placeholder='Category name' value={category} onChange={(e) => setCategory(e.target.value)}
                        className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500' />
                    </div>
                </div>

                {/* 🔑 NEW CHECKBOX FIELD: Add the Is Featured field */}
                <div>
                    <div className='flex items-center space-x-2 p-3 border border-gray-300 rounded-lg shadow-sm'>
                        <input 
                            type='checkbox' 
                            id='isFeatured'
                            checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                            className='h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                        />
                        <label htmlFor='isFeatured' className='text-sm font-semibold text-gray-700'>
                            Feature this Product on the Homepage
                        </label>
                    </div>
                </div>

                {/* Description Field */}
                <div>
                    <label htmlFor='description' className='block text-sm font-semibold text-gray-700 mb-1'>Description</label>
                    <textarea id='description' placeholder='Enter detailed product description' value={description} onChange={(e) => setDescription(e.target.value)}
                    rows='4' className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 resize-none' />
                </div>
            </div>

            {/* Column 2: Image Upload */}
            <div className='bg-gray-50 p-6 rounded-xl border border-gray-200'>
                <h3 className='text-lg font-bold text-gray-800 mb-4'>Product Image</h3>
                
                {/* Image Preview */}
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Current Image Preview:</label>
                    <div className='w-full h-48 border border-gray-300 bg-white rounded-lg flex items-center justify-center overflow-hidden'>
                        {image ? (
                            <img src={image} alt={name || 'Product Image'} className='h-full w-full object-contain' />
                        ) : (
                            <span className='text-gray-400'>No Image Selected</span>
                        )}
                    </div>
                </div>

                {/* Image Path Field */}
                <div>
                    <label htmlFor='image' className='block text-sm font-medium text-gray-700 mb-1'>Image Path (URL)</label>
                    <input 
                        type='text' 
                        id='image' 
                        placeholder='Path will appear here after upload' 
                        value={image} 
                        onChange={(e) => setImage(e.target.value)}
                        className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500' 
                    />
                </div>
                
                {/* File Upload Button */}
                <div className='mt-4'>
                    <input 
                        type='file' 
                        id='image-file' 
                        onChange={uploadFileHandler} 
                        className='hidden' // Hide native input
                    />
                    <label 
                        htmlFor="image-file" 
                        className='cursor-pointer inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out'
                    >
                        <FontAwesomeIcon icon={faUpload} className='mr-2' />
                        {uploading ? 'Uploading...' : 'Choose File to Upload'}
                    </label>
                    {uploading && <Loader className="mt-2" />} 
                </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type='submit' 
            className='w-full py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out'
            disabled={loadingUpdate}
          >
            {loadingUpdate ? 'Updating...' : 'Save Product Changes'}
          </button>
        </form>
      )}
    </div>
  )
}

export default ProductEditScreen