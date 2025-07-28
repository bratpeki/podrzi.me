import React, { useEffect, useState } from "react";

function ImageGallery({ images = [], videoUrl = "" }) {
  const hasVideo = videoUrl.trim() !== "";
  const totalItems = (hasVideo ? 1 : 0) + images.length;

  // selectedIndex: 0 = video (if exists), 1..images.length = images
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (totalItems > 0) {
      setSelectedIndex(0); // default to video if present, else first image
    }
  }, [images, videoUrl]);

  const handleItemChange = (index) => {
    if (index !== selectedIndex) {
      setFade(true);
      setTimeout(() => {
        setSelectedIndex(index);
        setFade(false);
      }, 200);
    }
  };

  const goPrevious = () => {
    if (totalItems > 0) {
      const newIndex = (selectedIndex - 1 + totalItems) % totalItems;
      handleItemChange(newIndex);
    }
  };

  const goNext = () => {
    if (totalItems > 0) {
      const newIndex = (selectedIndex + 1) % totalItems;
      handleItemChange(newIndex);
    }
  };

  if (totalItems === 0) return null;

  // Extract YouTube video ID
  function getYouTubeVideoId(url) {
    if (!url) return null;
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // Get embed URL for iframe
  function getYouTubeEmbedUrl(url) {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  const isVideoSelected = hasVideo && selectedIndex === 0;

  const videoId = getYouTubeVideoId(videoUrl);
  const videoThumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Main display area */}
      <div className="relative w-full max-w-3xl h-[400px] aspect-[3/2] mb-4 overflow-hidden rounded-lg bg-cyan-50 shadow flex items-center justify-center">
        {isVideoSelected ? (
          <iframe
            key="video"
            className={`w-full h-full transition-opacity duration-300 ${
              fade ? "opacity-0" : "opacity-100"
            }`}
            src={getYouTubeEmbedUrl(videoUrl)}
            title="Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img
            key={images[selectedIndex - 1]} // images start at index 1 here
            src={images[selectedIndex - 1]}
            alt="Selected"
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              fade ? "opacity-0" : "opacity-100"
            }`}
          />
        )}

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
        {hasVideo && videoThumbnailUrl ? (
          <div
            onClick={() => handleItemChange(0)}
            className={`relative h-24 w-32 rounded border-2 cursor-pointer transition-all ${
              selectedIndex === 0
                ? "border-blue-500 scale-105"
                : "border-transparent opacity-80 hover:opacity-100"
            }`}
            title="Play Video"
          >
            <img
              src={videoThumbnailUrl}
              alt="Video Thumbnail"
              className="h-full w-full object-cover rounded"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white drop-shadow-lg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        ) : hasVideo ? (
          <button
            onClick={() => handleItemChange(0)}
            className={`h-24 w-32 rounded border-2 cursor-pointer flex items-center justify-center transition-all ${
              selectedIndex === 0
                ? "border-blue-500 scale-105 bg-black text-white"
                : "border-transparent bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            title="Play Video"
          >
            ▶ Video
          </button>
        ) : null}

        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Thumbnail ${i + 1}`}
            onClick={() => handleItemChange(i + (hasVideo ? 1 : 0))}
            className={`h-24 w-32 object-cover rounded border-2 cursor-pointer transition-all ${
              selectedIndex === i + (hasVideo ? 1 : 0)
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
