import { YoutubeEmbed } from '@/components'
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { FaSpinner, FaVideo, FaList } from 'react-icons/fa'
const AllVideos = () => {
    return (
        <div className="max-w-7xl mx-auto">
                     <div className="px-4 sm:px-6 lg:px-8 py-3">
                         <div className="rounded-lg">
                             <div className='hidden md:block'>
                                 <h2 className="text-3xl font-bold text-[var(--grey--900)] text-center">
                                     SukoonSphere Videos
                                 </h2>
                                 <p className="mt-2 text-center text-[var(--grey--800)]">
                                     Explore our collection of healing and mindfulness videos
                                 </p>
                             </div>
                             <div className="border-b border-gray-200">
                        <nav className=" flex sm:w-1/3 md:w-1/4 justify-center">
                            <NavLink
                                to="."
                                end
                                className={({ isActive }) =>
                                    `${
                                        isActive
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } w-1/2 py-2 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200`
                                }
                            >
                                <FaVideo className="inline-block mr-2 -mt-1" />
                                Videos
                            </NavLink>
                            <NavLink
                                to="/all-videos/playlists"
                                className={({ isActive }) =>
                                    `${
                                        isActive
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } w-1/2 py-2 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200`
                                }
                            >
                                <FaList className="inline-block mr-2 -mt-1" />
                                Playlists
                            </NavLink>
                        </nav>
                    </div>

                    <div className="p-0 mt-2 md:p-3 lg:p-6 md:mt-4">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllVideos

