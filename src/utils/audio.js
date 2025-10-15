// Audio utilities for playing sounds and managing audio instances

class AudioManager {
  constructor() {
    this.audioInstances = new Map()
    this.tickingSoundUrl = null // Will be set when user adds ticking sound or use default
  }

  // Create or get audio instance
  getAudioInstance(id, url) {
    if (!this.audioInstances.has(id)) {
      const audio = new Audio(url)
      audio.loop = false
      this.audioInstances.set(id, audio)
    }
    return this.audioInstances.get(id)
  }

  // Play a sound
  async playSound(id, url, loop = false, volume = 1.0) {
    try {
      const audio = this.getAudioInstance(id, url)
      audio.loop = loop
      audio.volume = Math.max(0, Math.min(1, volume))
      
      // Reset to beginning if already playing
      audio.currentTime = 0
      
      await audio.play()
      return audio
    } catch (error) {
      console.error('Error playing sound:', error)
      return null
    }
  }

  // Stop a sound
  stopSound(id) {
    if (this.audioInstances.has(id)) {
      const audio = this.audioInstances.get(id)
      audio.pause()
      audio.currentTime = 0
    }
  }

  // Stop all sounds
  stopAll() {
    this.audioInstances.forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  // Set volume for specific sound
  setVolume(id, volume) {
    if (this.audioInstances.has(id)) {
      const audio = this.audioInstances.get(id)
      audio.volume = Math.max(0, Math.min(1, volume))
    }
  }

  // Clean up
  cleanup() {
    this.stopAll()
    this.audioInstances.clear()
  }

  // Play ticking sound (for countdown)
  async playTickingSound() {
    // Default ticking sound URL (you can replace with actual sound)
    const tickUrl = this.tickingSoundUrl || 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwPUKfk77RgGwU7k9r0yXcsBS18zu/bljwJEF2049+qVhQJQ5zd8MBuJAUrgdHz1oU4Bxtyv+/knUwNDlCn5O+zYBoGPJHa9Ml6LAUzfM/u15U7CRJctOPbrFUTCkOb3fDBbiQELoHN8tmJNwoZb7/u45lMDABQp+PvtGEbBjuP2vTLei0FMn3O79iWOwkSW7Tk3apYFApCnN3xwW4kBSuBzvLaizYKGGy+7+OZTAwQUKjk7rRiGgU8ktv0zHorBTJ+z+/YljsJElqy5d2rVxQKQpzd8cJwIwQwhM/y2Ig3CRhrvO/gmk4LDVG15O60YBsGO5Ha9Mx7KwU0fc/u2JY6CRFbs+XdqVcWCj+c3fHCciIGMITP8tmIOAkZbr7v4ptQCwxRt+XvtGAbBjyS2/XPeSoFOH7P7tiWOgkRW7Pk26hVFgpBnN3xwm8jBjCEz/LZhzgJGW+/7+KbUAsLUbjl77NhGgY8k9v0znkrBTh+z+7WljsJEVqy5dqoVhYKQZvd8sNvIwUwhM/y2Yc4CRlwv+/im1ELC1C45O+0YRoGOpPb9c56KgU5fs/u1pY6CRFZY+TaqVYWCkGb3fLDb0YIG3G/7+KaUQwLULfk7rNgGgU8ktv1zngrBDN9ze3aizYEGm++7+GaTwsLUbXk7rNhGgY7kdr0zXorBDN8zu3ZljQIF16y5NuoVRQKP5ra88NuJAQxf8zx2Ic3BRdquu3km1AMC1C25e6yYRoGOpDb8s15KwUzfc/u1pU6CA9as+PdqFQUCz+Y2PLEcSIFMX/M8diIOAUYar3u5ZtPDAtRtuXtsWEaBTmP2fLOeSsFMn3P7tmWOAgPXLPk3KlVFQpAm9zxxHMjBDGAzfDYiDgFF2q77uSaTwwMT7jl7rJhGgU8kNrzzHsrBzJ8z+/YlzsJEVqz5dyoVRUKP5rb8sRxIwYyfszu14c4BhdqvO7lm1EKC1G35O60YhsEO5Ha9Mx7KwU0fc/u2Jc6CRFZ';
    
    return this.playSound('ticking', tickUrl, false, 0.7)
  }
}

// Export singleton instance
export const audioManager = new AudioManager()

