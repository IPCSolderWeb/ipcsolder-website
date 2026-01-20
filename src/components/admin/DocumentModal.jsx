import React, { useState } from 'react'

const DocumentModal = ({ isOpen, onInsert, onCancel }) => {
  const [documentUrl, setDocumentUrl] = useState('')
  const [documentType, setDocumentType] = useState('pdf')
  
  // Campos bilingües
  const [titleEs, setTitleEs] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [descriptionEs, setDescriptionEs] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')

  if (!isOpen) return null

  // Función para convertir enlaces de Google Drive automáticamente
  const convertToDirectLink = (url) => {
    if (!url) return url
    
    // Detectar si es un enlace de Google Drive
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      // Extraer el ID del archivo de diferentes formatos de URL
      let fileId = null
      
      // Formato: https://drive.google.com/file/d/FILE_ID/view
      const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
      if (match1) {
        fileId = match1[1]
      }
      
      // Formato: https://drive.google.com/open?id=FILE_ID
      const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
      if (match2) {
        fileId = match2[1]
      }
      
      // Formato: https://docs.google.com/document/d/FILE_ID/edit
      const match3 = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
      if (match3) {
        fileId = match3[1]
      }
      
      // Si encontramos el ID, convertir al formato de descarga directa
      if (fileId) {
        return `https://drive.google.com/uc?export=download&id=${fileId}`
      }
    }
    
    // Si no es Google Drive o no se pudo convertir, devolver URL original
    return url
  }

  const handleInsert = () => {
    if (!documentUrl.trim()) {
      alert('Por favor ingresa una URL del documento')
      return
    }
    if (!titleEs.trim()) {
      alert('Por favor ingresa el título en español')
      return
    }
    if (!titleEn.trim()) {
      alert('Por favor ingresa el título en inglés')
      return
    }

    // Convertir el enlace automáticamente si es de Google Drive
    const convertedUrl = convertToDirectLink(documentUrl.trim())

    // Pasar ambos idiomas al handler con la URL convertida
    onInsert(convertedUrl, documentType, {
      es: { title: titleEs, description: descriptionEs },
      en: { title: titleEn, description: descriptionEn }
    })
    
    // Limpiar campos
    setDocumentUrl('')
    setDocumentType('pdf')
    setTitleEs('')
    setTitleEn('')
    setDescriptionEs('')
    setDescriptionEn('')
  }

  const handleCancel = () => {
    setDocumentUrl('')
    setDocumentType('pdf')
    setTitleEs('')
    setTitleEn('')
    setDescriptionEs('')
    setDescriptionEn('')
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
              💡 Enlace público de Google Drive
            </p>
            {documentUrl && (documentUrl.includes('drive.google.com') || documentUrl.includes('docs.google.com')) && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                ✨ <strong>Enlace de Google Drive detectado.</strong> Se convertirá automáticamente al formato de descarga directa.
              </div>
            )}
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
                PDF
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
                Excel
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
                Word
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
                ZIP
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
                Imagen
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
                Otro
              </button>
            </div>
          </div>

          {/* Separador Español */}
          <div className="border-t-2 border-blue-200 pt-4 mt-6">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">🇪🇸</span>
              <h4 className="text-lg font-bold text-blue-900">ESPAÑOL</h4>
            </div>

            {/* Título ES */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título en español <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={titleEs}
                onChange={(e) => setTitleEs(e.target.value)}
                placeholder="Ej: Ficha Técnica Soldadura SAC305"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Descripción ES */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción breve <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <input
                type="text"
                value={descriptionEs}
                onChange={(e) => setDescriptionEs(e.target.value)}
                placeholder="Ej: Especificaciones técnicas completas"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Separador Inglés */}
          <div className="border-t-2 border-red-200 pt-4 mt-4">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">🇺🇸</span>
              <h4 className="text-lg font-bold text-red-900">ENGLISH</h4>
            </div>

            {/* Título EN */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title in English <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Ex: SAC305 Solder Technical Sheet"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Descripción EN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brief description <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="text"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="Ex: Complete technical specifications"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Preview */}
          {(titleEs || titleEn) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4">
              <p className="text-xs font-medium text-gray-600 mb-2">Vista previa:</p>
              <div className="space-y-2">
                {titleEs && (
                  <div className="flex items-start">
                    <span className="text-2xl mr-2">{getIcon(documentType)}</span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">🇪🇸 {titleEs}</p>
                      {descriptionEs && (
                        <p className="text-xs text-gray-600">{descriptionEs}</p>
                      )}
                    </div>
                  </div>
                )}
                {titleEn && (
                  <div className="flex items-start">
                    <span className="text-2xl mr-2">{getIcon(documentType)}</span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">🇺🇸 {titleEn}</p>
                      {descriptionEn && (
                        <p className="text-xs text-gray-600">{descriptionEn}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info box */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-sm text-green-800">
              <strong>✨ Nuevo:</strong> El documento se agregará automáticamente en ambos idiomas
            </p>
            <ul className="text-xs text-green-700 mt-2 space-y-1 ml-4">
              <li>• Aparecerá en la sección "Recursos Adicionales" de español E inglés</li>
              <li>• No necesitas agregarlo dos veces</li>
              <li>• Se abre en nueva pestaña al hacer clic</li>
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
