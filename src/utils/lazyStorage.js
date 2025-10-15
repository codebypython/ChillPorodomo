// Lazy loading storage utilities - Load metadata first, data on demand
import { initDB } from "./indexedDB";

// Load only metadata (lightweight)
export const getAnimationsMetadata = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction(["animations"], "readonly");
    const store = tx.objectStore("animations");

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const allAnimations = request.result;
        // Return only metadata (no URL data)
        const metadata = allAnimations.map((anim) => ({
          id: anim.id,
          name: anim.name,
          type: anim.type,
          // Don't include URL - save memory!
        }));
        resolve(metadata);
      };
      request.onerror = () => {
        console.error(
          "[LazyStorage] Error loading animations metadata:",
          request.error
        );
        resolve([]);
      };
    });
  } catch (error) {
    console.error("[LazyStorage] Error loading animations metadata:", error);
    return [];
  }
};

// Load only metadata (lightweight)
export const getSoundsMetadata = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction(["sounds"], "readonly");
    const store = tx.objectStore("sounds");

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const allSounds = request.result;
        // Return only metadata (no URL data)
        const metadata = allSounds.map((sound) => ({
          id: sound.id,
          name: sound.name,
          volume: sound.volume || 1.0,
          // Don't include URL - save memory!
        }));
        resolve(metadata);
      };
      request.onerror = () => {
        console.error(
          "[LazyStorage] Error loading sounds metadata:",
          request.error
        );
        resolve([]);
      };
    });
  } catch (error) {
    console.error("[LazyStorage] Error loading sounds metadata:", error);
    return [];
  }
};

// Load single animation data on demand
export const getAnimationData = async (id) => {
  try {
    const db = await initDB();
    const tx = db.transaction(["animations"], "readonly");
    const store = tx.objectStore("animations");

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => {
        const animation = request.result;
        if (!animation) {
          console.warn(`[LazyStorage] Animation ${id} not found`);
          resolve(null);
        } else {
          resolve(animation); // Full data with URL
        }
      };
      request.onerror = () => {
        console.error(
          `[LazyStorage] Error loading animation ${id}:`,
          request.error
        );
        resolve(null);
      };
    });
  } catch (error) {
    console.error(`[LazyStorage] Error loading animation ${id}:`, error);
    return null;
  }
};

// Load single sound data on demand
export const getSoundData = async (id) => {
  try {
    const db = await initDB();
    const tx = db.transaction(["sounds"], "readonly");
    const store = tx.objectStore("sounds");

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => {
        const sound = request.result;
        if (!sound) {
          console.warn(`[LazyStorage] Sound ${id} not found`);
          resolve(null);
        } else {
          resolve(sound); // Full data with URL
        }
      };
      request.onerror = () => {
        console.error(
          `[LazyStorage] Error loading sound ${id}:`,
          request.error
        );
        resolve(null);
      };
    });
  } catch (error) {
    console.error(`[LazyStorage] Error loading sound ${id}:`, error);
    return null;
  }
};

// Preload multiple items (for selected sounds/background)
export const preloadAnimations = async (ids) => {
  try {
    const promises = ids.map((id) => getAnimationData(id));
    return await Promise.all(promises);
  } catch (error) {
    console.error("[LazyStorage] Error preloading animations:", error);
    return [];
  }
};

// Preload multiple sounds
export const preloadSounds = async (ids) => {
  try {
    const promises = ids.map((id) => getSoundData(id));
    return await Promise.all(promises);
  } catch (error) {
    console.error("[LazyStorage] Error preloading sounds:", error);
    return [];
  }
};

// Cache for loaded data (in-memory)
const loadedDataCache = {
  animations: new Map(),
  sounds: new Map(),
};

// Get animation with cache
export const getAnimationCached = async (id) => {
  if (loadedDataCache.animations.has(id)) {
    console.log(`[LazyStorage] Using cached animation ${id}`);
    return loadedDataCache.animations.get(id);
  }

  const data = await getAnimationData(id);
  if (data) {
    loadedDataCache.animations.set(id, data);
  }
  return data;
};

// Get sound with cache
export const getSoundCached = async (id) => {
  if (loadedDataCache.sounds.has(id)) {
    console.log(`[LazyStorage] Using cached sound ${id}`);
    return loadedDataCache.sounds.get(id);
  }

  const data = await getSoundData(id);
  if (data) {
    loadedDataCache.sounds.set(id, data);
  }
  return data;
};

// Clear cache for unused items
export const clearUnusedCache = (usedAnimationIds, usedSoundIds) => {
  // Clear animations not in use
  for (const [id] of loadedDataCache.animations) {
    if (!usedAnimationIds.includes(id)) {
      console.log(`[LazyStorage] Clearing cached animation ${id}`);
      loadedDataCache.animations.delete(id);
    }
  }

  // Clear sounds not in use
  for (const [id] of loadedDataCache.sounds) {
    if (!usedSoundIds.includes(id)) {
      console.log(`[LazyStorage] Clearing cached sound ${id}`);
      loadedDataCache.sounds.delete(id);
    }
  }
};

// Clear all cache
export const clearAllCache = () => {
  loadedDataCache.animations.clear();
  loadedDataCache.sounds.clear();
  console.log("[LazyStorage] Cleared all cache");
};

// Get cache size (for monitoring)
export const getCacheSize = () => {
  return {
    animations: loadedDataCache.animations.size,
    sounds: loadedDataCache.sounds.size,
  };
};
