import React, { useEffect, useState } from "react";

function ImageGallery({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedIndex(0);
    }
  }, [images]);

  const handleImageChange = (index) => {
    if (index !== selectedIndex) {
      setFade(true);
      setTimeout(() => {
        setSelectedIndex(index);
        setFade(false);
      }, 200);
    }
  };

  const goPrevious = () => {
    if (images.length > 0) {
      const newIndex = (selectedIndex - 1 + images.length) % images.length;
      handleImageChange(newIndex);
    }
  };

  const goNext = () => {
    if (images.length > 0) {
      const newIndex = (selectedIndex + 1) % images.length;
      handleImageChange(newIndex);
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Main Image Display */}
      <div className="relative w-full max-w-3xl h-[400px] aspect-[3/2] mb-4 overflow-hidden rounded-lg bg-cyan-50 shadow">
        <img
          src={images[selectedIndex]}
          alt="Selected"
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Left/Right Arrows */}
        <button
          onClick={goPrevious}
          className="absolute top-1/2 left-0 -translate-y-1/2 px-3 py-2 bg-black/30 hover:bg-black/60 text-white text-lg z-10"
        >
          ◀
        </button>
        <button
          onClick={goNext}
          className="absolute top-1/2 right-0 -translate-y-1/2 px-3 py-2 bg-black/30 hover:bg-black/60 text-white text-lg z-10"
        >
          ▶
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center gap-3 overflow-x-auto scrollbar-hide px-2">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Thumbnail ${i + 1}`}
            onClick={() => handleImageChange(i)}
            className={`h-24 w-32 object-cover rounded border-2 cursor-pointer transition-all ${
              selectedIndex === i
                ? "border-blue-500 scale-105"
                : "border-transparent opacity-80 hover:opacity-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;
