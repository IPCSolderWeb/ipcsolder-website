import React, { useState, useEffect } from 'react'
import { blogService } from '../../services/supabase'

const BlogTest = () => {
  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔄 Testing Supabase connection...')
        
        // Probar obtener categorías
        const categoriesData = await blogService.getCategories()
        setCategories(categoriesData)
        console.log('✅ Categories loaded:', categoriesData)

        // Probar obtener posts
        const postsData = await blogService.getPublishedPosts(1, 5, null, 'es')
        setPosts(postsData.posts)
        console.log('✅ Posts loaded:', postsData)

        setLoading(false)
      } catch (err) {
        console.error('❌ Supabase connection error:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  if (loading) {
    return (
      <div className="p-8 bg-blue-50 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">🔄 Testing Supabase Connection...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 rounded-lg border border-red-200">
        <h2 className="text-2xl font-bold text-red-900 mb-4">❌ Connection Error</h2>
        <p className="text-red-700 mb-4">{error}</p>
        <div className="text-sm text-red-600">
          <p>Check:</p>
          <ul className="list-disc list-inside mt-2">
            <li>VITE_SUPABASE_URL is set correctly</li>
            <li>VITE_SUPABASE_ANON_KEY is set correctly</li>
            <li>Supabase project is active</li>
            <li>RLS policies are configured</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-green-50 rounded-lg border border-green-200">
      <h2 className="text-2xl font-bold text-green-900 mb-6">✅ Supabase Connected Successfully!</h2>
      
      {/* Categories Test */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-3">Categories ({categories.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {categories.map(category => (
            <div key={category.id} className="bg-white p-3 rounded border">
              <div className="font-medium text-blue-900">{category.name_es}</div>
              <div className="text-sm text-gray-600">{category.slug}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Posts Test */}
      <div>
        <h3 className="text-lg font-semibold text-green-800 mb-3">Posts ({posts.length})</h3>
        {posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="bg-white p-4 rounded border">
                <div className="font-medium text-blue-900">
                  {post.post_contents?.[0]?.title || 'No title'}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {post.post_contents?.[0]?.excerpt || 'No excerpt'}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Status: {post.status} | Slug: {post.slug}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
            <p className="text-yellow-800">No published posts found. Create some test posts in Supabase!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogTest