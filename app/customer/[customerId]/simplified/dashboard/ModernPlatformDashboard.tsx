'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import ModernSidebarLayout from '@/src/shared/components/layout/ModernSidebarLayout'
import { SystematicScalingDashboard } from '@/src/features/dashboard'
import { SystematicScalingProvider } from '@/src/shared/contexts/SystematicScalingContext'

export default function ModernPlatformDashboard() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const customerId = params.customerId as string
      const token = searchParams.get('token')

      try {
        // Check if this is a Supabase OAuth user
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!error && session?.user) {
          console.log('✅ Modern Platform - Supabase OAuth user detected:', {
            userId: session.user.id,
            email: session.user.email,
            customerId
          })

          // Store authentication state
          document.cookie = `hs_access_token=${token || 'supabase-session'}; expires=${new Date(Date.now() + 24*60*60*1000).toUTCString()}; path=/`;
          document.cookie = `hs_customer_id=${customerId}; expires=${new Date(Date.now() + 7*24*60*60*1000).toUTCString()}; path=/`;
          
          setUserData({
            id: customerId,
            supabaseId: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email,
            isSupabaseUser: true,
            authToken: token
          })
          setIsAuthenticated(true)
        } else if (customerId && token) {
          console.log('🔄 Modern Platform - Legacy token authentication:', { customerId, hasToken: !!token })
          
          // Legacy authentication flow
          document.cookie = `hs_access_token=${token}; expires=${new Date(Date.now() + 24*60*60*1000).toUTCString()}; path=/`;
          document.cookie = `hs_customer_id=${customerId}; expires=${new Date(Date.now() + 7*24*60*60*1000).toUTCString()}; path=/`;
          
          setUserData({
            id: customerId,
            authToken: token,
            isSupabaseUser: false
          })
          setIsAuthenticated(true)
        } else {
          console.log('❌ Modern Platform - No valid authentication found')
          router.push('/login?redirectTo=' + encodeURIComponent(`/customer/${customerId}/simplified/dashboard`))
          return
        }
      } catch (error) {
        console.error('Authentication initialization failed:', error)
        router.push('/login?error=auth_failed')
        return
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [params.customerId, searchParams, router])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h1 className="text-xl font-semibold text-gray-200 mb-2">Initializing Revenue Intelligence Platform</h1>
          <p className="text-gray-400">Loading your professional dashboard...</p>
          <div className="mt-4">
            <div className="w-8 h-8 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  // Authentication failed
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-xl font-semibold text-red-400 mb-2">Authentication Required</h1>
          <p className="text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Success - render the enhanced systematic scaling dashboard
  return (
    <SystematicScalingProvider customerId={userData?.id || ''}>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {/* Success notification for OAuth users */}
        {userData?.isSupabaseUser && (
          <div className="bg-green-900/20 border-b border-green-800/50 p-3">
            <div className="container mx-auto text-center">
              <span className="text-green-400 text-sm">
                ✅ OAuth Authentication Successful - Systematic Revenue Scaling Mode Active
              </span>
            </div>
          </div>
        )}
        
        <ModernSidebarLayout customerId={userData?.id || ''} activeRoute="dashboard">
          <SystematicScalingDashboard 
            customerId={userData?.id || ''} 
            customerData={{
              ...userData,
              currentARR: userData?.id === 'dru78DR9789SDF862' ? '$3M' : '$2M',
              targetARR: '$10M',
              teamSize: userData?.id === 'dru78DR9789SDF862' ? 25 : 15,
              authToken: userData?.authToken
            }}
          />
        </ModernSidebarLayout>
      </div>
    </SystematicScalingProvider>
  )
}