import { GroupsSidebar, ProfileCard, ProfileDetails } from '@/components'
import React from 'react'

const UserProfile = () => {
    const groups = [
        {
            id: 1,
            name: 'Mindfulness Practices 🧘‍♂️',
            image: 'https://example.com/image_mindfulness.jpg',
        },
        {
            id: 2,
            name: 'Coping with Anxiety 💭',
            image: 'https://example.com/image_anxiety.jpg',
        },
        {
            id: 3,
            name: 'Therapy Techniques 📖',
            image: 'https://example.com/image_therapy.jpg',
        },
        {
            id: 4,
            name: 'Depression Support Group ❤️',
            image: 'https://example.com/image_depression.jpg',
        },
        {
            id: 5,
            name: 'Stress Management Workshops 🌱',
            image: 'https://example.com/image_stress.jpg',
        }
    ];
    return (
        <>
            <div className='relative max-w-7xl mx-auto p-4 lg:p-8'>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8'>
                    {/* Profile Card Section */}
                    <div className="md:col-span-3">
                        <div className="lg:sticky top-[80px] transition-all duration-300 hover:shadow-lg rounded-2xl">
                            <ProfileCard />
                        </div>
                    </div>

                    {/* Main Content Section */} 
                    <div className='md:col-span-9'>
                        <div className='bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 lg:p-6'>
                            <ProfileDetails />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserProfile