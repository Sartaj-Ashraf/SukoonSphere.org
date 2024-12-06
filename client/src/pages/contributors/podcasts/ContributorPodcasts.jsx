import React, { useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { useUser } from "@/context/UserContext";
import { FiPlus } from 'react-icons/fi';
import CreateNewPodcast from '../models/CreateNewPodcast';
const ContributorPodcasts = () => {
  const [showModal, setShowModal] = useState(false);
    const { id: ParamId } = useParams()
    const user = useOutletContext();
    const { user: currentUser } = useUser();
  return (
    <div className='mx-auto lg:py-8'>
         {user?.role === "contributor" && currentUser?._id === ParamId && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 lg:mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Your Podcasts</h2>
                        <p className="text-[var(--grey--800)]">
                          Dont know how to upload a podcast? Check out our{" "}
                          <Link to={"/user-manual/create-podcast"} className="text-blue-500 hover:underline">
                            user manual
                          </Link>{" "}
                          for a step-by-step guide.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary inline-flex items-center gap-2 px-3 py-1.5 text-sm"
                    >
                        <FiPlus className="w-4 h-4" />
                        Create podcast
                    </button>

                </div>
            )}
           {showModal && <CreateNewPodcast setShowModal={setShowModal} />}
    </div>
  )
}

export default ContributorPodcasts