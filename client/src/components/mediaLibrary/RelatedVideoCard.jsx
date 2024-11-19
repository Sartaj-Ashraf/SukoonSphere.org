import React from 'react'
import { Link } from "react-router-dom";
import { FaRegCirclePlay } from 'react-icons/fa6';

function RelatedVideoCard({ title }) {
    return (
        <div>
            <h3 className='text-2xl text-[var(--black-color)] text-center m-6' >{title}</h3>
            <div className="relative border-b-2">
                <SideBarRelatedVideos />
                <SideBarRelatedVideos />
                <SideBarRelatedVideos />
            </div>
        </div>
    )
}
export default RelatedVideoCard
const SideBarRelatedVideos = () => {
    return (
        <div className="p-3 grid grid-cols-3 gap-2 border-b-2 mb-4">
            <div className="col-span-2">
                <Link to={`video/${1}`}>
                    <h1 className="text-base line-clamp-2 hover:text-[--ternery]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, assumenda.</h1>
                </Link>
                <p className="line-clamp-1 text-sm text-[var(--grey--700)] ">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eius nemo doloremque id at possimus, necessitatibus esse velit error adipisci architecto!</p>
                <button className='flex items-center mt-4 hover:text-[var(--ternery)]'>Watch <FaRegCirclePlay size={20} style={{ marginLeft: '1rem', color: 'blue' }} /></button>
            </div>
            <div className="col-span-1">
                <Link to="#">
                    <img
                        className="h-16 w-full rounded object-cover"
                        src={"https://picsum.photos/200/300?random=7"}
                        alt="category"
                    />
                </Link>
            </div>
        </div>
    );
};


