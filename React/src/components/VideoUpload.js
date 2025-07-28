import React, { useState, useRef } from "react";

const VideoUpload = ({ onVideoSelect }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isMp4 = file.type.toLowerCase() === "video/mp4";
    const isUnder100MB = file.size <= 100 * 1024 * 1024;

    if (!isMp4) {
      setError("Samo .mp4 video fajlovi su dozvoljeni.");
      clearVideo();
      return;
    }

    if (!isUnder100MB) {
      setError("Video ne smije biti veći od 100MB.");
      clearVideo();
      return;
    }

    setError("");

    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoPreviewUrl(previewUrl);

    if (onVideoSelect) onVideoSelect(file);
  };

  const clearVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }

    setVideoFile(null);
    setVideoPreviewUrl(null);
    setError("");
    if (onVideoSelect) onVideoSelect(null);

    // Reset the file input value
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <section>
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="font-medium text-lg mb-1">Video projekta</h3>
          <p className="text-sm text-gray-600 mb-2">
            Ubaci kratki uvodni video o svom projektu (opcionalno).
          </p>
          <p className="text-sm text-gray-500">
            Samo .mp4 format. Maksimalna veličina: 100MB.
          </p>
        </div>

        <div className="bg-white p-6 shadow border rounded space-y-4">
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4"
            onChange={handleVideoChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {videoFile && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Odabrani fajl: <strong>{videoFile.name}</strong>
              </p>
              <button
                onClick={clearVideo}
                className="text-red-600 hover:text-red-800 text-sm ml-4 underline"
              >
                Ukloni video
              </button>
            </div>
          )}

          {videoPreviewUrl && (
            <video controls className="w-full rounded shadow mt-2">
              <source src={videoPreviewUrl} type="video/mp4" />
              Vaš browser ne podržava video tag.
            </video>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoUpload;
