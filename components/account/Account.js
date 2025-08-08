import { useState, useEffect } from 'react'
import { supabase } from '../../utils'
import Avatar from './Avatar'
import AccountStats from './AccountStats'

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [statusMessage, setStatusMessage] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }
  

  async function updateProfile({ username, avatar_url }) {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        username,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
      
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updatePassword() {
    try {
      setStatusMessage("Updating password...")
      const { user, error } = await supabase.auth.update({ password: newPassword })

      if (error) {
        throw error
      }
      setStatusMessage("Password updated successfully!")
      setNewPassword("")
      setTimeout(() => {
        setStatusMessage("")
        setShowPasswordSection(false)
      }, 3000)
    } catch (error) {
      setStatusMessage("Error: " + error.message)
      setTimeout(() => setStatusMessage(""), 5000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-xl p-8 text-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
        <div className="relative z-10">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <Avatar
              url={avatar_url}
              size={120}
              onUpload={(url) => {
                setAvatarUrl(url)
                updateProfile({ username, avatar_url: url })
              }}
            />
          </div>
          <div className="flex-grow">
            <h1 className="text-3xl font-bold mb-1">
              {username || 'Sneakerhead'}
            </h1>
            <p className="text-grey">{session.user.email}</p>
            <p className="text-sm text-grey/70 mt-2">Member since {new Date(session.user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        </div>
      </div>

      {/* Stats Section */}
      <AccountStats userId={session.user.id} />

      {/* Profile Settings Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-lightGrey">
          <h2 className="text-xl font-semibold flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile Information
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-grey mb-1">Email Address</label>
              <input 
                id="email" 
                type="text" 
                value={session.user.email} 
                disabled 
                className="w-full border border-lightGrey rounded-lg px-4 py-3 bg-lighterGrey cursor-not-allowed opacity-60"
              />
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-grey mb-1">Display Name</label>
              <input
                id="username"
                type="text"
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-lightGrey rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                placeholder="Enter your display name"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              className={`flex-1 button py-3 rounded-lg transition-all transform hover:scale-105 ${
                profileSaved 
                  ? 'bg-green text-white' 
                  : 'bg-black text-white hover:bg-grey'
              }`}
              onClick={() => updateProfile({ username, avatar_url })}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Updating...
                </span>
              ) : profileSaved ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Security Settings Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={() => setShowPasswordSection(!showPasswordSection)}
          className="w-full p-6 border-b border-lightGrey hover:bg-lighterGrey transition-colors flex items-center justify-between"
        >
          <h2 className="text-xl font-semibold flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Security Settings
          </h2>
          <svg 
            className={`w-5 h-5 transform transition-transform ${showPasswordSection ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className={`transition-all duration-300 ${showPasswordSection ? 'max-h-96' : 'max-h-0'} overflow-hidden`}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-grey mb-1">New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)}
                className="w-full border border-lightGrey rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                placeholder="Enter new password"
                onKeyPress={(e) => e.key === 'Enter' && newPassword && updatePassword()}
              />
            </div>
            
            {statusMessage && (
              <div className={`p-3 rounded-lg text-sm font-medium animate-fade-in ${
                statusMessage.includes('success') 
                  ? 'bg-green/10 text-green border border-green/20' 
                  : statusMessage.includes('Error')
                  ? 'bg-deleteRed/10 text-deleteRed border border-deleteRed/20'
                  : 'bg-lighterGrey text-grey'
              }`}>
                {statusMessage}
              </div>
            )}
            
            <button 
              className="w-full button bg-black text-white py-3 rounded-lg hover:bg-grey transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => updatePassword()}
              disabled={!newPassword || statusMessage.includes('Updating')}
            >
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-deleteRed/20">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-deleteRed mb-4">Danger Zone</h2>
          <p className="text-grey text-sm mb-4">Once you sign out, you&apos;ll need to sign in again to access your collection.</p>
          <button 
            className="w-full button bg-white text-deleteRed border-2 border-deleteRed py-3 rounded-lg hover:bg-deleteRed hover:text-white transition-all transform hover:scale-105"
            onClick={() => {
              if (confirm('Are you sure you want to sign out?')) {
                supabase.auth.signOut()
              }
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
