// IndexedDB utility for storing large files (images, GIFs, videos)

const DB_NAME = 'ChillPomodoroDB'
const DB_VERSION = 1
const STORE_ANIMATIONS = 'animations'
const STORE_SOUNDS = 'sounds'

let db = null

// Initialize IndexedDB
export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject('IndexedDB error: ' + request.error)
    }

    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      db = event.target.result

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORE_ANIMATIONS)) {
        const animationStore = db.createObjectStore(STORE_ANIMATIONS, { keyPath: 'id' })
        animationStore.createIndex('name', 'name', { unique: false })
        animationStore.createIndex('createdAt', 'createdAt', { unique: false })
      }

      if (!db.objectStoreNames.contains(STORE_SOUNDS)) {
        const soundStore = db.createObjectStore(STORE_SOUNDS, { keyPath: 'id' })
        soundStore.createIndex('name', 'name', { unique: false })
        soundStore.createIndex('createdAt', 'createdAt', { unique: false })
      }
    }
  })
}

// Animation CRUD operations
export const getAllAnimations = async () => {
  try {
    await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_ANIMATIONS], 'readonly')
      const store = transaction.objectStore(STORE_ANIMATIONS)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  } catch (error) {
    console.error('Error getting animations:', error)
    return []
  }
}

export const addAnimationToDB = async (animation) => {
  try {
    await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_ANIMATIONS], 'readwrite')
      const store = transaction.objectStore(STORE_ANIMATIONS)
      
      const newAnimation = {
        id: Date.now().toString(),
        ...animation,
        createdAt: new Date().toISOString()
      }
      
      const request = store.add(newAnimation)

      request.onsuccess = () => {
        resolve(newAnimation)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  } catch (error) {
    console.error('Error adding animation:', error)
    throw error
  }
}

export const updateAnimationInDB = async (id, updates) => {
  try {
    await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_ANIMATIONS], 'readwrite')
      const store = transaction.objectStore(STORE_ANIMATIONS)
      
      const getRequest = store.get(id)
      
      getRequest.onsuccess = () => {
        const data = getRequest.result
        if (data) {
          const updatedData = { ...data, ...updates }
          const updateRequest = store.put(updatedData)
          
          updateRequest.onsuccess = () => {
            resolve(updatedData)
          }
          
          updateRequest.onerror = () => {
            reject(updateRequest.error)
          }
        } else {
          reject('Animation not found')
        }
      }
      
      getRequest.onerror = () => {
        reject(getRequest.error)
      }
    })
  } catch (error) {
    console.error('Error updating animation:', error)
    throw error
  }
}

export const deleteAnimationFromDB = async (id) => {
  try {
    await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_ANIMATIONS], 'readwrite')
      const store = transaction.objectStore(STORE_ANIMATIONS)
      const request = store.delete(id)

      request.onsuccess = () => {
        resolve(true)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  } catch (error) {
    console.error('Error deleting animation:', error)
    throw error
  }
}

// Sound CRUD operations
export const getAllSounds = async () => {
  try {
    await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_SOUNDS], 'readonly')
      const store = transaction.objectStore(STORE_SOUNDS)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  } catch (error) {
    console.error('Error getting sounds:', error)
    return []
  }
}

export const addSoundToDB = async (sound) => {
  try {
    await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_SOUNDS], 'readwrite')
      const store = transaction.objectStore(STORE_SOUNDS)
      
      const newSound = {
        id: Date.now().toString(),
        ...sound,
        createdAt: new Date().toISOString()
      }
      
      const request = store.add(newSound)

      request.onsuccess = () => {
        resolve(newSound)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  } catch (error) {
    console.error('Error adding sound:', error)
    throw error
  }
}

export const updateSoundInDB = async (id, updates) => {
  try {
    await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_SOUNDS], 'readwrite')
      const store = transaction.objectStore(STORE_SOUNDS)
      
      const getRequest = store.get(id)
      
      getRequest.onsuccess = () => {
        const data = getRequest.result
        if (data) {
          const updatedData = { ...data, ...updates }
          const updateRequest = store.put(updatedData)
          
          updateRequest.onsuccess = () => {
            resolve(updatedData)
          }
          
          updateRequest.onerror = () => {
            reject(updateRequest.error)
          }
        } else {
          reject('Sound not found')
        }
      }
      
      getRequest.onerror = () => {
        reject(getRequest.error)
      }
    })
  } catch (error) {
    console.error('Error updating sound:', error)
    throw error
  }
}

export const deleteSoundFromDB = async (id) => {
  try {
    await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_SOUNDS], 'readwrite')
      const store = transaction.objectStore(STORE_SOUNDS)
      const request = store.delete(id)

      request.onsuccess = () => {
        resolve(true)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  } catch (error) {
    console.error('Error deleting sound:', error)
    throw error
  }
}

// Utility: Convert file to base64 (for small files)
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Utility: Store file as Blob in IndexedDB (for large files like videos)
export const fileToBlob = async (file) => {
  // Just return the file blob itself
  // IndexedDB can store Blobs directly
  return file
}

// Utility: Create Blob URL from stored blob
export const createBlobURL = (blob) => {
  if (!blob) return null
  return URL.createObjectURL(blob)
}

// Utility: Check file size
export const isFileSizeValid = (file, maxSizeMB = 50) => {
  const maxSize = maxSizeMB * 1024 * 1024 // Convert to bytes
  return file.size <= maxSize
}

// Utility: Determine if file should use Blob storage (videos, large files)
export const shouldUseBlob = (file) => {
  // Use Blob for videos or files larger than 5MB
  return file.type.startsWith('video/') || file.size > 5 * 1024 * 1024
}

