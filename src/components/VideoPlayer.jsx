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
      if (window.innerWidth <= 768) {
        requestFullscreen();
      }
    }
  }, [isVisible, videoUrl]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, [isVisible]);

  const requestFullscreen = () => {
    if (containerRef.current) {
      const elem = containerRef.current;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(console.error);
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    }
  };

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
      className="fixed inset-0 z-50 bg-black"
      style={{
        width: "100vw",
        height: "100vh",
        touchAction: scale > 1 ? "none" : "auto",
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
            className="max-w-full max-h-full"
            style={{
              objectFit: mode === "fit" ? "contain" : "cover",
              width: mode === "fill" ? "100%" : "auto",
              height: mode === "fill" ? "100%" : "auto",
            }}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            webkit-playsinline="true"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
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
