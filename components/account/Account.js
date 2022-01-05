import { useState, useEffect } from 'react'
import { supabase } from '../../utils'
import Avatar from './Avatar'

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [statusMessage, setStatusMessage] = useState("nothing yet")
  const [newPassword, setNewPassword] = useState("")

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
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updatePassword() {
    try {
      setStatusMessage("about to update password")
      const { user, error } = await supabase.auth.update({ password: newPassword })

      if (error) {
        throw error
      }
      console.log(user)
    } catch (error) {
      alert(error.message)
    } finally {
      setStatusMessage("update password successful!")
    }
  }

  return (
    <div className="flex flex-col">
      <Avatar
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url)
          updateProfile({ username, avatar_url: url })
        }}
      />
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button block primary"
          onClick={() => updateProfile({ username, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button className="button block" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>

      <p>
        {statusMessage}
      </p>
      <input autoFocus className='bg-lighterGrey pl-8' type="text" name="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} ></input>
      <button className='button' onClick={() => updatePassword()}>submit!</button>

    </div>
  )
}
