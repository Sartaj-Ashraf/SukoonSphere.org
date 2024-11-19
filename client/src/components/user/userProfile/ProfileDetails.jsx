import { useUser } from '@/context/UserContext'
import { ProfileNavigationLinks } from '@/utils/SharedComp/ProfileNavigationLinks'
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const ProfileDetails = ({ images }) => {
    const { user } = useUser()

    return (
        <>
            <div className='flex gap-4 items-center justify-start flex-wrap p-4' >
                {user?.role === "contributor" && (
                    <NavLink to="/contributor/articles" className={({ isActive }) =>
                        `text-[var(--primary)] text-xs md:text-sm
                    ${isActive
                            ? "text-[var(--ternery)] font-extrabold "
                            : "font-bold hover:text-[var(--ternery)]"} }`
                    }>
                        Articles
                    </NavLink>
                )}
                {ProfileNavigationLinks.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.address}
                        className={({ isActive }) =>
                            `text-[var(--primary)]  text-xs md:text-sm
                        ${isActive
                                ? "text-[var(--ternery)] font-extrabold "
                                : "font-bold hover:text-[var(--ternery)]"} }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </div>
            <div className="mt-4">
                <Outlet />
            </div>
        </>
    )
}

export default ProfileDetails
