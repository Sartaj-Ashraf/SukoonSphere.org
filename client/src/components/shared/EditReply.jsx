import { useState } from "react";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";

const EditReply = ({ reply, onClose, onUpdate }) => {
  const [editedContent, setEditedContent] = useState(reply.content);

  const handleSave = async () => {
    if (!editedContent.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      // Check if it's a QA reply by checking for commentId (QA specific field)
      const isQAReply = Boolean(reply.commentId);
      const endpoint = isQAReply
        ? `/qa-section/answer/comments/replies/${reply._id}`  // QA reply
        : `/posts/comments/replies/${reply._id}`;  // Post reply

      console.log('Using endpoint:', endpoint);
      console.log('Is QA Reply:', isQAReply);
      console.log('Reply data:', reply);

      const response = await customFetch.patch(endpoint, { content: editedContent });
      
      // Preserve all original reply properties while updating with new data
      const updatedReply = {
        ...reply,
        ...response.data.reply,
        createdBy: reply.createdBy, // Preserve the createdBy field
        likes: response.data.reply.likes || reply.likes,
        totalLikes: response.data.reply.totalLikes || reply.likes?.length || 0,
        username: response.data.reply.username || reply.username,
        userAvatar: response.data.reply.userAvatar || reply.userAvatar,
        commentUsername: response.data.reply.commentUsername || reply.commentUsername,
        commentUserAvatar: response.data.reply.commentUserAvatar || reply.commentUserAvatar,
        commentUserId: response.data.reply.commentUserId || reply.commentUserId,
        commentId: reply.commentId // Preserve the commentId for QA replies
      };

      onUpdate(updatedReply);
      onClose();
      toast.success("Reply updated successfully");
    } catch (error) {
      console.log('Error updating reply:', error);
      console.log('Reply data that caused error:', reply);
      toast.error(error.response?.data?.msg || "Failed to update reply");
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        placeholder="Edit your reply..."
        className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 placeholder-ternary min-h-[100px] resize-none"
      />
      <div className="flex justify-end gap-3 pt-3 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!editedContent.trim()}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditReply;
