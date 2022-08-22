import Image from 'next/image'

export const EditSneakerColorsModal = ({ showEditColoursModal, handleSetShowEditColoursModal, stockXSneakerData, selectedSneakerColours, handleRemoveSelectedColour, handleAddSelectedColour, userColours, handleSetShowCreateUserColourModal, handleSaveSneakerColoursClick }) => {
  return (
    <>
      {/* Sneaker colour edit modal overlay */}
      <div className={`${showEditColoursModal ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0"} fixed z-[70] inset-0 bg-black transition-opacity duration-[400ms]`} onClick={e => {
        e.preventDefault()
        handleSetShowEditColoursModal(false)
      }}></div>
      {/* Sneaker colour edit modal */}
      <div className={`${showEditColoursModal ? "translate-x-0" : "translate-y-full"} fixed z-[70] top-16 bottom-0 left-0 right-0 bg-white rounded-tl-3xl rounded-tr-3xl transition-transform duration-[400ms]`}>
        <button type="button" className='absolute top-4 right-4 flex justify-center items-center p-2' onClick={e => {
          e.preventDefault()
          handleSetShowEditColoursModal(false)
        }}>
          <Image unoptimized src="/cross.svg" height={20} width={20} alt="Close modal button" />
        </button>
        <div className="w-full h-32 mt-4 relative pointer-events-none">
          <Image unoptimized src={stockXSneakerData?.thumbnail || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt={stockXSneakerData?.stockXSneakerData?.shoeName} layout="fill" objectFit="contain" />
        </div>
        <div className='h-[calc(100vh-13rem)] overflow-y-scroll pb-[182px] border-t-[1px] border-lightGrey'>
          <div className='p-4'>
            <p className='font-semibold mb-2'>Selected</p>
            <div className='grid grid-cols-2 gap-y-4 min-h-[40px]'>
              {selectedSneakerColours.length === 0 ? (
                <p className='col-span-2 text-grey m-auto mx-0'>No selected colours yet.</p>
              ) : (
                selectedSneakerColours.map(colour => (
                  <button key={colour.id} className='flex items-center pointer-events-none' onClick={() => handleRemoveSelectedColour(colour)}>
                    <div className='w-10 h-10 rounded-full mr-4 border-2 border-black pointer-events-auto' style={{ backgroundColor: `#${colour.hexcode}` }}></div>
                    <p className='pointer-events-auto capitalize font-semibold'>{colour.name}</p>
                  </button>
                ))
              )}
            </div>
          </div>
          <div className='border-t-[1px] border-lightGrey p-4'>
            <div className='grid grid-cols-2 gap-y-4'>
              {userColours?.filter(userColour => selectedSneakerColours.every(selectedColour => selectedColour.id !== userColour.id)).sort((a, b) => a.name.localeCompare(b.name)).map(colour => (
                <button type="button" key={colour.id} className='flex items-center pointer-events-none' onClick={() => handleAddSelectedColour(colour)}>
                  <div className='pointer-events-auto w-10 h-10 rounded-full mr-4 border-[1px] border-lightGrey' style={{ backgroundColor: `#${colour.hexcode}` }}></div>
                  <p className='pointer-events-auto capitalize'>{colour.name}</p>
                </button>
              ))}
              <button type="button" className='relative w-10 h-10 bg-lightGrey rounded-full flex items-center justify-center pointer-events-none col-span-2' onClick={() => handleSetShowCreateUserColourModal(true)}>
                <Image unoptimized className='pointer-events-auto' src="/plus.svg" height={20} width={20} alt="Add more colours" />
                <p className='absolute left-full ml-2 whitespace-nowrap text-grey pointer-events-auto'>Create a new colour</p>
              </button>
            </div>
          </div>
        </div>
        <button className={`bg-black text-center text-white absolute left-4 right-4 bottom-4 w-[calc(100%-2rem)] p-4 rounded-[10px] font-semibold text-[18px] leading-[18px]`} type="button" onClick={() => handleSaveSneakerColoursClick()}>
          Save Colours
        </button>
      </div>
    </>
  )
};