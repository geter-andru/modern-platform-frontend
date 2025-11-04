import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen p-8" style={{ background: 'var(--background-primary)' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="heading-2 text-text-primary mb-6">Settings</h1>

        <div className="rounded-lg shadow p-6" style={{ background: 'var(--surface)' }}>
          <div className="border-b pb-4 mb-4">
            <h2 className="heading-3 text-text-primary">Account Settings</h2>
            <p className="body text-text-muted mt-1">Manage your account preferences</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block form-label text-text-primary mb-1">Email</label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full px-3 py-2 border rounded-md text-text-muted"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--background-secondary)' }}
              />
            </div>

            <div>
              <label className="block form-label text-text-primary mb-1">User ID</label>
              <input
                type="text"
                value={user.id}
                disabled
                className="w-full px-3 py-2 border rounded-md text-text-muted font-mono body-small"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--background-secondary)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
