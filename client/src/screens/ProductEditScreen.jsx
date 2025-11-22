import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer' // Assuming you have a basic FormContainer component
import { listProductDetails, updateProduct, deleteProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const ProductEditScreen = () => {
  const { id: productId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  // const [uploading, setUploading] = useState(false) // State for image upload

  // Fetch product details
  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  // Update product state
  const productUpdate = useSelector((state) => state.productUpdate)
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate

  useEffect(() => {
    if (successUpdate) {
      // If update was successful, reset state and navigate back to list
      dispatch({ type: PRODUCT_UPDATE_RESET })
      navigate('/admin/productlist')
    } else {
      // Check if product details need to be fetched or if the fetched product doesn't match the ID
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId)) // Fetch product details (reusing public action)
      } else {
        // Populate form with fetched data
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }
  }, [dispatch, navigate, productId, product, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault()
    // Dispatch update action with all form fields
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
      })
    )
  }

  // ------------------------------------------------------------------
  // NEW: Handle Navigation Back and Optional Delete
  // ------------------------------------------------------------------
  const handleGoBack = () => {
    // 1. Check if the product is still in its sample state
    const isSampleProduct = product.name === 'Sample name' && product.price === 0 && product.description === 'Sample description'

    if (isSampleProduct) {
      // 2. If it's a sample, prompt the user
      if (window.confirm('You have not updated this new product. Are you sure you want to discard it?')) {
        // 3. If they confirm discard, dispatch the delete action
        dispatch(deleteProduct(productId))
        // The deleteProduct action will refresh the list and remove the item.
        // We still need to manually navigate back as Redux is asynchronous
        navigate('/admin/productlist')
      }
      // If they cancel the confirm dialog, they stay on the edit screen.
    } else {
      // 4. If it's a real product (was edited or was an existing product), just navigate back.
      navigate('/admin/productlist')
    }
  }
  
  // NOTE: Image upload logic is complex and will be addressed separately (usually involves a dedicated upload route)
  // const uploadFileHandler = async (e) => { ... }

  return (
    <div className='p-4 max-w-2xl mx-auto'>
      {/* <Link to='/admin/productlist' className='text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block'>
        <i className='fas fa-arrow-left mr-1'></i> Go Back
      </Link> */}


        {/* USE THE NEW HANDLER FOR NAVIGATION intead of the above <Link to... */}
      <button onClick={handleGoBack} className='text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block'><FontAwesomeIcon icon={faArrowLeft} /> Go Back</button>

      <h1 className='text-2xl font-bold mb-6'>Edit Product</h1>

      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <form onSubmit={submitHandler} className='space-y-4 bg-white p-6 shadow-md rounded-lg'>
          
          {/* Name Field */}
          <div>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700'>Name</label>
            <input type='text' id='name' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2' />
          </div>

          {/* Price Field */}
          <div>
            <label htmlFor='price' className='block text-sm font-medium text-gray-700'>Price</label>
            <input type='number' id='price' placeholder='Enter price' value={price} onChange={(e) => setPrice(e.target.value)}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2' />
          </div>

          {/* Image Field */}
          <div>
            <label htmlFor='image' className='block text-sm font-medium text-gray-700'>Image URL</label>
            <input type='text' id='image' placeholder='Enter image url' value={image} onChange={(e) => setImage(e.target.value)}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2' />
            {/* Input for File Upload would go here:
            <input type='file' onChange={uploadFileHandler} className='mt-2' />
            {uploading && <Loader />} 
            */}
          </div>
          
          {/* Brand Field */}
          <div>
            <label htmlFor='brand' className='block text-sm font-medium text-gray-700'>Brand</label>
            <input type='text' id='brand' placeholder='Enter brand' value={brand} onChange={(e) => setBrand(e.target.value)}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2' />
          </div>

          {/* Count In Stock Field */}
          <div>
            <label htmlFor='countInStock' className='block text-sm font-medium text-gray-700'>Count In Stock</label>
            <input type='number' id='countInStock' placeholder='Enter count in stock' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2' />
          </div>
          
          {/* Category Field */}
          <div>
            <label htmlFor='category' className='block text-sm font-medium text-gray-700'>Category</label>
            <input type='text' id='category' placeholder='Enter category' value={category} onChange={(e) => setCategory(e.target.value)}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2' />
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor='description' className='block text-sm font-medium text-gray-700'>Description</label>
            <textarea id='description' placeholder='Enter description' value={description} onChange={(e) => setDescription(e.target.value)}
              rows='4' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2' />
          </div>

          {/* Submit Button */}
          <button type='submit' className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
            Update
          </button>
        </form>
      )}
    </div>
  )
}

export default ProductEditScreen