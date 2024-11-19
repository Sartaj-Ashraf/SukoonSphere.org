import React, { useState } from 'react'
import { FaEllipsisV } from 'react-icons/fa'

const PostActions = ({ handleDelete }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaEllipsisV size={20} />
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-[10px] shadow-xl py-2 z-10 border border-gray-100">
            <button
              onClick={handleDelete}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );
}

export default PostActions
