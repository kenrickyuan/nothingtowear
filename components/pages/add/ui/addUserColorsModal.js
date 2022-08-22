import Image from 'next/image'
import { HexColorPicker, HexColorInput } from "react-colorful";
import { SpinningLoader } from '../../../sharedUi/spinningLoader'

export const AddUserColorsModal = ({ showCreateUserColourModal, closeAddUserColorsModal, stockXSneakerData, newColourHex, handleSetNewColourHex, newColourName, handleColourNameInputKeyDown, handleSetNewColourName, addUserColourLoading, handleAddNewUserColourClick }) => {
  return (
    <>
      {/* modal overlay */}
      <div className={`${showCreateUserColourModal ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0"} fixed z-[80] inset-0 bg-black transition-opacity duration-[400ms]`} onClick={() => closeAddUserColorsModal()}></div>
      {/* modal */}
      <div className={`${showCreateUserColourModal ? "translate-x-0" : "translate-y-full"} fixed z-[80] top-24 bottom-0 left-0 right-0 bg-white rounded-tl-3xl rounded-tr-3xl transition-transform duration-[400ms]`}>
        <button type="button" className='absolute top-4 right-4 flex justify-center items-center p-2' onClick={() => closeAddUserColorsModal()}>
          <Image unoptimized src="/cross.svg" height={20} width={20} alt="Close modal button" />
        </button>
        <div className="w-full h-32 mt-4 relative pointer-events-none">
          <Image unoptimized src={stockXSneakerData?.thumbnail || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt={stockXSneakerData?.stockXSneakerData?.shoeName} layout="fill" objectFit="contain" />
        </div>
        <div className='border-t-[1px] border-lightGrey p-4 h-[calc(100vh-15rem)] overflow-y-scroll pb-[82px]'>
          <HexColorPicker color={newColourHex} onChange={handleSetNewColourHex} />
          <div className='flex items-center justify-center gap-4 mt-4'>
            <div className='rounded-full w-10 h-10 border-2 border-lightGrey' style={{ backgroundColor: newColourHex }}></div>
            <div className='relative before:content-["#"] before:absolute before:top-[9px] before:left-2'>
              <HexColorInput className='text-center w-[10ch] uppercase' color={newColourHex} onChange={handleSetNewColourHex} />
            </div>
          </div>
          <input className='mx-auto block mt-4' type="text" placeholder='*Name your colour' onKeyDown={e => handleColourNameInputKeyDown(e)} value={newColourName} onChange={e => handleSetNewColourName(e.target.value)} />
        </div>
        <button disabled={newColourName === "" || addUserColourLoading} className={`${addUserColourLoading && "flex justify-center items-center h-[50px]"} disabled:opacity-20 bg-black text-center text-white absolute left-4 right-4 bottom-4 w-[calc(100%-2rem)] p-4 rounded-[10px] font-semibold text-[18px] leading-[18px]`} type="button" onClick={e => handleAddNewUserColourClick(e)}>
          {addUserColourLoading ? <SpinningLoader /> : "Add Colour"}
        </button>
      </div>
    </>
  )
};