import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '@/context/UserContext';
import customFetch from '@/utils/customFetch';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

const Inbox = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            toast.error('Unauthorized access');
            return;
        }
        fetchRequests();
    }, [user, navigate]);

    const fetchRequests = async () => {
        try {
            const response = await customFetch.get('/user/contributor-requests');
            setRequests(response.data.requests);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id) => {
        try {
            await customFetch.patch(`/user/accept-contributor/${id}`);
            toast.success('Request accepted successfully');
            fetchRequests(); // Refresh the list
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to accept request');
        }
    };

    const handleReject = async (id) => {
        try {
            await customFetch.delete(`/user/contributor-request/${id}`);
            toast.success('Request rejected');
            fetchRequests(); // Refresh the list
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to reject request');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <FaSpinner className="animate-spin text-4xl text-[var(--primary)]" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Contributor Requests</h1>
            
            {requests.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    No pending requests
                </div>
            ) : (
                <div className="grid gap-4">
                    {requests.map((request) => (
                        <div 
                            key={request._id}
                            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{request.fullname}</h3>
                                    <p className="text-gray-600 mb-1">{request.email}</p>
                                    <p className="text-gray-700 mt-3">{request.message}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAccept(request._id)}
                                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                        title="Accept Request"
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        onClick={() => handleReject(request._id)}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        title="Reject Request"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                                Status: <span className="font-semibold capitalize">{request.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Inbox;