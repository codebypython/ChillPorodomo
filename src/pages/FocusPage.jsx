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
  ChevronDown,
  Eye,
  Volume2,
  VolumeX,
  Music,
  Settings,
  Image as ImageIcon,
  Film,
  Trash2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import VideoPlayer from "../components/VideoPlayer";
import {
  getAnimations,
  getSounds,
  getPresets,
  getSavedSessions,
  addSavedSession,
  deleteSavedSession,
} from "../utils/storage";
import { audioManager } from "../utils/audio";
import { toggleFullscreen } from "../utils/fullscreen";

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

  // Audio State - Separate from timer
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showSoundPanel, setShowSoundPanel] = useState(false);
  const [showVolumePanel, setShowVolumePanel] = useState(false);

  // Background/Video State - Separate from timer and audio
  const [isBackgroundVisible, setIsBackgroundVisible] = useState(false);
  const [showBackgroundPanel, setShowBackgroundPanel] = useState(false);

  // Modals
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [sessionName, setSessionName] = useState("");

  // Hide UI State
  const [isUIHidden, setIsUIHidden] = useState(false);
  const [showTimerWhenHidden, setShowTimerWhenHidden] = useState(false);

  // Background Mode State: 'fit' (contain) or 'fill' (cover)
  const [backgroundMode, setBackgroundMode] = useState(() => {
    const saved = localStorage.getItem("backgroundMode");
    return saved || "fit";
  });

  const timerRef = useRef(null);
  const breakTimerRef = useRef(null);

  // Load data on mount
  useEffect(() => {
    loadData();

    return () => {
      audioManager.stopAll();
      if (timerRef.current) clearInterval(timerRef.current);
      if (breakTimerRef.current) clearInterval(breakTimerRef.current);
    };
  }, []);

  // ESC key to toggle UI visibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isBackgroundVisible) {
        setIsUIHidden(!isUIHidden);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isUIHidden, isBackgroundVisible]);

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

  // Body scroll is managed by VideoPlayer component now

  const loadData = async () => {
    try {
      const [animationsData, soundsData, presetsData, sessionsData] =
        await Promise.all([
          getAnimations(),
          getSounds(),
          Promise.resolve(getPresets()),
          Promise.resolve(getSavedSessions()),
        ]);

      setAnimations(animationsData || []);
      setSounds(soundsData || []);
      setPresets(presetsData || []);
      setSavedSessions(sessionsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setAnimations([]);
      setSounds([]);
      setPresets([]);
      setSavedSessions([]);
    }
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    setShowBreakPopup(true);
    setIsUIHidden(false);
    setIsWorkMode(!isWorkMode);
  };

  const handleStartPause = () => {
    // Only control timer, not audio or background
    setIsRunning(!isRunning);
  };

  // Separate audio controls
  const handleToggleAudio = () => {
    if (!isAudioPlaying) {
      // Start playing all selected sounds
      soundTracks.forEach((track) => {
        if (track.selectedSound) {
          const trackVolume = track.volume || 1.0;

          if (track.type === "single") {
            const sound = sounds.find((s) => s.id === track.selectedSound);
            if (sound) {
              const finalVolume = (sound.volume || 1.0) * trackVolume;
              audioManager.playSound(track.id, sound.url, true, finalVolume);
            }
          } else if (track.type === "preset") {
            const preset = presets.find((p) => p.id === track.selectedSound);
            if (preset && preset.soundIds) {
              preset.soundIds.forEach((soundId) => {
                const sound = sounds.find((s) => s.id === soundId);
                if (sound) {
                  const finalVolume = (sound.volume || 1.0) * trackVolume;
                  audioManager.playSound(
                    `${track.id}_${soundId}`,
                    sound.url,
                    true,
                    finalVolume
                  );
                }
              });
            }
          }
        }
      });
      setIsAudioPlaying(true);
    } else {
      audioManager.stopAll();
      setIsAudioPlaying(false);
    }
  };

  // Update volume in real-time
  const handleVolumeChange = (trackId, newVolume) => {
    // Update state
    setSoundTracks(
      soundTracks.map((t) =>
        t.id === trackId ? { ...t, volume: newVolume } : t
      )
    );

    // Apply volume change immediately to playing audio
    const track = soundTracks.find((t) => t.id === trackId);
    if (track && track.selectedSound && isAudioPlaying) {
      if (track.type === "single") {
        audioManager.setVolume(trackId, newVolume);
      } else if (track.type === "preset") {
        const preset = presets.find((p) => p.id === track.selectedSound);
        if (preset && preset.soundIds) {
          preset.soundIds.forEach((soundId) => {
            audioManager.setVolume(`${trackId}_${soundId}`, newVolume);
          });
        }
      }
    }
  };

  // Toggle background/video visibility
  const handleToggleBackground = () => {
    setIsBackgroundVisible(!isBackgroundVisible);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(isWorkMode ? workTime * 60 : breakTime * 60);
    // Don't stop audio or background - they're independent from timer
  };

  const handleAddSoundTrack = () => {
    setSoundTracks([
      ...soundTracks,
      { id: Date.now(), selectedSound: null, type: "single", volume: 1.0 },
    ]);
  };

  const handleRemoveSoundTrack = (id) => {
    setSoundTracks(soundTracks.filter((t) => t.id !== id));
    // Stop audio for this track if playing
    if (isAudioPlaying) {
      audioManager.stopSound(id);
    }
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
  };

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

  // Background data
  const selectedBackgroundData = selectedBackground
    ? animations.find((a) => a.id === selectedBackground)
    : null;

  const backgroundImage =
    selectedBackgroundData && selectedBackgroundData.type !== "video"
      ? selectedBackgroundData.url
      : null;

  const backgroundVideo =
    selectedBackgroundData && selectedBackgroundData.type === "video"
      ? selectedBackgroundData.url
      : null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Video Player Component - Cinema Mode */}
      <VideoPlayer
        videoUrl={backgroundVideo}
        imageUrl={backgroundImage}
        isVisible={isBackgroundVisible}
        onClose={handleToggleBackground}
        mode={backgroundMode}
        onModeChange={toggleBackgroundMode}
      />

      {/* Main UI - Normal layout */}
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => {
                audioManager.stopAll();
                navigate("/");
              }}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
              title="Quay lại trang chủ"
            >
              <ArrowLeft size={24} />
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => toggleFullscreen()}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
                title="Toàn màn hình"
              >
                <Maximize size={20} />
              </button>
            </div>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {isWorkMode ? "Thời gian làm việc" : "Thời gian nghỉ ngơi"}
            </h2>
            <div className="text-8xl font-bold text-purple-600 mb-8">
              {formatTime(timeLeft)}
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={handleStartPause}
                className={`p-5 rounded-2xl transition-all shadow-lg ${
                  isRunning
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                } text-white font-semibold`}
                title={isRunning ? "Tạm dừng" : "Bắt đầu"}
              >
                {isRunning ? <Pause size={32} /> : <Play size={32} />}
              </button>
              <button
                onClick={handleReset}
                className="p-5 rounded-2xl transition-all shadow-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                title="Đặt lại"
              >
                <RotateCcw size={32} />
              </button>
            </div>
          </div>

          {/* Independent Controls Row - Icon Only */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Điều khiển
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {/* Sound Selection Panel Toggle */}
              <button
                onClick={() => setShowSoundPanel(!showSoundPanel)}
                className={`p-4 rounded-xl transition-all ${
                  showSoundPanel
                    ? "bg-purple-100 border-2 border-purple-400 shadow-md"
                    : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:shadow"
                }`}
                title="Chọn âm thanh"
              >
                <Music
                  size={28}
                  className={
                    showSoundPanel ? "text-purple-600" : "text-gray-600"
                  }
                />
              </button>

              {/* Audio Play/Stop Toggle */}
              <button
                onClick={handleToggleAudio}
                className={`p-4 rounded-xl transition-all ${
                  isAudioPlaying
                    ? "bg-green-100 border-2 border-green-400 shadow-md"
                    : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:shadow"
                }`}
                title={isAudioPlaying ? "Tắt âm thanh" : "Bật âm thanh"}
                disabled={soundTracks.every((t) => !t.selectedSound)}
              >
                {isAudioPlaying ? (
                  <Volume2 size={28} className="text-green-600" />
                ) : (
                  <VolumeX size={28} className="text-gray-400" />
                )}
              </button>

              {/* Volume Control Panel Toggle */}
              <button
                onClick={() => setShowVolumePanel(!showVolumePanel)}
                className={`p-4 rounded-xl transition-all ${
                  showVolumePanel
                    ? "bg-blue-100 border-2 border-blue-400 shadow-md"
                    : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:shadow"
                }`}
                title="Điều chỉnh âm lượng"
                disabled={!isAudioPlaying}
              >
                <Settings
                  size={28}
                  className={
                    showVolumePanel ? "text-blue-600" : "text-gray-600"
                  }
                />
              </button>

              {/* Background Selection Panel Toggle */}
              <button
                onClick={() => setShowBackgroundPanel(!showBackgroundPanel)}
                className={`p-4 rounded-xl transition-all ${
                  showBackgroundPanel
                    ? "bg-pink-100 border-2 border-pink-400 shadow-md"
                    : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:shadow"
                }`}
                title="Chọn background"
              >
                <ImageIcon
                  size={28}
                  className={
                    showBackgroundPanel ? "text-pink-600" : "text-gray-600"
                  }
                />
              </button>

              {/* Background/Video Play/Stop Toggle */}
              <button
                onClick={handleToggleBackground}
                className={`p-4 rounded-xl transition-all ${
                  isBackgroundVisible
                    ? "bg-orange-100 border-2 border-orange-400 shadow-md"
                    : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:shadow"
                }`}
                title={
                  isBackgroundVisible ? "Tắt background" : "Bật background"
                }
                disabled={!selectedBackground}
              >
                <Film
                  size={28}
                  className={
                    isBackgroundVisible ? "text-orange-600" : "text-gray-600"
                  }
                />
              </button>

              {/* Hide UI Button - when background is visible */}
              {isBackgroundVisible && (
                <button
                  onClick={() => setIsUIHidden(true)}
                  className="p-4 rounded-xl transition-all bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:shadow"
                  title="Ẩn giao diện"
                >
                  <Eye size={28} className="text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Sound Selection Panel */}
          {showSoundPanel && (
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Chọn âm thanh
                </h3>
                <Button
                  onClick={handleAddSoundTrack}
                  variant="secondary"
                  size="sm"
                >
                  <Plus size={16} className="mr-1" />
                  Thêm
                </Button>
              </div>

              <div className="space-y-4">
                {soundTracks.map((track) => (
                  <div
                    key={track.id}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-start space-x-2">
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Volume Control Panel */}
          {showVolumePanel && isAudioPlaying && (
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Điều chỉnh âm lượng
              </h3>
              <div className="space-y-4">
                {soundTracks.map((track) => {
                  if (!track.selectedSound) return null;

                  const displayName =
                    track.type === "single"
                      ? sounds.find((s) => s.id === track.selectedSound)?.name
                      : presets.find((p) => p.id === track.selectedSound)?.name;

                  return (
                    <div
                      key={track.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {displayName || "Unknown"}
                        </span>
                        <span className="text-xs text-gray-600">
                          {Math.round((track.volume || 1.0) * 100)}%
                        </span>
                      </div>
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
                            handleVolumeChange(
                              track.id,
                              parseFloat(e.target.value)
                            )
                          }
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Background Selection Panel */}
          {showBackgroundPanel && (
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Chọn background
              </h3>
              <div className="relative">
                <select
                  value={selectedBackground || ""}
                  onChange={(e) =>
                    setSelectedBackground(e.target.value || null)
                  }
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none appearance-none bg-white"
                >
                  <option value="">Không có background</option>
                  {animations.map((anim) => (
                    <option key={anim.id} value={anim.id}>
                      {anim.name} ({anim.type === "video" ? "Video" : "Ảnh"})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>

              {selectedBackground && (
                <div className="mt-4">
                  <button
                    onClick={toggleBackgroundMode}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      Chế độ hiển thị
                    </span>
                    <span className="text-sm text-purple-600 font-medium flex items-center gap-2">
                      {backgroundMode === "fit" ? (
                        <>
                          <Maximize2 size={16} />
                          Xem trọn vẹn
                        </>
                      ) : (
                        <>
                          <Minimize2 size={16} />
                          Full màn hình
                        </>
                      )}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Time Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Cài đặt thời gian
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian làm việc
                </label>
                <div className="relative">
                  <select
                    value={workTime}
                    onChange={(e) => setWorkTime(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none appearance-none bg-white"
                    disabled={isRunning}
                  >
                    {[15, 25, 30, 45, 60, 90].map((time) => (
                      <option key={time} value={time}>
                        {time} phút
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian nghỉ
                </label>
                <div className="relative">
                  <select
                    value={breakTime}
                    onChange={(e) => setBreakTime(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none appearance-none bg-white"
                    disabled={isRunning}
                  >
                    {[5, 10, 15, 20, 30].map((time) => (
                      <option key={time} value={time}>
                        {time} phút
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Session Management */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quản lý Session
            </h3>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowSaveModal(true)}
                variant="secondary"
                fullWidth
              >
                <Save size={16} className="mr-2" />
                Lưu Session
              </Button>
              <Button
                onClick={() => setShowLoadModal(true)}
                variant="secondary"
                fullWidth
              >
                Tải Session
              </Button>
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
