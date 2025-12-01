import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { getUserDetails, updateUser } from '../../actions/userActions';
import { USER_UPDATE_RESET } from '../../constants/userConstants';

const UserEditScreen = () => {
  const { id: userId } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // State for fetching user details
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  // State for updating user
  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      // Reset the update state and redirect back to the user list
      dispatch({ type: USER_UPDATE_RESET });
      navigate('/admin/userlist');
    } else {
      // Check if the loaded user matches the URL ID or if it hasn't been loaded yet
      if (!user.name || user._id !== userId) {
        // If not loaded, dispatch action to fetch the user details
        dispatch(getUserDetails(userId));
      } else {
        // If loaded, populate the form fields
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, navigate, userId, user, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateUser({
        _id: userId,
        name,
        email,
        isAdmin,
      })
    );
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <Link to="/admin/userlist" className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block">
        <i className="fas fa-arrow-left mr-1"></i> Go Back
      </Link>

      <h1 className="text-2xl font-bold mb-6">Edit User</h1>

      {/* Show status messages for the Update operation */}
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

      {/* Show status messages for the Fetch operation */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <form onSubmit={submitHandler} className="space-y-4 bg-white p-6 shadow-md rounded-lg">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Admin Checkbox */}
          <div className="flex items-center">
            <input id="isAdmin" type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
            <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">
              Is Admin
            </label>
          </div>

          {/* Submit Button */}

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update
          </button>
        </form>
      )}
    </div>
  );
};

export default UserEditScreen;
