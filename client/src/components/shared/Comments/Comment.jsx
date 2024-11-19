import { FaRegHeart, FaReply } from "react-icons/fa";
import UserAvatar from "../UserAvatar";
import PostActions from "../PostActions";
import { useUser } from "@/context/UserContext";
import DeleteModal from "../DeleteModal";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Comment = ({ comment, handleDeleteComment, handleLikeComment, toggleReply }) => {
  const { user } = useUser();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.likes.includes(user?._id));
  const [likesCount, setLikesCount] = useState(comment.totalLikes || 0);
  const replyLink = toggleReply
    ? `/QA-section/question/answer/${comment.postId}/comments/${comment._id}/reply`
    : `/posts/${comment.postId}/comment-id/${comment._id}`;
  const likeCommnet = async () => {
    if (!user) {
      toast.error("Please login to like this comment!");
      return;
    }
    try {
      await handleLikeComment(comment._id);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div key={comment._id} className="flex flex-col gap-2 p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <UserAvatar
          username={comment.username}
          userAvatar={comment.userAvatar}
          createdAt={comment.createdAt}
          size="medium"
        />
        {user?._id === comment.createdBy && (
          <PostActions handleDelete={() => setShowDeleteModal(true)} />
        )}
      </div>
      <div className="ml-13">
        <div className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
          <p className="text-gray-800 text-sm mb-0 ">{comment.content}</p>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <button
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${isLiked
              ? "text-red-500 bg-red-50 hover:bg-red-100"
              : "text-gray-500 hover:bg-gray-100"
              }`}
            onClick={likeCommnet}
          >
            <FaRegHeart className="w-4 h-4" />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>
          <Link
            to={replyLink}
            className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
          >
            <FaReply className="w-4 h-4" />
            <span className="text-sm font-medium">{comment.totalReplies || 0}</span>
          </Link>
        </div>
      </div>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={async () => {
          await handleDeleteComment(comment._id);
          setShowDeleteModal(false);
        }}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        itemType="comment"
      />
    </div>
  );
};
export default Comment;
