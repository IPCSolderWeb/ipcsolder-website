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
  const [deleteModal, setDeleteModal] = useState({ show: false, postId: null, postTitle: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const postsPerPage = 25
  const navigate = useNavigate()
  const location = useLocation()
  const { toasts, showSuccess, showError, showWarning, removeToast } = useToast()

  // Mostrar mensaje de bienvenida solo cuando viene del login
  useEffect(() => {
    if (location.state?.fromLogin) {
      showSuccess('¡Bienvenido al panel de administración!', '👋 ¡Hola!')
      // Limpiar el estado para evitar que se muestre de nuevo
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, showSuccess, navigate, location.pathname])

  // Cargar datos
  useEffect(() => {
    const loadData = async () => {
      
      try {
        const [postsData, categoriesData, totalCount] = await Promise.all([
          adminService.getAllPosts(1, postsPerPage),
          blogService.getCategories(),
          adminService.getPostsCount()
        ])
        setPosts(postsData)
        setCategories(categoriesData)
        setTotalPosts(totalCount)
      } catch (error) {
        console.error('Error loading data:', error)
        showError('Error al cargar los datos del dashboard', 'Error de conexión')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Cargar más posts
  const loadMorePosts = async () => {
    if (loadingMore || posts.length >= totalPosts) return

    try {
      setLoadingMore(true)
      const nextPage = currentPage + 1
      const morePosts = await adminService.getAllPosts(nextPage, postsPerPage)
      setPosts(prevPosts => [...prevPosts, ...morePosts])
      setCurrentPage(nextPage)
    } catch (error) {
      console.error('Error loading more posts:', error)
      showError('Error al cargar más posts', 'Error de conexión')
    } finally {
      setLoadingMore(false)
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      await adminService.deletePost(postId)
      setPosts(posts.filter(post => post.id !== postId))
      setTotalPosts(prev => prev - 1)
      showSuccess('Post eliminado correctamente', 'Eliminación exitosa')
      setDeleteModal({ show: false, postId: null, postTitle: '' })
    } catch (error) {
      console.error('Error deleting post:', error)
      showError('Error al eliminar el post', 'Error de eliminación')
    }
  }

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

  const filteredPosts = posts.filter(post => {
    const esContent = post.post_contents?.find(content => content.language === 'es')
    const enContent = post.post_contents?.find(content => content.language === 'en')
    
    const title = esContent?.title || enContent?.title || ''
    const excerpt = esContent?.excerpt || enContent?.excerpt || ''
    
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{totalPosts}</p>
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
                {posts.filter(post => post.status === 'published').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Borradores</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.filter(post => post.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/admin/posts/new')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <span className="mr-2">➕</span>
              Crear Nuevo Post
            </button>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Posts del Blog</h2>
        </div>
        
        <div className="px-6 py-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Buscar posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
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
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'No se encontraron posts que coincidan con tu búsqueda' : 'No hay posts creados aún'}
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => {
                  const category = categories.find(c => c.id === post.category_id)
                  const esContent = post.post_contents?.find(content => content.language === 'es')
                  const enContent = post.post_contents?.find(content => content.language === 'en')
                  
                  const title = esContent?.title || enContent?.title || 'Sin título'
                  const excerpt = esContent?.excerpt || enContent?.excerpt || 'Sin resumen'
                  
                  return (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {excerpt}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(post.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {category?.name_es || 'Sin categoría'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {post.created_at ? new Date(post.created_at).toLocaleDateString('es-ES') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setDeleteModal({ 
                            show: true, 
                            postId: post.id, 
                            postTitle: title
                          })}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Load More Button */}
        {posts.length < totalPosts && (
          <div className="px-6 py-4 border-t border-gray-200 text-center">
            <button
              onClick={loadMorePosts}
              disabled={loadingMore}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cargando...
                </>
              ) : (
                `Cargar más posts (${posts.length} de ${totalPosts})`
              )}
            </button>
          </div>
        )}
      </div>

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
    </div>
  )
}

export default AdminDashboard