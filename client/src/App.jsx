import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; // <-- IMPORT useLocation

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Screens (Views)
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen'; 
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/UserListScreen';
import AdminLayout from './screens/AdminLayout'; // Note: Should be imported from components if it's just a layout
import UserEditScreen from './screens/UserEditScreen';
import ProductListAdminScreen from './screens/ProductListAdminScreen'; // Admin Product List Screen
import ProductEditScreen from './screens/ProductEditScreen'; // Admin Product Edit Screen
import OrderListScreen from './screens/OrderListScreen';
import ProductListScreen from './screens/ProductListScreen';



// --- NEW COMPONENT FOR CONDITIONAL RENDERING ---
const AppContent = () => {
  const location = useLocation();
  // Check if the current path starts with '/admin'
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen w-screen mx-auto"> 
      
      {/* 1. CONDITIONAL HEADER */}
      {!isAdminRoute && <Header />}

      <main className={`py-3 flex-grow container mx-auto px-4 ${isAdminRoute ? 'w-full max-w-none' : ''}`}> 
        <Routes>
          {/* Public Routes */}
          {/* Note: Removed duplicate root route */}
          <Route path="/" element={<HomeScreen />} /> 
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/cart/:id?" element={<CartScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />
          {/* 1. Default Products List (no search/page) */}
          <Route path='/products' element={<ProductListScreen />} /> 
          {/* 2. Paginated Products List */}
          <Route path='/products/page/:pageNumber' element={<ProductListScreen />} />
          {/* 3. Search Results (Future use, but good to add now) */}
          <Route path='/search/:keyword' element={<ProductListScreen />} />
          <Route path='/search/:keyword/page/:pageNumber' element={<ProductListScreen />} />




          {/* Admin Routes */}
          <Route path='/admin/userlist' element={<AdminLayout><UserListScreen /></AdminLayout>} />

          {/* Admin User Edit Route */}
          <Route path='/admin/user/:id/edit' element={<AdminLayout><UserEditScreen /></AdminLayout>} />

          {/* Admin Product List Route */}
          <Route path='/admin/productlist' element={<AdminLayout><ProductListAdminScreen /></AdminLayout>} />
          
          {/* Admin Product Edit Route */}
          <Route path='/admin/product/:id/edit' element={<AdminLayout><ProductEditScreen /></AdminLayout>} />

          {/* Admin Order List Route */}
          <Route path='/admin/orderlist' element={<AdminLayout><OrderListScreen/></AdminLayout>} />

          

        </Routes>
      </main>

      {/* 2. CONDITIONAL FOOTER */}
      {!isAdminRoute && <Footer />}
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