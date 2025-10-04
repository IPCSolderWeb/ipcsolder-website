import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminService, blogService, useAuth } from '../../services/supabase'
import Toast from '../../components/admin/Toast'
import ImageUploader from '../../components/admin/ImageUploader'
import useToast from '../../hooks/useToast'

const PostEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { toasts, showSuccess, showError, showWarning, removeToast } = useToast()
  const isEditing = Boolean(id)

  // Estados del formulario
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [currentLanguage, setCurrentLanguage] = useState('es')

  // Estados del post
  const [postData, setPostData] = useState({
    slug: '',
    category_id: '',
    status: 'draft',
    featured_image_url: ''
  })

  // Estados del contenido por idioma
  const [contentData, setContentData] = useState({
    es: { title: '', excerpt: '', content: '' },
    en: { title: '', excerpt: '', content: '' }
  })

  // Proteger ruta
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login', { replace: true })
    }
  }, [user, authLoading, navigate])

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      if (!user || authLoading) return

      setLoading(true)
      try {
        // Cargar categorías
        const categoriesData = await blogService.getCategories()
        setCategories(categoriesData)

        // Si estamos editando, cargar el post
        if (isEditing && id) {
          const post = await adminService.getPostForEdit(id)

          if (post) {
            setPostData({
              slug: post.slug,
              category_id: post.category_id || '',
              status: post.status,
              featured_image_url: post.featured_image_url || ''
            })

            // Cargar contenido por idioma
            const newContentData = { es: { title: '', excerpt: '', content: '' }, en: { title: '', excerpt: '', content: '' } }
            post.post_contents?.forEach(content => {
              newContentData[content.language] = {
                title: content.title,
                excerpt: content.excerpt,
                content: content.content
              }
            })
            setContentData(newContentData)
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
        showError('Error al cargar los datos del editor', 'Error de conexión')
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [user, authLoading, isEditing, id])

  // Generar slug automáticamente desde el título en español
  useEffect(() => {
    if (!isEditing && contentData.es.title) {
      const slug = contentData.es.title
        .toLowerCase()
        .replace(/[áéíóúñ]/g, match => {
          const replacements = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n' }
          return replacements[match]
        })
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .substring(0, 100)

      setPostData(prev => ({ ...prev, slug }))
    }
  }, [contentData.es.title, isEditing])

  const handlePostDataChange = (field, value) => {
    setPostData(prev => ({ ...prev, [field]: value }))
  }

  const handleContentChange = (language, field, value) => {
    setContentData(prev => ({
      ...prev,
      [language]: { ...prev[language], [field]: value }
    }))
  }

  const handleSave = async (publishNow = false) => {
    setSaving(true)
    try {
      // Validaciones básicas
      if (!contentData.es.title.trim()) {
        showWarning('El título en español es obligatorio', 'Campo requerido')
        setSaving(false)
        return
      }
      if (!contentData.es.excerpt.trim()) {
        showWarning('El resumen en español es obligatorio', 'Campo requerido')
        setSaving(false)
        return
      }
      if (!contentData.es.content.trim()) {
        showWarning('El contenido en español es obligatorio', 'Campo requerido')
        setSaving(false)
        return
      }
      if (!postData.category_id) {
        showWarning('Selecciona una categoría', 'Campo requerido')
        setSaving(false)
        return
      }

      const finalPostData = {
        ...postData,
        status: publishNow ? 'published' : postData.status,
        published_at: publishNow ? new Date().toISOString() : postData.published_at,
        author_id: user.id
      }

      let savedPost
      if (isEditing) {
        savedPost = await adminService.updatePost(id, finalPostData)
      } else {
        savedPost = await adminService.createPost(finalPostData)
      }

      // Guardar contenido en ambos idiomas
      for (const [language, content] of Object.entries(contentData)) {
        if (content.title.trim()) { // Solo guardar si hay título
          const contentPayload = {
            post_id: savedPost.id,
            language,
            title: content.title,
            excerpt: content.excerpt,
            content: content.content
          }

          if (isEditing) {
            try {
              await adminService.updatePostContent(savedPost.id, language, contentPayload)
            } catch (error) {
              // Si no existe, crear nuevo
              await adminService.createPostContent(contentPayload)
            }
          } else {
            await adminService.createPostContent(contentPayload)
          }
        }
      }

      if (publishNow) {
        showSuccess('¡Post publicado exitosamente! Los usuarios ya pueden verlo en el blog.', '🎉 ¡Publicado!')

        // Enviar newsletter automáticamente SOLO para posts nuevos
        if (!isEditing) {
          try {
            console.log('📧 PostEditor: Enviando newsletter para post nuevo:', savedPost.id)
            await sendNewsletterAutomatically(savedPost, contentData)
            showSuccess('Newsletter enviado a todos los suscriptores', '📧 Newsletter enviado')
          } catch (newsletterError) {
            console.error('❌ PostEditor: Error enviando newsletter:', newsletterError)
            showWarning('Post publicado correctamente, pero hubo un error enviando el newsletter', 'Newsletter no enviado')
          }
        } else {
          console.log('📝 PostEditor: Post editado - No se envía newsletter')
        }
      } else {
        showSuccess('Post guardado como borrador. Puedes continuar editándolo más tarde.', '💾 Guardado')
      }

      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Error saving post:', error)
      showError(`Error al ${publishNow ? 'publicar' : 'guardar'} el post: ${error.message}`, 'Error de guardado')
    } finally {
      setSaving(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando editor...</p>
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
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Volver
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Editar Post' : 'Nuevo Post'}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Borrador'}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {saving ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-none">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Language Tabs */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setCurrentLanguage('es')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${currentLanguage === 'es'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    🇪🇸 Español
                  </button>
                  <button
                    onClick={() => setCurrentLanguage('en')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${currentLanguage === 'en'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    🇺🇸 English
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {/* Title */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título {currentLanguage === 'es' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    value={contentData[currentLanguage].title}
                    onChange={(e) => handleContentChange(currentLanguage, 'title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder={`Título del post en ${currentLanguage === 'es' ? 'español' : 'inglés'}`}
                  />
                </div>

                {/* Excerpt */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resumen {currentLanguage === 'es' && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    value={contentData[currentLanguage].excerpt}
                    onChange={(e) => handleContentChange(currentLanguage, 'excerpt', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Resumen breve del post en ${currentLanguage === 'es' ? 'español' : 'inglés'}`}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {contentData[currentLanguage].excerpt.length}/500 caracteres
                  </p>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenido {currentLanguage === 'es' && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    value={contentData[currentLanguage].content}
                    onChange={(e) => handleContentChange(currentLanguage, 'content', e.target.value)}
                    rows={25}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-base"
                    placeholder={`Contenido completo del post en ${currentLanguage === 'es' ? 'español' : 'inglés'}. Puedes usar HTML básico.`}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Soporta HTML básico: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;
                  </p>

                  {/* AI Helper Section */}
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">🤖</span>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-blue-800 mb-2">
                          💡 Mejora tu blog con IA
                        </h4>
                        <p className="text-xs text-blue-700 mb-3">
                          Copia este prompt en ChatGPT, Claude o cualquier IA para mejorar tu contenido:
                        </p>
                        <div className="bg-white border border-blue-300 rounded p-3 text-xs font-mono text-gray-800 max-h-32 overflow-y-auto">
                          <div className="select-all">
                            Actúa como un experto editor de contenido técnico y diseñador web. Necesito que mejores este contenido de blog sobre soldadura y electrónica para que sea más atractivo, profesional y fácil de leer.

                            **CONTENIDO ORIGINAL:**
                            **[PEGA AQUÍ TU CONTENIDO]**

                            **INSTRUCCIONES:**
                            1. **Estructura HTML completa**: Convierte el texto a HTML bien estructurado usando:
                            - &lt;h2&gt; y &lt;h3&gt; para títulos y subtítulos
                            - &lt;p&gt; para párrafos bien organizados
                            - &lt;ul&gt; y &lt;li&gt; para listas de puntos importantes
                            - &lt;strong&gt; para destacar conceptos clave
                            - &lt;em&gt; para énfasis sutil
                            - &lt;br&gt; para saltos de línea cuando sea necesario
                            - &lt;div style="text-align: center;"&gt; para centrar texto importante
                            - &lt;p style="text-align: center;"&gt; para párrafos centrados

                            2. **Mejoras de contenido**:
                            - Agrega una introducción atractiva que enganche al lector
                            - Divide el contenido en secciones claras con subtítulos (&lt;h2&gt;, &lt;h3&gt;)
                            - Incluye consejos prácticos y advertencias de seguridad
                            - Agrega una conclusión que resuma los puntos clave
                            - Usa &lt;strong&gt; para destacar información crítica

                            3. **Estilo técnico**:
                            - Usa terminología precisa pero accesible
                            - Incluye especificaciones técnicas cuando sea relevante
                            - Agrega recomendaciones de herramientas o materiales
                            - Menciona errores comunes y cómo evitarlos
                            - Destaca advertencias importantes con &lt;strong&gt; o centrado

                            4. **Formato visual avanzado**:
                            - Usa &lt;ul&gt; y &lt;li&gt; para pasos o componentes
                            - Centra títulos importantes con style="text-align: center;"
                            - Organiza la información de forma escaneada
                            - Usa &lt;br&gt; para espaciado cuando sea necesario
                            - Aplica &lt;em&gt; para notas técnicas sutiles

                            **DEVUELVE:** Solo el HTML mejorado y completo, listo para copiar y pegar en el editor.
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-blue-600">
                            ✨ Copia el prompt completo y pega tu contenido donde dice **[PEGA AQUÍ TU CONTENIDO]**
                          </p>
                          <button
                            onClick={() => {
                              const promptText = document.querySelector('.select-all').textContent;
                              navigator.clipboard.writeText(promptText).then(() => {
                                // Mostrar feedback visual
                                const btn = event.target;
                                const originalText = btn.textContent;
                                btn.textContent = '✅ Copiado!';
                                btn.className = btn.className.replace('text-blue-600', 'text-green-600');
                                setTimeout(() => {
                                  btn.textContent = originalText;
                                  btn.className = btn.className.replace('text-green-600', 'text-blue-600');
                                }, 2000);
                              });
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                          >
                            📋 Copiar Prompt
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuración</h3>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  value={postData.category_id}
                  onChange={(e) => handlePostDataChange('category_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name_es}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={postData.status}
                  onChange={(e) => handlePostDataChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>

              {/* Slug */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">URL (Slug)</label>
                <input
                  type="text"
                  value={postData.slug}
                  onChange={(e) => handlePostDataChange('slug', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="url-del-post"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se genera automáticamente desde el título
                </p>
              </div>

              {/* Featured Image */}
              <div className="mb-6 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-3">Imagen Destacada</label>
                <div className="w-full">
                  <ImageUploader
                    currentImageUrl={postData.featured_image_url}
                    onImageUploaded={async (url) => {
                      handlePostDataChange('featured_image_url', url)
                      // Auto-guardar cuando se elimina la imagen (url vacía)
                      if (url === '' && isEditing) {
                        try {
                          await adminService.updatePost(id, { ...postData, featured_image_url: '' })
                        } catch (error) {
                          console.error('Error auto-saving after image deletion:', error)
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
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
    </div>
  )
}

// Función para enviar newsletter automáticamente
async function sendNewsletterAutomatically(savedPost, contentData) {
  console.log('📧 PostEditor: Enviando newsletter automáticamente', savedPost.id)

  try {
    // Preparar datos del blog para el newsletter
    const newsletterData = {
      blogId: savedPost.id,
      title_es: contentData.es?.title || 'Sin título',
      title_en: contentData.en?.title || contentData.es?.title || 'Sin título',
      excerpt_es: contentData.es?.excerpt || 'Sin resumen',
      excerpt_en: contentData.en?.excerpt || contentData.es?.excerpt || 'Sin resumen',
      slug: savedPost.slug,
      featured_image_url: savedPost.featured_image_url,
      category_es: savedPost.category_name_es,
      category_en: savedPost.category_name_en,
      reading_time: calculateReadingTime(contentData.es?.content || '')
    }

    console.log('📧 PostEditor: Datos del newsletter preparados', newsletterData)

    // Llamar a la API de newsletter
    const response = await fetch('/api/newsletter/send-blog-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsletterData)
    })

    // Verificar si la respuesta es válida
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ PostEditor: Error HTTP en newsletter API:', response.status, errorText)
      throw new Error(`Error ${response.status}: ${errorText || 'Error en la API de newsletter'}`)
    }

    // Verificar si la respuesta tiene contenido JSON válido
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text()
      console.error('❌ PostEditor: Respuesta no es JSON:', responseText.substring(0, 200))
      throw new Error('La API de newsletter no devolvió una respuesta JSON válida')
    }

    let result
    try {
      result = await response.json()
    } catch (jsonError) {
      console.error('❌ PostEditor: Error parseando JSON:', jsonError)
      throw new Error('Error parseando la respuesta de la API de newsletter')
    }

    if (result.success) {
      console.log('✅ PostEditor: Newsletter enviado exitosamente', {
        sent: result.sent,
        subscribers: result.subscribers
      })
    } else {
      console.error('❌ PostEditor: Error en respuesta del newsletter:', result.error)
      throw new Error(result.error || 'Error desconocido enviando newsletter')
    }

  } catch (error) {
    console.error('❌ PostEditor: Error enviando newsletter:', error)
    throw error
  }
}

// Función auxiliar para calcular tiempo de lectura
function calculateReadingTime(content) {
  if (!content) return 5

  // Remover HTML tags y contar palabras
  const plainText = content.replace(/<[^>]*>/g, '')
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length

  // Promedio de 200 palabras por minuto
  const readingTime = Math.ceil(wordCount / 200)

  return Math.max(1, readingTime) // Mínimo 1 minuto
}

export default PostEditor