import { createClient } from '@/lib/supabase/server'

export default async function DebugSession() {
  const supabase = await createClient()
  
  // Get user from server-side
  const { data: { user }, error } = await supabase.auth.getUser()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Server-side User:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Server-side Session:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Error:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    </div>
  )
}