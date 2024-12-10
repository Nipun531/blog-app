


// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";

// export default function ProfilePage() {
//     const { id } = useParams();
//     const [userInfo, setUserInfo] = useState(null);
//     const [userPosts, setUserPosts] = useState([]);

//     useEffect(() => {
//         fetch(`http://localhost:4000/auth/profile/${id}`, {
//             credentials: 'include',
//         })
//             .then((response) => {
//                 if (response.ok) {
//                     return response.json();
//                 } else {
//                     throw new Error("Failed to fetch profile data");
//                 }
//             })
//             .then((data) => {
//                 setUserInfo(data.user);
//                 setUserPosts(data.posts);
//             })
//             .catch((err) => console.error(err));
//     }, [id]);

//     if (!userInfo) return <div>Loading profile...</div>;

//     return (
//         <div className="profile-page">
//             <h1>{userInfo.username}'s Profile</h1>
//             <h2>Posts</h2>
//             {userPosts.length === 0 ? (
//                 <p>No posts found.</p>
//             ) : (
//                 userPosts.map((post) => (
//                     <div key={post._id} className="post-summary">
//                         <h3>
//                             <Link to={`/post/${post._id}`}>
//                             {post.title}
                            
//                             </Link>
//                         </h3>
//                         <p>{post.summary}</p>
//                         <time>{new Date(post.createdAt).toLocaleString()}</time>
//                     </div>
//                 ))
//             )}
//         </div>
//     );
// }


import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ProfilePage() {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:4000/auth/profile/${id}`, {
            credentials: 'include',
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to fetch profile data");
                }
            })
            .then((data) => {
                setUserInfo(data.user);
                setUserPosts(data.posts);
            })
            .catch((err) => console.error(err));
    }, [id]);

    if (!userInfo) return <div>Loading profile...</div>;

    return (
        <div className="profile-page">
            <div className="user-info">
                <h1>{userInfo.username}'s Profile</h1>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Joined:</strong> {new Date(userInfo.createdAt).toLocaleDateString()}</p>
                <p><strong>Bio:</strong> {userInfo.bio || "No bio available"}</p>
            </div>

            <div className="user-posts">
                <h2>Posts</h2>
                {userPosts.length === 0 ? (
                    <p>No posts found.</p>
                ) : (
                    userPosts.map((post) => (
                        <div key={post._id} className="post-summary">
                            <h3>
                                <Link to={`/post/${post._id}`}>{post.title}</Link>
                            </h3>
                            <p>{post.summary}</p>
                            <time>{new Date(post.createdAt).toLocaleString()}</time>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
