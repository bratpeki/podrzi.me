import React, { useEffect, useRef, useState } from "react";

function ImageGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0]); // Show first image on load
    }
  }, [images]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full max-w-5xl">
      {/* Main image */}
      <div className="aspect-video bg-gray-100 mb-4 rounded overflow-hidden w-full">
        <img
          src={selectedImage}
          alt="Selected"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Thumbnail list with arrows */}
      <div className="relative flex items-center">
        <button
          onClick={scrollLeft}
          className="absolute left-0 z-10 h-full px-2 bg-black/30 hover:bg-black/50 text-white"
        >
          ◀
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-2 px-8 scrollbar-hide"
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Thumbnail ${i + 1}`}
              onClick={() => setSelectedImage(img)}
              className={`h-24 w-40 object-cover rounded border-2 cursor-pointer transition
                ${
                  selectedImage === img
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
            />
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 z-10 h-full px-2 bg-black/30 hover:bg-black/50 text-white"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

export default ImageGallery;
