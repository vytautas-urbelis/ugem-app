import React from 'react';
import { useState, useEffect } from 'react';

const Carousel = ({ items }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const autoPlayInterval = 5000;
  const slides = items || [
    { id: 1, text: 'Slide 1', image: '/slide1.jpg' },
    { id: 2, text: 'Slide 2', image: '/slide2.jpg' },
    { id: 3, text: 'Slide 3', image: '/slide3.jpg' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleMouseDown = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 100) {
      setCurrentSlide((prev) =>
        prev + (touchEndX < touchStartX ? 1 : -1) % slides.length
      );
    }
  };

  return (
    <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
      {/* Container for all slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%) translateX(-${(currentSlide + 1) * -30}px)`,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`w-full flex items-center justify-center transform transition-transform duration-500 ease-in-out`}
            style={{
              opacity: currentSlide === index ? 1 : 0.4,
              transform: `translateX(${index === currentSlide - 1 ? '30%' : ''}) scale(${
                currentSlide === index ? 1.1 : 1
              })`,
            }}
          >
            <img
              src={slide.image}
              alt={slide.text}
              className="max-w-full h-auto object-cover rounded-lg"
            />
            <div className="text-center opacity-90">
              <h2 className="text-3xl font-bold">{slide.text}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              currentSlide === index ? 'bg-blue-600' : 'bg-white'
            }`}
          />
        ))}
      </div>

      {/* Touch Events */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onTouchMove={handleMouseMove}
        />
      </div>
    </div>
  );
};

export default Carousel;