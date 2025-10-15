import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  X,
  Save,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Smartphone,
  ChevronDown,
  EyeOff,
  Eye,
  Volume2,
  Trash2,
  Maximize2,
  Minimize2,
  Sliders,
} from "lucide-react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import {
  getAnimations,
  getSounds,
  getPresets,
  getSavedSessions,
  addSavedSession,
  deleteSavedSession,
} from "../utils/storage";
import {
  getAnimationsMetadata,
  getSoundsMetadata,
  getAnimationCached,
  getSoundCached,
  clearUnusedCache,
  clearAllCache,
} from "../utils/lazyStorage";
import { audioManager } from "../utils/audio";
import {
  toggleFullscreen,
  lockOrientation,
  unlockOrientation,
} from "../utils/fullscreen";

function FocusPage() {
  const navigate = useNavigate();

  // Data from storage
  const [animations, setAnimations] = useState([]);
  const [sounds, setSounds] = useState([]);
  const [presets, setPresets] = useState([]);
  const [savedSessions, setSavedSessions] = useState([]);

  // UI State
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [soundTracks, setSoundTracks] = useState([
    { id: Date.now(), selectedSound: null, type: "single", volume: 1.0 },
  ]);
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);

  // Timer State
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkMode, setIsWorkMode] = useState(true);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [showBreakPopup, setShowBreakPopup] = useState(false);
  const [breakCountdown, setBreakCountdown] = useState(20);

  // Modals
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [sessionName, setSessionName] = useState("");

  // Hide UI State
  const [isUIHidden, setIsUIHidden] = useState(false);
  const [showTimerWhenHidden, setShowTimerWhenHidden] = useState(false);
  const [showVolumePanel, setShowVolumePanel] = useState(false);

  // Background Mode State: 'fit' (contain) or 'fill' (cover)
  const [backgroundMode, setBackgroundMode] = useState(() => {
    const saved = localStorage.getItem("backgroundMode");
    return saved || "fit";
  });

  const timerRef = useRef(null);
  const breakTimerRef = useRef(null);
  const videoRef = useRef(null);
  const blurVideoRef = useRef(null);

  // Cache data to prevent reloading
  const dataCache = useRef({
    animations: null,
    sounds: null,
    presets: null,
    sessions: null,
    timestamp: 0,
  });

  // Detect mobile device
  const isMobile = useRef(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768
  ).current;

  // Page visibility state
  const [isPageVisible, setIsPageVisible] = useState(!document.hidden);
  const wasRunningBeforeHidden = useRef(false);

  // Load data on mount with caching
  useEffect(() => {
    loadData();

    return () => {
      audioManager.stopAll();
      if (timerRef.current) clearInterval(timerRef.current);
      if (breakTimerRef.current) clearInterval(breakTimerRef.current);

      // Clear cache on unmount to free memory
      dataCache.current = {
        animations: null,
        sounds: null,
        presets: null,
        sessions: null,
        timestamp: 0,
      };

      // Clear lazy loading cache
      clearAllCache();
      console.log("[ChillPomodoro] All caches cleared on unmount");
    };
  }, []);

  // Page Visibility API - Pause when tab inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsPageVisible(isVisible);

      if (!isVisible && isRunning) {
        // Tab hidden - pause timer and audio (keep videos running)
        wasRunningBeforeHidden.current = true;
        setIsRunning(false);
        audioManager.stopAll();
        console.log("[ChillPomodoro] Tab hidden - paused");

        // Keep videos playing in background (if exists)
        if (backgroundVideo) {
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
          if (blurVideoRef.current && !isMobile) {
            blurVideoRef.current.play().catch(() => {});
          }
        }
      } else if (isVisible && wasRunningBeforeHidden.current) {
        // Tab visible again - resume videos if needed
        wasRunningBeforeHidden.current = false;

        // Ensure videos are playing
        if (backgroundVideo) {
          if (videoRef.current) {
            videoRef.current.play().catch((err) => {
              console.warn("[ChillPomodoro] Main video resume failed:", err);
            });
          }
          if (blurVideoRef.current && !isMobile) {
            blurVideoRef.current.play().catch(() => {});
          }
        }

        // Don't auto-resume timer, let user decide
        console.log("[ChillPomodoro] Tab visible - ready to resume");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Prevent iOS Safari from killing the tab
    const preventUnload = (e) => {
      if (isRunning) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", preventUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", preventUnload);
    };
  }, [isRunning, backgroundVideo]);

  // ESC key to toggle UI visibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isRunning) {
        setIsUIHidden(!isUIHidden);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isUIHidden, isRunning]);

  // Update time left when work/break time changes
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(isWorkMode ? workTime * 60 : breakTime * 60);
    }
  }, [workTime, breakTime, isWorkMode, isRunning]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 11 && prev > 10) {
            audioManager.playTickingSound();
          }

          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Break popup timer
  useEffect(() => {
    if (showBreakPopup) {
      setBreakCountdown(20);
      breakTimerRef.current = setInterval(() => {
        setBreakCountdown((prev) => {
          if (prev <= 1) {
            setShowBreakPopup(false);
            if (breakTimerRef.current) clearInterval(breakTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (breakTimerRef.current) clearInterval(breakTimerRef.current);
    };
  }, [showBreakPopup]);

  const loadData = async () => {
    try {
      const now = Date.now();
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

      // Check if cache is still valid
      if (
        dataCache.current.timestamp > 0 &&
        now - dataCache.current.timestamp < CACHE_DURATION &&
        dataCache.current.animations
      ) {
        console.log("[ChillPomodoro] Using cached metadata");
        setAnimations(dataCache.current.animations);
        setSounds(dataCache.current.sounds);
        setPresets(dataCache.current.presets);
        setSavedSessions(dataCache.current.sessions);
        return;
      }

      console.log("[ChillPomodoro] Loading lightweight metadata (OPTIMIZED)");

      // OPTIMIZATION: Load only metadata (names, IDs) - NOT full data URLs
      // This is 100x faster and lighter than loading full base64 data!
      const [animationsData, soundsData, presetsData, sessionsData] =
        await Promise.all([
          getAnimationsMetadata(), // Only metadata - NO URLs!
          getSoundsMetadata(), // Only metadata - NO URLs!
          Promise.resolve(getPresets()),
          Promise.resolve(getSavedSessions()),
        ]);

      const animations = animationsData || [];
      const sounds = soundsData || [];
      const presets = presetsData || [];
      const sessions = sessionsData || [];

      // Update state with lightweight metadata
      setAnimations(animations);
      setSounds(sounds);
      setPresets(presets);
      setSavedSessions(sessions);

      // Update cache
      dataCache.current = {
        animations,
        sounds,
        presets,
        sessions,
        timestamp: now,
      };

      console.log("[ChillPomodoro] Lightweight metadata loaded ⚡");
      console.log(`  → ${animations.length} animations (metadata only)`);
      console.log(`  → ${sounds.length} sounds (metadata only)`);
    } catch (error) {
      console.error("[ChillPomodoro] Error loading data:", error);
      setAnimations([]);
      setSounds([]);
      setPresets([]);
      setSavedSessions([]);

      // Show user-friendly error
      alert("Không thể tải dữ liệu. Vui lòng refresh trang.");
    }
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    setShowBreakPopup(true);
    setIsUIHidden(false);
    setIsWorkMode(!isWorkMode);
  };

  const handleStartPause = async () => {
    try {
      if (!isRunning) {
        // Ensure videos play when starting (user interaction)
        if (backgroundVideo) {
          // Play main video
          if (videoRef.current) {
            videoRef.current.play().catch((err) => {
              console.warn(
                "[ChillPomodoro] Main video play on start failed:",
                err
              );
            });
          }

          // Play blur video (desktop only)
          if (blurVideoRef.current && !isMobile) {
            blurVideoRef.current.play().catch(() => {});
          }
        }

        // OPTIMIZATION: Load sound data on-demand before playing
        console.log("[ChillPomodoro] Loading selected sounds...");

        for (const track of soundTracks) {
          if (track.selectedSound) {
            const trackVolume = track.volume || 1.0;

            if (track.type === "single") {
              // Load full sound data on-demand
              const sound = await getSoundCached(track.selectedSound);
              if (sound && sound.url) {
                const finalVolume = (sound.volume || 1.0) * trackVolume;
                audioManager.playSound(track.id, sound.url, true, finalVolume);
              }
            } else if (track.type === "preset") {
              const preset = presets.find((p) => p.id === track.selectedSound);
              if (preset && preset.soundIds) {
                // Load all sounds in preset
                for (const soundId of preset.soundIds) {
                  const sound = await getSoundCached(soundId);
                  if (sound && sound.url) {
                    const finalVolume = (sound.volume || 1.0) * trackVolume;
                    audioManager.playSound(
                      `${track.id}_${soundId}`,
                      sound.url,
                      true,
                      finalVolume
                    );
                  }
                }
              }
            }
          }
        }

        console.log("[ChillPomodoro] All sounds loaded and playing ✓");
      } else {
        audioManager.stopAll();
        // Don't pause videos when stopping timer - keep them playing
        // Videos should keep looping in background
      }

      setIsRunning(!isRunning);
    } catch (error) {
      console.error("[ChillPomodoro] Error in handleStartPause:", error);
      // Try to recover
      audioManager.stopAll();
      setIsRunning(false);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(isWorkMode ? workTime * 60 : breakTime * 60);
    audioManager.stopAll();

    // Keep videos playing after reset
    if (backgroundVideo) {
      // Play main video
      if (videoRef.current) {
        videoRef.current.play().catch((err) => {
          console.warn(
            "[ChillPomodoro] Main video play after reset failed:",
            err
          );
        });
      }

      // Play blur video (desktop only)
      if (blurVideoRef.current && !isMobile) {
        blurVideoRef.current.play().catch(() => {});
      }
    }
  };

  const handleAddSoundTrack = () => {
    setSoundTracks([
      ...soundTracks,
      { id: Date.now(), selectedSound: null, type: "single", volume: 1.0 },
    ]);
  };

  const handleRemoveSoundTrack = (id) => {
    setSoundTracks(soundTracks.filter((t) => t.id !== id));
  };

  const handleSoundTrackChange = (id, value, type, volume) => {
    setSoundTracks(
      soundTracks.map((t) =>
        t.id === id
          ? {
              ...t,
              selectedSound: value,
              type,
              volume: volume !== undefined ? volume : t.volume,
            }
          : t
      )
    );
  };

  // Update volume in realtime while running
  const handleRealtimeVolumeChange = async (trackId, newVolume) => {
    // Update state
    setSoundTracks(
      soundTracks.map((t) =>
        t.id === trackId ? { ...t, volume: newVolume } : t
      )
    );

    // Update audio manager immediately
    const track = soundTracks.find((t) => t.id === trackId);
    if (track && track.selectedSound) {
      if (track.type === "single") {
        // Get sound data (from cache if already loaded)
        const sound = await getSoundCached(track.selectedSound);
        if (sound) {
          const finalVolume = (sound.volume || 1.0) * newVolume;
          audioManager.setVolume(trackId, finalVolume);
        }
      } else if (track.type === "preset") {
        const preset = presets.find((p) => p.id === track.selectedSound);
        if (preset && preset.soundIds) {
          // Update all sounds in preset
          for (const soundId of preset.soundIds) {
            const sound = await getSoundCached(soundId);
            if (sound) {
              const finalVolume = (sound.volume || 1.0) * newVolume;
              audioManager.setVolume(`${trackId}_${soundId}`, finalVolume);
            }
          }
        }
      }
    }
  };

  const handleSaveSession = () => {
    if (!sessionName) {
      alert("Vui lòng nhập tên session");
      return;
    }

    const session = {
      name: sessionName,
      background: selectedBackground,
      soundTracks: soundTracks,
      workTime,
      breakTime,
    };

    addSavedSession(session);
    loadData();
    setShowSaveModal(false);
    setSessionName("");
    alert("Đã lưu session thành công!");
  };

  const handleLoadSession = (session) => {
    try {
      setSelectedBackground(session.background);
      setSoundTracks(
        session.soundTracks || [
          { id: Date.now(), selectedSound: null, type: "single", volume: 1.0 },
        ]
      );
      setWorkTime(session.workTime);
      setBreakTime(session.breakTime);
      setShowLoadModal(false);
      handleReset();
    } catch (error) {
      console.error("[ChillPomodoro] Error loading session:", error);
      alert("Không thể tải session. Vui lòng thử lại.");
    }
  };

  // Ensure video plays when background is selected or timer starts
  useEffect(() => {
    if (backgroundVideo) {
      // Try to play main video
      if (videoRef.current) {
        const playPromise = videoRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("[ChillPomodoro] Main video playing");
            })
            .catch((error) => {
              console.warn("[ChillPomodoro] Video autoplay blocked:", error);
              // This is normal - video will play on user interaction
            });
        }
      }

      // Try to play blur video (desktop only)
      if (blurVideoRef.current && !isMobile) {
        blurVideoRef.current.play().catch(() => {
          // Ignore blur video play errors
        });
      }
    }
  }, [backgroundVideo, isRunning, isMobile]);

  // Memory cleanup - Release unused background resources
  useEffect(() => {
    // Cleanup when background changes
    return () => {
      // Stop main video if exists
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }

      // Stop blur video if exists
      if (blurVideoRef.current) {
        blurVideoRef.current.pause();
        blurVideoRef.current.src = "";
      }

      // Force garbage collection hint for old background
      if (window.gc) {
        window.gc();
      }
    };
  }, [selectedBackground]);

  const handleDeleteSession = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa session này?")) {
      deleteSavedSession(id);
      loadData();
    }
  };

  const toggleBackgroundMode = () => {
    const newMode = backgroundMode === "fit" ? "fill" : "fit";
    setBackgroundMode(newMode);
    localStorage.setItem("backgroundMode", newMode);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Background data - with lazy loading
  const [selectedBackgroundData, setSelectedBackgroundData] = useState(null);

  // Load background data when selected
  useEffect(() => {
    if (selectedBackground) {
      // Load full data on-demand
      (async () => {
        console.log(`[ChillPomodoro] Loading background ${selectedBackground}`);
        const fullData = await getAnimationCached(selectedBackground);
        if (fullData) {
          setSelectedBackgroundData(fullData);
          console.log(`[ChillPomodoro] Background loaded ✓`);
        }
      })();
    } else {
      setSelectedBackgroundData(null);
    }
  }, [selectedBackground]);

  const backgroundImage =
    selectedBackgroundData && selectedBackgroundData.type !== "video"
      ? selectedBackgroundData.url
      : null;

  const backgroundVideo =
    selectedBackgroundData && selectedBackgroundData.type === "video"
      ? selectedBackgroundData.url
      : null;

  return (
    <div
      className="fixed inset-0 w-full overflow-hidden"
      style={{
        height: "100dvh", // Dynamic viewport height for mobile (fallback to 100vh in CSS)
        backgroundColor:
          backgroundImage || backgroundVideo ? "#000" : "#f3f4f6",
      }}
    >
      {/* Background Container - Responsive */}
      <div className="absolute inset-0 w-full h-full">
        {/* Blur Background Layer - Desktop only (too heavy for mobile) */}
        {!isMobile &&
          (backgroundImage || backgroundVideo) &&
          backgroundMode === "fit" && (
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {backgroundImage && (
                <div
                  className="absolute inset-0 w-full h-full bg-center blur-3xl scale-110 opacity-60"
                  style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(40px) brightness(0.7)",
                    transform: "scale(1.1)",
                  }}
                />
              )}
              {backgroundVideo && (
                <video
                  ref={blurVideoRef}
                  src={backgroundVideo}
                  className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110 opacity-60"
                  style={{
                    filter: "blur(40px) brightness(0.7)",
                    transform: "scale(1.1)",
                  }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedData={() => {
                    // Ensure blur video plays
                    if (blurVideoRef.current) {
                      blurVideoRef.current.play().catch(() => {});
                    }
                  }}
                />
              )}
            </div>
          )}

        {/* Main Background - sharp, centered */}
        {backgroundImage && !backgroundVideo && (
          <div
            className="absolute inset-0 w-full h-full bg-center bg-no-repeat transition-all duration-500"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: backgroundMode === "fit" ? "contain" : "cover",
              backgroundPosition: "center",
            }}
          />
        )}

        {/* Video background - iOS Safari optimized */}
        {backgroundVideo && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              src={backgroundVideo}
              className={`transition-all duration-500 ${
                backgroundMode === "fit"
                  ? "max-w-full max-h-full w-auto h-auto"
                  : "w-full h-full"
              }`}
              style={{
                objectFit: backgroundMode === "fit" ? "contain" : "cover",
              }}
              autoPlay
              loop
              muted
              playsInline
              webkit-playsinline="true"
              preload={isMobile ? "metadata" : "auto"}
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              onLoadedData={() => {
                // Try to play when video is loaded
                if (videoRef.current) {
                  videoRef.current.play().catch((err) => {
                    console.warn("[ChillPomodoro] Video play failed:", err);
                  });
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Overlay for better readability - with safe area */}
      {(backgroundImage || backgroundVideo) && !isUIHidden && (
        <div
          className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
          }}
        ></div>
      )}

      {/* Floating buttons when UI hidden - invisible until hover/touch */}
      {isUIHidden && (
        <div
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 flex flex-col gap-1.5 btn-invisible-group"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingRight: "env(safe-area-inset-right)",
          }}
        >
          <button
            onClick={() => setIsUIHidden(false)}
            className="btn-invisible floating-btn text-white p-2.5 sm:p-3 rounded-full"
            title="Hiện giao diện (ESC)"
          >
            <Eye size={20} />
          </button>
          <button
            onClick={() => setShowTimerWhenHidden(!showTimerWhenHidden)}
            className="btn-invisible floating-btn text-white p-2.5 sm:p-3 rounded-full"
            title={showTimerWhenHidden ? "Ẩn đồng hồ" : "Hiện đồng hồ"}
          >
            <Clock size={18} />
          </button>
          {(backgroundImage || backgroundVideo) && (
            <button
              onClick={toggleBackgroundMode}
              className="btn-invisible floating-btn text-white p-2.5 sm:p-3 rounded-full"
              title={
                backgroundMode === "fit"
                  ? "Chế độ: Fit → Click để Fill"
                  : "Chế độ: Fill → Click để Fit"
              }
            >
              {backgroundMode === "fit" ? (
                <Maximize2 size={18} className="text-purple-300" />
              ) : (
                <Minimize2 size={18} className="text-green-300" />
              )}
            </button>
          )}
          {/* Volume Panel Button - Only show when timer is running */}
          {isRunning && (
            <button
              onClick={() => setShowVolumePanel(!showVolumePanel)}
              className="btn-invisible floating-btn text-white p-2.5 sm:p-3 rounded-full"
              title={
                showVolumePanel
                  ? "Đóng điều chỉnh âm lượng"
                  : "Điều chỉnh âm lượng"
              }
            >
              <Sliders
                size={18}
                className={showVolumePanel ? "text-blue-300" : ""}
              />
            </button>
          )}
        </div>
      )}

      {/* Volume Control Panel - Floating */}
      {isUIHidden && showVolumePanel && isRunning && (
        <div
          className="absolute bottom-4 left-4 right-4 sm:bottom-auto sm:top-24 sm:right-4 sm:left-auto sm:w-96 z-40"
          style={{
            paddingBottom: "env(safe-area-inset-bottom)",
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
          }}
        >
          <div className="bg-black bg-opacity-80 backdrop-filter backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl border border-white border-opacity-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Volume2 size={20} />
                <span>Điều chỉnh âm lượng</span>
              </h3>
              <button
                onClick={() => setShowVolumePanel(false)}
                className="text-white hover:text-red-400 transition-colors p-1 rounded-full hover:bg-white hover:bg-opacity-10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto">
              {soundTracks
                .filter((track) => track.selectedSound)
                .map((track, index) => {
                  const soundName =
                    track.type === "single"
                      ? sounds.find((s) => s.id === track.selectedSound)?.name
                      : presets.find((p) => p.id === track.selectedSound)?.name;

                  return (
                    <div
                      key={track.id}
                      className="bg-white bg-opacity-10 rounded-lg p-3 border border-white border-opacity-10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm font-medium truncate flex-1">
                          {soundName || `Sound ${index + 1}`}
                        </span>
                        <span className="text-white text-xs opacity-75 ml-2">
                          {Math.round((track.volume || 1.0) * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Volume2
                          size={16}
                          className="text-white opacity-75 flex-shrink-0"
                        />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={track.volume || 1.0}
                          onChange={(e) =>
                            handleRealtimeVolumeChange(
                              track.id,
                              parseFloat(e.target.value)
                            )
                          }
                          className="flex-1 h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>
                  );
                })}

              {soundTracks.filter((track) => track.selectedSound).length ===
                0 && (
                <div className="text-white text-center py-6 opacity-75">
                  <Volume2 size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Không có âm thanh nào đang phát</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Timer when UI hidden and showTimerWhenHidden */}
      {isUIHidden && showTimerWhenHidden && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
          <div className="text-center">
            <div className="text-8xl md:text-9xl font-bold text-white drop-shadow-2xl mb-4 animate-pulse">
              {formatTime(timeLeft)}
            </div>
            <div className="text-2xl text-white drop-shadow-lg opacity-80">
              {isWorkMode ? "Đang làm việc..." : "Đang nghỉ ngơi..."}
            </div>
          </div>
        </div>
      )}

      {/* Main Content - with safe area and proper scrolling */}
      <div
        className={`relative z-10 flex flex-col transition-opacity duration-500 ${
          isUIHidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{
          height: "100dvh",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        {/* Header - Invisible buttons group */}
        <div className="p-2 sm:p-4 flex items-center justify-between flex-shrink-0 btn-invisible-group">
          <button
            onClick={() => {
              audioManager.stopAll();
              navigate("/");
            }}
            className="btn-invisible header-btn p-2 rounded-lg text-white"
            title="Quay lại trang chủ"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex gap-1.5 sm:gap-2">
            {/* Background Mode Toggle */}
            {(backgroundImage || backgroundVideo) && (
              <button
                onClick={toggleBackgroundMode}
                className="btn-invisible header-btn p-2 rounded-lg text-white"
                title={
                  backgroundMode === "fit"
                    ? "Chế độ: Xem trọn vẹn (Fit) - Click để Full màn hình"
                    : "Chế độ: Full màn hình (Fill) - Click để Xem trọn vẹn"
                }
              >
                {backgroundMode === "fit" ? (
                  <Maximize2 size={18} className="text-purple-300" />
                ) : (
                  <Minimize2 size={18} className="text-green-300" />
                )}
              </button>
            )}
            <button
              onClick={() => toggleFullscreen()}
              className="btn-invisible header-btn p-2 rounded-lg text-white"
              title="Toàn màn hình"
            >
              <Maximize size={18} />
            </button>
            <button
              onClick={() => lockOrientation("landscape")}
              className="btn-invisible header-btn p-2 rounded-lg text-white"
              title="Khóa xoay ngang"
            >
              <Smartphone size={18} />
            </button>
          </div>
        </div>

        {/* Main Content - scrollable area */}
        <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-y-auto overflow-x-hidden">
          <div className="w-full max-w-4xl my-auto">
            {/* Timer Display */}
            <div className="text-center mb-6 sm:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg px-2">
                {isWorkMode ? "Thời gian làm việc" : "Thời gian nghỉ ngơi"}
              </h2>
              <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white drop-shadow-2xl mb-4 sm:mb-8">
                {formatTime(timeLeft)}
              </div>

              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4 sm:mb-8 px-2">
                <Button
                  onClick={handleStartPause}
                  size="lg"
                  className="min-w-[100px] sm:min-w-[120px] flex-shrink-0"
                >
                  {isRunning ? (
                    <Pause size={20} className="sm:mr-2" />
                  ) : (
                    <Play size={20} className="sm:mr-2" />
                  )}
                  <span className="hidden sm:inline">
                    {isRunning ? "Tạm dừng" : "Bắt đầu"}
                  </span>
                </Button>
                <Button
                  onClick={handleReset}
                  variant="secondary"
                  size="lg"
                  className="min-w-[100px] sm:min-w-[120px] flex-shrink-0"
                >
                  <RotateCcw size={20} className="sm:mr-2" />
                  <span className="hidden sm:inline">Đặt lại</span>
                </Button>
                {isRunning && (
                  <Button
                    onClick={() => setIsUIHidden(true)}
                    variant="secondary"
                    size="lg"
                    className="min-w-[100px] sm:min-w-[120px] flex-shrink-0"
                  >
                    <EyeOff size={20} className="sm:mr-2" />
                    <span className="hidden sm:inline">Ẩn UI</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Controls - adaptive height for mobile */}
            <div className="bg-white bg-opacity-95 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-6 max-h-[50vh] sm:max-h-[70vh] md:max-h-none overflow-y-auto">
              {/* Background Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Background
                </label>
                <div className="relative">
                  <select
                    value={selectedBackground || ""}
                    onChange={(e) =>
                      setSelectedBackground(e.target.value || null)
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-8 sm:pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none appearance-none bg-white text-sm sm:text-base"
                  >
                    <option value="">Không có background</option>
                    {animations.map((anim) => (
                      <option key={anim.id} value={anim.id}>
                        {anim.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Sound Tracks */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">
                    Âm thanh
                  </label>
                  <Button
                    onClick={handleAddSoundTrack}
                    variant="secondary"
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    <Plus size={16} className="mr-1" />
                    Thêm
                  </Button>
                </div>

                <div className="space-y-4">
                  {soundTracks.map((track, index) => (
                    <div
                      key={track.id}
                      className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                    >
                      <div className="flex items-start space-x-2 mb-3">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="relative">
                            <select
                              value={track.type}
                              onChange={(e) =>
                                handleSoundTrackChange(
                                  track.id,
                                  null,
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none appearance-none bg-white text-sm"
                            >
                              <option value="single">Đơn</option>
                              <option value="preset">Preset</option>
                            </select>
                            <ChevronDown
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                              size={16}
                            />
                          </div>

                          <div className="relative">
                            <select
                              value={track.selectedSound || ""}
                              onChange={(e) =>
                                handleSoundTrackChange(
                                  track.id,
                                  e.target.value || null,
                                  track.type
                                )
                              }
                              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none appearance-none bg-white text-sm"
                            >
                              <option value="">
                                Chọn{" "}
                                {track.type === "single" ? "sound" : "preset"}
                              </option>
                              {track.type === "single"
                                ? sounds.map((sound) => (
                                    <option key={sound.id} value={sound.id}>
                                      {sound.name}
                                    </option>
                                  ))
                                : presets.map((preset) => (
                                    <option key={preset.id} value={preset.id}>
                                      {preset.name}
                                    </option>
                                  ))}
                            </select>
                            <ChevronDown
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                              size={16}
                            />
                          </div>
                        </div>

                        {soundTracks.length > 1 && (
                          <button
                            onClick={() => handleRemoveSoundTrack(track.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>

                      {/* Volume Control */}
                      <div className="flex items-center space-x-3">
                        <Volume2
                          size={16}
                          className="text-gray-500 flex-shrink-0"
                        />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={track.volume || 1.0}
                          onChange={(e) =>
                            handleSoundTrackChange(
                              track.id,
                              track.selectedSound,
                              track.type,
                              parseFloat(e.target.value)
                            )
                          }
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-gray-600 min-w-[35px]">
                          {Math.round((track.volume || 1.0) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Thời gian làm việc
                  </label>
                  <div className="relative">
                    <select
                      value={workTime}
                      onChange={(e) => setWorkTime(Number(e.target.value))}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-8 sm:pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none appearance-none bg-white text-sm sm:text-base"
                      disabled={isRunning}
                    >
                      {[15, 25, 30, 45, 60, 90].map((time) => (
                        <option key={time} value={time}>
                          {time} phút
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Thời gian nghỉ
                  </label>
                  <div className="relative">
                    <select
                      value={breakTime}
                      onChange={(e) => setBreakTime(Number(e.target.value))}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-8 sm:pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none appearance-none bg-white text-sm sm:text-base"
                      disabled={isRunning}
                    >
                      {[5, 10, 15, 20, 30].map((time) => (
                        <option key={time} value={time}>
                          {time} phút
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                  </div>
                </div>
              </div>

              {/* Session Management */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                <Button
                  onClick={() => setShowSaveModal(true)}
                  variant="secondary"
                  fullWidth
                  className="text-xs sm:text-sm"
                >
                  <Save size={16} className="mr-1 sm:mr-2" />
                  Lưu Session
                </Button>
                <Button
                  onClick={() => setShowLoadModal(true)}
                  variant="secondary"
                  fullWidth
                  className="text-xs sm:text-sm"
                >
                  Tải Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Break Popup */}
      {showBreakPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md">
          <div className="bg-white rounded-2xl p-12 shadow-2xl text-center max-w-md">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {isWorkMode ? "Bắt đầu nghỉ ngơi!" : "Tiếp tục làm việc!"}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Đứng dậy thư giãn trong {breakCountdown} giây
            </p>
            <div className="text-6xl font-bold text-purple-600">
              {breakCountdown}
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Lưu Session"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên Session
            </label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
              placeholder="Ví dụ: Deep Work Session"
            />
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleSaveSession} fullWidth>
              Lưu
            </Button>
            <Button
              onClick={() => setShowSaveModal(false)}
              variant="secondary"
              fullWidth
            >
              Hủy
            </Button>
          </div>
        </div>
      </Modal>

      {/* Load Modal */}
      <Modal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        title="Tải Session"
        size="md"
      >
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {savedSessions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Chưa có session nào được lưu
            </p>
          ) : (
            savedSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {session.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {session.workTime}p làm việc / {session.breakTime}p nghỉ
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleLoadSession(session)}
                    variant="secondary"
                    size="sm"
                  >
                    Tải
                  </Button>
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}

export default FocusPage;
