import React, { useState } from 'react'

const DocumentModal = ({ isOpen, onInsert, onCancel }) => {
  const [documentUrl, setDocumentUrl] = useState('')
  const [documentTitle, setDocumentTitle] = useState('')
  const [documentType, setDocumentType] = useState('pdf')
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  const handleInsert = () => {
    if (!documentUrl.trim()) {
      alert('Por favor ingresa una URL del documento')
      return
    }
    if (!documentTitle.trim()) {
      alert('Por favor ingresa un título para el documento')
      return
    }

    onInsert(documentUrl, documentTitle, documentType, description)
    
    // Limpiar campos
    setDocumentUrl('')
    setDocumentTitle('')
    setDocumentType('pdf')
    setDescription('')
  }

  const handleCancel = () => {
    setDocumentUrl('')
    setDocumentTitle('')
    setDocumentType('pdf')
    setDescription('')
    onCancel()
  }

  // Iconos por tipo de documento
  const getIcon = (type) => {
    const icons = {
      pdf: '📄',
      excel: '📊',
      word: '📝',
      zip: '📦',
      image: '🖼️',
      other: '📎'
    }
    return icons[type] || '📎'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-t-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
              <span className="text-3xl">📎</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Agregar Documento</h3>
              <p className="text-green-100 text-sm">Recursos adicionales para el blog</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* URL del documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL del documento <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Enlace público de Google Drive, Dropbox, etc.
            </p>
          </div>

          {/* Título del documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del documento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Ej: Ficha Técnica Soldadura SAC305"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Tipo de documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de documento
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDocumentType('pdf')}
                className={`px-3 py-2 rounded-lg border-2 font-medium transition-colors ${
                  documentType === 'pdf'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-green-300'
                }`}
              >
                📄 PDF
              </button>
              <button
                type="button"
                onClick={() => setDocumentType('excel')}
                className={`px-3 py-2 rounded-lg border-2 font-medium transition-colors ${
                  documentType === 'excel'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-green-300'
                }`}
              >
                📊 Excel
              </button>
              <button
                type="button"
                onClick={() => setDocumentType('word')}
                className={`px-3 py-2 rounded-lg border-2 font-medium transition-colors ${
                  documentType === 'word'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-green-300'
                }`}
              >
                📝 Word
              </button>
              <button
                type="button"
                onClick={() => setDocumentType('zip')}
                className={`px-3 py-2 rounded-lg border-2 font-medium transition-colors ${
                  documentType === 'zip'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-green-300'
                }`}
              >
                📦 ZIP
              </button>
              <button
                type="button"
                onClick={() => setDocumentType('image')}
                className={`px-3 py-2 rounded-lg border-2 font-medium transition-colors ${
                  documentType === 'image'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-green-300'
                }`}
              >
                🖼️ Imagen
              </button>
              <button
                type="button"
                onClick={() => setDocumentType('other')}
                className={`px-3 py-2 rounded-lg border-2 font-medium transition-colors ${
                  documentType === 'other'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-green-300'
                }`}
              >
                📎 Otro
              </button>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción breve <span className="text-gray-400 text-xs">(opcional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Especificaciones técnicas completas"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Preview */}
          {documentTitle && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-600 mb-2">Vista previa:</p>
              <div className="flex items-start">
                <span className="text-2xl mr-2">{getIcon(documentType)}</span>
                <div>
                  <p className="font-medium text-gray-900">{documentTitle}</p>
                  {description && (
                    <p className="text-sm text-gray-600">{description}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Info box */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-sm text-green-800">
              <strong>💡 Cómo funciona:</strong>
            </p>
            <ul className="text-xs text-green-700 mt-2 space-y-1 ml-4">
              <li>• El documento se agregará a la sección "Recursos Adicionales"</li>
              <li>• Aparecerá al final del blog con el icono correspondiente</li>
              <li>• Al hacer clic, se abre en nueva pestaña</li>
              <li>• No ocupa espacio en Supabase (usa tu Drive/Dropbox)</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleInsert}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Agregar Documento
          </button>
        </div>
      </div>
    </div>
  )
}

export default DocumentModal
