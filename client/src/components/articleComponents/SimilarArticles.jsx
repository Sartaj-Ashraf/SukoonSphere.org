
import { SidebarArticles } from "..";

const SimilarArticles = ({ title }) => {
  return (
    <div className="card grid ">
      <h1 className="card-title text-black">{title}</h1>
      <SidebarArticles />
      <div className="grid"></div>
    </div>
  );
};
export default SimilarArticles