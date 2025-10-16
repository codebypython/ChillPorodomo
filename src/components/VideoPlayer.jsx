import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
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
  const contentRef = useRef(null);
  const touchRef = useRef({
    startDistance: 0,
    startScale: 1,
    startX: 0,
    startY: 0,
    lastTap: 0,
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  const controlsTimeoutRef = useRef(null);

  // Force viewport height on iOS Safari (hide address bar)
  useEffect(() => {
    // Set viewport height to window.innerHeight to account for address bar
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);

    // Scroll to top to hide address bar on iOS
    window.scrollTo(0, 1);
    setTimeout(() => window.scrollTo(0, 0), 0);

    // Mark as fully loaded after animations
    setTimeout(() => setIsFullyLoaded(true), 300);

    // Prevent body scroll
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalHeight = document.body.style.height;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.height = "100%";
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.height = originalHeight;
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
      document.documentElement.style.removeProperty("--vh");
    };
  }, []);

  // Auto-hide controls
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

  const handlePlayPause = (e) => {
    e?.stopPropagation();
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

  const handleMuteToggle = (e) => {
    e?.stopPropagation();
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

  const showControlsTemporarily = () => {
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

  // Touch handlers for pinch zoom and pan
  const handleTouchStart = (e) => {
    showControlsTemporarily();

    if (e.touches.length === 2) {
      // Pinch zoom start
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      touchRef.current.startDistance = distance;
      touchRef.current.startScale = scale;
    } else if (e.touches.length === 1) {
      const currentTime = Date.now();
      const tapGap = currentTime - touchRef.current.lastTap;

      // Double tap detection
      if (tapGap < 300 && tapGap > 0) {
        e.preventDefault();
        // Double tap to zoom in/out
        if (scale === 1) {
          setScale(2);
        } else {
          setScale(1);
          setTranslate({ x: 0, y: 0 });
        }
      } else if (scale > 1) {
        // Single touch pan when zoomed
        touchRef.current.startX = e.touches[0].clientX - translate.x;
        touchRef.current.startY = e.touches[0].clientY - translate.y;
      }

      touchRef.current.lastTap = currentTime;
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

      const scaleChange = distance / touchRef.current.startDistance;
      const newScale = Math.max(
        1,
        Math.min(touchRef.current.startScale * scaleChange, 4)
      );
      setScale(newScale);
    } else if (e.touches.length === 1 && scale > 1) {
      // Pan when zoomed
      e.preventDefault();
      const newX = e.touches[0].clientX - touchRef.current.startX;
      const newY = e.touches[0].clientY - touchRef.current.startY;

      // Limit pan to reasonable bounds
      const maxX = (window.innerWidth * (scale - 1)) / 2;
      const maxY = (window.innerHeight * (scale - 1)) / 2;

      setTranslate({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    }
  };

  const handleTouchEnd = () => {
    // Reset translate if scale is 1
    if (scale <= 1) {
      setTranslate({ x: 0, y: 0 });
    }
  };

  const handleContainerClick = (e) => {
    // Toggle controls on tap
    if (e.target === containerRef.current || e.target === contentRef.current) {
      showControlsTemporarily();
    }
  };

  const handleClose = (e) => {
    e?.stopPropagation();
    onClose();
  };

  const handleToggleMode = (e) => {
    e?.stopPropagation();
    onToggleMode();
    showControlsTemporarily();
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full bg-black overflow-hidden"
      style={{
        height: "calc(var(--vh, 1vh) * 100)",
        minHeight: "-webkit-fill-available",
        zIndex: 9999,
        touchAction: scale > 1 ? "none" : "manipulation",
        WebkitUserSelect: "none",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
      onClick={handleContainerClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video/Image Content */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `scale(${scale}) translate(${translate.x / scale}px, ${
            translate.y / scale
          }px)`,
          transition:
            touchRef.current.startDistance > 0
              ? "none"
              : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full"
            style={{
              objectFit: backgroundMode === "fit" ? "contain" : "cover",
              pointerEvents: "none",
            }}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            webkit-playsinline="true"
            onLoadedMetadata={(e) => {
              e.target.volume = volume;
            }}
          />
        ) : imageUrl ? (
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: backgroundMode === "fit" ? "contain" : "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              pointerEvents: "none",
            }}
          />
        ) : null}
      </div>

      {/* Controls Overlay - iOS Style */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.6) 100%)",
        }}
      >
        {/* Top Bar */}
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pointer-events-auto"
          style={{
            paddingTop: `max(1rem, env(safe-area-inset-top))`,
          }}
        >
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors active:scale-95"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <button
            onClick={handleToggleMode}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors active:scale-95"
            aria-label={backgroundMode === "fit" ? "Fill Screen" : "Fit Screen"}
          >
            {backgroundMode === "fit" ? (
              <Maximize size={20} />
            ) : (
              <Minimize size={20} />
            )}
          </button>
        </div>

        {/* Center Play/Pause */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <button
              onClick={handlePlayPause}
              className="w-20 h-20 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/70 transition-all active:scale-95"
              aria-label="Play"
            >
              <Play size={40} className="ml-1" />
            </button>
          </div>
        )}

        {/* Bottom Controls */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-auto"
          style={{
            paddingBottom: `max(1rem, env(safe-area-inset-bottom))`,
          }}
        >
          {videoUrl && (
            <div className="px-6 pb-4 flex items-center gap-4">
              <button
                onClick={handlePlayPause}
                className="w-10 h-10 flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={28} />
                ) : (
                  <Play size={28} className="ml-0.5" />
                )}
              </button>

              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={handleMuteToggle}
                  className="w-10 h-10 flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
                  aria-label={isMuted ? "Unmute" : "Mute"}
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
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-white"
                  style={{
                    maxWidth: "150px",
                  }}
                  aria-label="Volume"
                />
              </div>
            </div>
          )}
        </div>

        {/* Zoom Indicator */}
        {scale > 1 && (
          <div
            className="absolute top-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md text-white text-sm font-medium"
            style={{
              top: `calc(max(5rem, env(safe-area-inset-top) + 3rem))`,
            }}
          >
            {scale.toFixed(1)}×
          </div>
        )}

        {/* Hint Text */}
        {isFullyLoaded && scale === 1 && showControls && (
          <div
            className="absolute bottom-24 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white/70 text-sm text-center whitespace-nowrap"
            style={{
              bottom: `calc(6rem + env(safe-area-inset-bottom))`,
            }}
          >
            Chụm 2 ngón hoặc chạm 2 lần để zoom
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
