import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const BlogCard = ({ post, currentLanguage = 'es' }) => {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language || currentLanguage
  // Obtener contenido en el idioma actual
  const content = post.post_contents?.find(c => c.language === currentLang) || post.post_contents?.[0]
  const category = post.categories

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Iconos por categoría
  const getCategoryIcon = (categorySlug) => {
    const icons = {
      'soldadura': '🔬',
      'esd': '⚡',
      'procesos': '⚙️',
      'investigacion': '📊',
      'casos-estudio': '📋'
    }
    return icons[categorySlug] || '📝'
  }

  // Colores por categoría
  const getCategoryColor = (categorySlug) => {
    const colors = {
      'soldadura': 'bg-blue-100 text-blue-800',
      'esd': 'bg-yellow-100 text-yellow-800',
      'procesos': 'bg-green-100 text-green-800',
      'investigacion': 'bg-purple-100 text-purple-800',
      'casos-estudio': 'bg-orange-100 text-orange-800'
    }
    return colors[categorySlug] || 'bg-gray-100 text-gray-800'
  }

  if (!content) {
    return null // No mostrar si no hay contenido
  }

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 overflow-hidden group">
      {/* Featured Image or Icon */}
      <div className="relative">
        {post.featured_image_url ? (
          <img
            src={post.featured_image_url}
            alt={content.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='20' cy='20' r='2' fill='white' opacity='0.1'/%3E%3Ccircle cx='80' cy='40' r='1.5' fill='white' opacity='0.1'/%3E%3Ccircle cx='40' cy='80' r='1' fill='white' opacity='0.1'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }} />
            </div>
            <span className="text-6xl relative z-10">
              {getCategoryIcon(category?.slug)}
            </span>
          </div>
        )}
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(category.slug)}`}>
              {currentLang === 'es' ? category.name_es : category.name_en}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta Info */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            📅 {formatDate(post.published_at || post.created_at)}
          </span>
          {/* Tiempo de lectura estimado */}
          <span className="mx-2">•</span>
          <span className="flex items-center">
            ⏱️ {Math.max(1, Math.ceil(content.content.length / 1000))} {t('blog.card.readingTime')}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link to={`/blog/${post.slug}`} className="hover:underline">
            {content.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {content.excerpt}
        </p>

        {/* Tags */}
        {post.post_tags && post.post_tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.post_tags.slice(0, 3).map((tagRelation, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                {currentLang === 'es' ? tagRelation.tags.name_es : tagRelation.tags.name_en}
              </span>
            ))}
            {post.post_tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{post.post_tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Read More */}
        <div className="flex items-center justify-between">
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm group-hover:translate-x-1 transition-transform"
          >
            {t('blog.card.readMore')}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          {/* Share Button (opcional) */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: content.title,
                  text: content.excerpt,
                  url: `${window.location.origin}/blog/${post.slug}`
                })
              } else {
                // Fallback: copiar al clipboard
                navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`)
                alert(t('blog.card.linkCopied'))
              }
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title={t('blog.card.share')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

export default BlogCard