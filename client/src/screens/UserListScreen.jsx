import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listUsers, deleteUser } from '../actions/userActions' // <-- Import deleteUser

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';



const UserListScreen = ({ history }) => {
  const dispatch = useDispatch()

  const userList = useSelector((state) => state.userList)
  const { loading, error, users } = userList

  // NEW: Get the state for the delete operation
  const userDelete = useSelector((state) => state.userDelete)
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = userDelete

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    // Check if the user is logged in AND is an admin
    if (userInfo && userInfo.isAdmin) {
      // Re-fetch users on initial load OR after a successful deletion (successDelete)
      dispatch(listUsers())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo, successDelete]) // <-- Added successDelete as dependency

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id)) // <-- Dispatch the delete action
    }
  }

  return (
    <div className='p-4 w-full border overflow-x-clip'>
      <h1 className='text-3xl text-black font-bold mb-6'>Users</h1>

      {/* Show loader/message for the DELETE operation */}
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {successDelete && <Message variant='success'>User Deleted Successfully</Message>}

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
                  EMAIL
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  ADMIN
                </th>
                <th className='px-6 py-3'></th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {users.map((user) => (
                <tr key={user._id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {user._id}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {user.name}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <a href={`mailto:${user.email}`} className='text-blue-600 hover:text-blue-900'>
                      {user.email}
                    </a>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    {user.isAdmin ? (
                      <FontAwesomeIcon icon={faCheck} className='text-green-500' />
                    ) : (
                      <FontAwesomeIcon icon={faTimes} className='text-red-500' />
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    {/* Edit Button */}
                    <Link
                      to={`/admin/user/${user._id}/edit`}
                      className='text-indigo-600 hover:text-indigo-900 mr-2 p-2 rounded-full hover:bg-indigo-100'
                    >
                     <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    
                    {/* Delete Button */}
                    {/* Prevent admin from deleting themselves, assuming you have the user info object */}
                    {userInfo._id !== user._id && (
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className='text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100'
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                    )}
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

export default UserListScreen