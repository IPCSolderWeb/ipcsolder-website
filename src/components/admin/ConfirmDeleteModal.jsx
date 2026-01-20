import React from 'react'

const ConfirmDeleteModal = ({ isOpen, resource, onConfirm, onCancel }) => {
  if (!isOpen || !resource) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 text-white p-6 rounded-t-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
              <span className="text-3xl">🗑️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Eliminar Documento</h3>
              <p className="text-red-100 text-sm">Esta acción no se puede deshacer</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            ¿Estás seguro de que deseas eliminar este documento?
          </p>

          {/* Document preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <span className="text-3xl mr-3">{resource.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 mb-1">{resource.title}</p>
                {resource.description && (
                  <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                )}
                <p className="text-xs text-gray-500 truncate">{resource.url}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
            <div className="flex">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> El documento se eliminará de ambos idiomas (español e inglés).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal
