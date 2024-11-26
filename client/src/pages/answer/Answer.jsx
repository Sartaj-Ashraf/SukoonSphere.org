import React, { useState, useEffect } from "react";
import { GroupsSidebar, HeaderImg, ProfileSidebar, Spinner } from "@/components";
import { useAuth0 } from "@auth0/auth0-react";
import customFetch from "@/utils/customFetch";
import { Form, useLoaderData, useActionData, Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import UserAvatar from "@/components/shared/UserAvatar";

export const answersLoader = async () => {
  try {
    const { data } = await customFetch.get("/qa-section/all-questions");
    return { allQuestions: data.questions };
  } catch (error) {
    console.log(error);
    return { error: error?.response?.data?.msg || "Could not fetch answers." };
  }
  return null;
};

export const answerAction = async ({ request }) => {
  const formData = await request.formData();
  const context = formData.get("context");
  const questionId = formData.get("questionId");

  if (!context?.trim()) {
    return { error: "Answer cannot be empty" };
  }

  try {
    const { data } = await customFetch.post(`/qa-section/question/${questionId}/add-answer`, { context });
    return { success: data.msg };
  } catch (error) {
    console.log(error);
    return { error: error?.response?.data?.msg || "Could not submit answer." };
  }
};

const Answer = () => {
  const { user } = useUser();
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const { allQuestions, error: loadError } = useLoaderData();
  const [isLoading, setIsLoading] = useState(false);
  const actionData = useActionData();

  useEffect(() => {
    if (actionData?.success) {
      setSelectedQuestionId(null);
      setNewAnswer("");
    }
  }, [actionData]);


  const handleAnswerButtonClick = (questionId) => {
    if (!user) {
      toast.error("Please login to answer questions");
      return;
    }
    setSelectedQuestionId((prev) => (prev === questionId ? null : questionId));
    setNewAnswer("");
  };

  if (loadError) {
    return (
      <div className="text-center p-4 lg:p-8">
        <p className="text-red-500 text-lg md:text-xl">{loadError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }
  const groups = [
    {
      id: 1,
      name: "Mindfulness Practices 🧘‍♂️",
      image: "https://example.com/image_mindfulness.jpg",
    },
    {
      id: 2,
      name: "Coping with Anxiety 💭",
      image: "https://example.com/image_anxiety.jpg",
    },
    {
      id: 3,
      name: "Therapy Techniques 📖",
      image: "https://example.com/image_therapy.jpg",
    },
    {
      id: 4,
      name: "Depression Support Group ❤️",
      image: "https://example.com/image_depression.jpg",
    },
    {
      id: 5,
      name: "Stress Management Workshops 🌱",
      image: "https://example.com/image_stress.jpg",
    },
  ];

  return (
    <>
      <div className="relative max-w-7xl mx-auto p-2 md:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Profile Sidebar - Hidden on mobile, visible on md+ screens */}
          <div className="hidden lg:block md:col-span-3 sticky top-[10%] h-screen overflow-y-auto">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Coming Soon</h3>
              <div className="space-y-4">
                {groups.map((group) => (
                  <div key={group.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      {group.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{group.name}</p>
                      <p className="text-xs text-gray-500">Starting soon</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-1 md:col-span-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 border-b pb-3">Questions</h2>
            {allQuestions?.length === 0 ? (
              <div className="text-center p-4 md:p-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-600">No questions available at the moment.</p>
              </div>
            ) : (
              allQuestions?.map((question) => (
                <div
                  key={question._id}
                  className="flex flex-col gap-3 p-4 md:p-6 bg-white rounded-xl shadow-sm mb-4 border border-gray-100"
                >
                  <UserAvatar
                    createdBy={question?.author.userId}
                    username={question?.author.username}
                    userAvatar={question?.author.userAvatar}
                    createdAt={question?.createdAt}
                  />


                  <h3 className="text-base md:text-xl mb-2 font-bold text-[var(--grey--900)] hover:text-[var(--ternery)] transition-colors duration-200s">
                    {question?.questionText}
                  </h3>
                  <p className="text-base mb-2 leading-relaxed text-[var(--grey--800)]">{question.context}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {question?.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs md:text-sm text-gray-500 mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Total Answers: {question.answers?.length || 0}
                  </p>
                  <div className="flex flex-wrap md:flex-nowrap gap-2">
                    <button
                      onClick={() => handleAnswerButtonClick(question._id)}
                      className={`flex-1 md:flex-none inline-flex items-start justify-center gap-2 py-2 md:py-2.5 px-3 md:px-4 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${selectedQuestionId === question._id
                        ? "bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg"
                        }`}
                    >
                      {selectedQuestionId === question._id ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 md:h-5 w-4 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 md:h-5 w-4 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Answer
                        </>
                      )}
                    </button>
                    <Link
                      to={`/QA-section/question/${question._id}`}
                      className={`flex-1 md:flex-none inline-flex items-center justify-center gap-2 py-2 md:py-2.5 px-3 md:px-4 rounded-xl font-medium text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all duration-300 ${question.answers?.length === 0 ? 'opacity-50 pointer-events-none cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 md:h-5 w-4 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      See Answers ({question.answers?.length || 0})
                    </Link>
                  </div>

                  {selectedQuestionId === question._id && (
                    <Form method="post" className="mt-4">
                      <input type="hidden" name="questionId" value={question._id} />
                      <textarea
                        name="context"
                        placeholder="Write your answer..."
                        className="textarea textarea-bordered w-full mb-3 bg-white text-black border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl p-4 resize-none"
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        rows={4}
                        maxLength={500}
                      />
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
                        <span className="text-xs md:text-sm text-gray-500 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          {newAnswer.length}/500 characters
                        </span>
                        <button
                          type="submit"
                          className="w-full md:w-auto btn-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                          disabled={isLoading || !newAnswer.trim()}
                        >
                          {isLoading ? (
                            <>
                              <Spinner size="small" />
                              Submitting...
                            </>
                          ) : (
                            'Submit Answer'
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Groups Sidebar - Hidden on mobile, visible on md+ screens */}
          {/* <div className="hidden lg:block md:col-span-3 sticky top-[10%] h-screen overflow-y-auto">
            <GroupsSidebar groups={groups} />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Answer;
