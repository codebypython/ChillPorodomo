import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react";

function VideoPlayer({
  videoUrl,
  imageUrl,
  onClose,
  backgroundMode,
  onToggleMode,
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);
  const [lastTap, setLastTap] = useState(0);

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const touchStartDistance = useRef(0);
  const initialScale = useRef(1);
  const controlsTimeout = useRef(null);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (showControls) {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [showControls]);

  // Show controls on any interaction
  const handleShowControls = () => {
    setShowControls(true);
  };

  // Handle touch start (for pinch zoom)
  const handleTouchStart = (e) => {
    handleShowControls();

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
        handleDoubleTab();
      } else {
        // Start drag
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

  // Handle touch move (for pinch zoom and pan)
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
        3
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

  // Handle touch end
  const handleTouchEnd = () => {
    setIsDragging(false);

    // Reset position if scale is back to 1
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Double tap to zoom
  const handleDoubleTab = () => {
    if (scale === 1) {
      setScale(2);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  // Zoom in button
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3));
    handleShowControls();
  };

  // Zoom out button
  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.5, 1);
    setScale(newScale);
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
    handleShowControls();
  };

  // Reset zoom
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    handleShowControls();
  };

  // Mouse events for desktop
  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      const maxOffset = 100 * scale;
      setPosition({
        x: Math.min(Math.max(newX, -maxOffset), maxOffset),
        y: Math.min(Math.max(newY, -maxOffset), maxOffset),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom for desktop
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.min(Math.max(scale + delta, 1), 3);
    setScale(newScale);
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
    handleShowControls();
  };

  return (
    <div
      ref={containerRef}
      className="video-player-cinema fixed inset-0 w-full h-full z-50 bg-black"
      style={{
        height: "100dvh",
        touchAction: scale > 1 ? "none" : "auto",
      }}
      onClick={handleShowControls}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
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
            muted
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
            onClick={onClose}
            className="p-3 rounded-full bg-black bg-opacity-50 backdrop-blur-lg text-white hover:bg-opacity-70 transition-all"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="flex gap-2">
            <button
              onClick={onToggleMode}
              className="p-3 rounded-full bg-black bg-opacity-50 backdrop-blur-lg text-white hover:bg-opacity-70 transition-all"
            >
              {backgroundMode === "fit" ? (
                <Maximize2 size={20} />
              ) : (
                <Minimize2 size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Zoom Controls - Bottom Right */}
        <div
          className="absolute bottom-0 right-0 p-4 flex flex-col gap-2"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)",
            paddingRight: "calc(env(safe-area-inset-right) + 1rem)",
          }}
        >
          <button
            onClick={handleZoomIn}
            disabled={scale >= 3}
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
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-60 text-center px-4">
            Double tap hoặc pinch để zoom
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
