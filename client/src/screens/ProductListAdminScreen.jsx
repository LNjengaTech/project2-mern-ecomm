import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'

import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

const ProductListScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Selector for Product Create state
  const productCreate = useSelector((state) => state.productCreate)
  const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  const productDelete = useSelector((state) => state.productDelete)
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {

    // IMPORTANT: Reset the create state when navigating away to prevent constant redirection
    dispatch({ type: PRODUCT_CREATE_RESET }) 
    
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login')
    }

    // Check for successCreate: If a product was just created, redirect to its edit screen
    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`)
    } else {
      dispatch(listProducts())
    }
  }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct]) // Added dependencies

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id))
    }
  }

  // Handle the Create button click
  const createProductHandler = () => {
    dispatch(createProduct())
  }

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Products</h1>
        <button
          onClick={createProductHandler}
          className='py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700'
          disabled={loadingCreate} // Disable button while loading
        >
          <i className='fas fa-plus mr-2'></i> Create Product
        </button>
      </div>

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

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
                  NAME
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  PRICE
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  CATEGORY
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  BRAND
                </th>
                <th className='px-6 py-3'></th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {products.map((product) => (
                <tr key={product._id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {product._id}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {product.name}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    ${product.price}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {product.category}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {product.brand}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    {/* Edit Button Placeholder */}
                    <Link
                      to={`/admin/product/${product._id}/edit`}
                      className='text-indigo-600 hover:text-indigo-900 mr-2 p-2 rounded-full hover:bg-indigo-100'
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteHandler(product._id)}
                      className='text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100'
                    >
                      <FontAwesomeIcon icon={faTrash} />
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

export default ProductListScreen