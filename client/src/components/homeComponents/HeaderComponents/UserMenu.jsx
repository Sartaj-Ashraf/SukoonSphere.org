import React from 'react';
import { Link } from 'react-router-dom';
import { BsKey, BsDatabase, BsPencil } from 'react-icons/bs';
import { MdPrivateConnectivity } from 'react-icons/md';

function UserMenu({ user, miniMenu, handleLogout }) {
  return (
    <div
      className={`${miniMenu ? "opacity-100 max-h-[500px] " : "opacity-0 max-h-0"
        } absolute overflow-hidden transition-all duration-300 
      ease-in-out shadow-lg rounded-[4px] bg-[var(--body)] flex flex-col w-72 top-[4.5rem] right-[7.5rem]`}
      style={{
        transition: "opacity 0.5s ease, max-height 0.5s ease ",
      }}
    >
      <div className="flex items-center flex-col gap-4 pb-3 relative">
        <div className="bg-[var(--primary)] w-full h-[100px] flex items-center justify-center relative rounded-t-lg">
          <h4 className="text-white text-lg font-bold">{user?.name}</h4>
          {/* <button className="absolute right-4 bottom-2 text-white text-sm hover:text-gray-300">
            <BsPencil />
          </button> */}
        </div>

        <div className="flex flex-col justify-center items-center mt-[-40px] z-10">
          <img
            className="w-12 h-12 rounded-full border-1 border-black shadow-lg"
            src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/147/147142.png"}
            alt="User"
          />
          <h4 className="text-[var(--gray--900)] mt-2 font-semibold">{user?.name}</h4>
          <p className="text-[var(--grey--800)] text-sm">{user?.email}</p>
          <div className="flex gap-1">
            <UserActionButtons />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button onClick={handleLogout} className="btn-2">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const UserActionButtons = () => (
  <>
    <Link to="/user/change-passowrd">
      <button className="bg-gray-800 hover:bg-gray-900 text-white rounded-full p-2">
        <BsKey className="size-5" />
      </button>
    </Link>
    {/* <Link to="/">
      <button className="bg-gray-800 hover:bg-gray-900 text-white rounded-full p-2">
        <MdPrivateConnectivity className="size-5" />
      </button>
    </Link>
    <Link to="/">
      <button className="bg-gray-800 hover:bg-gray-900 text-white rounded-full p-2">
        <BsDatabase className="size-5" />
      </button>
    </Link> */}
  </>
);

export default UserMenu; 