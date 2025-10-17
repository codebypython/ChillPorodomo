// Utility functions for localStorage management

export const STORAGE_KEYS = {
  ANIMATIONS: 'chillpomodoro_animations',
  SOUNDS: 'chillpomodoro_sounds',
  PRESETS: 'chillpomodoro_presets',
  SAVED_SESSIONS: 'chillpomodoro_saved_sessions',
  SETTINGS: 'chillpomodoro_settings'
}

export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Error getting ${key} from storage:`, error)
    return null
  }
}

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error)
    return false
  }
}

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error)
    return false
  }
}

// Animation management - Now using IndexedDB
// Import these functions from indexedDB.js instead
export const getAnimations = async () => {
  const { getAllAnimations } = await import('./indexedDB.js')
  return getAllAnimations()
}

export const addAnimation = async (animation) => {
  const { addAnimationToDB } = await import('./indexedDB.js')
  return addAnimationToDB(animation)
}

export const updateAnimation = async (id, updates) => {
  const { updateAnimationInDB } = await import('./indexedDB.js')
  return updateAnimationInDB(id, updates)
}

export const deleteAnimation = async (id) => {
  const { deleteAnimationFromDB } = await import('./indexedDB.js')
  return deleteAnimationFromDB(id)
}

// Sound management - Now using IndexedDB
export const getSounds = async () => {
  const { getAllSounds } = await import('./indexedDB.js')
  return getAllSounds()
}

export const addSound = async (sound) => {
  const { addSoundToDB } = await import('./indexedDB.js')
  return addSoundToDB(sound)
}

export const updateSound = async (id, updates) => {
  const { updateSoundInDB } = await import('./indexedDB.js')
  return updateSoundInDB(id, updates)
}

export const deleteSound = async (id) => {
  const { deleteSoundFromDB } = await import('./indexedDB.js')
  return deleteSoundFromDB(id)
}

// Preset management
export const getPresets = () => {
  return getFromStorage(STORAGE_KEYS.PRESETS) || []
}

export const savePresets = (presets) => {
  return saveToStorage(STORAGE_KEYS.PRESETS, presets)
}

export const addPreset = (preset) => {
  const presets = getPresets()
  const newPreset = {
    id: Date.now().toString(),
    ...preset,
    createdAt: new Date().toISOString()
  }
  presets.push(newPreset)
  savePresets(presets)
  return newPreset
}

export const updatePreset = (id, updates) => {
  const presets = getPresets()
  const index = presets.findIndex(p => p.id === id)
  if (index !== -1) {
    presets[index] = { ...presets[index], ...updates }
    savePresets(presets)
    return presets[index]
  }
  return null
}

export const deletePreset = (id) => {
  const presets = getPresets()
  const filtered = presets.filter(p => p.id !== id)
  savePresets(filtered) // Fixed: save filtered, not presets
  return true
}

// Saved sessions management
export const getSavedSessions = () => {
  return getFromStorage(STORAGE_KEYS.SAVED_SESSIONS) || []
}

export const saveSavedSessions = (sessions) => {
  return saveToStorage(STORAGE_KEYS.SAVED_SESSIONS, sessions)
}

export const addSavedSession = (session) => {
  const sessions = getSavedSessions()
  const newSession = {
    id: Date.now().toString(),
    ...session,
    createdAt: new Date().toISOString()
  }
  sessions.push(newSession)
  saveSavedSessions(sessions)
  return newSession
}

export const deleteSavedSession = (id) => {
  const sessions = getSavedSessions()
  const filtered = sessions.filter(s => s.id !== id)
  saveSavedSessions(filtered)
  return true
}

