import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

function VideoPlayer({
  videoUrl,
  imageUrl,
  onClose,
  backgroundMode,
  onToggleMode,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const touchStartDistance = useRef(0);
  const initialScale = useRef(1);

  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);

  const controlsTimeoutRef = useRef(null);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    const resetControlsTimer = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    resetControlsTimer();

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Request fullscreen on mount (mobile)
  useEffect(() => {
    const enterFullscreen = async () => {
      const container = containerRef.current;
      if (!container) return;

      try {
        // Try to enter fullscreen
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          await container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
          await container.msRequestFullscreen();
        }
      } catch (error) {
        console.log("Fullscreen not available:", error);
      }
    };

    enterFullscreen();

    // Lock orientation if supported
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock("any").catch(() => {
        // Orientation lock not supported
      });
    }

    return () => {
      // Cleanup
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
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

  // Pinch to zoom
  const handleTouchStart = (e) => {
    setShowControls(true);

    if (e.touches.length === 2) {
      // Pinch zoom start
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      touchStartDistance.current = distance;
      initialScale.current = scale;
    } else if (e.touches.length === 1) {
      // Single touch - check for double tap or drag
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;

      if (tapLength < 300 && tapLength > 0) {
        // Double tap detected - toggle zoom
        handleDoubleTap();
      } else {
        // Start drag if zoomed
        if (scale > 1) {
          setIsDragging(true);
          setDragStart({
            x: e.touches[0].clientX - position.x,
            y: e.touches[0].clientY - position.y,
          });
        }
      }

      setLastTap(currentTime);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const scaleChange = distance / touchStartDistance.current;
      const newScale = Math.min(
        Math.max(initialScale.current * scaleChange, 1),
        5
      );
      setScale(newScale);
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      // Pan when zoomed
      e.preventDefault();
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;

      // Limit panning to reasonable bounds
      const maxOffset = 100 * scale;
      setPosition({
        x: Math.min(Math.max(newX, -maxOffset), maxOffset),
        y: Math.min(Math.max(newY, -maxOffset), maxOffset),
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    // Reset position if scale is back to 1
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleDoubleTap = () => {
    if (scale === 1) {
      setScale(2);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 5));
    setShowControls(true);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.5, 1);
    setScale(newScale);
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
    setShowControls(true);
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setShowControls(true);
  };

  const handleShowControls = () => {
    setShowControls(true);
  };

  const handleClose = async () => {
    // Exit fullscreen before closing
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.log("Exit fullscreen error:", error);
      }
    }
    onClose();
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-black z-[9999]"
      style={{
        height: "100dvh",
        touchAction: scale > 1 ? "none" : "auto",
      }}
      onClick={handleShowControls}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video/Image Container */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="transition-transform duration-300 ease-out"
            style={{
              maxWidth: backgroundMode === "fit" ? "100%" : "none",
              maxHeight: backgroundMode === "fit" ? "100%" : "none",
              width: backgroundMode === "fit" ? "auto" : "100%",
              height: backgroundMode === "fit" ? "auto" : "100%",
              objectFit: backgroundMode === "fit" ? "contain" : "cover",
              transform: `scale(${scale}) translate(${position.x / scale}px, ${
                position.y / scale
              }px)`,
              cursor: scale > 1 ? "move" : "default",
            }}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            webkit-playsinline="true"
          />
        ) : imageUrl ? (
          <div
            className="transition-transform duration-300 ease-out"
            style={{
              maxWidth: backgroundMode === "fit" ? "100%" : "none",
              maxHeight: backgroundMode === "fit" ? "100%" : "none",
              width: backgroundMode === "fit" ? "auto" : "100vw",
              height: backgroundMode === "fit" ? "auto" : "100vh",
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: backgroundMode === "fit" ? "contain" : "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              transform: `scale(${scale}) translate(${position.x / scale}px, ${
                position.y / scale
              }px)`,
              cursor: scale > 1 ? "move" : "default",
            }}
          />
        ) : null}
      </div>

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.7) 100%)",
        }}
      >
        {/* Top Controls */}
        <div
          className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between"
          style={{
            paddingTop: "calc(env(safe-area-inset-top) + 1rem)",
            paddingLeft: "calc(env(safe-area-inset-left) + 1rem)",
            paddingRight: "calc(env(safe-area-inset-right) + 1rem)",
          }}
        >
          <button
            onClick={handleClose}
            className="p-3 rounded-full bg-black bg-opacity-50 backdrop-blur-lg text-white hover:bg-opacity-70 transition-all"
          >
            <X size={24} />
          </button>

          <div className="flex gap-2">
            <button
              onClick={onToggleMode}
              className="p-3 rounded-full bg-black bg-opacity-50 backdrop-blur-lg text-white hover:bg-opacity-70 transition-all"
            >
              {backgroundMode === "fit" ? (
                <Maximize size={20} />
              ) : (
                <Minimize size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={handlePlayPause}
            className="pointer-events-auto p-6 rounded-full bg-black bg-opacity-60 backdrop-blur-lg text-white hover:bg-opacity-80 transition-all"
          >
            {isPlaying ? <Pause size={48} /> : <Play size={48} />}
          </button>
        </div>

        {/* Zoom Controls - Bottom Right */}
        <div
          className="absolute bottom-24 right-4 flex flex-col gap-2"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom))",
            paddingRight: "calc(env(safe-area-inset-right))",
          }}
        >
          <button
            onClick={handleZoomIn}
            disabled={scale >= 5}
            className="p-3 rounded-full bg-black bg-opacity-50 backdrop-blur-lg text-white hover:bg-opacity-70 transition-all disabled:opacity-30"
          >
            <ZoomIn size={20} />
          </button>

          {scale > 1 && (
            <button
              onClick={handleResetZoom}
              className="p-2 rounded-full bg-black bg-opacity-50 backdrop-blur-lg text-white hover:bg-opacity-70 transition-all text-xs"
            >
              1x
            </button>
          )}

          <button
            onClick={handleZoomOut}
            disabled={scale <= 1}
            className="p-3 rounded-full bg-black bg-opacity-50 backdrop-blur-lg text-white hover:bg-opacity-70 transition-all disabled:opacity-30"
          >
            <ZoomOut size={20} />
          </button>
        </div>

        {/* Bottom Controls */}
        {videoUrl && (
          <div
            className="absolute bottom-0 left-0 right-0 px-4 pb-4"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)",
              paddingLeft: "calc(env(safe-area-inset-left) + 1rem)",
              paddingRight: "calc(env(safe-area-inset-right) + 1rem)",
            }}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayPause}
                className="text-white hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleMuteToggle}
                  className="text-white hover:scale-110 transition-transform"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={24} />
                  ) : (
                    <Volume2 size={24} />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        )}

        {/* Zoom Level Indicator */}
        {scale > 1 && (
          <div
            className="absolute top-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-black bg-opacity-70 backdrop-blur-lg text-white text-sm"
            style={{
              paddingTop: "calc(env(safe-area-inset-top) + 0.5rem)",
            }}
          >
            {scale.toFixed(1)}x
          </div>
        )}

        {/* Hint Text */}
        {scale === 1 && (
          <div
            className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-60 text-center px-4"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom))",
            }}
          >
            Chụm 2 ngón tay hoặc double tap để zoom
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
