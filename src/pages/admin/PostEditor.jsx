import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminService, blogService, useAuth } from '../../services/supabase'
import Toast from '../../components/admin/Toast'
import ImageUploader from '../../components/admin/ImageUploader'
import ConfirmLeaveModal from '../../components/admin/ConfirmLeaveModal'
import ImageUrlModal from '../../components/admin/ImageUrlModal'
import DocumentModal from '../../components/admin/DocumentModal'
import BlogPreview from '../../components/admin/BlogPreview'
import ResourcesManager from '../../components/admin/ResourcesManager'
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
  const [dataLoaded, setDataLoaded] = useState(false) // Flag para evitar recargas
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false) // Detectar cambios sin guardar
  const [showLeaveModal, setShowLeaveModal] = useState(false) // Modal de confirmación
  const [showPreview, setShowPreview] = useState(false) // Mostrar vista previa
  const [showImageModal, setShowImageModal] = useState(false) // Modal de insertar imagen
  const [showDocumentModal, setShowDocumentModal] = useState(false) // Modal de insertar documento

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
      // Solo cargar si no se ha cargado antes y el usuario está autenticado
      if (dataLoaded || !user || authLoading) return

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
        
        // Marcar como cargado para evitar recargas
        setDataLoaded(true)
      } catch (error) {
        console.error('Error loading data:', error)
        showError('Error al cargar los datos del editor', 'Error de conexión')
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [user, authLoading, isEditing, id, dataLoaded])

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

  // Advertencia antes de salir si hay cambios sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = '¿Estás seguro? Tienes cambios sin guardar que se perderán.'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasUnsavedChanges])

  // Función para manejar salida con confirmación
  const handleLeaveEditor = () => {
    if (hasUnsavedChanges) {
      setShowLeaveModal(true)
    } else {
      navigate('/admin/dashboard')
    }
  }

  const confirmLeave = () => {
    setShowLeaveModal(false)
    setHasUnsavedChanges(false) // Limpiar flag para evitar advertencia del navegador
    navigate('/admin/dashboard')
  }

  const cancelLeave = () => {
    setShowLeaveModal(false)
  }

  const handlePostDataChange = (field, value) => {
    setPostData(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true) // Marcar cambios sin guardar
  }

  const handleContentChange = (language, field, value) => {
    setContentData(prev => ({
      ...prev,
      [language]: { ...prev[language], [field]: value }
    }))
    setHasUnsavedChanges(true) // Marcar cambios sin guardar
  }

  // Función para insertar HTML en el textarea
  const insertHtmlAtCursor = (htmlBefore, htmlAfter = '', placeholder = 'texto') => {
    const textarea = document.getElementById(`content-${currentLanguage}`)
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = contentData[currentLanguage].content.substring(start, end)
    const textToInsert = selectedText || placeholder

    const newContent = 
      contentData[currentLanguage].content.substring(0, start) +
      htmlBefore + textToInsert + htmlAfter +
      contentData[currentLanguage].content.substring(end)

    handleContentChange(currentLanguage, 'content', newContent)

    // Restaurar el foco y posición del cursor
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + htmlBefore.length + textToInsert.length + htmlAfter.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  // Función para insertar documento en recursos adicionales (AMBOS IDIOMAS)
  const handleInsertDocument = (documentUrl, documentType, content) => {
    // Iconos por tipo
    const icons = {
      pdf: '📄',
      excel: '📊',
      word: '📝',
      zip: '📦',
      image: '🖼️',
      other: '📎'
    }
    const icon = icons[documentType] || '📎'

    // Insertar en AMBOS idiomas
    const languages = ['es', 'en']
    
    languages.forEach(lang => {
      const currentContent = contentData[lang].content
      const resourcesMarker = '<!-- RECURSOS_ADICIONALES -->'
      const title = content[lang].title
      const description = content[lang].description
      
      let newContent = ''
      
      if (currentContent.includes(resourcesMarker)) {
        // Ya existe la sección, agregar el documento a la lista
        const documentItem = `    <li style="margin-bottom: 10px;">
      <a href="${documentUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none; font-weight: 500; display: flex; align-items: start; gap: 8px;">
        <span style="font-size: 20px;">${icon}</span>
        <div>
          <div style="font-size: 15px;">${title}</div>
          ${description ? `<div style="font-size: 13px; color: #6b7280; margin-top: 2px;">${description}</div>` : ''}
        </div>
      </a>
    </li>`
        
        // Insertar antes del cierre de </ul>
        newContent = currentContent.replace('</ul>\n</div>', `${documentItem}\n  </ul>\n</div>`)
      } else {
        // No existe la sección, crearla al final
        const sectionTitle = lang === 'es' ? 'Recursos Adicionales' : 'Additional Resources'
        const resourcesSection = `

${resourcesMarker}
<div style="margin-top: 40px; padding: 20px; background: linear-gradient(to right, #f0f9ff, #e0f2fe); border-radius: 8px; border-left: 3px solid #3b82f6;">
  <h3 style="font-size: 18px; font-weight: bold; color: #1e40af; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
    <span style="font-size: 20px;">📚</span> ${sectionTitle}
  </h3>
  <ul style="list-style: none; padding: 0; margin: 0;">
    <li style="margin-bottom: 10px;">
      <a href="${documentUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none; font-weight: 500; display: flex; align-items: start; gap: 8px;">
        <span style="font-size: 20px;">${icon}</span>
        <div>
          <div style="font-size: 15px;">${title}</div>
          ${description ? `<div style="font-size: 13px; color: #6b7280; margin-top: 2px;">${description}</div>` : ''}
        </div>
      </a>
    </li>
  </ul>
</div>`
        
        newContent = currentContent + resourcesSection
      }

      // Actualizar el contenido del idioma
      handleContentChange(lang, 'content', newContent)
    })

    // Cerrar modal
    setShowDocumentModal(false)

    // Mostrar notificación de éxito
    showSuccess('Documento agregado en español e inglés', '✅ Agregado en ambos idiomas')
  }

  // Función para eliminar un recurso (AMBOS IDIOMAS)
  const handleRemoveResource = (resource) => {
    const languages = ['es', 'en']
    
    languages.forEach(lang => {
      let currentContent = contentData[lang].content
      const resourcesMarker = '<!-- RECURSOS_ADICIONALES -->'
      
      if (!currentContent.includes(resourcesMarker)) return
      
      // Escapar caracteres especiales en la URL para regex
      const escapedUrl = resource.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      
      // Buscar y eliminar el <li> específico por su URL (es único)
      // Usamos un regex más específico que busca desde <li hasta </li> que contenga la URL
      const liRegex = new RegExp(`\\s*<li[^>]*>[\\s\\S]*?href="${escapedUrl}"[\\s\\S]*?<\\/li>\\n?`, 'g')
      const newContent = currentContent.replace(liRegex, '')
      
      // Verificar si quedan más recursos en la sección
      const resourcesSection = newContent.split(resourcesMarker)[1]
      const remainingLis = resourcesSection ? (resourcesSection.match(/<li[^>]*>/g) || []).length : 0
      
      // Si no quedan recursos, eliminar toda la sección
      if (remainingLis === 0) {
        const sectionRegex = new RegExp(`\\n*${resourcesMarker}[\\s\\S]*?<\\/div>`, 'g')
        currentContent = newContent.replace(sectionRegex, '')
      } else {
        currentContent = newContent
      }
      
      // Actualizar el contenido
      handleContentChange(lang, 'content', currentContent)
    })
    
    // Mostrar notificación
    showSuccess('Documento eliminado de ambos idiomas', '🗑️ Eliminado')
  }

  // Función para insertar imagen desde URL
  const handleInsertImage = (imageUrl, altText, alignment, size) => {
    const textarea = document.getElementById(`content-${currentLanguage}`)
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    // Determinar el tamaño máximo según la selección
    const maxWidth = size === 'small' ? '300px' : size === 'medium' ? '500px' : '800px'

    // Generar HTML de la imagen según alineación
    let imageHtml = ''
    
    if (alignment === 'center') {
      // Centro: usar display block y margin auto
      imageHtml = `<p style="text-align: center; margin: 30px 0;">
  <a href="${imageUrl}" target="_blank" rel="noopener noreferrer">
    <img src="${imageUrl}" alt="${altText || 'Imagen'}" style="max-width: ${maxWidth}; height: auto; cursor: pointer; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: inline-block;" />
  </a>
</p>`
    } else if (alignment === 'left') {
      // Izquierda: sin width 100%, se alinea naturalmente
      imageHtml = `<p style="margin: 30px 0;">
  <a href="${imageUrl}" target="_blank" rel="noopener noreferrer">
    <img src="${imageUrl}" alt="${altText || 'Imagen'}" style="max-width: ${maxWidth}; height: auto; cursor: pointer; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: block;" />
  </a>
</p>`
    } else { // right
      // Derecha: usar margin-left auto
      imageHtml = `<p style="margin: 30px 0;">
  <a href="${imageUrl}" target="_blank" rel="noopener noreferrer">
    <img src="${imageUrl}" alt="${altText || 'Imagen'}" style="max-width: ${maxWidth}; height: auto; cursor: pointer; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: block; margin-left: auto;" />
  </a>
</p>`
    }

    const newContent = 
      contentData[currentLanguage].content.substring(0, start) +
      imageHtml +
      contentData[currentLanguage].content.substring(end)

    handleContentChange(currentLanguage, 'content', newContent)

    // Cerrar modal
    setShowImageModal(false)

    // Restaurar el foco
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + imageHtml.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  // Funciones de formato
  const formatButtons = [
    {
      label: 'B',
      title: 'Negrita',
      action: () => insertHtmlAtCursor('<strong>', '</strong>', 'texto en negrita'),
      group: 'text'
    },
    {
      label: 'I',
      title: 'Cursiva',
      action: () => insertHtmlAtCursor('<em>', '</em>', 'texto en cursiva'),
      group: 'text'
    },
    {
      label: 'H2',
      title: 'Título Principal (centrado)',
      action: () => insertHtmlAtCursor('<h2 style="text-align: center; font-weight: bold;">', '</h2>', 'Título Principal'),
      group: 'heading'
    },
    {
      label: 'H3',
      title: 'Subtítulo',
      action: () => insertHtmlAtCursor('<h3 style="font-weight: bold;">', '</h3>', 'Subtítulo'),
      group: 'heading'
    },
    {
      label: 'P',
      title: 'Párrafo',
      action: () => insertHtmlAtCursor('<p>', '</p>', 'Contenido del párrafo'),
      group: 'structure'
    },
    {
      label: '• Lista',
      title: 'Lista con viñetas',
      action: () => insertHtmlAtCursor('<ul>\n  <li>', '</li>\n  <li>Punto 2</li>\n  <li>Punto 3</li>\n</ul>', 'Punto 1'),
      group: 'structure'
    },
    {
      label: 'BR',
      title: 'Salto de línea',
      action: () => insertHtmlAtCursor('<br>\n', '', ''),
      group: 'structure'
    },
    {
      label: '🖼️',
      title: 'Insertar imagen desde URL',
      action: () => setShowImageModal(true),
      group: 'media'
    },
    {
      label: '⬅️➡️',
      title: 'Centrar texto',
      action: () => insertHtmlAtCursor('<p style="text-align: center;">', '</p>', 'Texto centrado'),
      group: 'align'
    },
    {
      label: '⚠️',
      title: 'Texto importante centrado',
      action: () => insertHtmlAtCursor('<p style="text-align: center;"><strong>⚠️ ', '</strong></p>', 'Texto importante'),
      group: 'align'
    }
  ];

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

      // Limpiar flag de cambios sin guardar
      setHasUnsavedChanges(false)

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
                onClick={handleLeaveEditor}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Volver
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Editar Post' : 'Nuevo Post'}
              </h1>
              {hasUnsavedChanges && (
                <span className="ml-3 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  ⚠️ Cambios sin guardar
                </span>
              )}
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
                    onClick={() => {
                      setShowPreview(false)
                      setCurrentLanguage('es')
                    }}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${!showPreview && currentLanguage === 'es'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    🇪🇸 Español
                  </button>
                  <button
                    onClick={() => {
                      setShowPreview(false)
                      setCurrentLanguage('en')
                    }}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${!showPreview && currentLanguage === 'en'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    🇺🇸 English
                  </button>
                  <button
                    onClick={() => setShowPreview(true)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${showPreview
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    👁️ Vista Previa
                  </button>
                </nav>
              </div>

              {/* Contenido de las pestañas */}
              {showPreview ? (
                <BlogPreview 
                  contentData={contentData}
                  postData={postData}
                  categories={categories}
                />
              ) : (
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
                  
                  {/* Barra de Herramientas de Formato */}
                  <div className="mb-2 bg-gray-50 border border-gray-300 rounded-lg p-2">
                    <div className="flex flex-wrap gap-1">
                      {/* Grupo: Formato de Texto */}
                      <div className="flex gap-1 pr-2 border-r border-gray-300">
                        {formatButtons.filter(btn => btn.group === 'text').map((btn, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={btn.action}
                            title={btn.title}
                            className="px-3 py-1 text-sm font-semibold bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 transition-colors"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      {/* Grupo: Títulos */}
                      <div className="flex gap-1 pr-2 border-r border-gray-300">
                        {formatButtons.filter(btn => btn.group === 'heading').map((btn, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={btn.action}
                            title={btn.title}
                            className="px-3 py-1 text-sm font-semibold bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 transition-colors"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      {/* Grupo: Estructura */}
                      <div className="flex gap-1 pr-2 border-r border-gray-300">
                        {formatButtons.filter(btn => btn.group === 'structure').map((btn, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={btn.action}
                            title={btn.title}
                            className="px-3 py-1 text-sm font-medium bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 transition-colors"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      {/* Grupo: Media */}
                      <div className="flex gap-1 pr-2 border-r border-gray-300">
                        {formatButtons.filter(btn => btn.group === 'media').map((btn, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={btn.action}
                            title={btn.title}
                            className="px-3 py-1 text-sm font-medium bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 transition-colors"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      {/* Grupo: Alineación */}
                      <div className="flex gap-1">
                        {formatButtons.filter(btn => btn.group === 'align').map((btn, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={btn.action}
                            title={btn.title}
                            className="px-3 py-1 text-sm font-medium bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 transition-colors"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Selecciona texto y haz clic en un botón para aplicar formato, o haz clic sin seleccionar para insertar
                    </p>
                  </div>

                  <textarea
                    id={`content-${currentLanguage}`}
                    value={contentData[currentLanguage].content}
                    onChange={(e) => handleContentChange(currentLanguage, 'content', e.target.value)}
                    rows={25}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-base"
                    placeholder={`Contenido completo del post en ${currentLanguage === 'es' ? 'español' : 'inglés'}. Usa la barra de herramientas arriba para insertar formato HTML.`}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Soporta HTML básico: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;
                  </p>

                  {/* AI Helper Section */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg shadow-sm">
                    <div className="flex items-start">
                      <span className="text-3xl mr-3">🤖</span>
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-blue-900 mb-2">
                          ✨ Guía de Formato para tu Blog
                        </h4>
                        <p className="text-sm text-blue-800 mb-3 font-medium">
                          Copia este prompt en ChatGPT o Gemini para generar contenido con formato perfecto:
                        </p>
                        <div className="bg-white border-2 border-blue-400 rounded-lg p-4 text-sm font-mono text-gray-800 max-h-64 overflow-y-auto shadow-inner">
                          <div className="select-all whitespace-pre-wrap">
{`Actúa como experto en contenido técnico de soldadura y electrónica. Genera un artículo de blog profesional en ESPAÑOL e INGLÉS siguiendo EXACTAMENTE este formato:

**CONTENIDO A MEJORAR:**
[PEGA AQUÍ TU CONTENIDO]

**FORMATO DE SALIDA REQUERIDO:**

Debes devolver CUATRO secciones (Español e Inglés):

═══════════════════════════════════════
🇪🇸 ESPAÑOL - RESUMEN (máximo 200 caracteres)
═══════════════════════════════════════
[Escribe aquí un resumen breve en TEXTO PLANO, sin HTML, que describa de qué trata el artículo en ESPAÑOL]

═══════════════════════════════════════
🇪🇸 ESPAÑOL - CONTENIDO HTML COMPLETO
═══════════════════════════════════════
[Aquí va todo el HTML del artículo en ESPAÑOL]

═══════════════════════════════════════
🇺🇸 ENGLISH - EXCERPT (max 200 characters)
═══════════════════════════════════════
[Write here a brief summary in PLAIN TEXT, no HTML, describing what the article is about in ENGLISH]

═══════════════════════════════════════
🇺🇸 ENGLISH - FULL HTML CONTENT
═══════════════════════════════════════
[Here goes all the HTML of the article in ENGLISH]

**REGLAS DE FORMATO PARA EL HTML (MUY IMPORTANTE):**

1. TÍTULOS:
   - Título principal: <h2 style="text-align: center; font-weight: bold; margin-bottom: 20px;">Tu Título</h2>
   - Subtítulos: <h3 style="font-weight: bold; margin-top: 30px; margin-bottom: 15px;">Subtítulo</h3>

2. PÁRRAFOS Y ESPACIADO:
   - Usa <p style="margin-bottom: 15px;">texto</p> para cada párrafo
   - SIEMPRE agrega <br> entre secciones importantes
   - Máximo 3-4 líneas por párrafo
   - Deja espacio visual entre cada elemento

3. ÉNFASIS:
   - Negritas: <strong>texto importante</strong>
   - Cursivas: <em>énfasis sutil</em>

4. LISTAS (FORMATO MEJORADO):
   - Usa emojis o símbolos para destacar puntos:
   <ul style="margin: 20px 0; padding-left: 20px;">
     <li style="margin-bottom: 10px;">✓ Punto importante 1</li>
     <li style="margin-bottom: 10px;">✓ Punto importante 2</li>
     <li style="margin-bottom: 10px;">✓ Punto importante 3</li>
   </ul>
   - Alternativamente usa: ✓ ✔️ ⚡ 🔹 • para diferentes tipos de listas

5. CENTRAR TEXTO IMPORTANTE:
   - <p style="text-align: center; margin: 25px 0;"><strong>⚠️ Texto centrado y destacado</strong></p>

6. ESPACIADO CRÍTICO:
   - Usa <br> después de cada sección principal
   - Agrega <br><br> entre bloques de contenido diferentes
   - Ejemplo: </ul><br><br><h3>Siguiente Sección</h3>

7. ESTRUCTURA RECOMENDADA CON ESPACIADO:
   <h2 style="text-align: center; font-weight: bold; margin-bottom: 20px;">Título Principal</h2>
   
   <p style="margin-bottom: 15px;">Introducción atractiva que explica el tema...</p>
   
   <br>
   
   <h3 style="font-weight: bold; margin-top: 30px; margin-bottom: 15px;">Primera Sección</h3>
   
   <p style="margin-bottom: 15px;">Contenido explicativo detallado...</p>
   
   <ul style="margin: 20px 0; padding-left: 20px;">
     <li style="margin-bottom: 10px;">✓ Punto importante 1</li>
     <li style="margin-bottom: 10px;">✓ Punto importante 2</li>
     <li style="margin-bottom: 10px;">✓ Punto importante 3</li>
   </ul>
   
   <br>
   
   <h3 style="font-weight: bold; margin-top: 30px; margin-bottom: 15px;">Segunda Sección</h3>
   
   <p style="margin-bottom: 15px;">Más contenido relevante...</p>
   
   <p style="text-align: center; margin: 25px 0;"><strong>⚠️ Advertencia o nota importante</strong></p>
   
   <br>
   
   <h3 style="font-weight: bold; margin-top: 30px; margin-bottom: 15px;">Conclusión</h3>
   
   <p style="margin-bottom: 15px;">Resumen final con puntos clave...</p>

**MEJORAS DE CONTENIDO:**
- Agrega introducción atractiva
- Divide en secciones claras con buen espaciado
- Incluye consejos prácticos en listas
- Destaca información crítica con símbolos (✓ ⚡ ⚠️)
- Agrega conclusión útil
- Usa terminología técnica precisa
- Menciona errores comunes

**IMPORTANTE:** 
- Genera TODO en ESPAÑOL e INGLÉS
- Los RESÚMENES deben ser texto plano, sin HTML, máximo 200 caracteres cada uno
- Los CONTENIDOS deben tener EXCELENTE ESPACIADO con margins y <br>
- SIEMPRE usa estilos inline (margin-bottom, margin-top) en TODOS los elementos
- Usa símbolos ✓ ✔️ ⚡ 🔹 en las listas para mejor visualización
- Separa claramente las 4 secciones con las líneas de ═══
- La traducción al inglés debe ser profesional y técnicamente precisa`}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-3 gap-2">
                          <p className="text-xs text-blue-700 font-medium">
                            📋 Reemplaza [PEGA AQUÍ TU CONTENIDO] con tu texto. Recibirás TODO en español E inglés.
                          </p>
                          <button
                            onClick={(e) => {
                              const promptText = e.target.closest('.flex-1').querySelector('.select-all').textContent;
                              navigator.clipboard.writeText(promptText).then(() => {
                                const btn = e.target;
                                const originalText = btn.textContent;
                                btn.textContent = '✅ Copiado!';
                                btn.className = 'bg-green-500 text-white px-3 py-1 rounded text-xs font-semibold';
                                setTimeout(() => {
                                  btn.textContent = originalText;
                                  btn.className = 'bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold transition-colors';
                                }, 2000);
                              });
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
                          >
                            📋 Copiar Prompt
                          </button>
                        </div>
                        
                        {/* Ejemplos visuales */}
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
                          <p className="text-xs font-bold text-yellow-900 mb-2">💡 EJEMPLOS DE FORMATO CON ESPACIADO:</p>
                          <div className="space-y-2 text-xs text-yellow-800 font-mono">
                            <div>
                              <strong>Título centrado:</strong><br/>
                              <code className="bg-white px-1">&lt;h2 style="text-align: center; margin-bottom: 20px;"&gt;Título&lt;/h2&gt;</code>
                            </div>
                            <div>
                              <strong>Párrafo con espacio:</strong><br/>
                              <code className="bg-white px-1">&lt;p style="margin-bottom: 15px;"&gt;Texto...&lt;/p&gt;</code>
                            </div>
                            <div>
                              <strong>Lista con símbolos:</strong><br/>
                              <code className="bg-white px-1">&lt;li style="margin-bottom: 10px;"&gt;✓ Punto importante&lt;/li&gt;</code>
                            </div>
                            <div>
                              <strong>Separador entre secciones:</strong><br/>
                              <code className="bg-white px-1">&lt;/ul&gt;&lt;br&gt;&lt;br&gt;&lt;h3&gt;Nueva Sección&lt;/h3&gt;</code>
                            </div>
                          </div>
                        </div>

                        {/* Instrucciones de uso */}
                        <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded">
                          <p className="text-xs font-bold text-green-900 mb-2">📝 CÓMO USAR:</p>
                          <ol className="text-xs text-green-800 space-y-1 list-decimal list-inside">
                            <li>Copia el prompt completo con el botón de arriba</li>
                            <li>Pégalo en ChatGPT o Gemini</li>
                            <li>Reemplaza [PEGA AQUÍ TU CONTENIDO] con tu texto</li>
                            <li>La IA te dará CUATRO secciones separadas (Español e Inglés):</li>
                          </ol>
                          <div className="mt-2 ml-4 text-xs text-green-800 space-y-1">
                            <div className="font-bold mt-2 mb-1">🇪🇸 ESPAÑOL:</div>
                            <div className="flex items-start ml-2">
                              <span className="mr-2">→</span>
                              <span><strong>RESUMEN:</strong> Cópialo en pestaña 🇪🇸 Español, campo "Resumen"</span>
                            </div>
                            <div className="flex items-start ml-2">
                              <span className="mr-2">→</span>
                              <span><strong>CONTENIDO HTML:</strong> Cópialo en pestaña 🇪🇸 Español, campo "Contenido"</span>
                            </div>
                            <div className="font-bold mt-2 mb-1">🇺🇸 ENGLISH:</div>
                            <div className="flex items-start ml-2">
                              <span className="mr-2">→</span>
                              <span><strong>EXCERPT:</strong> Cópialo en pestaña 🇺🇸 English, campo "Resumen"</span>
                            </div>
                            <div className="flex items-start ml-2">
                              <span className="mr-2">→</span>
                              <span><strong>CONTENT HTML:</strong> Cópialo en pestaña 🇺🇸 English, campo "Contenido"</span>
                            </div>
                          </div>
                          <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-900">
                            <strong>💡 Tip:</strong> Cambia entre pestañas 🇪🇸/🇺🇸 arriba para pegar cada versión
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 w-full mb-6">
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

            {/* Resources Manager */}
            <ResourcesManager
              contentData={contentData}
              currentLanguage={currentLanguage}
              onRemoveResource={handleRemoveResource}
              onOpenModal={() => setShowDocumentModal(true)}
            />
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

      {/* Modal de confirmación para salir */}
      <ConfirmLeaveModal
        isOpen={showLeaveModal}
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />

      {/* Modal de insertar imagen */}
      <ImageUrlModal
        isOpen={showImageModal}
        onInsert={handleInsertImage}
        onCancel={() => setShowImageModal(false)}
      />

      {/* Modal de insertar documento */}
      <DocumentModal
        isOpen={showDocumentModal}
        onInsert={handleInsertDocument}
        onCancel={() => setShowDocumentModal(false)}
      />
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