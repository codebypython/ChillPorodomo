import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Image, Music, PlayCircle } from 'lucide-react'
import Button from '../components/Button'

function HomePage() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            ChillPomodoro
          </h1>
          <p className="text-xl text-gray-600">
            Tập trung làm việc, thư giãn hiệu quả
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/animations')}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-300"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Kho Animation</h2>
              <p className="text-gray-600 text-center">
                Quản lý ảnh và GIF animation của bạn
              </p>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/sounds')}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-300"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Music size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Kho Sound</h2>
              <p className="text-gray-600 text-center">
                Quản lý âm thanh và tạo preset
              </p>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/focus')}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-pink-300"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlayCircle size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Bắt Đầu</h2>
              <p className="text-gray-600 text-center">
                Tập trung làm việc ngay bây giờ
              </p>
            </div>
          </button>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Sử dụng kỹ thuật Pomodoro để tăng hiệu suất làm việc
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage

