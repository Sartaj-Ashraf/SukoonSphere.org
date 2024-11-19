import React, { useState, useEffect } from 'react';
import { FaHeart, FaReply, FaThumbsUp } from 'react-icons/fa';
import { useUser } from '@/context/userContext';
import '../../assets/styles/global.css';

const ReactionButtons = ({
    likes = [],
    totalLikes = 0,
    onLike,
    onError,
    onReply,
    showReplyButton = true
}) => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [likeState, setLikeState] = useState({
        isLiked: false,
        count: 0,
    });

    useEffect(() => {
        if (!user) return;
        setLikeState({
            isLiked: Array.isArray(likes) && likes.includes(user._id),
            count: totalLikes
        });
    }, [totalLikes, user, likes]);

    const handleLike = async (e) => {
        e.stopPropagation();

        if (!user) {
            onError?.('Please login to like posts');
            return;
        }
        try {
            setIsLoading(true);
            await onLike();

            setLikeState(prev => ({
                isLiked: !prev.isLiked,
                count: prev.isLiked ? prev.count - 1 : prev.count + 1,
            }));
        } catch (error) {
            console.error('Error liking post:', error);
            onError?.('Failed to like post');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
                <span className="text-sm sm:text-base mr-1">{likeState.count}</span>
                <button type="submit" className="bg-transparent border-none cursor-pointer" onClick={handleLike} disabled={isLoading}>
                    <FaThumbsUp
                        className={`${likeState.isLiked && 'text-blue-500'} cursor-pointer size-2 sm:size-4`}
                    />
                </button>
            </div>
            {showReplyButton && (
                <button
                    onClick={onReply}
                    className="hover:text-blue-600 flex items-center gap-1"
                >
                    <FaReply className="w-4 h-4" />
                    Reply
                </button>
            )}
        </div>
    );
};

export default ReactionButtons;