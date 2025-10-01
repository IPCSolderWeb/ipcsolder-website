import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const BlogFilters = ({ 
  categories, 
  currentCategory, 
  searchTerm, 
  onCategoryChange, 
  onSearch, 
  currentLanguage = 'es' 
}) => {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language || currentLanguage
  const [searchInput, setSearchInput] = useState(searchTerm || '')

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    onSearch(searchInput)
  }

  const handleSearchClear = () => {
    setSearchInput('')
    onSearch('')
  }

  return (
    <div className="mb-12">
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('blog.filters.searchPlaceholder')}
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleSearchClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {/* All Categories Button */}
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            !currentCategory
              ? 'bg-blue-600 text-white shadow-lg transform -translate-y-0.5'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          <span className="flex items-center">
            <span className="mr-2">📚</span>
            {t('blog.filters.allCategories')}
          </span>
        </button>

        {/* Category Buttons */}
        {categories.map((category) => {
          const isActive = currentCategory === category.slug
          
          // Iconos por categoría
          const getCategoryIcon = (slug) => {
            const icons = {
              'soldadura': '🔬',
              'esd': '⚡',
              'procesos': '⚙️',
              'investigacion': '📊',
              'casos-estudio': '📋'
            }
            return icons[slug] || '📝'
          }

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.slug)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg transform -translate-y-0.5'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center">
                <span className="mr-2">{getCategoryIcon(category.slug)}</span>
                {currentLang === 'es' ? category.name_es : category.name_en}
              </span>
            </button>
          )
        })}
      </div>

      {/* Active Filters Display */}
      {(currentCategory || searchTerm) && (
        <div className="mt-6 flex flex-wrap items-center gap-2 justify-center">
          <span className="text-sm text-gray-600">{t('blog.filters.activeFilters')}</span>
          
          {currentCategory && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              {categories.find(c => c.slug === currentCategory)?.[currentLang === 'es' ? 'name_es' : 'name_en']}
              <button
                onClick={() => onCategoryChange(null)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              "{searchTerm}"
              <button
                onClick={() => onSearch('')}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default BlogFilters