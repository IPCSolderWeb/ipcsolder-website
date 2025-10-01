import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { adminService, blogService, useAuth } from '../../services/supabase'
import Toast from '../../components/admin/Toast'
import ConfirmModal from '../../components/admin/ConfirmModal'
import useToast from '../../hooks/useToast'

const AdminDashboard = () => {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ show: false, postId: null, postTitle: '' })
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading: authLoading } = useAuth()
  const { toasts, showSuccess, showError, showWarning, removeToast } = useToast()

  // Proteger ruta - redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login', { replace: true })
    }
  }, [user, authLoading, navigate])

  // Mostrar mensaje de bienvenida solo cuando viene del login
  useEffect(() => {
    if (location.state?.fromLogin && user) {
      showSuccess('¡Bienvenido al panel de administración!', '👋 ¡Hola!')
      // Limpiar el estado para evitar que se muestre de nuevo
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, user, showSuccess, navigate, location.pathname])

  // Cargar datos
  useEffect(() => {
    const loadData = async () => {
      if (!user || authLoading) return
      
      try {
        const [postsData, categoriesData] = await Promise.all([
          adminService.getAllPosts(),
          blogService.getCategories()
        ])
        setPosts(postsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error loading data:', error)
        showError('Error al cargar los datos del dashboard', 'Error de conexión')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, authLoading]) // Incluir authLoading para evitar cargas prematuras

  const handleLogout = async () => {
    try {
      await adminService.signOut()
      showSuccess('Sesión cerrada correctamente', '¡Hasta pronto!')
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

  const handleDeletePost = async (postId) => {
    try {
      await adminService.deletePost(postId)
      setPosts(posts.filter(post => post.id !== postId))
      showSuccess('Post eliminado correctamente', 'Eliminación exitosa')
      setDeleteModal({ show: false, postId: null, postTitle: '' })
    } catch (error) {
      console.error('Error deleting post:', error)
      showError('Error al eliminar el post', 'Error de eliminación')
    }
  }

  const confirmDeletePost = (postId, postTitle) => {
    setDeleteModal({ show: true, postId, postTitle })
  }

  const filteredPosts = posts.filter(post => {
    const searchLower = searchTerm.toLowerCase()
    return post.post_contents?.some(content => 
      content.title.toLowerCase().includes(searchLower) ||
      content.excerpt.toLowerCase().includes(searchLower)
    )
  })

  const getStatusBadge = (status) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    }
    const labels = {
      published: 'Publicado',
      draft: 'Borrador',
      archived: 'Archivado'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {authLoading ? 'Verificando autenticación...' : 'Cargando dashboard...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">IPCSolder Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bienvenido, {user?.email}
              </span>
              <button
                onClick={confirmLogout}
                className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-red-200 hover:border-red-300 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Publicados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {posts.filter(p => p.status === 'published').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Borradores</p>
                <p className="text-2xl font-bold text-gray-900">
                  {posts.filter(p => p.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => navigate('/admin/posts/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <span className="mr-2">➕</span>
              Nuevo Post
            </button>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Posts del Blog</h2>
          </div>
          
          {filteredPosts.length === 0 ? (
            <div className="p-8 text-center">
              <span className="text-4xl mb-4 block">📝</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay posts</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No se encontraron posts con ese término' : 'Comienza creando tu primer post'}
              </p>
              <button
                onClick={() => navigate('/admin/posts/new')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Crear Primer Post
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPosts.map((post) => {
                    const esContent = post.post_contents?.find(c => c.language === 'es')
                    const category = categories.find(c => c.id === post.category_id)
                    
                    return (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {esContent?.title || 'Sin título'}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {esContent?.excerpt || 'Sin descripción'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {category?.name_es || 'Sin categoría'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(post.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(post.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => confirmDeletePost(post.id, esContent?.title || 'Sin título')}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          title={toast.title}
          isVisible={toast.isVisible}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Cerrar Sesión"
        message="¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder al panel de administración."
        confirmText="Sí, cerrar sesión"
        cancelText="Cancelar"
        type="warning"
      />

      {/* Delete Post Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, postId: null, postTitle: '' })}
        onConfirm={() => handleDeletePost(deleteModal.postId)}
        title="Eliminar Post"
        message={`¿Estás seguro de que deseas eliminar el post "${deleteModal.postTitle}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

export default AdminDashboard