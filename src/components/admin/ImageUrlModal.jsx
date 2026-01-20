import React, { useState } from 'react'

const ImageUrlModal = ({ isOpen, onInsert, onCancel }) => {
  const [imageUrl, setImageUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [alignment, setAlignment] = useState('center')
  const [size, setSize] = useState('medium') // Nuevo: tamaño de imagen

  if (!isOpen) return null

  // Función para convertir enlaces de imágenes (solo Imgur)
  const convertImageUrl = (url) => {
    if (!url) return url
    
    // BLOQUEAR GOOGLE DRIVE para imágenes (no es confiable)
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      alert('⚠️ Google Drive NO es confiable para mostrar imágenes en blogs.\n\n' +
            '✅ Recomendación: Usa Imgur (imgur.com) en su lugar.\n\n' +
            'Imgur es:\n' +
            '• Gratis y sin límites\n' +
            '• Diseñado específicamente para imágenes\n' +
            '• 100% confiable\n' +
            '• Más rápido\n\n' +
            'Para documentos (PDF, Excel, etc.) SÍ puedes usar Google Drive con el botón 📎')
      return null // Retornar null para indicar que no se debe usar
    }
    
    // IMGUR: Convertir enlaces de página a enlaces directos de imagen
    if (url.includes('imgur.com')) {
      // Si ya es un enlace directo (i.imgur.com), no hacer nada
      if (url.includes('i.imgur.com')) {
        return url
      }
      
      // Si es un álbum (imgur.com/a/), no se puede convertir
      if (url.includes('/a/')) {
        alert('⚠️ Los álbumes de Imgur no funcionan.\n\n' +
              'Por favor:\n' +
              '1. Abre la imagen individual\n' +
              '2. Haz clic derecho → "Copiar dirección de imagen"\n' +
              '3. Pega ese enlace (debe empezar con i.imgur.com)')
        return null
      }
      
      // Convertir imgur.com/ID a i.imgur.com/ID.jpg
      const match = url.match(/imgur\.com\/([a-zA-Z0-9]+)/)
      if (match) {
        const imageId = match[1]
        return `https://i.imgur.com/${imageId}.jpg`
      }
    }
    
    // Si no es Imgur ni Drive, devolver URL original (otros servicios)
    return url
  }

  const handleInsert = () => {
    if (!imageUrl.trim()) {
      alert('Por favor ingresa una URL de imagen')
      return
    }

    // Convertir el enlace automáticamente
    const convertedUrl = convertImageUrl(imageUrl.trim())
    
    // Si la conversión retorna null, significa que no se debe usar (Drive o álbum)
    if (convertedUrl === null) {
      return // No continuar con la inserción
    }

    onInsert(convertedUrl, altText, alignment, size)
    
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
              placeholder="https://i.imgur.com/ejemplo.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 <strong>Solo Imgur:</strong> Para imágenes usa Imgur. Para documentos (PDF, Excel) usa el botón 📎
            </p>
            {imageUrl && imageUrl.includes('imgur.com') && !imageUrl.includes('i.imgur.com') && !imageUrl.includes('/a/') && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-300 rounded text-xs text-yellow-800">
                ⚠️ <strong>URL de página de Imgur detectada.</strong> Se convertirá automáticamente al enlace directo de imagen (i.imgur.com).
              </div>
            )}
            {imageUrl && imageUrl.includes('i.imgur.com') && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                ✅ <strong>Enlace directo de Imgur.</strong> Perfecto para imágenes web.
              </div>
            )}
            {imageUrl && imageUrl.includes('imgur.com/a/') && (
              <div className="mt-2 p-2 bg-red-50 border border-red-300 rounded text-xs text-red-800">
                ❌ <strong>Álbum de Imgur detectado.</strong> Los álbumes no funcionan. Abre la imagen individual y copia el enlace directo.
              </div>
            )}
            {imageUrl && (imageUrl.includes('drive.google.com') || imageUrl.includes('docs.google.com')) && (
              <div className="mt-2 p-2 bg-red-50 border border-red-300 rounded text-xs text-red-800">
                ❌ <strong>Google Drive NO funciona para imágenes.</strong> Usa Imgur en su lugar. Drive solo funciona para documentos (botón 📎).
              </div>
            )}
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
