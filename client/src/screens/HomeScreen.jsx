import React, { useEffect } from 'react';
// These imports are assumed to be correct for the application structure
import { useDispatch, useSelector } from 'react-redux'; 
import { Link, useParams } from 'react-router-dom';
import { listProducts } from '../actions/productActions';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    // Dispatch the action to fetch products when the component mounts or keyword changes
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);

  return (
    <>
      {/* 🚀 HERO SECTION (Matching Design) */}
      <div className="bg-[#1a111a] text-white py-20 lg:py-0 min-h-[500px] flex items-center justify-center rounded-xl my-6 shadow-2xl">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* Text Content */}
          <div className="z-10 py-10 lg:py-20 max-w-lg">
            <h3 className="text-xl lg:text-2xl font-light text-gray-300 mb-2 tracking-wider">
              Pro.Beyond.
            </h3>
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
              iPhone 14 <span className="text-white">Pro</span>
            </h1>
            <p className="text-base lg:text-lg text-gray-400 mb-10">
              Created to change everything for the better. For everyone
            </p>
            <Link to="/products/latest" className="inline-block">
                <button
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-white hover:text-[#1a111a] transition duration-300 shadow-lg"
                >
                Shop Now
                </button>
            </Link>
          </div>
          
          {/* Image Section */}
          <div className="flex justify-center lg:justify-end overflow-hidden lg:h-full">
            {/* 🚨 IMPORTANT: You need to replace this placeholder URL with your actual iPhone image URL */}
            <img 
              src="https://placehold.co/800x600/1a111a/ffffff?text=iPhone+Image"
              alt="iPhone 14 Pro" 
              className="w-full max-w-xl object-contain transform translate-x-10 lg:translate-x-0" 
              style={{ maxHeight: '600px' }}
            />
          </div>
        </div>
      </div>
      
      {/* 📦 PRODUCTS SECTION (Existing Product Listing) */}
      <h2 className="text-3xl font-bold text-gray-800 my-8 pt-4 border-t-2 border-gray-100">Latest Products</h2>
      {loading ? (
        <div className="text-center text-blue-600">Loading Products...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <Link to={`/product/${product._id}`}>
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">{product.name}</h3>
                </Link>
                <div className="my-2 text-sm text-yellow-500">
                  {/* Rating Component Placeholder */}
                  {'★'.repeat(Math.round(product.rating))}
                  {'☆'.repeat(5 - Math.round(product.rating))} ({product.numReviews} reviews)
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mt-3">${product.price}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default HomeScreen;