import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Edit2, Trash2, Music, Play, Pause, List, Loader } from 'lucide-react'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { getSounds, addSound, updateSound, deleteSound } from '../utils/storage'
import { audioManager } from '../utils/audio'
import { fileToBase64, isFileSizeValid } from '../utils/indexedDB'

function SoundLibrary() {
  const navigate = useNavigate()
  const [sounds, setSounds] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSound, setEditingSound] = useState(null)
  const [formData, setFormData] = useState({ name: '', url: '', volume: 1.0 })
  const [playingId, setPlayingId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  useEffect(() => {
    loadSounds()
    
    return () => {
      audioManager.stopAll()
    }
  }, [])
  
  const loadSounds = async () => {
    setIsLoading(true)
    try {
      const data = await getSounds()
      setSounds(data)
    } catch (error) {
      console.error('Error loading sounds:', error)
      alert('Lỗi khi tải danh sách sound')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleOpenModal = (sound = null) => {
    if (sound) {
      setEditingSound(sound)
      setFormData({ name: sound.name, url: sound.url, volume: sound.volume || 1.0 })
    } else {
      setEditingSound(null)
      setFormData({ name: '', url: '', volume: 1.0 })
    }
    setIsModalOpen(true)
  }
  
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingSound(null)
    setFormData({ name: '', url: '', volume: 1.0 })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.url) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }
    
    setIsUploading(true)
    try {
      if (editingSound) {
        await updateSound(editingSound.id, formData)
      } else {
        await addSound(formData)
      }
      
      await loadSounds()
      handleCloseModal()
      alert('Lưu thành công!')
    } catch (error) {
      console.error('Error saving sound:', error)
      alert('Lỗi khi lưu sound. Vui lòng thử lại.')
    } finally {
      setIsUploading(false)
    }
  }
  
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa âm thanh này?')) {
      try {
        audioManager.stopSound(id)
        await deleteSound(id)
        await loadSounds()
        if (playingId === id) {
          setPlayingId(null)
        }
      } catch (error) {
        console.error('Error deleting sound:', error)
        alert('Lỗi khi xóa sound')
      }
    }
  }
  
  const handlePlayPause = async (sound) => {
    if (playingId === sound.id) {
      audioManager.stopSound(sound.id)
      setPlayingId(null)
    } else {
      audioManager.stopAll()
      await audioManager.playSound(sound.id, sound.url, true, sound.volume || 1.0)
      setPlayingId(sound.id)
    }
  }
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Validate file size (max 50MB)
    if (!isFileSizeValid(file, 50)) {
      alert('File quá lớn! Vui lòng chọn file nhỏ hơn 50MB')
      e.target.value = ''
      return
    }
    
    setIsUploading(true)
    try {
      const base64 = await fileToBase64(file)
      setFormData({ ...formData, url: base64 })
      alert('Upload thành công! Vui lòng nhấn "Thêm mới" để lưu.')
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Lỗi khi upload file')
    } finally {
      setIsUploading(false)
    }
  }
  
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-4xl font-bold text-gray-800">Kho Sound</h1>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => navigate('/presets')}
              variant="secondary"
              size="md"
            >
              <List size={20} className="mr-2" />
              Quản lý Preset
            </Button>
            <Button
              onClick={() => handleOpenModal()}
              size="md"
            >
              <Plus size={20} className="mr-2" />
              Thêm Sound
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={48} className="animate-spin text-purple-600" />
          </div>
        ) : sounds.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <Music size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              Chưa có âm thanh nào
            </h3>
            <p className="text-gray-500 mb-6">
              Thêm âm thanh để tạo không gian làm việc tập trung
            </p>
            <Button onClick={() => handleOpenModal()}>
              <Plus size={20} className="mr-2" />
              Thêm Sound Đầu Tiên
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sounds.map((sound) => (
              <div
                key={sound.id}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => handlePlayPause(sound)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      playingId === sound.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {playingId === sound.id ? (
                      <Pause size={24} className="text-white" />
                    ) : (
                      <Play size={24} className={playingId === sound.id ? 'text-white' : 'text-gray-600'} />
                    )}
                  </button>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 truncate">
                      {sound.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Volume: {Math.round((sound.volume || 1.0) * 100)}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleOpenModal(sound)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(sound.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSound ? 'Chỉnh sửa Sound' : 'Thêm Sound Mới'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên Sound
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
              placeholder="Ví dụ: Rain Sound"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL hoặc Tải lên
            </label>
            <input
              type="text"
              value={formData.url.startsWith('data:') ? '' : formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none mb-2"
              placeholder="https://example.com/sound.mp3"
              disabled={isUploading}
            />
            <div className="text-center text-gray-500 text-sm mb-2">hoặc</div>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
              disabled={isUploading}
            />
            <p className="text-xs text-gray-500 mt-2">
              Hỗ trợ: MP3, WAV, OGG (tối đa 50MB)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volume: {Math.round(formData.volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={formData.volume}
              onChange={(e) => setFormData({ ...formData, volume: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
          
          {formData.url && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nghe thử
              </label>
              <audio controls className="w-full">
                <source src={formData.url} />
                Trình duyệt không hỗ trợ
              </audio>
            </div>
          )}
          
          <div className="flex space-x-4">
            <Button type="submit" variant="primary" fullWidth disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader size={20} className="mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                editingSound ? 'Cập nhật' : 'Thêm mới'
              )}
            </Button>
            <Button type="button" variant="secondary" fullWidth onClick={handleCloseModal} disabled={isUploading}>
              Hủy
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default SoundLibrary

