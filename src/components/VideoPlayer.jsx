import React, { useRef, useEffect, useState } from "react";
import {
  X,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
} from "lucide-react";

export default function VideoPlayer({
  videoUrl,
  imageUrl,
  isVisible,
  onClose,
  mode,
  onModeChange,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    if (showControls) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(controlsTimeoutRef.current);
  }, [showControls]);

  useEffect(() => {
    if (videoRef.current && isVisible && videoUrl) {
      videoRef.current.play().catch(console.error);
    }
  }, [isVisible, videoUrl]);

  // Better mobile viewport handling
  useEffect(() => {
    if (isVisible) {
      // Add class to body for CSS targeting
      document.body.classList.add('video-player-active');
      
      // Lock scroll and fix body
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = "0";
      document.body.style.left = "0";
      
      // iOS specific: prevent bounce scroll
      document.body.style.overscrollBehavior = "none";
      document.body.style.WebkitOverflowScrolling = "touch";
      
      // Set viewport meta for mobile
      let viewport = document.querySelector("meta[name=viewport]");
      const originalViewportContent = viewport?.getAttribute("content") || "";
      if (viewport) {
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        );
      }

      return () => {
        document.body.classList.remove('video-player-active');
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.overscrollBehavior = "";
        document.body.style.WebkitOverflowScrolling = "";
        
        // Restore original viewport
        if (viewport && originalViewportContent) {
          viewport.setAttribute("content", originalViewportContent);
        }
      };
    }
  }, [isVisible]);

  // Enhanced fullscreen for mobile
  const requestFullscreen = () => {
    if (containerRef.current) {
      const elem = containerRef.current;
      
      // Try native fullscreen API
      if (elem.requestFullscreen) {
        elem.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch((err) => {
          console.warn("Fullscreen request failed:", err);
          // Fallback: just hide browser UI by scrolling
          if (window.innerWidth <= 768) {
            window.scrollTo(0, 1);
          }
        });
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
        setIsFullscreen(true);
      } else if (elem.webkitEnterFullscreen) {
        // iOS Safari video element
        elem.webkitEnterFullscreen();
        setIsFullscreen(true);
      } else {
        // Fallback for browsers that don't support fullscreen
        if (window.innerWidth <= 768) {
          window.scrollTo(0, 1);
        }
      }
    }
  };
  
  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const togglePlayPause = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setLastTouch(distance);
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      setLastTouch({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && typeof lastTouch === "number") {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const delta = distance - lastTouch;
      const newScale = Math.max(1, Math.min(3, scale + delta * 0.01));
      setScale(newScale);
      setLastTouch(distance);
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      e.preventDefault();
      const deltaX = e.touches[0].clientX - lastTouch.x;
      const deltaY = e.touches[0].clientY - lastTouch.y;

      setPosition({
        x: position.x + deltaX,
        y: position.y + deltaY,
      });

      setLastTouch({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastTouch(null);
  };

  const handleDoubleTap = () => {
    if (scale === 1) {
      setScale(2);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleContainerClick = () => {
    setShowControls(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setScale(1);
    setPosition({ x: 0, y: 0 });
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black video-player-container"
      style={{
        width: "100vw",
        height: "100vh",
        // Use dynamic viewport height for mobile
        height: "100dvh",
        minHeight: "-webkit-fill-available",
        touchAction: scale > 1 ? "none" : "auto",
        // Ensure proper positioning on mobile
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // Prevent scrolling
        overflow: "hidden",
        // Hardware acceleration
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
        willChange: "transform",
        // iOS Safari specific
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "none",
      }}
      onClick={handleContainerClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleTap}
    >
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{
          transform: `scale(${scale}) translate(${position.x / scale}px, ${
            position.y / scale
          }px)`,
          transition: isDragging ? "none" : "transform 0.3s ease",
        }}
      >
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            className="max-w-full max-h-full video-player-element"
            style={{
              objectFit: mode === "fit" ? "contain" : "cover",
              width: mode === "fill" ? "100%" : "auto",
              height: mode === "fill" ? "100%" : "auto",
              maxWidth: "100%",
              maxHeight: "100%",
              // Ensure video fills container properly
              display: "block",
            }}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            webkit-playsinline="true"
            // Additional attributes for better mobile support
            x5-video-player-type="h5"
            x5-video-player-fullscreen="true"
            x5-video-orientation="portraint"
            preload="auto"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            // Prevent context menu on long press
            onContextMenu={(e) => e.preventDefault()}
          />
        )}
        {!videoUrl && imageUrl && (
          <img
            src={imageUrl}
            alt="Background"
            className="max-w-full max-h-full"
            style={{
              objectFit: mode === "fit" ? "contain" : "cover",
              width: mode === "fill" ? "100%" : "auto",
              height: mode === "fill" ? "100%" : "auto",
            }}
          />
        )}
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: showControls
            ? "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.7) 100%)"
            : "transparent",
          pointerEvents: showControls ? "auto" : "none",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between"
          style={{
            paddingTop: "max(1rem, env(safe-area-inset-top))",
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
          }}
        >
          <button
            onClick={handleClose}
            className="p-3 rounded-full bg-black bg-opacity-50 backdrop-blur-lg text-white hover:bg-opacity-70 transition-all"
          >
            <X size={24} />
          </button>

          <div className="flex gap-2">
            {videoUrl && (
              <button
                onClick={toggleMute}
                className="p-3 rounded-full bg-black bg-opacity-50 backdrop-blur-lg text-white hover:bg-opacity-70 transition-all"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onModeChange();
              }}
              className="p-3 rounded-full bg-black bg-opacity-50 backdrop-blur-lg text-white hover:bg-opacity-70 transition-all"
            >
              {mode === "fit" ? (
                <Maximize2 size={20} />
              ) : (
                <Minimize2 size={20} />
              )}
            </button>
          </div>
        </div>

        {videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              onClick={togglePlayPause}
              className="p-6 rounded-full bg-black bg-opacity-50 backdrop-blur-lg text-white hover:bg-opacity-70 transition-all pointer-events-auto"
            >
              {isPlaying ? <Pause size={40} /> : <Play size={40} />}
            </button>
          </div>
        )}

        <div
          className="absolute bottom-0 left-0 right-0 p-4 text-center"
          style={{
            paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
        >
          <p className="text-white text-sm opacity-70">
            {scale > 1
              ? `Zoom: ${Math.round(scale * 100)}%`
              : "Chạm 2 lần hoặc pinch để zoom"}
          </p>
        </div>
      </div>
    </div>
  );
}
