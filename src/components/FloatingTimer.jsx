import React from 'react'
import { Eye } from 'lucide-react'

function FloatingTimer({ timeLeft, isWorkMode, onShowUI }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
      <div className="text-center">
        <div className="text-8xl md:text-9xl font-bold text-white drop-shadow-2xl mb-4 animate-pulse">
          {formatTime(timeLeft)}
        </div>
        <div className="text-2xl text-white drop-shadow-lg opacity-80">
          {isWorkMode ? 'Đang làm việc...' : 'Đang nghỉ ngơi...'}
        </div>
      </div>
    </div>
  )
}

export default FloatingTimer

