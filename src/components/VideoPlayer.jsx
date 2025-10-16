import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Minus,
} from "lucide-react";

function VideoPlayer({
  videoUrl,
  imageUrl,
  onClose,
  backgroundMode,
  onToggleMode,
}) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0 });

  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 640, height: 360 });

  // Initialize position (center of screen)
  useEffect(() => {
    const centerX = (window.innerWidth - size.width) / 2;
    const centerY = (window.innerHeight - size.height) / 2;
    setPosition({ x: centerX, y: centerY });
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    video.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume || 0.5;
      setVolume(volume || 0.5);
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const handleMinimize = () => {
    if (isMinimized) {
      setSize({ width: 640, height: 360 });
      setIsMinimized(false);
    } else {
      setSize({ width: 300, height: 169 });
      setIsMinimized(true);
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    } else {
      setSize({ width: 640, height: 360 });
      const centerX = (window.innerWidth - 640) / 2;
      const centerY = (window.innerHeight - 360) / 2;
      setPosition({ x: centerX, y: centerY });
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest(".video-controls")) return;
    if (isFullscreen) return;

    dragRef.current = {
      isDragging: true,
      startX: e.clientX - position.x,
      startY: e.clientY - position.y,
    };

    // Prevent body scroll while dragging
    document.body.classList.add("dragging-video");
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current.isDragging) return;

    const newX = e.clientX - dragRef.current.startX;
    const newY = e.clientY - dragRef.current.startY;

    // Keep within screen bounds
    const maxX = window.innerWidth - size.width;
    const maxY = window.innerHeight - size.height;

    setPosition({
      x: Math.min(Math.max(0, newX), maxX),
      y: Math.min(Math.max(0, newY), maxY),
    });
  };

  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
    document.body.classList.remove("dragging-video");
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [position, size]);

  return (
    <>
      {/* Backdrop overlay - semi-transparent, doesn't block content */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* Floating Video Player */}
      <div
        ref={playerRef}
        className="floating-video-player fixed bg-black rounded-lg shadow-2xl overflow-hidden"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          zIndex: isFullscreen ? 50 : 1000,
          cursor: dragRef.current.isDragging ? "grabbing" : "grab",
          transition: dragRef.current.isDragging ? "none" : "all 0.3s ease",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Video Container */}
        <div className="relative w-full h-full">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full"
              style={{
                objectFit: backgroundMode === "fit" ? "contain" : "cover",
              }}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              webkit-playsinline="true"
            />
          ) : imageUrl ? (
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: backgroundMode === "fit" ? "contain" : "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          ) : null}

          {/* Control Bar - Always visible */}
          <div
            className="video-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="text-white hover:scale-110 transition-transform"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              {/* Volume Control (only for video) */}
              {videoUrl && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMuteToggle}
                    className="text-white hover:scale-110 transition-transform"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX size={20} />
                    ) : (
                      <Volume2 size={20} />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              <div className="flex-1" />

              {/* Display Mode Toggle */}
              <button
                onClick={onToggleMode}
                className="text-white hover:scale-110 transition-transform"
                title={
                  backgroundMode === "fit" ? "Switch to Fill" : "Switch to Fit"
                }
              >
                {backgroundMode === "fit" ? (
                  <Maximize size={18} />
                ) : (
                  <Minimize size={18} />
                )}
              </button>

              {/* Minimize/Maximize */}
              <button
                onClick={handleMinimize}
                className="text-white hover:scale-110 transition-transform"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                <Minus size={18} />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={handleFullscreen}
                className="text-white hover:scale-110 transition-transform"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="text-white hover:scale-110 transition-transform hover:text-red-500"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Draggable indicator */}
          {!isFullscreen && (
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/50 to-transparent cursor-grab flex items-center justify-center">
              <div className="drag-indicator w-12 h-1 bg-white/30 rounded-full" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default VideoPlayer;
