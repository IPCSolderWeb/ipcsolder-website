import React, { useState, useRef } from 'react'
import imageService from '../../services/imageService'
import ConfirmModal from './ConfirmModal'

const ImageUploader = ({ onImageUploaded, currentImageUrl = null, autoSave = false }) => {
  const [dragActive, setDragActive] = useState(false)
  const [originalImage, setOriginalImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [originalInfo, setOriginalInfo] = useState(null)
  const [processedInfo, setProcessedInfo] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(currentImageUrl)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef(null)

  const handleFiles = async (files) => {
    const file = files[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido')
      return
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 10MB.')
      return
    }

    try {
      // Obtener información de la imagen original
      const originalImageInfo = await imageService.getImageInfo(file)
      setOriginalInfo(originalImageInfo)

      // Crear URL para preview de la imagen original
      const originalUrl = URL.createObjectURL(file)
      setOriginalImage(originalUrl)

      // Procesar imagen
      const processedBlob = await imageService.processImage(file, 1200, 0.85)
      const processedUrl = URL.createObjectURL(processedBlob)
      setProcessedImage(processedUrl)

      // Obtener información de la imagen procesada (WebP)
      const webpFileName = file.name.replace(/\.[^/.]+$/, '.webp')
      const processedFile = new File([processedBlob], webpFileName, { type: 'image/webp' })
      const processedImageInfo = await imageService.getImageInfo(processedFile)
      setProcessedInfo(processedImageInfo)

      // Guardar el blob procesado para subir después
      setProcessedInfo(prev => ({ ...prev, blob: processedBlob }))

      setShowPreview(true)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Error al procesar la imagen')
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleUpload = async () => {
    if (!processedInfo?.blob) return

    setUploading(true)
    try {
      const result = await imageService.uploadImage(processedInfo.blob, 'posts', originalInfo?.name)
      
      if (result.success) {
        onImageUploaded(result.url)
        setUploadedImageUrl(result.url)
        setShowPreview(false)
        resetState()
      } else {
        alert('Error al subir la imagen: ' + result.error)
      }
    } catch (error) {
      console.error('Error uploading:', error)
      alert('Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    setShowPreview(false)
    resetState()
  }

  const resetState = () => {
    setOriginalImage(null)
    setProcessedImage(null)
    setOriginalInfo(null)
    setProcessedInfo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const calculateReduction = () => {
    if (!originalInfo?.size || !processedInfo?.size) return 0
    const reduction = ((originalInfo.size - processedInfo.size) / originalInfo.size) * 100
    return Math.max(0, Math.round(reduction)) // Asegurar que no sea negativo
  }

  const calculateSavings = () => {
    if (!originalInfo?.size || !processedInfo?.size) return '0 KB'
    const savings = originalInfo.size - processedInfo.size
    return imageService.formatFileSize(Math.max(0, savings))
  }

  const handleDeleteImage = async () => {
    setDeleting(true)
    try {
      const imageUrl = uploadedImageUrl || currentImageUrl
      
      if (imageUrl) {
        // Extraer el path del archivo desde la URL
        const urlParts = imageUrl.split('/storage/v1/object/public/blog-images/')
        
        if (urlParts.length > 1) {
          // Decodificar la URL para manejar espacios y caracteres especiales
          const filePath = decodeURIComponent(urlParts[1])
          
          // Eliminar del bucket de Supabase
          const deleteResult = await imageService.deleteImage(filePath)
          
          if (deleteResult.success) {
            // Eliminar del post
            setUploadedImageUrl(null)
            onImageUploaded('')
            setShowDeleteModal(false)
          } else {
            alert('Error al eliminar la imagen del almacenamiento: ' + deleteResult.error)
          }
        } else {
          // Si no se puede extraer el path, solo eliminar del post
          setUploadedImageUrl(null)
          onImageUploaded('')
          setShowDeleteModal(false)
        }
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Error al eliminar la imagen: ' + error.message)
    } finally {
      setDeleting(false)
    }
  }

  if (showPreview) {
    return (
      <div className="w-full border-2 border-gray-200 rounded-xl p-8 bg-white shadow-lg" style={{ minWidth: '100%', maxWidth: 'none' }}>
        <h3 className="text-xl font-semibold mb-8 flex items-center">
          <span className="mr-3 text-2xl">📊</span>
          Preview de Optimización
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-8">
          {/* Imagen Original */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📁</span>
              <h4 className="text-lg font-semibold text-gray-700">Original</h4>
            </div>
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
              <img 
                src={originalImage} 
                alt="Original" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-2">
              <p><strong>Archivo:</strong> {originalInfo?.name}</p>
              <p><strong>Tamaño:</strong> {originalInfo?.sizeFormatted}</p>
              <p><strong>Dimensiones:</strong> {originalInfo?.width}x{originalInfo?.height}px</p>
              <p><strong>Formato:</strong> {originalInfo?.type}</p>
            </div>
          </div>

          {/* Imagen Procesada */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✨</span>
              <h4 className="text-lg font-semibold text-green-700">Optimizada</h4>
            </div>
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-green-200 shadow-sm">
              <img 
                src={processedImage} 
                alt="Optimizada" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-sm text-gray-600 space-y-2">
              <p><strong>Archivo:</strong> {processedInfo?.name}</p>
              <p><strong>Tamaño:</strong> {processedInfo?.sizeFormatted}</p>
              <p><strong>Dimensiones:</strong> {processedInfo?.width}x{processedInfo?.height}px</p>
              <p><strong>Formato:</strong> {processedInfo?.type}</p>
            </div>
          </div>
        </div>

        {/* Estadísticas de reducción */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center">
              <span className="text-3xl mr-4">🎯</span>
              <div>
                <span className="text-green-800 font-semibold text-lg">
                  Reducción de tamaño: {calculateReduction()}%
                </span>
                <p className="text-green-600 text-sm mt-1">
                  Optimización automática aplicada
                </p>
              </div>
            </div>
            <div className="flex items-center bg-white rounded-lg px-4 py-3 shadow-sm">
              <span className="text-2xl mr-3">💾</span>
              <div>
                <span className="text-green-700 font-semibold">
                  Ahorro: {calculateSavings()}
                </span>
                <p className="text-green-600 text-xs">
                  Espacio liberado
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción - DENTRO del contenedor principal */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <div className="flex justify-center gap-6">
            <button
              onClick={handleCancel}
              disabled={uploading}
              className="min-w-[140px] px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 flex items-center justify-center font-semibold text-base shadow-sm"
            >
              <span className="mr-3 text-xl">❌</span>
              Cancelar
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="min-w-[180px] px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center font-semibold text-base shadow-md"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Subiendo...
                </>
              ) : (
                <>
                  <span className="mr-3 text-xl">✅</span>
                  Subir Optimizada
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentImage = uploadedImageUrl || currentImageUrl

  return (
    <div className="w-full space-y-6">
      {/* Imagen actual si existe */}
      {currentImage && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <p className="text-lg font-semibold text-green-800">Imagen Destacada Cargada</p>
                <p className="text-sm text-green-600">La imagen se mostrará en el blog</p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
              className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center disabled:opacity-50"
            >
              <span className="mr-1">🗑️</span>
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
          <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-green-300">
            <img 
              src={currentImage} 
              alt="Imagen destacada actual" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <span className="mr-2">🔄</span>
              Cambiar Imagen
            </button>
          </div>
        </div>
      )}

      {/* Área de drag & drop - Solo si no hay imagen */}
      {!currentImage && (
        <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 shadow-lg' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-6">
          <div className="text-6xl">📁</div>
          <div>
            <p className="text-xl font-semibold text-gray-700 mb-2">
              Seleccionar Imagen Destacada
            </p>
            <p className="text-base text-gray-500">
              Arrastra una imagen aquí o haz clic para examinar
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <span className="mr-3 text-xl">📂</span>
            Examinar Archivos
          </button>
          <p className="text-sm text-gray-400">
            Formatos: JPG, PNG, GIF • Máximo: 10MB • Se convertirá a WebP automáticamente
          </p>
        </div>
      </div>
      )}

      {/* Input file siempre presente pero oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Modal de confirmación para eliminar imagen */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteImage}
        title="Eliminar Imagen Destacada"
        message="¿Estás seguro de que deseas eliminar esta imagen? Se eliminará permanentemente del almacenamiento y no se podrá recuperar."
        confirmText="Sí, eliminar permanentemente"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

export default ImageUploader