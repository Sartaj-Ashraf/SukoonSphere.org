import { useOutletContext } from "react-router-dom";
import QuestionCard from "./components/QuestionCard";

const QaOutlet = () => {
  const { questions } = useOutletContext();
  return (
    <div>
      {questions?.length > 0 ? (
        questions.map((question) => <QuestionCard question={question} key={question._id} />)
      ) : (
        <div className="text-center py-8 bg-white rounded-lg">
          <p className="text-[var(--primary-color)]">
            No questions available! Start asking questions.
          </p>
        </div>
      )}
    </div>
  );
}
export default QaOutlet