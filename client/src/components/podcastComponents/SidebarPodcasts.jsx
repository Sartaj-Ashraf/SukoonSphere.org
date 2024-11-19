import { Link } from "react-router-dom";
import { SideBarArticle } from "..";
import { podcasts } from "@/utils/Podcast";
import SideBarPodcast from "./SideBarPodcast";

const SidebarPodcasts = () => {
  console.log({podcasts})
  return (
    <></>
    // <div>
    //   {podcasts.slice(0, 4).map((podcast, index) => {
    //     return (
    //       <SideBarPodcast key={index} podcast={podcast}/>
    //     );
    //   })}
    // </div>
  );
};

export default SidebarPodcasts;
