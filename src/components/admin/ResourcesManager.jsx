import React, { useState } from 'react'
import ConfirmDeleteModal from './ConfirmDeleteModal'

const ResourcesManager = ({ contentData, currentLanguage, onRemoveResource, onOpenModal }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [resourceToDelete, setResourceToDelete] = useState(null)
  // Función para parsear los recursos del HTML
  const parseResources = (htmlContent) => {
    if (!htmlContent) return []
    
    // Buscar la sección de recursos adicionales
    const resourcesMarker = '<!-- RECURSOS_ADICIONALES -->'
    if (!htmlContent.includes(resourcesMarker)) {
      return []
    }

    const resources = []
    
    // Extraer todos los <li> de la sección de recursos
    const resourcesSection = htmlContent.split(resourcesMarker)[1]
    if (!resourcesSection) return []
    
    // Regex para extraer cada item de recurso
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/g
    let match
    
    while ((match = liRegex.exec(resourcesSection)) !== null) {
      const liContent = match[1]
      
      // Extraer URL
      const urlMatch = liContent.match(/href="([^"]+)"/)
      const url = urlMatch ? urlMatch[1] : ''
      
      // Extraer icono
      const iconMatch = liContent.match(/<span[^>]*>([^<]+)<\/span>/)
      const icon = iconMatch ? iconMatch[1] : '📎'
      
      // Extraer título
      const titleMatch = liContent.match(/<div style="font-size: 15px;">([^<]+)<\/div>/)
      const title = titleMatch ? titleMatch[1] : 'Sin título'
      
      // Extraer descripción (opcional)
      const descMatch = liContent.match(/<div style="font-size: 13px[^>]*>([^<]+)<\/div>/)
      const description = descMatch ? descMatch[1] : ''
      
      resources.push({
        url,
        icon,
        title,
        description,
        rawHtml: match[0] // Guardar el HTML completo para poder eliminarlo
      })
    }
    
    return resources
  }

  // Obtener recursos del idioma actual
  const resources = parseResources(contentData[currentLanguage].content)

  // Función para manejar la eliminación
  const handleRemove = (resource) => {
    setResourceToDelete(resource)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (resourceToDelete) {
      onRemoveResource(resourceToDelete)
      setShowDeleteModal(false)
      setResourceToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setResourceToDelete(null)
  }

  // Iconos por tipo
  const getTypeLabel = (icon) => {
    const types = {
      '📄': 'PDF',
      '📊': 'Excel',
      '📝': 'Word',
      '📦': 'ZIP',
      '🖼️': 'Imagen',
      '📎': 'Otro'
    }
    return types[icon] || 'Documento'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="mr-2">📎</span>
          Recursos Adicionales
          {resources.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
              {resources.length}
            </span>
          )}
        </h3>
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <span className="text-4xl mb-2 block">📎</span>
          <p className="text-sm text-gray-500 mb-4">
            No hay recursos agregados
          </p>
          <button
            onClick={onOpenModal}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            + Agregar primer documento
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1 min-w-0">
                    <span className="text-2xl mr-3 flex-shrink-0">{resource.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {resource.title}
                        </p>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded flex-shrink-0">
                          {getTypeLabel(resource.icon)}
                        </span>
                      </div>
                      {resource.description && (
                        <p className="text-xs text-gray-600 mb-1 line-clamp-1">
                          {resource.description}
                        </p>
                      )}
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 truncate block"
                        title={resource.url}
                      >
                        {resource.url.length > 40 ? resource.url.substring(0, 40) + '...' : resource.url}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(resource)}
                    className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors flex-shrink-0"
                    title="Eliminar documento"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenModal}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm font-medium"
          >
            + Agregar otro documento
          </button>
        </>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
        <strong>💡 Nota:</strong> Los recursos se agregan automáticamente en español E inglés. Al eliminar, se quita de ambos idiomas.
      </div>

      {/* Modal de confirmación de eliminación */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        resource={resourceToDelete}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}

export default ResourcesManager
