import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; // <-- IMPORT useLocation
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Components
import Header from './components/Header';
import Footer from './components/Footer';


// Screens (Views)
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen'; 
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';

// import ProfileScreen from './screens/ProfileDetailsScreen';
import ProfileDetailsScreen from './screens/ProfileDetailsScreen';
import AccountScreen from './screens/AccountScreen';
import AccountDashboardScreen from './screens/AccountDashboardScreen';
import AddressScreen from './screens/AddressScreen';

import OrderAdminScreen from './screens/admin/OrderAdminScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
import ProductListAdminScreen from './screens/admin/ProductListAdminScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductListScreen from './screens/ProductListScreen';
import AdminLayout from './layouts/AdminLayout';
import DashboardScreen from './screens/admin/DashboardScreen';




// --- NEW COMPONENT FOR CONDITIONAL RENDERING ---
const AppContent = () => {
  const location = useLocation();
  // Check if the current path starts with '/admin'
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen w-screen mx-auto p-0 bg-white"> 
      
      {/* 1. CONDITIONAL HEADER */}
      {!isAdminRoute && <Header />}

      <main className={`py-3 flex-grow w-screen px-4 ${isAdminRoute ? 'max-w-none' : ''}`}> 
        <Routes>
          {/* Public Routes */}
          {/* Note: Removed duplicate root route */}
          <Route path="/" element={<HomeScreen />} /> 
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/cart/:id?" element={<CartScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          {/* <Route path="/profile" element={<ProfileScreen />} /> */}
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />

          <Route path="/account" element={<AccountScreen />}>
            <Route index element={<AccountDashboardScreen />} /> 
            <Route path="details" element={<ProfileDetailsScreen />} /> 
            <Route path="orders" element={<ProfileDetailsScreen isOrdersOnly={true} />} /> 
            <Route path="addresses" element={<AddressScreen/>} />
          </Route>

          {/* 1. Default Products List (no search/page) */}
          {/* <Route path='/products' element={<ProductListScreen />} />  */}
          {/* 2. Paginated Products List */}
          {/* <Route path='/products/page/:pageNumber' element={<ProductListScreen />} /> */}
          {/* 3. Search Results (Future use, but good to add now) */}
          {/* <Route path='/products/search/:keyword' element={<ProductListScreen />} />*/}
          {/* <Route path='/products/search/:keyword/page/:pageNumber' element={<ProductListScreen />} />  */}

          <Route path="/products" element={<ProductListScreen />} exact /> {/* Default Products List */}
          <Route path="/page/:pageNumber" element={<ProductListScreen />} /> {/* Paginated Products List */}
          <Route path="/products/search/:keyword" element={<ProductListScreen />} /> {/* Search Results */}
          <Route path="/search/:keyword/page/:pageNumber" element={<ProductListScreen />} /> {/* Search Results Paginated */}




          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}> {/* 🔑 Use AdminLayout as parent */}
            {/* The UserListScreen will be the default view if you navigate to /admin */}
            <Route path="userlist" element={<UserListScreen />} /> 
            <Route path="productlist" element={<ProductListAdminScreen />} />
            <Route path="productlist/:pageNumber" element={<ProductListAdminScreen />} />
            <Route path="product/:id/edit" element={<ProductEditScreen />} />
            <Route path="user/:id/edit" element={<UserEditScreen />} />
            <Route path="orderlist" element={<OrderListScreen />} />
            <Route path="order/:id" element={<OrderAdminScreen />} />
            <Route path="dashboard" element={<DashboardScreen />} />
            {/* Add other admin routes here */}
          </Route>




          {/* <Route path='/admin/userlist' element={<AdminLayout><UserListScreen /></AdminLayout>} /> */}
          {/* <Route path='/admin/user/:id/edit' element={<AdminLayout><UserEditScreen /></AdminLayout>} /> */}
          {/* <Route path='/admin/productlist' element={<AdminLayout><ProductListAdminScreen /></AdminLayout>} /> */}
          {/* <Route path='/admin/product/:id/edit' element={<AdminLayout><ProductEditScreen /></AdminLayout>} /> */}
          {/* <Route path='/admin/orderlist' element={<AdminLayout><OrderListScreen/></AdminLayout>} /> */}

          

        </Routes>
      </main>

      {/* 2. CONDITIONAL FOOTER */}
      {!isAdminRoute && <Footer />}
      <ToastContainer position="top-center" autoClose={10000} />
    </div>
  );
};
// --- END NEW COMPONENT ---


function App() {
  return (
    <Router>
      <AppContent /> {/* Render the content logic within the Router */}
    </Router>
  );
}

export default App;