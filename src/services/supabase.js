import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Funciones de utilidad para el blog
export const blogService = {
  // Obtener todas las categorías
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name_es')

    if (error) throw error
    return data || []
  },

  // Obtener posts publicados con paginación
  async getPublishedPosts(page = 1, limit = 6, categorySlug = null, language = 'es') {
    let query = supabase
      .from('posts')
      .select(`
        *,
        post_contents!inner(*),
        categories(*),
        post_tags(tags(*))
      `, { count: 'exact' })
      .eq('status', 'published')
      .eq('post_contents.language', language)

    // Filtrar por categoría si se especifica
    if (categorySlug) {
      console.log('Filtering by category:', categorySlug)
      // Primero obtener el ID de la categoría por su slug
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single()

      if (categoryError) throw categoryError
      if (categoryData) {
        console.log('Category ID found:', categoryData.id)
        query = query.eq('category_id', categoryData.id)
      }
    }

    query = query.order('published_at', { ascending: false })

    // Paginación
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      .limit(limit)

    if (error) throw error

    return {
      posts: data || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  },

  // Obtener un post por slug
  async getPostBySlug(slug, language = 'es') {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_contents!inner(*),
        categories(*),
        post_tags(tags(*))
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('post_contents.language', language)
      .single()

    if (error) throw error
    return data
  },

  // Obtener posts relacionados
  async getRelatedPosts(categoryId, currentPostId, language = 'es', limit = 3) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_contents!inner(*),
        categories(*)
      `)
      .eq('status', 'published')
      .eq('category_id', categoryId)
      .eq('post_contents.language', language)
      .neq('id', currentPostId)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  // Buscar posts
  async searchPosts(searchTerm, language = 'es', limit = 10) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_contents!inner(*),
        categories(*)
      `)
      .eq('status', 'published')
      .eq('post_contents.language', language)
      .or(`post_contents.title.ilike.%${searchTerm}%,post_contents.excerpt.ilike.%${searchTerm}%`)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }
}

// Funciones para el admin (requieren autenticación)
export const adminService = {
  // Autenticación
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // CRUD de posts
  async createPost(postData) {
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updatePost(id, postData) {
    const { data, error } = await supabase
      .from('posts')
      .update(postData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deletePost(id) {
    try {
      // 1. Obtener el post para verificar si tiene imagen destacada
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('featured_image_url')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // 2. Si tiene imagen destacada, eliminarla del bucket
      if (post?.featured_image_url) {
        try {
          const imageUrl = post.featured_image_url
          
          // Extraer el path del archivo desde la URL - manejo más robusto
          let filePath = null
          
          // Intentar diferentes formatos de URL de Supabase
          if (imageUrl.includes('/storage/v1/object/public/blog-images/')) {
            const urlParts = imageUrl.split('/storage/v1/object/public/blog-images/')
            if (urlParts.length > 1) {
              filePath = decodeURIComponent(urlParts[1])
            }
          } else if (imageUrl.includes('/blog-images/')) {
            // Formato alternativo
            const urlParts = imageUrl.split('/blog-images/')
            if (urlParts.length > 1) {
              filePath = decodeURIComponent(urlParts[1])
            }
          }
          
          if (filePath) {
            // Importar imageService dinámicamente para evitar dependencias circulares
            const { default: imageService } = await import('../services/imageService')
            
            // Eliminar del bucket de Supabase
            const deleteResult = await imageService.deleteImage(filePath)
            
            if (deleteResult.success) {
              console.log('✅ Imagen eliminada del bucket:', filePath)
            } else {
              console.warn('⚠️ No se pudo eliminar la imagen del bucket:', deleteResult.error)
              // Continuamos con la eliminación del post aunque falle la imagen
            }
          } else {
            console.warn('⚠️ No se pudo extraer el path de la URL:', imageUrl)
          }
        } catch (imageError) {
          console.warn('⚠️ Error eliminando imagen del bucket:', imageError)
          // Continuamos con la eliminación del post aunque falle la imagen
        }
      }

      // 3. Eliminar el post de la base de datos
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      console.log('✅ Post eliminado completamente (BD + imagen)')
      
    } catch (error) {
      console.error('❌ Error eliminando post:', error)
      throw error
    }
  },

  // CRUD de contenido de posts
  async createPostContent(contentData) {
    const { data, error } = await supabase
      .from('post_contents')
      .insert(contentData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updatePostContent(postId, language, contentData) {
    const { data, error } = await supabase
      .from('post_contents')
      .update(contentData)
      .eq('post_id', postId)
      .eq('language', language)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Obtener todos los posts para admin con paginación
  async getAllPosts(page = 1, limit = 25) {
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_contents(title, excerpt, language),
        categories(name_es, name_en)
      `)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error
    return data || []
  },

  // Obtener un post específico para edición (con todos los campos)
  async getPostForEdit(id) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_contents(*),
        categories(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Obtener conteo total de posts para paginación
  async getPostsCount() {
    const { count, error } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  }
}

// Hook para verificar autenticación
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Obtener sesión actual
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        if (mounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error getting session:', error)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    getSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, []) // Array de dependencias vacío - solo ejecutar una vez

  return { user, loading }
}