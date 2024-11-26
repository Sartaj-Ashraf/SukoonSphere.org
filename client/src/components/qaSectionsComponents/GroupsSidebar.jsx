import React from 'react';
import { FaAngleRight } from 'react-icons/fa';
import { MdSettingsCell } from 'react-icons/md';
import { TbSettings } from 'react-icons/tb';

const GroupsSidebar = ({ groups }) => {
    return (
        <div className="bg-white text-black p-4 w-full shadow-lg rounded-lg overflow-hidden">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Groups</h2>
                <button className="btn btn-ghost btn-circle">
                    < TbSettings className='size-6' />
                </button>
            </div>
            <div className="form-control">
                <div className="input-group space-y-4">
                    <label className="input bg-transparent flex items-center gap-2 " style={{ borderBottom: '1px solid #b1b1b1', borderRadius: '0px' }}>
                        <input
                            type="text"
                            className="grow"
                            placeholder="Search by group name "
                            name="search"

                        />
                        <svg
                            cursor={"pointer"}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-8 w-8 opacity-70 text-[var(--primary)] hover:text-[var(--ternery)]"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </label>
                </div>
            </div>
            <div className="mt-8 ">
                <h3 className="text-lg mb-2 text-[var(--black-color)]">Groups you've joined</h3>
                <div className="space-y-2">
                    {groups.map((group, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-100 rounded-lg p-2">
                            <div className="flex items-center space-x-2">
                                <img src={group.avatar} alt="Group" className="h-8 w-8 rounded-full" />
                                <div>
                                    <div className="font-semibold text-[var(--primary)]">{group.name}</div>
                                    {/* <div className="text-sm text-gray-500">Last active {group.lastActive}</div> */}
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-circle">
                                <FaAngleRight />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <button className="link link-hover">See all</button>
            </div>
        </div>
    );
};

export default GroupsSidebar;
