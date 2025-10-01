import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { blogService } from '../services/supabase'
import BlogCard from '../components/blog/BlogCard'
import BlogFilters from '../components/blog/BlogFilters'
import BlogPagination from '../components/blog/BlogPagination'
import useScrollToTop from '../hooks/useScrollToTop'

const Blog = ({ currentLanguage = 'es' }) => {
  const { t, ready, i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Scroll to top when route changes
  useScrollToTop()
  
  // Estados
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Parámetros de URL
  const currentPage = parseInt(searchParams.get('page')) || 1
  const categoryFilter = searchParams.get('category') || null
  const searchTerm = searchParams.get('search') || ''
  
  // Paginación
  const [totalPages, setTotalPages] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const postsPerPage = 6

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const categoriesData = await blogService.getCategories()
        setCategories(categoriesData)
      } catch (err) {
        console.error('Error loading categories:', err)
        setError('Error cargando categorías')
      }
    }

    if (ready) {
      loadInitialData()
    }
  }, [ready])

  // Cargar posts cuando cambien los filtros
  useEffect(() => {
    const loadPosts = async () => {
      if (!ready) return
      
      setLoading(true)
      setError(null)
      
      try {
        let postsData
        
        const currentLang = i18n.language || currentLanguage
        
        if (searchTerm) {
          // Búsqueda
          postsData = await blogService.searchPosts(searchTerm, currentLang, postsPerPage * 3) // Más resultados para búsqueda
          setPosts(postsData)
          setTotalPosts(postsData.length)
          setTotalPages(Math.ceil(postsData.length / postsPerPage))
        } else {
          // Lista normal con paginación
          const result = await blogService.getPublishedPosts(
            currentPage, 
            postsPerPage, 
            categoryFilter, 
            currentLang
          )
          setPosts(result.posts)
          setTotalPosts(result.totalCount)
          setTotalPages(result.totalPages)
        }
      } catch (err) {
        console.error('Error loading posts:', err)
        setError('Error cargando posts')
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [ready, currentPage, categoryFilter, searchTerm, i18n.language])

  // Manejar cambio de filtro de categoría
  const handleCategoryChange = (categorySlug) => {
    const newParams = new URLSearchParams(searchParams)
    
    if (categorySlug) {
      newParams.set('category', categorySlug)
    } else {
      newParams.delete('category')
    }
    
    newParams.delete('page') // Reset página
    newParams.delete('search') // Reset búsqueda
    setSearchParams(newParams)
  }

  // Manejar búsqueda
  const handleSearch = (term) => {
    const newParams = new URLSearchParams(searchParams)
    
    if (term.trim()) {
      newParams.set('search', term.trim())
    } else {
      newParams.delete('search')
    }
    
    newParams.delete('page') // Reset página
    newParams.delete('category') // Reset categoría
    setSearchParams(newParams)
  }

  // Manejar cambio de página
  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', page.toString())
    setSearchParams(newParams)
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Loading inicial
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">{t('common.loading')}</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              {t('blog.breadcrumb.home')}
            </a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{t('blog.breadcrumb.blog')}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 100' fill='%23ffffff'%3E%3Cpath d='M0,20 Q250,80 500,20 T1000,20 L1000,100 L0,100 Z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: '100% 100px'
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {t('blog.hero.title')}
          </h1>
          <div className="text-2xl lg:text-3xl text-blue-300 font-medium mb-4">
            {t('blog.hero.subtitle')}
          </div>
          <p className="text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t('blog.hero.description')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters and Search */}
          <BlogFilters
            categories={categories}
            currentCategory={categoryFilter}
            searchTerm={searchTerm}
            onCategoryChange={handleCategoryChange}
            onSearch={handleSearch}
            currentLanguage={currentLanguage}
          />

          {/* Results Info */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-gray-600 mb-4 sm:mb-0">
                {searchTerm ? (
                  <span>
                    {t('blog.results.searchResults')} "<strong>{searchTerm}</strong>": {totalPosts} {t('blog.results.articles')}
                  </span>
                ) : categoryFilter ? (
                  <span>
                    {t('blog.results.categoryResults')} <strong>{categories.find(c => c.slug === categoryFilter)?.[i18n.language === 'es' ? 'name_es' : 'name_en']}</strong> - {totalPosts} {t('blog.results.articles')}
                  </span>
                ) : (
                  <span>
                    {totalPosts} {t('blog.results.totalArticles')}
                  </span>
                )}
              </div>
              
              {(searchTerm || categoryFilter) && (
                <button
                  onClick={() => {
                    setSearchParams({})
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {t('blog.filters.clearFilters')} ✕
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('blog.results.loading')}</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">⚠️</div>
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Posts Grid */}
          {!loading && !error && (
            <>
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm ? t('blog.results.noResults') : t('blog.results.noArticles')}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm 
                      ? t('blog.results.tryOtherTerms')
                      : t('blog.results.comingSoon')
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {posts.map((post) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      currentLanguage={i18n.language || currentLanguage}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <BlogPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('blog.newsletter.title')}</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('blog.newsletter.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('blog.newsletter.placeholder')}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <button className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              {t('blog.newsletter.button')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Blog