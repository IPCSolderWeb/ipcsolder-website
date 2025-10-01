import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { blogService } from '../services/supabase'
import useScrollToTop from '../hooks/useScrollToTop'

const BlogPost = ({ currentLanguage = 'es' }) => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, ready, i18n } = useTranslation()
  const currentLang = i18n.language || currentLanguage
  
  // Scroll to top when route changes
  useScrollToTop()
  
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPost = async () => {
      if (!ready || !slug) return
      
      setLoading(true)
      setError(null)
      
      try {
        // Cargar el post
        const postData = await blogService.getPostBySlug(slug, currentLang)
        setPost(postData)
        
        // Cargar posts relacionados
        if (postData.category_id) {
          const related = await blogService.getRelatedPosts(
            postData.category_id, 
            postData.id, 
            currentLang, 
            3
          )
          setRelatedPosts(related)
        }
      } catch (err) {
        console.error('Error loading post:', err)
        setError('Post no encontrado')
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [ready, slug, currentLang])

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Loading inicial
  if (!ready || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('blog.post.notFound')}</h1>
          <p className="text-gray-600 mb-6">{t('blog.post.notFoundDescription')}</p>
          <Link
            to="/blog"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← {t('blog.post.backToBlog')}
          </Link>
        </div>
      </div>
    )
  }

  const content = post.post_contents?.find(c => c.language === currentLang) || post.post_contents?.[0]
  const category = post.categories

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('blog.post.contentNotAvailable')}</h1>
          <p className="text-gray-600 mb-6">{t('blog.post.contentNotAvailableDescription')}</p>
          <Link
            to="/blog"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← {t('blog.post.backToBlog')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              {t('blog.breadcrumb.home')}
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/blog" className="text-blue-600 hover:text-blue-800 transition-colors">
              {t('blog.breadcrumb.blog')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">{content.title}</span>
          </nav>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12">
          {/* Category Badge */}
          {category && (
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {currentLang === 'es' ? category.name_es : category.name_en}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {content.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center text-gray-600 text-sm mb-8">
            <span className="flex items-center mr-6">
              📅 {formatDate(post.published_at || post.created_at)}
            </span>
            <span className="flex items-center mr-6">
              ⏱️ {Math.max(1, Math.ceil(content.content.length / 1000))} {t('blog.card.readingTime')}
            </span>
            {category && (
              <span className="flex items-center">
                🏷️ {currentLang === 'es' ? category.name_es : category.name_en}
              </span>
            )}
          </div>

          {/* Excerpt */}
          <div className="text-xl text-gray-600 leading-relaxed mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            {content.excerpt}
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="mb-12">
            <img
              src={post.featured_image_url}
              alt={content.title}
              className="w-full h-64 lg:h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />

        {/* Tags */}
        {post.post_tags && post.post_tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('blog.post.tags')}</h3>
            <div className="flex flex-wrap gap-2">
              {post.post_tags.map((tagRelation, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                >
                  {currentLang === 'es' ? tagRelation.tags.name_es : tagRelation.tags.name_en}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('blog.card.share')}:</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: content.title,
                    text: content.excerpt,
                    url: window.location.href
                  })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  alert(t('blog.card.linkCopied'))
                }
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              {t('blog.card.share')}
            </button>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t('blog.post.relatedPosts')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => {
                const relatedContent = relatedPost.post_contents?.find(c => c.language === currentLang) || relatedPost.post_contents?.[0]
                if (!relatedContent) return null
                
                return (
                  <article key={relatedPost.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      <Link 
                        to={`/blog/${relatedPost.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {relatedContent.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {relatedContent.excerpt}
                    </p>
                    <Link
                      to={`/blog/${relatedPost.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {t('blog.card.readMore')} →
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <div className="bg-white py-8 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ← {t('blog.post.backToBlog')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogPost