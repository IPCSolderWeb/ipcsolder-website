import { supabase } from './supabase'

export const imageService = {
  /**
   * Procesar imagen: redimensionar y convertir a WebP con alta calidad
   */
  async processImage(file, maxWidth = 1200, quality = 0.92) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        let { width, height } = img
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        // Configurar canvas
        canvas.width = width
        canvas.height = height

        // Dibujar imagen redimensionada con mejor calidad
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        // Convertir a WebP con alta calidad (92%)
        canvas.toBlob(resolve, 'image/webp', quality)
      }

      img.src = URL.createObjectURL(file)
    })
  },

  /**
   * Subir imagen a Supabase Storage
   */
  async uploadImage(file, folder = 'posts', originalFileName = null) {
    try {
      // Generar nombre único con extensión WebP
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 8)
      
      // Usar el nombre original si se proporciona, sino generar uno genérico
      let baseName = 'image'
      if (originalFileName) {
        baseName = originalFileName.split('.')[0]
      } else if (file.name) {
        baseName = file.name.split('.')[0]
      }
      
      const fileName = `${folder}/${timestamp}_${randomString}_${baseName}.webp`

      // Subir archivo
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file)

      if (error) throw error

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)

      return {
        success: true,
        url: publicUrl,
        path: fileName,
        size: file.size
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Eliminar imagen de Supabase Storage
   */
  async deleteImage(path) {
    try {
      const { error } = await supabase.storage
        .from('blog-images')
        .remove([path])

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error deleting image:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Obtener información de la imagen
   */
  getImageInfo(file) {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({
          name: file.name,
          size: file.size,
          width: img.width,
          height: img.height,
          type: file.type,
          sizeFormatted: this.formatFileSize(file.size)
        })
      }
      img.src = URL.createObjectURL(file)
    })
  },

  /**
   * Formatear tamaño de archivo
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

export default imageService