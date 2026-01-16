import React from 'react'

const ConfirmLeaveModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-t-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Cambios sin guardar</h3>
              <p className="text-yellow-100 text-sm">Tienes modificaciones pendientes</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 text-base leading-relaxed mb-4">
            Si sales ahora, <strong>perderás todos los cambios</strong> que no hayas guardado.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm text-yellow-800">
              💡 <strong>Tip:</strong> Usa "Guardar Borrador" para guardar tu progreso sin publicar.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            ← Continuar editando
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Salir sin guardar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmLeaveModal
