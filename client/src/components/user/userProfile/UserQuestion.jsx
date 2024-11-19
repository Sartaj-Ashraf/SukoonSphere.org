import { useUser } from '@/context/UserContext';
import customFetch from '@/utils/customFetch';
import React, { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import DeleteModal from '@/components/shared/DeleteModal';

const UserQuestions = () => {
    const { user } = useUser();
    const [questions, setQuestions] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);

    const fetchUserQuestions = async () => {
        try {
            const { data } = await customFetch.get(`/qa-section/user-questions/${user._id}`);
            setQuestions(data.questions);
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await customFetch.delete(`/qa-section/question/${selectedQuestionId}`);
            setShowDeleteModal(false);
            fetchUserQuestions();
        } catch (error) {
            console.error('Error deleting question:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchUserQuestions();
    }, [])

    return (
        <div className='bg-white shadow rounded-lg p-4 space-y-4'>
            <h2 className="text-xl font-bold mb-4 text-black text-center">Questions Posted</h2>
            <div className="divide-y divide-gray-200 space-y-4">
                {questions?.length === 0 ? (
                    <p className="text-[var(--primary)] text-center py-4">No questions asked yet!</p>
                ) : (
                    questions.map((question) => (
                        <div key={question._id} className="mb-8 p-6 rounded-lg bg-white transition duration-300 shadow-1 hover:shadow-2">
                            <div className="flex items-center mb-4 justify-between">
                                <div className="flex items-center">
                                    <img
                                        src={question.author?.picture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWXzCSPkpN-TPug9XIsssvBxZQHkZEhjoGfg&s"}
                                        alt={`${question.author?.username}'s avatar`}
                                        className="w-12 h-12 rounded-full mr-3 border-2 border-blue-500"
                                    />
                                    <div>
                                        <p className="font-semibold text-[var(--primary)]">
                                            {question.author?.username}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(question.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <BsThreeDotsVertical
                                        className="text-black cursor-pointer"
                                        onClick={() => {
                                            setSelectedQuestionId(question._id);
                                            setShowActionModal(!showActionModal);
                                        }}
                                    />
                                    {showActionModal && selectedQuestionId === question._id && (
                                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                                            <button
                                                className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 rounded-lg"
                                                onClick={() => {
                                                    setShowDeleteModal(true);
                                                    setShowActionModal(false);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                {question.questionText}
                            </h2>
                            <p className="text-gray-700 mb-4">{question.context}</p>

                            <div className="flex flex-wrap mb-4">
                                {question.tags?.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-200 text-blue-800 text-xs font-medium mr-2 px-3 py-1 rounded-full transition duration-200 hover:bg-blue-300"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDelete}
                title="Delete Question"
                message="Are you sure you want to delete this question?"
                itemType="question"
                isLoading={isDeleting}
            />
        </div>
    )
}

export default UserQuestions
