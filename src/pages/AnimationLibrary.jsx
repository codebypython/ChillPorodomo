import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Edit2, Trash2, Image as ImageIcon, Film, Loader } from 'lucide-react'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { getAnimations, addAnimation, updateAnimation, deleteAnimation } from '../utils/storage'
import { fileToBase64, isFileSizeValid } from '../utils/indexedDB'

function AnimationLibrary() {
  const navigate = useNavigate()
  const [animations, setAnimations] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAnimation, setEditingAnimation] = useState(null)
  const [formData, setFormData] = useState({ name: '', url: '', type: 'image' })
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  useEffect(() => {
    loadAnimations()
  }, [])
  
  const loadAnimations = async () => {
    setIsLoading(true)
    try {
      const data = await getAnimations()
      setAnimations(data)
    } catch (error) {
      console.error('Error loading animations:', error)
      alert('Lỗi khi tải danh sách animation')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleOpenModal = (animation = null) => {
    if (animation) {
      setEditingAnimation(animation)
      setFormData({ name: animation.name, url: animation.url, type: animation.type })
    } else {
      setEditingAnimation(null)
      setFormData({ name: '', url: '', type: 'image' })
    }
    setIsModalOpen(true)
  }
  
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingAnimation(null)
    setFormData({ name: '', url: '', type: 'image' })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.url) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }
    
    setIsUploading(true)
    try {
      if (editingAnimation) {
        await updateAnimation(editingAnimation.id, formData)
      } else {
        await addAnimation(formData)
      }
      
      await loadAnimations()
      handleCloseModal()
      alert('Lưu thành công!')
    } catch (error) {
      console.error('Error saving animation:', error)
      alert('Lỗi khi lưu animation. Vui lòng thử lại.')
    } finally {
      setIsUploading(false)
    }
  }
  
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa animation này?')) {
      try {
        await deleteAnimation(id)
        await loadAnimations()
      } catch (error) {
        console.error('Error deleting animation:', error)
        alert('Lỗi khi xóa animation')
      }
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
    
    // Detect file type
    let fileType = 'image'
    if (file.type.startsWith('video/')) {
      fileType = 'video'
    } else if (file.type === 'image/gif') {
      fileType = 'gif'
    }
    
    setIsUploading(true)
    try {
      const base64 = await fileToBase64(file)
      setFormData({ 
        ...formData, 
        url: base64,
        type: fileType
      })
      alert('Upload thành công! Vui lòng nhấn "Thêm mới" để lưu.')
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Lỗi khi upload file')
    } finally {
      setIsUploading(false)
    }
  }
  
  const renderMediaPreview = (animation) => {
    if (animation.type === 'video') {
      return (
        <video
          src={animation.url}
          className="w-full h-full object-cover"
          loop
          muted
          autoPlay
          playsInline
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      )
    } else {
      return (
        <img
          src={animation.url}
          alt={animation.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
          }}
        />
      )
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
            <h1 className="text-4xl font-bold text-gray-800">Kho Animation</h1>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            size="md"
          >
            <Plus size={20} className="mr-2" />
            Thêm Animation
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={48} className="animate-spin text-purple-600" />
          </div>
        ) : animations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              Chưa có animation nào
            </h3>
            <p className="text-gray-500 mb-6">
              Thêm ảnh, GIF hoặc video để tạo không gian làm việc của bạn
            </p>
            <Button onClick={() => handleOpenModal()}>
              <Plus size={20} className="mr-2" />
              Thêm Animation Đầu Tiên
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {animations.map((animation) => (
              <div
                key={animation.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {renderMediaPreview(animation)}
                  {animation.type === 'video' && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-lg text-xs flex items-center">
                      <Film size={12} className="mr-1" />
                      Video
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">
                    {animation.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 capitalize">
                      {animation.type}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(animation)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(animation.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAnimation ? 'Chỉnh sửa Animation' : 'Thêm Animation Mới'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên Animation
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
              placeholder="Ví dụ: Lofi Girl"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
            >
              <option value="image">Ảnh</option>
              <option value="gif">GIF Animation</option>
              <option value="video">Video MP4</option>
            </select>
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
              placeholder="https://example.com/image.gif"
              disabled={isUploading}
            />
            <div className="text-center text-gray-500 text-sm mb-2">hoặc</div>
            <input
              type="file"
              accept="image/*,video/mp4,video/webm"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
              disabled={isUploading}
            />
            <p className="text-xs text-gray-500 mt-2">
              Hỗ trợ: Ảnh, GIF, Video MP4/WebM (tối đa 50MB)
            </p>
          </div>
          
          {formData.url && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xem trước
              </label>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {formData.type === 'video' ? (
                  <video
                    src={formData.url}
                    className="w-full h-full object-cover"
                    controls
                    loop
                    muted
                    playsInline
                    onError={(e) => {
                      console.error('Video preview error')
                    }}
                  />
                ) : (
                  <img
                    src={formData.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInvalid URL%3C/text%3E%3C/svg%3E'
                    }}
                  />
                )}
              </div>
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
                editingAnimation ? 'Cập nhật' : 'Thêm mới'
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

export default AnimationLibrary
