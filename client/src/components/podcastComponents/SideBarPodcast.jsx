import { Link } from "react-router-dom";

const SideBarPodcast = ({ podcast }) => {
  const { title, description, image } = podcast;
  return (
    <div className=" py-4 grid grid-cols-3 gap-4 border-b-2">
      <div className="col-span-2">
        <Link to="#">
          <h1 className="text-lg">{title}</h1>
        </Link>
        <p className="tranctcate-text-3 text-sm text-[var(--black-color)]">{description}</p>
      </div>
      <div className="col-span-1">
        <Link to="#">
          <img
            className="rounded object-cover"
            src={image}
            alt="category"
          />
        </Link>
      </div>
    </div>
  );
};
export default SideBarPodcast;
