import customFetch from "@/utils/customFetch";
import { Form, useParams } from "react-router-dom";
import { Reply } from "../Comments";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
const RepliesSection = ({ addReply, replies, fetchReplies, deleteReply, likeReply }) => {
  const { user } = useUser();
  const { commentId } = useParams();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const content = formData.get("content");
    if (!user) {
      toast.error("Please login to add a reply!");
      return;
    }
    addReply(commentId, content);
    fetchReplies();
    e.target.reset();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <Form onSubmit={handleSubmit} className="relative">
        <textarea
          name="content"
          placeholder="Write a reply..."
          className="w-full p-3 pr-14 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none   text-gray-700"
          rows='2'
        />
        <button
          type="submit"
          className="absolute bottom-5 right-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </Form>
      <div className="space-y-4 mt-6 px-4 pb-4 max-h-[400px] overflow-y-auto no-scrollbar">
        {replies &&
          replies.map((reply) => (
            <Reply
              key={reply._id}
              reply={reply}
              handleDeleteReply={deleteReply}
              handleLikeReply={likeReply}
              handleSubmit={handleSubmit}
            />
          ))}
      </div>
    </div>
  );
};
export default RepliesSection