'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { IntegratedICPTool } from '@/src/features/icp-analysis'

export default function ICPAnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Supabase-only authentication
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!error && session?.user) {
          console.log('✅ ICP Analysis - Supabase user authenticated:', {
            userId: session.user.id,
            email: session.user.email
          })

          setUserData({
            id: session.user.id,
            supabaseId: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email,
            isSupabaseUser: true
          })
          setIsAuthenticated(true)
        } else {
          console.log('❌ ICP Analysis - No Supabase session found')
          router.push('/login?redirectTo=' + encodeURIComponent(`/customer/${params.customerId}/simplified/icp`))
          return
        }
      } catch (error) {
        console.error('ICP Authentication initialization failed:', error)
        router.push('/login?error=auth_failed')
        return
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [router])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <h1 className="text-xl font-semibold text-gray-200 mb-2">Loading ICP Analysis Tool</h1>
          <p className="text-gray-400">Initializing customer profiling system...</p>
          <div className="mt-4">
            <div className="w-8 h-8 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
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

  // Success - render the ICP Analysis tool
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Success notification for OAuth users */}
      {userData?.isSupabaseUser && (
        <div className="bg-purple-900/20 border-b border-purple-800/50 p-3">
          <div className="container mx-auto text-center">
            <span className="text-purple-400 text-sm">
              ✅ OAuth Authentication Active - ICP Analysis Tool Unlocked
            </span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🎯 Ideal Customer Profile Analysis
            </h1>
            <p className="text-gray-300 text-lg">
              AI-powered customer intelligence and market research platform
            </p>
            <div className="mt-4 text-sm text-gray-400">
              Customer: {userData?.email} | ID: {userData?.id?.slice(0, 12)}...
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/30 rounded-lg p-6">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Customer Intelligence</h3>
              <p className="text-gray-300">Advanced profiling with machine learning insights</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/30 rounded-lg p-6">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Market Research</h3>
              <p className="text-gray-300">Real-time competitive intelligence and market analysis</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30 rounded-lg p-6">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-white mb-2">Revenue Impact</h3>
              <p className="text-gray-300">Predictive revenue modeling and opportunity scoring</p>
            </div>

            <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border border-orange-700/30 rounded-lg p-6">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-white mb-2">Buyer Personas</h3>
              <p className="text-gray-300">Detailed psychological profiles and empathy mapping</p>
            </div>

            <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-700/30 rounded-lg p-6">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">Technical Translation</h3>
              <p className="text-gray-300">Convert complex features into business value</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 border border-indigo-700/30 rounded-lg p-6">
              <div className="text-3xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-white mb-2">Stakeholder Arsenal</h3>
              <p className="text-gray-300">Executive briefings and decision-maker resources</p>
            </div>
          </div>

          {/* Integrated ICP Tool */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl border border-gray-700/50 p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                🎯 Complete ICP Intelligence Platform
              </h2>
              <p className="text-gray-300">
                Generate customer profiles, create rating frameworks, and access all revenue intelligence tools
              </p>
            </div>

            {/* Import the integrated tool */}
            <IntegratedICPTool 
              customerId={userData?.id || ''}
            />
          </div>

          {/* Quick Actions */}
          <div className="text-center mt-8 space-y-4">
            <div className="space-x-4">
              <button 
                onClick={() => router.push(`/simplified/dashboard`)}
                className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200"
              >
                📊 Back to Dashboard
              </button>
            </div>
            
            <p className="text-gray-400 text-sm">
              H&S Revenue Intelligence Platform • Enterprise Customer Profiling System
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}