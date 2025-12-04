// /client/src/components/ReviewForm.jsx (UPDATED for STAR RATINGS)

import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // 🔑 Import FontAwesome
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular } from '@fortawesome/free-solid-svg-icons'

const ReviewForm = ({ productId, onSubmit, onClose, initialRating = 0, initialComment = '' }) => {
    
    // State 1: Current rating (number)
    const [rating, setRating] = useState(initialRating) 
    // State 2: Current comment
    const [comment, setComment] = useState(initialComment)
    // 🔑 State 3: Rating under mouse hover (used for visual feedback)
    const [hoverRating, setHoverRating] = useState(0) 

    // Sync local state when initial props change (for editing)
    useEffect(() => {
        // Convert rating to a number for state consistency, although it might start as 0 or a prop value
        setRating(Number(initialRating)) 
        setComment(initialComment)
        
    }, [initialRating, initialComment])


    const submitHandler = (e) => {
        e.preventDefault()
        if (rating === 0) {
            alert('Please select a star rating (1-5).')
            return
        }
        onSubmit(productId, { rating, comment })
    }

    // Array representing the 5 stars
    const stars = [1, 2, 3, 4, 5]

    return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg mt-3 shadow-inner">
            <h4 className='text-lg font-bold mb-3'>Write Your Review</h4>
            <form onSubmit={submitHandler}>
                <div className='mb-3'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Rating:</label>
                    
                    {/* 🔑 STAR RATING IMPLEMENTATION */}
                    <div className="flex text-2xl space-x-1">
                        {stars.map((starValue) => (
                            <FontAwesomeIcon
                                key={starValue}
                                icon={starValue <= (hoverRating || rating) ? faStarSolid : faStarRegular}
                                
                                // 🔑 On click, set the permanent rating state
                                onClick={() => setRating(starValue)}
                                
                                // 🔑 On mouse enter, set the temporary hover state
                                onMouseEnter={() => setHoverRating(starValue)}
                                
                                // 🔑 On mouse leave, clear the hover state
                                onMouseLeave={() => setHoverRating(0)}
                                
                                // 🔑 Apply dynamic color for visual feedback
                                className={`cursor-pointer transition-colors duration-100 ${
                                    starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                                }`}
                            />
                        ))}
                    </div>
                    {/* Display current rating text */}
                    <p className="text-xs text-gray-500 mt-1">
                        {rating === 0 ? 'Select a rating' : `Selected: ${rating} Star${rating > 1 ? 's' : ''}`}
                    </p>
                </div>
                
                <div className='mb-3'>
                    <label className='block text-sm font-medium text-gray-700'>Comment:</label>
                    <textarea
                        rows='3'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mt-1 block w-full border bg-white border-gray-300 rounded-md shadow-sm p-2"
                        required
                    ></textarea>
                </div>
                
                <div className='flex justify-end space-x-14'>
                    <button type='button' onClick={onClose} className='py-2 px-4 border rounded-none text-sm font-medium text-white bg-red-600'>
                        Cancel
                    </button>
                    <button type='submit' className='py-2 px-4 bg-blue-600 text-white rounded-none text-sm font-medium hover:bg-blue-700'>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}


export default ReviewForm