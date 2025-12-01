import React, { useState, useEffect } from 'react'; // <-- Added useState

import { useDispatch, useSelector } from 'react-redux';

import { useParams, useLocation, useNavigate } from 'react-router-dom';

import { listProducts, listFilterOptions } from '../actions/productActions'; // NEW: Import listFilterOptions

import { addToCart } from '../actions/cartActions';

import Product from '../components/Product';

import ProductFilterSidebar from '../components/ProductFilterSidebar';

import Loader from '../components/Loader';

import Message from '../components/Message';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons'; // Added faTimes

import Paginate from '../components/Paginate';

// 🔑 DEFINE CONSTANTS
const DEFAULT_PAGE_SIZE = 48;
const PAGE_SIZE_OPTIONS = [20, 48, 60, 96]; // Standard options

// Helper function to extract query parameters (from useLocation hook)
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ProductListScreen = () => {
  // Get keyword and pageNumber from URL parameters
  const { keyword } = useParams();
  const { pageNumber } = useParams() || 1;

  // Extract query parameters
  const query = useQuery();
  const brandQuery = query.get('brands') ? query.get('brands').split(',') : [];
  const categoryQuery = query.get('categories') ? query.get('categories').split(',') : [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //STATE: For managing filter visibility on mobile
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(categoryQuery);
  const [selectedBrands, setSelectedBrands] = useState(brandQuery);

  // 🔑 NEW STATE: Products Per Page Selector (Default 48)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Existing Redux State for Product List

  const productList = useSelector((state) => state.productList);

  const { loading, error, products, page, pages } = productList;

  const handleAddToCart = (productId) => {
    dispatch(addToCart(productId, 1));

    navigate('/cart');
  };

  // NEW: Handler for category checkbox changes

  const handleCategoryChange = (categoryName) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryName)
        ? prevCategories.filter((c) => c !== categoryName) // Remove category
        : [...prevCategories, categoryName]; // Add category

      // Navigate to update the URL with the new comma-separated list

      const brandParams = selectedBrands.length > 0 ? `brands=${selectedBrands.join(',')}` : '';

      const categoryParams = newCategories.length > 0 ? `categories=${newCategories.join(',')}` : '';

      let url = '/products';

      const params = [brandParams, categoryParams].filter((p) => p).join('&');

      if (params) {
        url = `/products?${params}`;
      }

      navigate(url);

      return newCategories;
    });
  };

  // UPDATED: Handler for brand checkbox changes

  const handleBrandChange = (brandName) => {
    setSelectedBrands((prevBrands) => {
      const newBrands = prevBrands.includes(brandName)
        ? prevBrands.filter((b) => b !== brandName) // Remove brand
        : [...prevBrands, brandName]; // Add brand

      // Navigate to update the URL with the new comma-separated list

      const brandParams = newBrands.length > 0 ? `brands=${newBrands.join(',')}` : '';

      const categoryParams = selectedCategories.length > 0 ? `categories=${selectedCategories.join(',')}` : '';

      let url = '/products';

      const params = [brandParams, categoryParams].filter((p) => p).join('&');

      if (params) {
        url = `/products?${params}`;
      }

      navigate(url);

      return newBrands;

      // useEffect will trigger listProducts with updated brands automatically
    });
  };
  // 🔑 NEW HANDLER: For the dropdown change
  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);

    // 🔑 Reset to page 1 if not already on page 1 when the size changes
    if (pageNumber !== 1) {
      // We need to navigate to reset the URL page number for consistent behavior
      const path = keyword ? `/search/${keyword}/page/1` : `/page/1`;
      navigate(path);
    }
  };

  // 🔑 1. EFFECT HOOK: ONLY FOR FETCHING FILTER OPTIONS (Runs Once)

  const filterOptions = useSelector((state) => state.filterOptions);

  const {
    availableBrands = [], // Default to empty array if undefined

    availableCategories = [], // Default to empty array if undefined

    loadingOptions,

    errorOptions,
  } = filterOptions || {};

  useEffect(() => {
    // Check if we already have the data in the store before dispatching.

    // This is the most crucial part for optimization.

    if (availableBrands.length === 0 && !loadingOptions && !errorOptions) {
      dispatch(listFilterOptions());
    }

    // 🔑 Empty dependency array [] means it runs ONLY on initial mount.

    // We rely on the initial check to prevent unnecessary fetches.
  }, [dispatch, availableBrands.length, loadingOptions, errorOptions]);

  // 🔑 2. EFFECT HOOK: FOR FETCHING PRODUCTS (UPDATED DISPATCH)
  useEffect(() => {
    // 🔑 Pass the new pageSize, along with the correct filters
    dispatch(
      listProducts(
        keyword || '',
        pageNumber || 1,
        pageSize, // 🔑 NEW PARAMETER
        selectedBrands,
        selectedCategories
      )
    );

    // Rerender when pageSize changes
  }, [dispatch, keyword, pageNumber, selectedBrands, selectedCategories, pageSize]);

  return (
    <div className="w-[100%] md:w-[90%] mx-auto px-0 py-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">All Products</h1>
        {/* Mobile Filter Toggle Button */}
        <button onClick={() => setShowFilters(true)} className="lg:hidden p-3 bg-black text-white rounded-lg shadow-md  transition flex items-center">
          <FontAwesomeIcon icon={faFilter} className="mr-2" /> Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 1. Filter Sidebar Component */}
        <ProductFilterSidebar
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          selectedBrands={selectedBrands}
          selectedCategories={selectedCategories}
          handleBrandChange={handleBrandChange}
          handleCategoryChange={handleCategoryChange}
        />

        {/* 2. Product Grid (Main Content) */}
        <div className="w-full lg:w-3/4">
          {/* 🔑 COMBINED HEADER AND SELECTOR */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-3 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
              {/* Displaying actual count if loaded, otherwise placeholder */}
              Showing {products.length || 0} Products
            </h2>

            {/* 🔑 PRODUCTS PER PAGE SELECTOR */}
            <div className="flex items-center space-x-4">
              <label htmlFor="pageSizeSelector" className="text-sm text-gray-700 font-medium whitespace-nowrap">
                Products per page:
              </label>
              <select id="pageSizeSelector" value={pageSize} onChange={handlePageSizeChange} className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* ... Product Mapping remains the same ... */}
                {products &&
                  Array.isArray(products) &&
                  products.map((product) => (
                    <div key={product._id} className="relative">
                      <Product product={product} customButtonText="Add to Cart & Checkout" customButtonHandler={() => handleAddToCart(product._id)} />
                    </div>
                  ))}
              </div>

              {/* RENDER PAGINATION: Pass the total pages and current page */}
              <Paginate pages={pages} page={page} keyword={keyword} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListScreen;
