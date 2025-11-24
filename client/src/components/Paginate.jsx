// /client/src/components/Paginate.jsx

import React from 'react'
import { Link } from 'react-router-dom'

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
    
    // Do not display the component if there is only one page
    if (pages <= 1) {
        return null 
    }

    // Helper function to construct the correct URL for each page link
    const getLink = (p) => {
        // If it's an admin page, route to the admin list
        if (isAdmin) {
            return `/admin/productlist/${p}`
        }
        
        // If a keyword is active, maintain the search context
        if (keyword) {
            return `/search/${keyword}/page/${p}`
        }
        
        // Default public product list route
        return `/products/page/${p}`
    }

    return (
        <div className='flex justify-center my-8'>
            <nav className="relative z-0 inline-flex rounded-lg shadow-md -space-x-px" aria-label="Pagination">
                {/* Generates a button for each page (1 to pages) */}
                {[...Array(pages).keys()].map((x) => (
                    <Link 
                        key={x + 1} 
                        to={getLink(x + 1)}
                        className={`
                            relative inline-flex items-center px-4 py-2 border text-sm font-medium transition duration-150
                            ${x + 1 === page 
                                ? 'z-10 bg-indigo-600 border-indigo-600 text-white font-bold pointer-events-none' // Active page style
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' // Inactive page style
                            }
                            ${x + 1 === 1 ? 'rounded-l-lg' : ''}
                            ${x + 1 === pages ? 'rounded-r-lg' : ''}
                        `}
                    >
                        {x + 1}
                    </Link>
                ))}
            </nav>
        </div>
    )
}

export default Paginate