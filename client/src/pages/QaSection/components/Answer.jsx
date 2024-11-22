import DeleteModal from "@/components/shared/DeleteModal";
import PostActions from "@/components/shared/PostActions";
import UserAvatar from "@/components/shared/UserAvatar";
import customFetch from "@/utils/customFetch";
import { useState } from "react";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Answer = ({ answer, user, answerCount }) => {
  const navigate = useNavigate();
  const [showAnswerDeleteModal, setShowAnswerDeleteModal] = useState(false);
  const [isLiked, setIsLiked] = useState(answer.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(answer.totalLikes || 0);

  const handleDeleteAnswer = async () => {
    try {
      await customFetch.delete(`/qa-section/question/answer/${answer._id}`);
      setShowAnswerDeleteModal(false);

      toast.success("Answer deleted successfully");
      answerCount === 1 ? navigate('/qa-section') : window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikeAnswer = async () => {
    if (!user) {
      toast.error("Please login to like an answer");
      return;
    }
    try {
      await customFetch.patch(`/qa-section/question/answer/${answer._id}/like`);
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <UserAvatar
          createdBy={answer?.author?.userId}
          username={answer?.author?.username}
          userAvatar={answer?.author?.userAvatar}
          createdAt={answer?.createdAt}
        />
        {user && answer.author?.userId === user?._id && (
          <PostActions handleDelete={() => setShowAnswerDeleteModal(true)} />
        )}
      </div>
      <div className="prose max-w-none mb-2">
        <p className="text-gray-700 leading-relaxed">{answer.context}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${isLiked ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-gray-500 hover:bg-gray-100"}`}
          onClick={handleLikeAnswer}
        >
          <FaRegHeart className="w-4 h-4" />
          <span className="text-sm font-medium text-gray-600">{likeCount}</span>
        </button>
        <Link
          to={`/QA-section/question/answer/${answer._id}/comments`}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-all duration-200"
        >
          <FaRegComment className="w-4 h-4" />
          <span className="text-sm font-medium text-gray-600">
            {answer.totalComments}
          </span>
        </Link>
      </div>
      <DeleteModal
        isOpen={showAnswerDeleteModal}
        onClose={() => setShowAnswerDeleteModal(false)}
        onDelete={handleDeleteAnswer}
        title="Delete Answer"
        message="Are you sure you want to delete this answer?"
        itemType="answer"
      />
    </div>
  );
};

export default Answer;
