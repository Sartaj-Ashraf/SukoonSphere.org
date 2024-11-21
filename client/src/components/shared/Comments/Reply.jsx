import UserAvatar from "../UserAvatar";
import PostActions from "../PostActions";
import DeleteModal from "../DeleteModal";
import { Form, Link } from "react-router-dom";
import { FaRegHeart, FaReply } from "react-icons/fa";
import { useState } from "react";
import { useUser } from "@/context/userContext";
import { toast } from "react-toastify";
const Reply = ({ reply, handleDeleteReply, handleLikeReply, handleSubmit }) => {
  const { user } = useUser();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLiked, setIsLiked] = useState(reply.likes.includes(user?._id));
  const [likesCount, setLikesCount] = useState(reply.totalLikes || 0);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const deleteReply = async () => {
    try {
      await handleDeleteReply(reply._id);
      setShowDeleteModal(false);
      toast.success("Reply deleted successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const likeReply = async () => {
    if (!user) {
      toast.error("Please login to like this reply!");
      return;
    }
    try {
      await handleLikeReply(reply._id);
      setIsLiked(!isLiked);
      setLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReplyClick = () => {
    // Close any other open reply forms first
    const allReplyForms = document.querySelectorAll('.reply-form');
    allReplyForms.forEach(form => {
      if (form !== event.currentTarget.closest('.reply-container')) {
        form.style.display = 'none';
      }
    });

    setShowReplyForm(!showReplyForm);
  };

  return (
    <div key={reply._id} className="flex flex-col gap-3 reply-container">
      <div className="flex justify-between items-start">
        <UserAvatar
          username={reply.username}
          userAvatar={reply.userAvatar}
          createdAt={reply.createdAt}
          size="verySmall"
        />
        {user?._id === reply.createdBy && (
          <PostActions handleDelete={() => setShowDeleteModal(true)} />
        )}
      </div>

      <div className="ml-13">
        <div className="bg-gray-50 p-1 rounded-[10px]">
          <Link className="text-blue-500" to={`/profile/${reply.createdBy}`}>@{reply.commentUsername}</Link>
          <span className="text-gray-800">&nbsp; &nbsp;{reply.content}</span>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <button
          className={`flex items-center gap-2 px-2 py-1 rounded-full transition-all duration-200 ${isLiked
            ? "text-red-500 bg-red-50 hover:bg-red-100"
            : "text-gray-500 hover:bg-gray-100"
            }`}
            onClick={likeReply}
          >
            <FaRegHeart className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-sm">{likesCount}</span>
          </button>

          <button
            onClick={handleReplyClick}
            className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
          >
            <FaReply className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>

        {showReplyForm && (
          <Form onSubmit={(e) => {
            handleSubmit(e)
            window.scrollTo({ top: 700, behavior: 'smooth' });

          }} className="mt-2 relative reply-form">
            <textarea
              name="content"
              placeholder="Write a reply..."
              className="w-full p-3 pr-14 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none text-gray-700"
              rows="1"
            />
            <button
              className="absolute bottom-3 right-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-2 h-2 md:w-3 md:h-3"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </Form>
        )}
      </div>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={async () => {
          await deleteReply();
        }}
        title="Delete Reply"
        message="Are you sure you want to delete this reply?"
        itemType="reply"
      />
    </div>
  );
};
export default Reply;
