import React, { useEffect, useState } from 'react'
import customFetch from '@/utils/customFetch'
import PostCard from '@/components/posts/PostCard'
import { useOutletContext } from 'react-router-dom'
import { useUser } from '@/context/UserContext';

const UserPosts = () => {
    const user = useOutletContext();
    const {user : loggedUser} = useUser();
    const [posts, setPosts] = useState([]);
    const fetchUserPosts = async () => {
        const { data } = await customFetch.get(`/posts/user/${user._id}`);
        setPosts(data.posts);
    }
    useEffect(() => {
        if (user?._id) {
            fetchUserPosts();
        }
    }, [user?._id])

    console.log({posts})
    const handlePostDelete = (postId) => {
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    };
    return (
        <div className="bg-white rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-[var(--black-color)] text-center">Posts</h2>
            <div>
                {posts && posts.length === 0 ? (
                    <p className="text-[var(--primary)] text-center py-4">No posts yet!</p>
                ) : (
                    posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onPostDelete={handlePostDelete}
                            user={loggedUser}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default UserPosts
