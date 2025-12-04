// /client/src/screens/ProductScreen.jsx

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails } from '../actions/productActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarEmpty, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

import moment from 'moment'; //moment for date formatting

const ProductScreen = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // For redirecting to the cart
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1); // State for quantity selector
  const [activeTab, setActiveTab] = useState('reviews'); // 🔑 Default active tab

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  // Handler for "Add to Cart" button
  const addToCartHandler = () => {
    // Redirect to /cart/:id?qty=X
    navigate(`/cart/${id}?qty=${qty}`);
  };

  // 🔑 RATING COMPONENT/FUNCTION: Converts number rating into star icons
  const renderRatingStars = (rating) => {
    return (
      <div className="flex space-x-0.5 text-yellow-500">
        {[1, 2, 3, 4, 5].map((index) => {
          const ratingValue = rating;

          return (
            <span key={index}>
              {/* Check for Solid Star (Full) */}
              {ratingValue >= index ? (
                <FontAwesomeIcon icon={faStar} />
              ) : /* Check for Half Star */
              ratingValue >= index - 0.5 ? (
                <FontAwesomeIcon icon={faStarHalfAlt} />
              ) : (
                /* Empty Star */
                <FontAwesomeIcon icon={faStarRegular} />
              )}
            </span>
          );
        })}
      </div>
    );
  };

  // 🔑 HELPER FUNCTION TO RENDER A SINGLE REVIEW ITEM
  const ReviewItem = ({ review }) => {
      // Use moment to format the date
      const formattedDate = moment(review.createdAt).format('MMMM DD, YYYY'); 
      const reviewerName = review.name || 'Anonymous User'; // Use name if available
      
      return (
          <div className="flex border-b border-gray-100 py-6 first:pt-0 last:border-b-0">
              {/* Avatar Placeholder */}
              <div className="mr-4">
                  {/* Using a simple circular placeholder image */}
                  <img 
                      src={`https://placehold.co/60x60/cccccc/000000?text=${reviewerName.charAt(0)}`}
                      alt={reviewerName}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/60x60/cccccc/000000?text=U" }} 
                  />
              </div>

              {/* Review Content */}
              <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                      <div>
                          <p className="font-semibold text-gray-900">{reviewerName}</p>
                          <p className="text-xs text-gray-500">{formattedDate}</p>
                      </div>
                      {/* Star Rating for the individual review */}
                      {renderRatingStars(review.rating)} 
                  </div>
                  <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
          </div>
      );
  };

  return (
    <div className="py-8 container mx-auto px-4">
      <Link to="/products" className="text-black font-extrabold text-lg hover:underline mb-4 inline-block">
        <FontAwesomeIcon icon={faArrowLeftLong} /> Go Back
      </Link>

      {loading ? (
        <div className="text-center text-xl text-blue-600">Loading product details...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="lg:col-span-1 w-full mx-auto">
            <img src={product.image} alt={product.name} className="w-full object-cover" />
          </div>

          <div className=" flex flex-col lg:grid-1 gap-20">
            {/* Product Info (Center Column) */}
            <div className="lg:col-span-1 text-black border-r border-gray-200 pr-8">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">Brand: {product.brand}</p>
              <p className="text-lg text-gray-600 mb-4">Description: {product.description}</p>

              <div className="py-2 mb-4 border-t border-b border-gray-200">
                {/* 🔑 RATING DISPLAY: Use the new renderRatingStars function */}
                <div className="flex items-center space-x-2 mb-2">
                  {renderRatingStars(product.rating)}
                  <span className="text-sm text-gray-700">
                    ({product.rating ? product.rating.toFixed(1) : '0.0'} / 5) - {product.numReviews} Reviews
                  </span>
                </div>

                <div className="text-2xl font-bold text-gray-900">Ksh. {product.price}</div>
              </div>
            </div>

            {/* Add to Cart/Status Card (Right Column) */}
            <div className="lg:col-span-1 text-black">
              <div className="border  p-6 shadow-md">
                <div className="flex justify-between  items-center pb-3 mb-3 border-b border-gray-200">
                  <span className="font-semibold text-lg">Price:</span>
                  <span className="font-bold text-xl">Ksh. {product.price}</span>
                </div>
                <div className="flex justify-between  items-center pb-3 mb-3 border-b border-gray-200">
                  <span className="font-semibold text-lg">Status:</span>
                  <span className={product.countInStock > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</span>
                </div>

                {/* Quantity Selector */}
                {product.countInStock > 0 && (
                  <div className="flex justify-between  items-center pb-4">
                    <span className="font-semibold text-lg">Qty:</span>
                    <select className="p-2 border bg-white border-gray-300 rounded" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                      {/* Generate options up to the stock count */}
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={addToCartHandler}
                  className={`w-full py-3 rounded text-white font-bold transition duration-150 ${
                    product.countInStock === 0 || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black border-none hover:bg-gray-800'
                  }`}
                  disabled={product.countInStock === 0 || loading}
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* 2. Tabs and Review Section */}
          <div className="mt-12">
            
            
            {/* Tabs Navigation */}
            <div className="flex flex-row justify-center space-x-8 mb-6">
                {/* 🔑 Tab Item Component */}
                {['reviews', 'additional information', 'description'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-black bg-white border border-black rounded-none px-4 font-semibold text-sm uppercase transition duration-150 ${
                            activeTab === tab 
                                ? 'border-b-4 border-0 hover:border-black' 
                                : 'text-gray-500 hover:text-black border-none'
                        }`}
                    >
                        {tab === 'reviews' ? `Reviews (${product.numReviews})` : tab}
                    </button>
                ))}
            </div>

            {/* Tabs Content */}
            <div className="p-4 bg-white border items-center border-gray-200 rounded-lg shadow-inner">
                {activeTab === 'reviews' && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h3>
                        
                        {product.numReviews === 0 ? (
                            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                        ) : (
                            <div className="space-y-4">
                                {product.reviews.map((review) => (
                                    <ReviewItem key={review._id} review={review} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {/* Placeholder for other tabs */}
                {(activeTab === 'description' || activeTab === 'additional information') && (
                    <p className="text-gray-500">
                        {`Content for the ${activeTab.toUpperCase()} Not available currently. Sorry for the inconvenience!.`}
                    </p>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductScreen;
