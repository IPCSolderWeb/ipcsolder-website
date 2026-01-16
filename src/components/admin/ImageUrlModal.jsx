import React, { useState } from 'react'

const ImageUrlModal = ({ isOpen, onInsert, onCancel }) => {
  const [imageUrl, setImageUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [alignment, setAlignment] = useState('center')
  const [size, setSize] = useState('medium') // Nuevo: tamaño de imagen

  if (!isOpen) return null

  const handleInsert = () => {
    if (!imageUrl.trim()) {
      alert('Por favor ingresa una URL de imagen')
      return
    }

    onInsert(imageUrl, altText, alignment, size)
    
    // Limpiar campos
    setImageUrl('')
    setAltText('')
    setAlignment('center')
    setSize('medium')
  }

  const handleCancel = () => {
    setImageUrl('')
    setAltText('')
    setAlignment('center')
    setSize('medium')
    onCancel()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
              <span className="text-3xl">🖼️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Insertar Imagen</h3>
              <p className="text-blue-100 text-sm">Desde URL externa</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* URL de imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de la imagen <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Usa enlaces públicos de Google Drive, Imgur, Dropbox, etc.
            </p>
          </div>

          {/* Texto alternativo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción de la imagen <span className="text-gray-400 text-xs">(opcional)</span>
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Ej: Diagrama de proceso de soldadura"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ayuda a la accesibilidad y SEO
            </p>
          </div>

          {/* Alineación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alineación
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAlignment('left')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                  alignment === 'left'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-blue-300'
                }`}
              >
                ⬅️ Izquierda
              </button>
              <button
                type="button"
                onClick={() => setAlignment('center')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                  alignment === 'center'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-blue-300'
                }`}
              >
                ↔️ Centro
              </button>
              <button
                type="button"
                onClick={() => setAlignment('right')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                  alignment === 'right'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-blue-300'
                }`}
              >
                ➡️ Derecha
              </button>
            </div>
          </div>

          {/* Tamaño */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño de la imagen
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSize('small')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                  size === 'small'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-blue-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-sm">Pequeño</div>
                  <div className="text-xs text-gray-500">300px</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSize('medium')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                  size === 'medium'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-blue-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-sm">Mediano</div>
                  <div className="text-xs text-gray-500">500px</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSize('large')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                  size === 'large'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-blue-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-sm">Grande</div>
                  <div className="text-xs text-gray-500">800px</div>
                </div>
              </button>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong>💡 Cómo funciona:</strong>
            </p>
            <ul className="text-xs text-blue-700 mt-2 space-y-1 ml-4">
              <li>• La imagen se mostrará en el tamaño seleccionado en el blog</li>
              <li>• Al hacer clic, se abre en tamaño completo en nueva pestaña</li>
              <li>• El blog permanece abierto en segundo plano</li>
              <li>• Pequeño (300px) ideal para iconos o diagramas simples</li>
              <li>• Mediano (500px) ideal para la mayoría de imágenes</li>
              <li>• Grande (800px) ideal para imágenes detalladas</li>
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
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Insertar Imagen
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageUrlModal
