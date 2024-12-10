

import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const [likes, setLikes] = useState(0);
    const { userInfo } = useContext(UserContext);
    const { id } = useParams();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');


    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`, {
            credentials: 'include',
        })
        .then(response => response.json())
        .then(postInfo => {
            setPostInfo(postInfo);
            setLikes(postInfo.likes?.length || 0);
        });
    }, [id]);

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`, { credentials: 'include' })
            .then(response => response.json())
            .then(postInfo => {
                setPostInfo(postInfo);
                setLikes(postInfo.likes?.length || 0);
                setComments(postInfo.comments || []);
            });
    }, [id]);

    const handleAddComment = () => {
        fetch(`http://localhost:4000/post/${id}/comment`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: newComment }),
        })
            .then(response => response.json())
            .then(updatedComments => {
                setComments(updatedComments);
                setNewComment('');
            });
    };
    
    

    const handleLike = () => {
        fetch(`http://localhost:4000/post/${id}/like`, {
            method: 'POST',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => setLikes(data.likes));
    };

    if (!postInfo) return '';

    return (
        <div className="post-page">
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            <div className="author">by @{postInfo.author.username}</div>
            {userInfo.id === postInfo.author._id && (
                <div className="edit-row">
                    <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zM16.862 4.487L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Edit this post
                    </Link>
                </div>
            )}
            <div className="image">
                <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
            </div>
            <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
            {/* <div className="like-section">
                <button onClick={handleLike}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                   <span> {likes} {likes === 1 ? 'Like' : 'Likes'}</span>
                </button>
            </div> */}
            <div className="like-section">
    <button 
        onClick={handleLike} 
        className={`like-button ${likes ? 'liked' : ''}`}
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
    </button>
</div>

<div className="comments-section">
    <h3>Comments</h3>
    <div className="comments-list">
        {comments.map((comment, index) => (
            <div key={index} className="comment">
                <strong>@{comment.author?.username || 'Anonymous'}</strong>: {comment.text}
            </div>
        ))}
    </div>
    <div className="add-comment">
        <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write a comment..."
        />
        <button onClick={handleAddComment}>Add Comment</button>
    </div>
</div>



        </div>
    );
}
