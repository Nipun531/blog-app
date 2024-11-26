// const React = require("react");
// const { useEffect, useState } = React;
// const { useParams } = require("react-router-dom");
// const Post = require("../post"); // Assuming Post is a reusable component for displaying individual posts.

// function ProfilePage() {
//     const { id } = useParams(); // Extract the user ID from the URL
//     const [userInfo, setUserInfo] = useState(null);
//     const [userPosts, setUserPosts] = useState([]);

//     useEffect(() => {
//         async function fetchProfile() {
//             try {
//                 const response = await fetch(`http://localhost:4000/profile/${id}`);
//                 console.log('Response status:', response.status); 
//                 if (response.ok) {
//                     const data = await response.json();
//                     setUserInfo(data.user);
//                     setUserPosts(data.posts);
//                 } else {
//                     console.error("Failed to fetch profile");
//                 }
//             } catch (err) {
//                 console.error(err);
//             }
//         }

//         fetchProfile();
//     }, [id]);

//     if (!userInfo) {
//         return React.createElement("div", null, "Loading profile...");
//     }

//     return React.createElement(
//         "div",
//         null,
//         React.createElement("h1", null, `${userInfo.username}'s Profile`),
//         React.createElement("h2", null, "Posts"),
//         userPosts.length === 0
//             ? React.createElement("p", null, "No posts found.")
//             : userPosts.map((post) =>
//                 React.createElement(Post, { key: post._id, ...post })
//             )
//     );
// }

// module.exports = ProfilePage;


// const React = require("react");
// const { useEffect, useState } = React;
// const { useParams } = require("react-router-dom");
// const Post = require("../post"); // Ensure this points to a valid Post component

// function ProfilePage() {
//     const { id } = useParams();
//     const [userInfo, setUserInfo] = useState(null);
//     const [userPosts, setUserPosts] = useState([]);

//     useEffect(() => {
//         async function fetchProfile() {
//             try {
//                 const response = await fetch(`http://localhost:4000/profile/${id}`);
//                 console.log('Response status:', response.status); 
//                 if (response.ok) {
//                     const data = await response.json();
//                     console.log("Fetched Data:", data); // Debugging API response
//                     setUserInfo(data.user);
//                     setUserPosts(data.posts);
//                 } else {
//                     console.error("Failed to fetch profile");
//                 }
//             } catch (err) {
//                 console.error(err);
//             }
//         }

//         fetchProfile();
//     }, [id]);

//     if (!userInfo) {
//         return <div>Loading profile...</div>;
//     }

//     return (
//         <div>
//             <h1>{userInfo.username}'s Profile</h1>
//             <h2>Posts</h2>
//             {userPosts.length === 0 ? (
//                 <p>No posts found.</p>
//             ) : (
//                 userPosts.map((post) => <Post key={post._id} {...post} />)
//             )}
//         </div>
//     );
// }

// module.exports = ProfilePage;
// module.exports.default = ProfilePage;


import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ProfilePage() {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:4000/profile/${id}`, {
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
            <h1>{userInfo.username}'s Profile</h1>
            <h2>Posts</h2>
            {userPosts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                userPosts.map((post) => (
                    <div key={post._id} className="post-summary">
                        <h3>
                            <Link to={`/post/${post._id}`}>
                            {post.title}
                            
                            </Link>
                        </h3>
                        <p>{post.summary}</p>
                        <time>{new Date(post.createdAt).toLocaleString()}</time>
                    </div>
                ))
            )}
        </div>
    );
}


