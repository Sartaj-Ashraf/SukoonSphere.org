import { useLoaderData } from "react-router-dom"
import { Article } from "..";
import { FaRegNewspaper } from "react-icons/fa";

const Spotlight = () => {
    const { data } = useLoaderData();
    const spotlight = data.find((article)=> article.views)
    return (
      <div>
        <div className="flex items-center gap-x-2 mb-6">
          <FaRegNewspaper className="size-6" />
          <h4 className="text-2xl">Spotlight</h4>
        </div>
        <Article article={spotlight} />
      </div>
    )
}
export default Spotlight