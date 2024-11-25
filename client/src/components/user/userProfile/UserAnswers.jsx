import { useUser } from '@/context/UserContext';
import customFetch from '@/utils/customFetch';
import React, { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaSearch } from 'react-icons/fa';
import DeleteModal from '@/components/shared/DeleteModal';
import { Link, useOutletContext } from 'react-router-dom';
import UserAvatar from '@/components/shared/UserAvatar';

const UserAnswers = () => {
    const user = useOutletContext();
    const { user: loggedUser } = useUser();
    const [answers, setAnswers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedAnswerId, setSelectedAnswerId] = useState(null);

    const fetchUserAnswers = async () => {
        try {
            const { data } = await customFetch.get(`/qa-section/user-answers/${user._id}`);
            setAnswers(data.answers);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        fetchUserAnswers();
    }, [user._id]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await customFetch.delete(`/qa-section/question/answer/${selectedAnswerId}`);
            setAnswers(answers.filter(answer => answer._id !== selectedAnswerId));
            setShowDeleteModal(false);
        } catch (error) {
            console.log(error);
        }
        setIsDeleting(false);
    };

    const filteredAnswers = answers.filter(answer =>
        (answer.answerText?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (answer.question?.questionText?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
    console.log({ answers })

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm">
            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Search in answers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-5 py-3 pl-12 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    />
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                </div>
            </div>

            {/* Answers Count */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    Answers <span className="text-blue-500 ml-2">{filteredAnswers.length}</span>
                </h2>
            </div>

            {/* Answers List */}
            {filteredAnswers.length === 0 ? (
                <div className="text-center py-12 px-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        {searchQuery ? 'No matching answers found' : 'No answers yet'}
                    </h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        {searchQuery
                            ? 'Try searching with different keywords'
                            : 'Share your knowledge by answering questions!'}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredAnswers.map((answer) => (
                        <div key={answer._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                            <div className="flex flex-col space-y-4">
                                {/* User Info and Date */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <UserAvatar
                                            createdBy={answer.createdBy}
                                            username={answer.username}
                                            userAvatar={answer.userAvatar}
                                            createdAt={answer.createdAt}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(answer.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Answer Content */}
                                <div className="ml-1">
                                    <Link to={`/Qa-section/question/answer/${answer._id}/comments`} className="block group">
                                        <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                                            {answer.question.questionText}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-600 mt-2 line-clamp-3">
                                        {answer.answerText}
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{answer.likes?.length || 0} likes</span>
                                    </div>
                                    {loggedUser?._id === user._id && (
                                        <div className="relative">
                                            <button
                                                onClick={() => {
                                                    setSelectedAnswerId(answer._id);
                                                    setShowActionModal(!showActionModal);
                                                }}
                                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                                            >
                                                <BsThreeDotsVertical className="text-gray-500" />
                                            </button>
                                            {showActionModal && selectedAnswerId === answer._id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                                                    <button
                                                        onClick={() => {
                                                            setShowDeleteModal(true);
                                                            setShowActionModal(false);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                                                    >
                                                        Delete Answer
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showDeleteModal && (
                <DeleteModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                    title="Delete Answer"
                    message="Are you sure you want to delete this answer? This action cannot be undone."
                />
            )}
        </div>
    );
};

export default UserAnswers;
