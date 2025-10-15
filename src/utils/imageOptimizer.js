// Image and video optimization utilities

/**
 * Compress image to reduce size before storing
 * @param {string} base64 - Base64 encoded image
 * @param {number} maxWidth - Maximum width
 * @param {number} quality - Quality 0-1
 * @returns {Promise<string>} - Compressed base64 image
 */
export const compressImage = async (
  base64,
  maxWidth = 1920,
  quality = 0.85
) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        // Create canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed base64
        const compressed = canvas.toDataURL("image/jpeg", quality);

        console.log(
          `[ImageOptimizer] Compressed: ${Math.round(
            base64.length / 1024
          )}KB → ${Math.round(compressed.length / 1024)}KB`
        );

        resolve(compressed);
      } catch (error) {
        console.error("[ImageOptimizer] Compression failed:", error);
        resolve(base64); // Return original if compression fails
      }
    };

    img.onerror = () => {
      console.error("[ImageOptimizer] Image load failed");
      resolve(base64); // Return original if load fails
    };

    img.src = base64;
  });
};

/**
 * Create thumbnail for preview
 * @param {string} base64 - Base64 encoded image
 * @param {number} maxSize - Maximum dimension
 * @returns {Promise<string>} - Thumbnail base64
 */
export const createThumbnail = async (base64, maxSize = 200) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate thumbnail size
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        // Create canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        // Draw thumbnail
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64
        const thumbnail = canvas.toDataURL("image/jpeg", 0.7);

        resolve(thumbnail);
      } catch (error) {
        console.error("[ImageOptimizer] Thumbnail creation failed:", error);
        resolve(base64);
      }
    };

    img.onerror = () => {
      console.error("[ImageOptimizer] Image load failed");
      resolve(base64);
    };

    img.src = base64;
  });
};

/**
 * Check if file is optimizable (image)
 * @param {string} mimeType - File MIME type
 * @returns {boolean}
 */
export const isOptimizableImage = (mimeType) => {
  return ["image/jpeg", "image/png", "image/webp"].includes(mimeType);
};

/**
 * Optimize video metadata for faster loading
 * @param {HTMLVideoElement} videoElement
 */
export const optimizeVideoElement = (videoElement) => {
  if (!videoElement) return;

  // Set optimal attributes for mobile
  videoElement.setAttribute("playsinline", "");
  videoElement.setAttribute("webkit-playsinline", "");
  videoElement.setAttribute("muted", "");
  videoElement.setAttribute("loop", "");
  videoElement.setAttribute("disablePictureInPicture", "");

  // Preload strategy
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  videoElement.preload = isMobile ? "metadata" : "auto";

  console.log(
    "[ImageOptimizer] Video element optimized for",
    isMobile ? "mobile" : "desktop"
  );
};

/**
 * Preload image/video for faster display
 * @param {string} url - Data URL or URL
 * @param {string} type - 'image' or 'video'
 */
export const preloadMedia = (url, type = "image") => {
  if (!url) return;

  if (type === "image") {
    const img = new Image();
    img.src = url;
    console.log("[ImageOptimizer] Preloading image");
  } else if (type === "video") {
    const video = document.createElement("video");
    video.src = url;
    video.preload = "metadata";
    console.log("[ImageOptimizer] Preloading video metadata");
  }
};

/**
 * Estimate data size
 * @param {string} base64 - Base64 string
 * @returns {Object} - Size info
 */
export const getDataSize = (base64) => {
  if (!base64) return { bytes: 0, kb: 0, mb: 0 };

  const bytes = base64.length;
  const kb = bytes / 1024;
  const mb = kb / 1024;

  return {
    bytes,
    kb: Math.round(kb * 100) / 100,
    mb: Math.round(mb * 100) / 100,
  };
};
