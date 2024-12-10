import React, { useState, useEffect } from "react";

export default function Carousel({ posts }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically cycle through posts
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Adjust the time interval (5 seconds here)
    return () => clearInterval(interval); // Cleanup
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === posts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? posts.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carousel-container">
      <div
        className="carousel-wrapper"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {posts.map((post) => (
          <div className="carousel-item" key={post._id}>
            <img src={`http://localhost:4000/${post.cover}`} alt={post.title} />
            <h2>{post.title}</h2>
            <p>{post.summary}</p>
          </div>
        ))}
      </div>
      <div className="carousel-controls">
        <button onClick={prevSlide}>❮</button>
        <button onClick={nextSlide}>❯</button>
      </div>
    </div>
  );
}
