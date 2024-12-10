

import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  
  useEffect(() => {
    fetch('http://localhost:4000/auth/profile', {
      credentials: 'include',
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch('http://localhost:4000/auth/logout', {
      credentials: 'include',
      method: 'POST',
    });

    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="Logo">MyBlog</Link>
      <nav>
        {username ? (
          <>
            <span>Hello, <Link to={`/profile/${username}`}>{username}</Link></span> {/* Profile Link */}
            <Link to="/create">Create new post</Link>
            <a className="logout" onClick={logout}>Logout</a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
