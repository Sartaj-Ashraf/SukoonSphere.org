import { useUser } from '@/context/UserContext';
import customFetch from '@/utils/customFetch';
import React, { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import DeleteModal from '@/components/shared/DeleteModal';
import { Link, useOutletContext } from 'react-router-dom';
import UserAvatar from '@/components/shared/UserAvatar';

const UserAnswers = () => {
    const user = useOutletContext();
    const {user:loggedUser} = useUser();
    const [answers, setAnswers] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedAnswerId, setSelectedAnswerId] = useState(null);

    const fetchUserAnswers = async () => {
        try {
            const { data } = await customFetch.get(`/qa-section/user-answers/${user._id}`);
            setAnswers(data.answers);
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await customFetch.delete(`/qa-section/question/answer/${selectedAnswerId}`);
            setShowDeleteModal(false);
            fetchUserAnswers();
        } catch (error) {
            console.error('Error deleting answer:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchUserAnswers();
    }, [])

    return (
        <div className='bg-white rounded-lg p-4 space-y-4'>
            <h2 className="text-xl font-bold mb-4 text-black text-center">Answers Given</h2>
            <div className="divide-y divide-gray-200 space-y-4">
                {answers?.length === 0 ? (
                    <p className="text-[var(--primary)] text-center py-4">No answers given yet!</p>
                ) : (
                    answers.map((answer) => (
                        <div key={answer._id} className="mb-8 p-6 rounded-xl bg-white transition duration-300 shadow-1 hover:shadow-2">
                            <div className="flex items-center mb-4 justify-between">
                            <UserAvatar
                                    createdBy={answer.author?.userId}
                                    username={answer?.username}
                                    userAvatar={answer?.userAvatar}
                                    createdAt={answer.createdAt}
                                />
                                {user._id === loggedUser._id &&<div className="relative">
                                    <BsThreeDotsVertical
                                        className="text-black cursor-pointer"
                                        onClick={() => {
                                            setSelectedAnswerId(answer._id);
                                            setShowActionModal(!showActionModal);
                                        }}
                                    />
                                    {showActionModal && selectedAnswerId === answer._id && (
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
                                </div>}
                            </div>
                            <Link   to={`/QA-section/question/answer/${answer._id}/comments`}><p className="text-gray-700 mb-4">{answer.context}</p></Link>

                            <div className="flex items-center text-sm text-gray-500">
                                <span>{answer.likes?.length || 0} likes</span>
                                <span className="mx-2">•</span>
                                <span>{answer.comments?.length || 0} comments</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDelete}
                title="Delete Answer"
                message="Are you sure you want to delete this answer?"
                itemType="answer"
                isLoading={isDeleting}
            />
        </div>
    )
}

export default UserAnswers
