import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../services/supabase'
import AdminHeader from './AdminHeader'

const AdminLayout = ({ children }) => {
  const { user, loading } = useAuth()

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Redirigir a login si no está autenticado
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout