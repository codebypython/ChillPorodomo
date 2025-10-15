// Hook for iOS Safari video optimization
import { useEffect, useRef } from "react";

export const useIOSVideoOptimization = (videoUrl) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;

    const video = videoRef.current;

    // iOS Safari specific optimizations
    const optimizeVideo = () => {
      // Reduce memory usage
      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");

      // Prevent buffering issues
      video.load();

      // Auto-play with user gesture workaround
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log(
            "Auto-play prevented, will play on user interaction:",
            error
          );
        });
      }
    };

    // Handle visibility change to pause/resume video
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    // Handle memory warnings on iOS
    const handleMemoryWarning = () => {
      if (video) {
        // Reduce video quality or pause temporarily
        video.pause();
        setTimeout(() => {
          video.play().catch(() => {});
        }, 1000);
      }
    };

    optimizeVideo();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", () => video.pause());

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (video) {
        video.pause();
        video.src = "";
        video.load();
      }
    };
  }, [videoUrl]);

  return videoRef;
};
