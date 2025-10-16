import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
  Settings,
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
  const progressBarRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true); // Muted by default for autoplay
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [buffered, setBuffered] = useState(0);

  const controlsTimeoutRef = useRef(null);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    const resetControlsTimer = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
          setShowSpeedMenu(false);
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

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const percentage = (bufferedEnd / video.duration) * 100;
        setBuffered(percentage);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
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

  const handleSeek = (e) => {
    const video = videoRef.current;
    const progressBar = progressBarRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const handleSkipBack = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.max(0, video.currentTime - 10);
    }
  };

  const handleSkipForward = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.min(video.duration, video.currentTime + 10);
    }
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

  const handleSpeedChange = (speed) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = speed;
      setPlaybackRate(speed);
      setShowSpeedMenu(false);
    }
  };

  const handleFullscreenToggle = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  return (
    <div
      ref={containerRef}
      className="video-player-container fixed inset-0 w-full h-full z-50 bg-black"
      style={{ height: "100dvh" }}
      onMouseMove={handleMouseMove}
      onClick={() => setShowControls(true)}
    >
      {/* Video/Image Container */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
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
      </div>

      {/* Video Controls Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.8) 100%)",
        }}
      >
        {/* Top Bar */}
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
                <Maximize size={20} />
              ) : (
                <Minimize size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Center Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlayPause}
            className="p-6 rounded-full bg-black bg-opacity-60 backdrop-blur-lg text-white hover:bg-opacity-80 transition-all"
          >
            {isPlaying ? <Pause size={48} /> : <Play size={48} />}
          </button>
        </div>

        {/* Skip Buttons (only for video) */}
        {videoUrl && (
          <>
            <button
              onClick={handleSkipBack}
              className="absolute left-1/4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black bg-opacity-50 backdrop-blur-lg text-white hover:bg-opacity-70 transition-all"
            >
              <SkipBack size={32} />
            </button>
            <button
              onClick={handleSkipForward}
              className="absolute right-1/4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black bg-opacity-50 backdrop-blur-lg text-white hover:bg-opacity-70 transition-all"
            >
              <SkipForward size={32} />
            </button>
          </>
        )}

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
            {/* Progress Bar */}
            <div
              ref={progressBarRef}
              className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-3 relative"
              onClick={handleSeek}
            >
              {/* Buffered Progress */}
              <div
                className="absolute h-full bg-gray-400 rounded-full"
                style={{ width: `${buffered}%` }}
              />
              {/* Current Progress */}
              <div
                className="absolute h-full bg-red-600 rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="video-controls flex items-center justify-between">
              {/* Left Side */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:scale-110 transition-transform"
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                </button>

                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-3">
                {/* Volume Control */}
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
                    className="volume-slider w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                </div>

                {/* Speed Control */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="text-white hover:scale-110 transition-transform"
                  >
                    <Settings size={24} />
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black bg-opacity-90 backdrop-blur-lg rounded-lg overflow-hidden">
                      <div className="px-4 py-2 text-white text-sm font-medium border-b border-gray-700">
                        Tốc độ phát lại
                      </div>
                      {[2, 1.5, 1.25, 1, 0.75, 0.5].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors flex items-center justify-between ${
                            playbackRate === speed ? "bg-gray-800" : ""
                          }`}
                        >
                          <span>{speed}x</span>
                          {playbackRate === speed && (
                            <span className="text-red-600">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fullscreen */}
                <button
                  onClick={handleFullscreenToggle}
                  className="text-white hover:scale-110 transition-transform"
                >
                  {isFullscreen ? (
                    <Minimize size={24} />
                  ) : (
                    <Maximize size={24} />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
