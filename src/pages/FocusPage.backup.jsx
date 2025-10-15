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
} from "lucide-react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import FloatingTimer from "../components/FloatingTimer";
import {
  getAnimations,
  getSounds,
  getPresets,
  getSavedSessions,
  addSavedSession,
  deleteSavedSession,
} from "../utils/storage";
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

  // UI State
  const [isUIHidden, setIsUIHidden] = useState(false);
  const [showTimerWhenHidden, setShowTimerWhenHidden] = useState(false);

  const timerRef = useRef(null);
  const breakTimerRef = useRef(null);

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
      if (e.key === "Escape" && isRunning) {
        setIsUIHidden(!isUIHidden);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isUIHidden, isRunning]);

  useEffect(() => {
    setTimeLeft(isWorkMode ? workTime * 60 : breakTime * 60);
  }, [workTime, breakTime, isWorkMode]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 11 && prev > 10) {
            // Play ticking sound at 10s remaining
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
      // Set default empty arrays to prevent undefined errors
      setAnimations([]);
      setSounds([]);
      setPresets([]);
      setSavedSessions([]);
      alert("Lỗi khi tải dữ liệu. Vui lòng thử lại hoặc kiểm tra console.");
    }
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    setShowBreakPopup(true);
    setIsUIHidden(false); // Hiện lại UI khi hết giờ

    // Switch mode
    setIsWorkMode(!isWorkMode);
  };

  const handleStartPause = () => {
    if (!isRunning) {
      // Start playing all selected sounds
      soundTracks.forEach((track) => {
        if (track.selectedSound) {
          const trackVolume = track.volume || 1.0;
          if (track.type === "single") {
            const sound = sounds.find((s) => s.id === track.selectedSound);
            if (sound) {
              // Apply both sound's volume and track's volume
              const finalVolume = (sound.volume || 1.0) * trackVolume;
              audioManager.playSound(track.id, sound.url, true, finalVolume);
            }
          } else if (track.type === "preset") {
            const preset = presets.find((p) => p.id === track.selectedSound);
            if (preset) {
              preset.soundIds.forEach((soundId) => {
                const sound = sounds.find((s) => s.id === soundId);
                if (sound) {
                  // Apply both sound's volume and track's volume
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
    } else {
      // Pause all sounds
      audioManager.stopAll();
    }

    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(isWorkMode ? workTime * 60 : breakTime * 60);
    audioManager.stopAll();
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
    setSoundTracks(session.soundTracks);
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

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
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor:
          backgroundImage || backgroundVideo ? "transparent" : "#f3f4f6",
      }}
    >
      {/* Video background */}
      {backgroundVideo && (
        <video
          src={backgroundVideo}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      )}

      {/* Overlay for better readability - Ẩn khi UI hidden */}
      {(backgroundImage || backgroundVideo) && !isUIHidden && (
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      )}

      {/* Timer nổi và controls khi UI hidden */}
      {isUIHidden && (
        <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
          <button
            onClick={() => setIsUIHidden(false)}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full shadow-2xl transition-all backdrop-blur-sm hover:scale-110 transform duration-200"
            title="Hiện giao diện (hoặc nhấn ESC)"
          >
            <Eye size={24} />
          </button>
          <button
            onClick={() => setShowTimerWhenHidden(!showTimerWhenHidden)}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full shadow-2xl transition-all backdrop-blur-sm hover:scale-110 transform duration-200"
            title={showTimerWhenHidden ? "Ẩn đồng hồ" : "Hiện đồng hồ"}
          >
            <Clock size={20} />
          </button>
        </div>
      )}

      {/* Floating Timer - hiển thị riêng */}
      {isUIHidden && showTimerWhenHidden && (
        <FloatingTimer
          timeLeft={timeLeft}
          isWorkMode={isWorkMode}
          onShowUI={() => setIsUIHidden(false)}
        />
      )}

      {/* Content */}
      <div
        className={`relative z-10 min-h-screen flex flex-col transition-opacity duration-500 ${
          isUIHidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              audioManager.stopAll();
              navigate("/");
            }}
            className="bg-white bg-opacity-90 hover:bg-opacity-100"
          >
            <ArrowLeft size={20} />
          </Button>

          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toggleFullscreen()}
              className="bg-white bg-opacity-90 hover:bg-opacity-100"
            >
              <Maximize size={20} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => lockOrientation("landscape")}
              className="bg-white bg-opacity-90 hover:bg-opacity-100"
            >
              <Smartphone size={20} />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-2 sm:p-4">
          <div className="w-full max-w-4xl">
            {/* Timer */}
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
                  size="lg"
                  variant="secondary"
                  className="flex-shrink-0"
                >
                  <RotateCcw size={20} className="sm:mr-2" />
                  <span className="hidden sm:inline">Reset</span>
                </Button>
                {isRunning && (
                  <Button
                    onClick={() => setIsUIHidden(true)}
                    size="lg"
                    variant="secondary"
                    title="Ẩn giao diện để tập trung (ESC để hiện lại)"
                    className="flex-shrink-0"
                  >
                    <EyeOff size={20} className="sm:mr-2" />
                    <span className="hidden sm:inline">Ẩn giao diện</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white bg-opacity-95 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-6 max-h-[60vh] sm:max-h-none overflow-y-auto">
              {/* Background Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Chọn Background
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Âm thanh
                  </label>
                  <Button
                    onClick={handleAddSoundTrack}
                    size="sm"
                    variant="secondary"
                  >
                    <Plus size={14} className="sm:mr-1" />
                    <span className="hidden sm:inline">Thêm âm thanh</span>
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
                            <X size={20} />
                          </button>
                        )}
                      </div>

                      {/* Volume Control */}
                      <div className="flex items-center space-x-3">
                        <Music
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
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${
                              (track.volume || 1.0) * 100
                            }%, #e5e7eb ${
                              (track.volume || 1.0) * 100
                            }%, #e5e7eb 100%)`,
                          }}
                        />
                        <span className="text-sm font-medium text-gray-700 w-12 text-right">
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
                    Thời gian làm việc (phút)
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
                    Thời gian nghỉ (phút)
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
                  size="md"
                >
                  <Save size={18} className="sm:mr-2" />
                  <span className="hidden sm:inline">Lưu tiến trình</span>
                  <span className="sm:hidden">Lưu</span>
                </Button>
                <Button
                  onClick={() => setShowLoadModal(true)}
                  variant="secondary"
                  fullWidth
                  size="md"
                >
                  <Clock size={18} className="sm:mr-2" />
                  <span className="hidden sm:inline">Tải tiến trình</span>
                  <span className="sm:hidden">Tải</span>
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
              Hãy đứng dậy và thư giãn một chút
            </p>
            <div className="text-6xl font-bold text-purple-600 mb-6">
              {breakCountdown}s
            </div>
            <Button
              onClick={() => setShowBreakPopup(false)}
              variant="primary"
              size="lg"
              fullWidth
            >
              Đóng
            </Button>
          </div>
        </div>
      )}

      {/* Save Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Lưu tiến trình"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên tiến trình
            </label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
              placeholder="Ví dụ: Lofi + Rain Morning"
            />
          </div>
          <Button onClick={handleSaveSession} variant="primary" fullWidth>
            Lưu
          </Button>
        </div>
      </Modal>

      {/* Load Modal */}
      <Modal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        title="Tải tiến trình đã lưu"
        size="md"
      >
        {savedSessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Chưa có tiến trình nào được lưu</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
                    variant="primary"
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
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default FocusPage;
