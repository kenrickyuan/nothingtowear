import { useState, useEffect } from 'react'
import { supabase } from '../../utils'

export default function AccountStats({ userId }) {
  const [stats, setStats] = useState({
    sneakerCount: 0,
    colorCount: 0,
    brandCount: 0,
    loading: true
  })

  useEffect(() => {
    if (userId) {
      fetchStats()
    }
  }, [userId])

  async function fetchStats() {
    try {
      // Get sneaker count
      const { data: sneakers, error: sneakerError } = await supabase
        .from('user_sneakers')
        .select('id')
        .eq('profile_id', userId)

      // Get color count
      const { data: colors, error: colorError } = await supabase
        .from('user_colours')
        .select('id')
        .eq('profile_id', userId)

      // Get unique brands from user's sneakers
      const { data: brands, error: brandError } = await supabase
        .from('user_sneakers')
        .select(`
          sneaker_model:sneaker_models!inner(
            sneaker_silhouette:sneaker_silhouettes!inner(
              brand:brands!inner(name)
            )
          )
        `)
        .eq('profile_id', userId)

      const uniqueBrands = brands ? new Set(brands.map(item => 
        item.sneaker_model?.sneaker_silhouette?.brand?.name
      ).filter(Boolean)).size : 0

      setStats({
        sneakerCount: sneakers?.length || 0,
        colorCount: colors?.length || 0,
        brandCount: uniqueBrands,
        loading: false
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      setStats(prev => ({ ...prev, loading: false }))
    }
  }

  if (stats.loading) {
    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i, index) => (
          <div key={i} className="bg-white border border-lightGrey rounded-lg p-4 transform transition-all hover:scale-105 hover:shadow-lg hover:bg-lighterGrey">
            {/* Icon skeleton */}
            <div 
              className="text-2xl mb-1 w-8 h-8 bg-lightGrey rounded animate-shimmer"
              style={{ animationDelay: `${index * 0.1}s` }}
            ></div>
            {/* Value skeleton */}
            <div 
              className="text-2xl font-bold mb-0 w-8 h-8 bg-lightGrey rounded animate-shimmer"
              style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
            ></div>
            {/* Label skeleton */}
            <div 
              className="text-xs opacity-80 w-12 h-3 bg-lightGrey rounded animate-shimmer"
              style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
            ></div>
          </div>
        ))}
      </div>
    )
  }

  const statItems = [
    { label: 'Sneakers', value: stats.sneakerCount, icon: '👟' },
    { label: 'Colors', value: stats.colorCount, icon: '🎨' },
    { label: 'Brands', value: stats.brandCount, icon: '🏷️' }
  ]

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {statItems.map((stat, index) => (
        <div 
          key={stat.label}
          className="bg-white border border-lightGrey text-black rounded-lg p-4 transform transition-all hover:scale-105 hover:shadow-lg hover:bg-lighterGrey"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="text-2xl mb-1">{stat.icon}</div>
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="text-xs opacity-80">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}