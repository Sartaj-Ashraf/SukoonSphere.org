import DeleteModal from "@/components/shared/DeleteModal";
import PostActions from "@/components/shared/PostActions";
import UserAvatar from "@/components/shared/UserAvatar";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Answer from "./components/Answer";
import { toast } from "react-toastify";

const AllQuestionAnswers = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState({});
  const { id } = useParams();

  const fetchAnswers = async () => {
    try {
      const { data } = await customFetch.get(`qa-section/question/${id}/answers`);
      console.log({ data });
      setAnswers(data.answers);
      setQuestion(data.question);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteQuestion = async () => {

    try {
      await customFetch.delete(`/qa-section/question/${id}`);
      toast.success("Question deleted successfully");
      setShowDeleteModal(false);
      navigate('/qa-section')
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAnswers()

  }, [id]);
  console.log({ answers });
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-3 border border-gray-100">
      {/* question  */}
      <div className="flex items-center justify-between mb-3">
        <UserAvatar
          username={question?.author?.username}
          userAvatar={question?.author?.userAvatar}
          createdAt={question?.createdAt}
        />
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
            {question?.totalAnswers}{" "}
            {question?.totalAnswers === 1 ? "Answer" : "Answers"}
          </span>
          {user && question?.author?.userId === user?._id && (
            <PostActions handleDelete={() => setShowDeleteModal(true)} />
          )}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 hover:text-blue-600 transition-colors duration-200">
          {question?.questionText}
        </h2>
        <p className="text-gray-600 mb-3 leading-relaxed">
          {question?.context}
        </p>
        <div className="flex flex-wrap gap-2 mb-2">
          {question?.tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      {answers?.map((answer) => (
        <Answer answer={answer} key={answer._id} user={user} answerCount={answers.length} />
      ))}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteQuestion}
        title="Delete Question"
        message="Are you sure you want to delete this question?"
        itemType="question"
      />
    </div>
  );
}
export default AllQuestionAnswers