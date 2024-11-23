import { useUser } from '@/context/UserContext';
import customFetch from '@/utils/customFetch';
import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import DeleteModal from '@/components/shared/DeleteModal';
import { Link, useOutletContext } from 'react-router-dom';
import UserAvatar from '@/components/shared/UserAvatar';

const UserQuestions = () => {
    const user = useOutletContext();
    const {user : loggedUser} = useUser();
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
    }

    useEffect(() => {
        fetchUserQuestions();
    }, [user._id, selectedQuestionId]);

    return (
        <div className='bg-[var(--body)] rounded-lg shadow-sm'>
            <h2 className="text-2xl font-semibold text-[var(--primary)] p-4 border-b">Questions Posted</h2>
            <div className="p-4 space-y-4">
                {questions && questions?.length === 0 ? (
                    <div className="text-center p-8 bg-white rounded-[10px] shadow-sm">
                        <p className="text-gray-600">No questions asked yet!</p>
                    </div>
                ) : (
                    questions.map((question) => (
                        <div key={question?._id} className="bg-white rounded-[10px] shadow-sm p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                    <UserAvatar
                                        createdBy={question?.author}
                                        username={question?.username}
                                        userAvatar={question?.userAvatar}
                                        createdAt={question?.createdAt}
                                    />
                                <div className="relative">
                                    {user._id === loggedUser._id && <button
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        onClick={() => {
                                            setSelectedQuestionId(question._id);
                                            setShowActionModal(!showActionModal);
                                        }}
                                    >
                                        <BsThreeDotsVertical className="text-gray-600" />
                                    </button>}
                                    {showActionModal && selectedQuestionId === question._id && (
                                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border z-10">
                                            <button
                                                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

                            <Link 
                                to= {`/QA-section/question/${question._id}`}
                                    className="cursor-pointer"
                            >
                                <h3 className="text-lg font-semibold text-[var(--primary)] mb-2">
                                    {question.questionText}
                                </h3>
                            </Link>
                            <p className="text-gray-700 mb-4 line-clamp-2">{question.context}</p>

                            <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                    {question.tags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {question.totalAnswers || 0} {question.totalAnswers === 1 ? 'Answer' : 'Answers'}
                                </div>
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
    );
}

export default UserQuestions;
