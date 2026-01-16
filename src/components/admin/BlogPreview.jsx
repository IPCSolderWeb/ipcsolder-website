import React, { useState } from 'react'

const BlogPreview = ({ contentData, postData, categories }) => {
  const [previewLanguage, setPreviewLanguage] = useState('es')

  // Obtener el contenido del idioma seleccionado
  const content = contentData[previewLanguage]
  
  // Obtener nombre de categoría
  const category = categories.find(cat => cat.id === postData.category_id)
  const categoryName = previewLanguage === 'es' ? category?.name_es : category?.name_en

  // Verificar si hay contenido para mostrar
  const hasContent = content.title.trim() || content.excerpt.trim() || content.content.trim()

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">👁️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Vista Previa
          </h3>
          <p className="text-gray-600">
            Escribe algo en las pestañas de idioma para ver la vista previa de tu blog.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Selector de idioma para preview */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">Vista previa en:</span>
          <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setPreviewLanguage('es')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                previewLanguage === 'es'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              🇪🇸 Español
            </button>
            <button
              onClick={() => setPreviewLanguage('en')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                previewLanguage === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              🇺🇸 English
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
          💡 Esta es una simulación de cómo se verá publicado
        </div>
      </div>

      {/* Preview Content - Simulación del BlogPost real */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header del Post */}
        <header className="mb-12">
          {/* Breadcrumb simulado */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <span className="text-blue-600">Blog</span>
            <span className="text-gray-400">/</span>
            {categoryName && (
              <>
                <span className="text-blue-600">{categoryName}</span>
                <span className="text-gray-400">/</span>
              </>
            )}
            <span className="text-gray-900">{content.title || 'Sin título'}</span>
          </nav>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            {categoryName && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                📁 {categoryName}
              </span>
            )}
            <span className="flex items-center">
              📅 {new Date().toLocaleDateString(previewLanguage === 'es' ? 'es-ES' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="flex items-center">
              ⏱️ {Math.max(1, Math.ceil((content.content.replace(/<[^>]*>/g, '').split(/\s+/).length) / 200))} min lectura
            </span>
          </div>

          {/* Título */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {content.title || 'Sin título'}
          </h1>

          {/* Excerpt */}
          {content.excerpt && (
            <div className="text-xl text-gray-600 leading-relaxed mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              {content.excerpt}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {postData.featured_image_url && (
          <div className="mb-12">
            <img
              src={postData.featured_image_url}
              alt={content.title}
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Contenido del Post */}
        <article className="prose prose-lg max-w-none">
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: content.content || '<p class="text-gray-500 italic">Sin contenido</p>' }}
          />
        </article>

        {/* Nota al final */}
        <div className="mt-12 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-blue-800">
            <strong>👁️ Vista Previa:</strong> Así es como se verá tu artículo cuando lo publiques. 
            Los estilos y el formato son idénticos al blog real.
          </p>
        </div>
      </div>

      {/* Estilos para el contenido del blog */}
      <style jsx>{`
        .blog-content {
          color: #374151;
          line-height: 1.8;
        }
        
        .blog-content h2 {
          font-size: 2rem;
          font-weight: bold;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #1f2937;
        }
        
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #1f2937;
        }
        
        .blog-content p {
          margin-bottom: 1rem;
        }
        
        .blog-content strong {
          font-weight: 600;
          color: #1f2937;
        }
        
        .blog-content em {
          font-style: italic;
        }
        
        .blog-content ul,
        .blog-content ol {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
        }
        
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        
        .blog-content ul li {
          list-style-type: none;
          position: relative;
        }
        
        .blog-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .blog-content a:hover {
          color: #1d4ed8;
        }
        
        .blog-content code {
          background-color: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-family: monospace;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #4b5563;
        }
      `}</style>
    </div>
  )
}

export default BlogPreview
