// import Post from "../post";
// import {useEffect,useState} from "react";

// export default function IndexPage() {
//     const [posts,setPosts]=useState([]);
//     useEffect(() =>{
//         fetch('http://localhost:4000/post').then(response =>{
//             response.json().then(posts =>{
//                 setPosts(posts);
//             })
//         })
//     },[]);
//     return (
//         <>
//             <div className="post-main">
//             {posts.length >0 && posts.map(post => (
//                 <Post {...post} />
//             ))}
//             </div>
//         </>
//     )
// }

import Post from "../post";
import Carousel from "../carousel"; // Import the new component
import { useEffect, useState } from "react";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/post").then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);

  return (
    <>
      <Carousel posts={posts.slice(0, 5)} /> 
      <div className="post-main">
        {posts.length > 0 && posts.map((post) => <Post {...post} />)}
      </div>
    </>
  );
}
