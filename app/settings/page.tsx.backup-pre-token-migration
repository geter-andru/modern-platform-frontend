import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Account Settings</h2>
            <p className="text-gray-600 mt-1">Manage your account preferences</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input
                type="text"
                value={user.id}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 font-mono text-sm"
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-500">
              🚧 Additional settings coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
