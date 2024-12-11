import React from 'react';
import { FiClock, FiCalendar, FiMessageSquare } from 'react-icons/fi';

const QaFilter = ({ activeFilter, onFilterChange }) => {
    const filters = [
        { id: 'newest', label: 'Newest', icon: <FiClock className="w-4 h-4" /> },
        { id: 'oldest', label: 'Oldest', icon: <FiCalendar className="w-4 h-4" /> },
        { id: 'mostAnswered', label: 'Most Answered', icon: <FiMessageSquare className="w-4 h-4" /> },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="overflow-x-auto pb-2">
                <div className="flex gap-3 min-w-max">
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => onFilterChange(filter.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ease-in-out whitespace-nowrap
                                ${activeFilter === filter.id
                                    ? 'bg-primary text-white shadow-md transform scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                                }
                            `}
                        >
                            {filter.icon}
                            <span className="text-sm font-medium">{filter.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QaFilter;
