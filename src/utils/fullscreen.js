// Fullscreen and orientation utilities

export const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      return true
    } else {
      await document.exitFullscreen()
      return false
    }
  } catch (error) {
    console.error('Fullscreen error:', error)
    return false
  }
}

export const isFullscreen = () => {
  return !!document.fullscreenElement
}

export const lockOrientation = async (orientation = 'landscape') => {
  try {
    if (screen.orientation && screen.orientation.lock) {
      await screen.orientation.lock(orientation)
      return true
    }
    return false
  } catch (error) {
    console.error('Orientation lock error:', error)
    return false
  }
}

export const unlockOrientation = () => {
  try {
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock()
      return true
    }
    return false
  } catch (error) {
    console.error('Orientation unlock error:', error)
    return false
  }
}

export const getCurrentOrientation = () => {
  if (screen.orientation) {
    return screen.orientation.type
  }
  return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
}

