
import { podcastsLists } from "@/utils/podcastsLists";
import SideBarPodcast from "./SideBarPodcast";

const SimilarPodcasts = ({ title }) => {
  console.log(title)
  return (
    <div className="card grid">
      <h1 className="card-title text-black">{title}</h1>
      {
        podcastsLists[0].podcasts.slice(0, 4).map((_podcast, index) => (
          <SideBarPodcast key={index} podcast={_podcast} />
        ))
      }
    </div>
  );
};
export default SimilarPodcasts