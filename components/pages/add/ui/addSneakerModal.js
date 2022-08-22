import Image from 'next/image'
import { SpinningLoader } from '../../../sharedUi/spinningLoader'


export const AddSneakerModal = ({ showAddSneakerModal, handleSetShowAddSneakerModal, stockXSneakerData, addSneakerModalStep, sneakerToAddData, handleSetSneakerToAddData, handleSetShowEditColoursModal, addToDbLoading, handleFormSubmit }) => {
  return (
    <>
      {/* Sneaker to add modal overlay */}
      <div className={`${showAddSneakerModal ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0"} fixed z-[60] inset-0 bg-black transition-opacity duration-[400ms]`} onClick={e => {
        e.preventDefault()
        handleSetShowAddSneakerModal(false)
      }}></div>
      {/* Sneaker to add modal */}
      <div className={`${showAddSneakerModal ? "translate-x-0" : "translate-y-full"} fixed z-[60] top-8 bottom-0 left-0 right-0 bg-white rounded-tl-3xl rounded-tr-3xl transition-transform duration-[400ms]`}>
        <button type="button" className='absolute top-4 right-4 flex justify-center items-center p-2' onClick={() => handleSetShowAddSneakerModal(false)}>
          <Image unoptimized src="/cross.svg" height={20} width={20} alt="Close modal button" />
        </button>
        <div className="w-full h-32 mt-4 relative pointer-events-none">
          <Image unoptimized src={stockXSneakerData?.thumbnail || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt={stockXSneakerData?.stockXSneakerData?.shoeName} layout="fill" objectFit="contain" />
        </div>
        <div className='flex flex-col items-center justify-center pb-6 px-4 border-b-[1px] border-lightGrey'>
          <h4 className='text-grey text-lg text-center'>{stockXSneakerData?.silhoutte}</h4>
          <h3 className='font-semibold text-xl text-center'>{stockXSneakerData?.shoeName.replace(stockXSneakerData?.silhoutte, "").trim()}</h3>
        </div>
        <div className='h-[calc(100vh-256px)] overflow-y-scroll pb-[82px]'>
          {addSneakerModalStep === "" ? (
            <>
              <div className='p-4'>
                <p className='text-grey text-xs'>Brand</p>
                <p className='font-semibold'>{stockXSneakerData?.brand}</p>
              </div>
              <div className='border-t-[1px] border-lightGrey p-4'>
                <p className='text-grey text-xs'>Colourway</p>
                <p className='font-semibold'>{stockXSneakerData?.colorway}</p>
              </div>
              <div className='border-t-[1px] border-lightGrey p-4'>
                <p className='text-grey text-xs'>SKU</p>
                <p className='font-semibold'>{stockXSneakerData?.styleID}</p>
              </div>
              <div className='border-t-[1px] border-lightGrey p-4'>
                <p className='text-grey text-xs'>Release Date</p>
                <p className='font-semibold'>{stockXSneakerData?.releaseDate || "N/A"}</p>
              </div>
            </>
          ) : addSneakerModalStep === "details" ? (
            <>
              <div className='p-4'>
                <p className='text-grey text-xs'>Nickname</p>
                <input className='w-full mt-2 font-semibold' type="text" name="name" value={sneakerToAddData.customName} onChange={e => handleSetSneakerToAddData({ customName: e.target.value })} />
              </div>
              <div className='border-t-[1px] border-lightGrey p-4'>
                <p className='text-grey text-xs'>Location Notes</p>
                <textarea className='w-full mt-2 font-semibold' rows="2" name="location" value={sneakerToAddData.location || ""} onChange={e => handleSetSneakerToAddData({ location: e.target.value })} ></textarea>
              </div>
              <div className='border-t-[1px] border-lightGrey p-4'>
                <p className='text-grey text-xs'>Can Wear</p>
                <input className="hidden peer" id="wearInRain" type="checkbox" name="wearInRain" checked={sneakerToAddData.wearInRain} onChange={e => handleSetSneakerToAddData({ wearInRain: !sneakerToAddData.wearInRain })} />
                <label className="relative flex items-center gap-2 mt-2 font-semibold overflow-hidden capitalize before:transition-colors before:peer-checked:bg-[#6c7abb] before:bg-[#97dded] before:border-[#72cce3] before:peer-checked:border-[#5e6baa] before:border-2 before:rounded-full before:w-12 before:h-7 after:content-[''] after:transition-transform after:absolute after:h-5 after:w-5 after:rounded-full after:top-1 after:left-1 after:bg-[#fffba9] peer-checked:after:bg-white after:border-[#f6eb71] peer-checked:after:border-[#e7e8ea] after:border-2 peer-checked:after:translate-x-full" htmlFor="wearInRain">
                  {sneakerToAddData.wearInRain ? "Even in the rain" : "Only on sunny days"}
                  <div className={`${sneakerToAddData.wearInRain ? "translate-x-[8px] translate-y-[0px]" : "translate-x-[8px] translate-y-[-20px]"} absolute left-0 transition-transform duration-100 w-[1px] h-2 bg-white`}></div>
                  <div className={`${sneakerToAddData.wearInRain ? "translate-x-[17px] translate-y-[4px]" : "translate-x-[17px] translate-y-[-20px]"} absolute left-0 transition-transform w-[1px] h-2 bg-white`}></div>
                  <div className={`${sneakerToAddData.wearInRain ? "translate-x-[13px] translate-y-[-6px]" : "translate-x-[13px] translate-y-[-20px]"} absolute left-0 transition-transform duration-250 w-[1px] h-2 bg-white`}></div>
                </label>
              </div>
              <div className='border-t-[1px] border-lightGrey p-4'>
                <p className='text-grey text-xs'>Colours</p>
                <div className='grid grid-cols-[repeat(8,30px)] justify-between mt-2'>
                  {sneakerToAddData?.sneakerColours?.map(colour => (
                    <div key={colour.id} className='w-[30px] h-[30px] m-auto rounded-full border-[1px] border-lightGrey' style={{ backgroundColor: `#${colour.hexcode}` }}></div>
                  ))}
                  <button type='button' className='relative w-[30px] h-[30px] m-auto bg-lightGrey rounded-full flex items-center justify-center pointer-events-none' onClick={() => handleSetShowEditColoursModal(true)}>
                    <Image unoptimized className='pointer-events-auto' src="/pencil.svg" height={14} width={14} alt="Edit colours" />
                    {(!sneakerToAddData?.sneakerColours || sneakerToAddData?.sneakerColours?.length === 0) && (
                      <p className='absolute left-full ml-2 whitespace-nowrap text-grey pointer-events-auto'>Add colours</p>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : addSneakerModalStep === "exists" ? (
            <div className='w-full h-full flex items-center justify-center'>
              <h1 className='text-xl text-center font-semibold'>You already have this sneaker!</h1>
            </div>
          ) : null}
        </div>
        <button disabled={addToDbLoading} className={`${addSneakerModalStep === "exists" ? "hidden" : ""} ${addToDbLoading && "h-[50px] pointer-events-none"} bg-black flex justify-center items-center text-center text-white absolute left-4 right-4 bottom-4 w-[calc(100%-2rem)] p-4 rounded-[10px] font-semibold text-[18px] leading-[18px]`} type="button" onClick={e => handleFormSubmit(e)}>
          {addToDbLoading ? <SpinningLoader /> : addSneakerModalStep === "" ? "Add To Collection" : "Save"}
        </button>
      </div>
    </>
  )
};