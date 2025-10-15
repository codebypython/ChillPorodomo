import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Edit2, Trash2, Layers, Play, Pause } from 'lucide-react'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { getPresets, addPreset, updatePreset, deletePreset, getSounds } from '../utils/storage'
import { audioManager } from '../utils/audio'

function PresetManager() {
  const navigate = useNavigate()
  const [presets, setPresets] = useState([])
  const [sounds, setSounds] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPreset, setEditingPreset] = useState(null)
  const [formData, setFormData] = useState({ name: '', soundIds: [] })
  const [playingPresetId, setPlayingPresetId] = useState(null)
  
  useEffect(() => {
    loadPresets()
    loadSounds()
    
    return () => {
      audioManager.stopAll()
    }
  }, [])
  
  const loadPresets = () => {
    const data = getPresets()
    setPresets(data)
  }
  
  const loadSounds = async () => {
    try {
      const data = await getSounds()
      setSounds(data)
    } catch (error) {
      console.error('Error loading sounds:', error)
    }
  }
  
  const handleOpenModal = (preset = null) => {
    if (preset) {
      setEditingPreset(preset)
      setFormData({ name: preset.name, soundIds: preset.soundIds })
    } else {
      setEditingPreset(null)
      setFormData({ name: '', soundIds: [] })
    }
    setIsModalOpen(true)
  }
  
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPreset(null)
    setFormData({ name: '', soundIds: [] })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || formData.soundIds.length === 0) {
      alert('Vui lòng điền tên và chọn ít nhất 1 âm thanh')
      return
    }
    
    if (editingPreset) {
      updatePreset(editingPreset.id, formData)
    } else {
      addPreset(formData)
    }
    
    loadPresets()
    handleCloseModal()
  }
  
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa preset này?')) {
      deletePreset(id)
      loadPresets()
      if (playingPresetId === id) {
        audioManager.stopAll()
        setPlayingPresetId(null)
      }
    }
  }
  
  const toggleSoundInPreset = (soundId) => {
    if (formData.soundIds.includes(soundId)) {
      setFormData({
        ...formData,
        soundIds: formData.soundIds.filter(id => id !== soundId)
      })
    } else {
      setFormData({
        ...formData,
        soundIds: [...formData.soundIds, soundId]
      })
    }
  }
  
  const handlePlayPause = async (preset) => {
    if (playingPresetId === preset.id) {
      audioManager.stopAll()
      setPlayingPresetId(null)
    } else {
      audioManager.stopAll()
      
      // Play all sounds in preset
      const presetSounds = sounds.filter(s => preset.soundIds.includes(s.id))
      for (const sound of presetSounds) {
        await audioManager.playSound(sound.id, sound.url, true, sound.volume || 1.0)
      }
      
      setPlayingPresetId(preset.id)
    }
  }
  
  const getSoundNames = (soundIds) => {
    return soundIds
      .map(id => sounds.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(', ')
  }
  
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/sounds')}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-4xl font-bold text-gray-800">Quản lý Preset</h1>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            size="md"
          >
            <Plus size={20} className="mr-2" />
            Tạo Preset
          </Button>
        </div>
        
        {presets.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <Layers size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              Chưa có preset nào
            </h3>
            <p className="text-gray-500 mb-6">
              Tạo preset để kết hợp nhiều âm thanh lại với nhau
            </p>
            <Button onClick={() => handleOpenModal()}>
              <Plus size={20} className="mr-2" />
              Tạo Preset Đầu Tiên
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => handlePlayPause(preset)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      playingPresetId === preset.id
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {playingPresetId === preset.id ? (
                      <Pause size={24} className="text-white" />
                    ) : (
                      <Play size={24} className={playingPresetId === preset.id ? 'text-white' : 'text-gray-600'} />
                    )}
                  </button>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 truncate">
                      {preset.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {preset.soundIds.length} âm thanh
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {getSoundNames(preset.soundIds)}
                  </p>
                </div>
                
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleOpenModal(preset)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(preset.id)}
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
        title={editingPreset ? 'Chỉnh sửa Preset' : 'Tạo Preset Mới'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên Preset
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
              placeholder="Ví dụ: Lofi + Rain"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn âm thanh ({formData.soundIds.length} đã chọn)
            </label>
            {sounds.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">Chưa có âm thanh nào</p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    handleCloseModal()
                    navigate('/sounds')
                  }}
                >
                  Thêm Sound
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {sounds.map((sound) => (
                  <label
                    key={sound.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.soundIds.includes(sound.id)}
                      onChange={() => toggleSoundInPreset(sound.id)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-400"
                    />
                    <span className="flex-1 font-medium text-gray-700">
                      {sound.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex space-x-4">
            <Button type="submit" variant="primary" fullWidth disabled={sounds.length === 0}>
              {editingPreset ? 'Cập nhật' : 'Tạo mới'}
            </Button>
            <Button type="button" variant="secondary" fullWidth onClick={handleCloseModal}>
              Hủy
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default PresetManager

