// Google Drive utilities

/**
 * Convert Google Drive share link to direct download link
 * @param {string} url - Google Drive share URL
 * @returns {string} Direct download URL
 */
export const convertGoogleDriveUrl = (url) => {
  try {
    // Patterns for Google Drive URLs
    const patterns = [
      // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
      /drive\.google\.com\/file\/d\/([^/]+)/,
      // https://drive.google.com/open?id=FILE_ID
      /drive\.google\.com\/open\?id=([^&]+)/,
      // Direct already
      /drive\.google\.com\/uc\?/,
    ];

    // Check if already direct download link
    if (url.includes("drive.google.com/uc?")) {
      return url;
    }

    // Extract file ID
    let fileId = null;
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        fileId = match[1];
        break;
      }
    }

    if (!fileId) {
      throw new Error("Invalid Google Drive URL");
    }

    // Create direct download link
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  } catch (error) {
    console.error("Error converting Google Drive URL:", error);
    return null;
  }
};

/**
 * Check if URL is a Google Drive link
 * @param {string} url - URL to check
 * @returns {boolean}
 */
export const isGoogleDriveUrl = (url) => {
  return url.includes("drive.google.com");
};

/**
 * Download file from Google Drive and convert to base64
 * @param {string} url - Google Drive URL
 * @param {function} onProgress - Progress callback (optional)
 * @returns {Promise<string>} Base64 data URL
 */
export const downloadFromGoogleDrive = async (url, onProgress = null) => {
  try {
    // Convert to direct download URL
    const directUrl = convertGoogleDriveUrl(url);

    if (!directUrl) {
      throw new Error("Không thể chuyển đổi link Google Drive");
    }

    // Fetch file
    const response = await fetch(directUrl, {
      method: "GET",
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get total size for progress
    const contentLength = response.headers.get("content-length");
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    // Read response as blob with progress
    const reader = response.body.getReader();
    const chunks = [];
    let receivedLength = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      receivedLength += value.length;

      // Call progress callback
      if (onProgress && total > 0) {
        const progress = (receivedLength / total) * 100;
        onProgress(progress);
      }
    }

    // Concatenate chunks into single Uint8Array
    const chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for (const chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }

    // Convert to blob
    const blob = new Blob([chunksAll]);

    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error downloading from Google Drive:", error);
    throw error;
  }
};

/**
 * Validate Google Drive URL
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export const validateGoogleDriveUrl = (url) => {
  if (!url || typeof url !== "string") return false;

  const patterns = [
    /^https:\/\/drive\.google\.com\/file\/d\/[^/]+/,
    /^https:\/\/drive\.google\.com\/open\?id=[^&]+/,
    /^https:\/\/drive\.google\.com\/uc\?/,
  ];

  return patterns.some((pattern) => pattern.test(url));
};

/**
 * Get file info from Google Drive (if possible)
 * Note: This might not work due to CORS, but we try
 * @param {string} url - Google Drive URL
 * @returns {Promise<object>} File info
 */
export const getGoogleDriveFileInfo = async (url) => {
  try {
    const directUrl = convertGoogleDriveUrl(url);

    const response = await fetch(directUrl, {
      method: "HEAD",
      mode: "cors",
    });

    return {
      size: response.headers.get("content-length"),
      type: response.headers.get("content-type"),
      ok: response.ok,
    };
  } catch (error) {
    // CORS might block this, return minimal info
    return {
      size: null,
      type: null,
      ok: false,
    };
  }
};
