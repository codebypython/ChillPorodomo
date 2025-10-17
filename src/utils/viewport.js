/**
 * Mobile Viewport Height Fix
 * 
 * This utility helps handle the dynamic viewport height on mobile devices,
 * especially for iOS Safari where the address bar affects the viewport height.
 * 
 * Based on best practices from:
 * - https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
 * - https://developers.google.com/web/updates/2016/12/url-bar-resizing
 */

/**
 * Sets a CSS custom property for the true viewport height
 * This accounts for mobile browser UI elements like address bars
 */
export function setViewportHeight() {
  // Get the actual viewport height
  const vh = window.innerHeight * 0.01;
  
  // Set the CSS custom property to the root element
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  
  // Also set for dvh fallback
  if (!CSS.supports('height', '100dvh')) {
    document.documentElement.style.setProperty('height', `${window.innerHeight}px`);
  }
}

/**
 * Initialize viewport height tracking
 * This should be called once when the app starts
 */
export function initViewportHeight() {
  // Set initial value
  setViewportHeight();
  
  // Update on resize (including orientation change)
  window.addEventListener('resize', setViewportHeight);
  
  // Update on orientation change (mobile specific)
  window.addEventListener('orientationchange', () => {
    // Small delay to ensure browser has updated dimensions
    setTimeout(setViewportHeight, 100);
  });
  
  // iOS Safari specific: update when scrolling stops
  // This helps handle the address bar showing/hiding
  let scrollTimer;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(setViewportHeight, 100);
  }, { passive: true });
  
  // Update when page becomes visible (tab switching)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setViewportHeight();
    }
  });
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', setViewportHeight);
    window.removeEventListener('orientationchange', setViewportHeight);
  };
}

/**
 * Force hide address bar on mobile (iOS Safari trick)
 * This should be called when showing the video player
 */
export function hideAddressBar() {
  if (isMobile()) {
    // Scroll slightly to trigger address bar hiding
    window.scrollTo(0, 1);
    
    // Then scroll back to top
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }
}

/**
 * Check if device is mobile
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768;
}

/**
 * Check if device is iOS
 */
export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * Check if browser is Safari
 */
export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

/**
 * Get safe area insets (for devices with notches)
 */
export function getSafeAreaInsets() {
  const computedStyle = getComputedStyle(document.documentElement);
  
  return {
    top: computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0px',
    right: computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0px',
    bottom: computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0px',
    left: computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0px',
  };
}

/**
 * Lock body scroll (for modals/overlays)
 */
export function lockBodyScroll() {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${window.scrollY}px`;
  document.body.style.width = '100%';
  
  // Prevent layout shift from scrollbar disappearing
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
  
  return window.scrollY;
}

/**
 * Unlock body scroll (restore after modal/overlay closes)
 */
export function unlockBodyScroll(scrollPosition = 0) {
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.paddingRight = '';
  
  window.scrollTo(0, scrollPosition);
}

/**
 * Request fullscreen with fallbacks
 */
export function requestFullscreen(element) {
  if (element.requestFullscreen) {
    return element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    return element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    return element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    return element.msRequestFullscreen();
  }
  
  return Promise.reject(new Error('Fullscreen API not supported'));
}

/**
 * Exit fullscreen with fallbacks
 */
export function exitFullscreen() {
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    return document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    return document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    return document.msExitFullscreen();
  }
  
  return Promise.reject(new Error('Fullscreen API not supported'));
}

/**
 * Check if currently in fullscreen
 */
export function isFullscreen() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
}

export default {
  setViewportHeight,
  initViewportHeight,
  hideAddressBar,
  isMobile,
  isIOS,
  isSafari,
  getSafeAreaInsets,
  lockBodyScroll,
  unlockBodyScroll,
  requestFullscreen,
  exitFullscreen,
  isFullscreen,
};

