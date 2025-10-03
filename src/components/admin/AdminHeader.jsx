import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth, adminService } from '../../services/supabase'
import ConfirmModal from './ConfirmModal'
import Toast from './Toast'
import useToast from '../../hooks/useToast'

const AdminHeader = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toasts, showSuccess, showError, removeToast } = useToast()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = async () => {
    try {
      await adminService.signOut()
      showSuccess('Sesión cerrada correctamente', '👋 ¡Hasta luego!')
      setTimeout(() => {
        navigate('/admin/login')
      }, 1000)
    } catch (error) {
      console.error('Error logging out:', error)
      showError('Error al cerrar sesión', 'Inténtalo de nuevo')
    }
  }

  const confirmLogout = () => {
    setShowLogoutModal(true)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const navItems = [
    {
      path: '/admin/dashboard',
      label: '📝 Posts del Blog',
      icon: '📝'
    },
    {
      path: '/admin/newsletter',
      label: '📧 Newsletter',
      icon: '📧'
    }
  ]

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center">
              <h1 className="text-lg font-bold">🔧 IPCSolder Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-blue-100">
                Bienvenido, <span className="font-medium">{user?.email}</span>
              </span>
              <button
                onClick={confirmLogout}
                className="text-blue-100 hover:text-white text-sm font-medium px-3 py-1 rounded hover:bg-blue-700 transition-colors duration-200"
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>

    {/* Logout Confirmation Modal */}
    <ConfirmModal
      isOpen={showLogoutModal}
      onClose={() => setShowLogoutModal(false)}
      onConfirm={handleLogout}
      title="Cerrar Sesión"
      message="¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder al panel de administración."
      confirmText="Cerrar Sesión"
      cancelText="Cancelar"
      type="warning"
    />

    {/* Toast Notifications */}
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          title={toast.title}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
    </>
  )
}

export default AdminHeader