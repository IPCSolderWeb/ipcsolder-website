import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../services/supabase'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Redirigir al login si no está autenticado
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Usuario autenticado, mostrar contenido
  return children
}

export default ProtectedRoute