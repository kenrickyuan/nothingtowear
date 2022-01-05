import { useState, useEffect } from 'react'
import { supabase } from '../../utils'
export default function Reset({ session, accessToken }) {

  const [statusMessage, setStatusMessage] = useState("nothing yet")
  const [newPassword, setNewPassword] = useState("")

  useEffect(() => {
    console.log(accessToken)
  }, [])

  async function updatePassword() {
    try {
      setStatusMessage("about to update password")

      const { error, data } = await supabase.auth.api
        .updateUser(accessToken, { password: newPassword })

      if (error) {
        throw error
      }
      console.log(data)
    } catch (error) {
      alert(error.message)
    } finally {
      setStatusMessage("update password successful!")
    }
  }

  return (
    <div className="flex flex-col">
      <p>
      {statusMessage}
      </p>
      <input autoFocus className='bg-lighterGrey pl-8' type="text" name="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} ></input>
      <button className='button' onClick={() => updatePassword()}>submit!</button>
    </div>
  )
}
