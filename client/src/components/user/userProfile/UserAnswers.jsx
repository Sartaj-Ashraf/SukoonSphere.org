import { useUser } from '@/context/UserContext';
import customFetch from '@/utils/customFetch';
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';
import Answer from '@/pages/stories&discussions/qaSection/components/Answer';

const UserAnswers = () => {
    const user = useOutletContext();
    const { user: loggedUser } = useUser();
    const [answers, setAnswers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUserAnswers = async () => {
        try {
            const { data } = await customFetch.get(`/qa-section/user-answers/${user._id}`);
            // Transform the data to match Answer component expectations
            const transformedAnswers = data.answers.map(answer => ({
                ...answer,
                author: {
                    userId: answer.createdBy,
                    username: answer.username,
                    userAvatar: answer.userAvatar
                }
            }));
            setAnswers(transformedAnswers);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUserAnswers();
    }, [user._id]);

    const filteredAnswers = answers.filter(answer =>
        (answer.context?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (answer.question?.questionText?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    const updateAnswersList = (deletedAnswerId) => {
        setAnswers(answers.filter(answer => answer._id !== deletedAnswerId));
    };

    return (
        <div className="lg:p-6 bg-white rounded-xl shadow-sm">
            {/* Search Bar */}
            <div className="mb-4 lg:mb-8">
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
            <div className="flex items-center justify-between mb-4 lg:mb-8">
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
                        <Answer
                            key={answer._id}
                            answer={answer}
                            user={loggedUser}
                            answerCount={filteredAnswers.length}
                            onDelete={updateAnswersList}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserAnswers;
