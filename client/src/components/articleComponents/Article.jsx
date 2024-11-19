import { Link } from "react-router-dom";
import {
  AiOutlineComment,
  AiOutlineLike,
  AiOutlineFieldTime,
} from "react-icons/ai";

const Article = ({ article }) => {
  const { title, author, datePublished, category, image } =
    article;

  const profileImage = "https://picsum.photos/seed/pic/40/40"; // Random profile image

  return (
    <div className="overflow-hidden">
      {/* Card Image */}
      <div
        className="relative h-[260px]  overflow-hidden"
        style={{ borderRadius: "20px" }}
      >
        <Link to={`/articles/article`}>
          <img className="w-full h-full object-cover" src={image} alt={title} />
        </Link>

        {/* Title Badge */}
        <span className="absolute bottom-4 right-4 bg-[var(--green)] text-[var(--almost-white)] text-xs font-bold px-4 py-2 rounded">
          {category || "Uncategorized"}
        </span>
      </div>

      <div className="p-2">
        <Link
          to={`/articles/article`}
          className="inline-block mt-2 text-2xl font-semibold hover:cursor-pointer"
        >
          {title}
        </Link>
      </div>

      {/* Articles More Info */}
      <div className="flex items-center justify-between p-2 border-gray-200">
        <div className="flex items-center">
          <img
            src={profileImage}
            alt={author || "Author"}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-sm text-gray-700">{author || "Author"}</span>
        </div>
        <div className="flex items-center">
          <AiOutlineFieldTime
            className="text-gray-500"
            aria-label="Date published"
          />
          <span className="text-sm text-gray-700 ml-1">
            {datePublished || "Date"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Article;
