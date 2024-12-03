import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import customFetch from '@/utils/customFetch';
import { FaCheck, FaTimes, FaSpinner, FaSearch } from 'react-icons/fa';

const Inbox = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('name'); // 'name' or 'email'

    useEffect(() => {
        fetchRequests();
    }, []);

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
            toast.success('removed from requests');
            fetchRequests(); // Refresh the list
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to reject request');
        }
    };

    const filteredRequests = () => {
        if (!searchTerm) return requests;

        const term = searchTerm.toLowerCase();
        return requests.filter(request => {
            if (searchBy === 'name') {
                return request.fullname.toLowerCase().includes(term);
            } else {
                return request.email.toLowerCase().includes(term);
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <FaSpinner className="animate-spin text-4xl text-[var(--primary)]" />
            </div>
        );
    }

    const displayedRequests = filteredRequests();

    return (
        <div className="">
            <div className="space-y-4 p-4">
                {/* <h2 className="text-xl md:text-2xl font-bold text-[var(--grey--900)]">Contributor Requests</h2> */}
                <div className="flex justify-between items-center">
                    <h2 className="text-base md:text-2xl font-semibold text-gray-800">Contributor Requests</h2>
                    <span className="text-sm text-gray-500">
                        {displayedRequests.length} Request{displayedRequests.length !== 1 ? 's' : ''}
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 min-w-0 sm:min-w-[300px]">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search by ${searchBy}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-[var(--grey-800)] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
                        />
                    </div>
                    <select
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg text-[var(--grey-800)] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:bg-gray-100"
                    >
                        <option value="name">Search by Name</option>
                        <option value="email">Search by Email</option>
                    </select>
                </div>
            </div>

            {displayedRequests.length === 0 ? (
                <div className="text-center text-gray-500 py-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {searchTerm ? 'No matching requests found' : 'No pending requests'}
                </div>
            ) : (
                <div className="grid gap-4">
                    {displayedRequests.map((request) => (
                        <div
                            key={request._id}
                            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[var(--grey-800)] break-words">{request.fullname}</h3>
                                    <p className="text-gray-600 mb-1 break-words">{request.email}</p>
                                    <p className="text-[var(--grey-700)] mt-3 leading-relaxed break-words">{request.message}</p>
                                </div>
                                <div className="flex sm:flex-col gap-2 self-end sm:self-start">
                                    {request.status === 'pending' && (
                                        <button
                                            onClick={() => handleAccept(request._id)}
                                            className="p-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow flex-shrink-0"
                                            title="Accept Request"
                                        >
                                            <FaCheck />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleReject(request._id)}
                                        className="p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow flex-shrink-0"
                                        title="Reject Request"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="text-sm text-gray-500">Status:</span>
                                <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${request.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                    }`}>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Inbox;