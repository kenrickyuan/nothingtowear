import { useUI } from "../../hooks"
import Image from 'next/image'

export const ErrorModal = () => {
  const { closeErrorModal, displayErrorModal, errorModalMessage } = useUI()
  return (
    <>
      <div className={`${displayErrorModal ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0"} fixed  z-[999] inset-0 bg-black transition-opacity duration-[400ms]`} onClick={e => {
        e.preventDefault()
        closeErrorModal()
      }}>
      </div>
      <div className={`fixed flex items-center justify-center z-[999] inset-0 pointer-events-none`}>
        <div className={`${displayErrorModal ? "scale-100 pointer-events-auto" : "scale-0 pointer-events-none"} transition-transform duration-[400ms] relative flex items-center justify-center bg-white rounded-3xl p-4 w-[min(75vw,300px)] min-h-[min(75vw,300px)]`}>
          <button type="button" className='absolute top-4 right-4 flex justify-center items-center p-2' onClick={e => {
            e.preventDefault()
            closeErrorModal()
          }}>
            <Image src="/cross.svg" height={20} width={20} alt="Close modal button" />
          </button>
          <p>{errorModalMessage}</p> 
        </div>
      </div>
    </>
  )
}