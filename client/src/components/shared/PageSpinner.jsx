import React from 'react';
import Spinner from './Spinner';

const PageSpinner = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <Spinner size="large" />
                <p className="mt-4 text-gray-700">Loading...</p>
            </div>
        </div>
    );
};

export default PageSpinner; 