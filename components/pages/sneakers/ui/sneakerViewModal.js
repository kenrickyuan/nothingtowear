import Image from 'next/image'
import { SpinningLoader } from '../../../sharedUi/spinningLoader'


export const SneakerViewModal = ({ showDetailsModal, handleSetShowDetailsModal, scrollableDetailsRef, activeSneaker, handleDeleteSneaker, deleteSneakerLoading }) => {
  return (
    <>
      {/* Sneaker view modal overlay */}
      <div className={`${showDetailsModal ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0"} fixed z-[60] inset-0 bg-black transition-opacity duration-[400ms]`} onTouchMove={e => e.preventDefault()} onClick={e => {
        e.preventDefault();
        handleSetShowDetailsModal(false);
      }}></div>
      {/* Sneaker view modal */}
      <div className={`${showDetailsModal ? "translate-x-0" : "translate-y-full"} fixed z-[60] top-8 bottom-0 left-0 right-0 bg-white rounded-tl-3xl rounded-tr-3xl transition-transform duration-[400ms]`}>
        <button type="button" className='absolute top-4 right-4 flex justify-center items-center p-2' onClick={e => {
          e.preventDefault();
          handleSetShowDetailsModal(false);
          scrollableDetailsRef.current.scrollTop = 0;
        }}>
          <Image unoptimized src="/cross.svg" height={20} width={20} alt="Close modal button" />
        </button>
        <div className="w-full h-32 mt-4 relative pointer-events-none">
          <Image unoptimized src={activeSneaker?.publicThumbnailUrl || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt={activeSneaker?.sneaker_models?.name} layout="fill" objectFit="contain" />
        </div>
        <div className='flex flex-col items-center justify-center pb-6 px-4 border-b-[1px] border-lightGrey'>
          <h4 className='text-grey text-lg text-center capitalize'>{activeSneaker?.sneaker_models?.sneaker_silhouettes?.name}</h4>
          <h3 className='font-semibold text-xl text-center overflow-hidden text-ellipsis whitespace-nowrap w-[calc(100vw-1rem)]'>{activeSneaker?.sneaker_models?.colourway_name}</h3>
        </div>
        <div ref={scrollableDetailsRef} className='h-[calc(100vh-256px)] overflow-y-scroll pb-4'>
          <div className='p-4'>
            <p className='text-grey text-xs'>Nickname</p>
            <p className='font-semibold capitalize'>{activeSneaker?.custom_name}</p>
          </div>
          <div className='border-t-[1px] border-lightGrey p-4'>
            <p className='text-grey text-xs'>Location Notes</p>
            <p className='font-semibold capitalize'>{activeSneaker?.location || "No location notes"}</p>
          </div>
          <div className='border-t-[1px] border-lightGrey p-4'>
            <p className='text-grey text-xs'>Can Wear</p>
            <input className="hidden peer" id="wearInRain" type="checkbox" name="wearInRain" checked={activeSneaker.wear_in_rain} onChange={e => e.preventDefault()} />
            <label className="relative flex items-center gap-2 mt-2 font-semibold overflow-hidden capitalize before:transition-colors before:peer-checked:bg-[#6c7abb] before:bg-[#97dded] before:border-[#72cce3] before:peer-checked:border-[#5e6baa] before:border-2 before:rounded-full before:w-12 before:h-7 after:content-[''] after:transition-transform after:absolute after:h-5 after:w-5 after:rounded-full after:top-1 after:left-1 after:bg-[#fffba9] peer-checked:after:bg-white after:border-[#f6eb71] peer-checked:after:border-[#e7e8ea] after:border-2 peer-checked:after:translate-x-full" htmlFor="wearInRain">
              {activeSneaker.wear_in_rain ? "Even in the rain" : "Only on sunny days"}
              <div className={`${activeSneaker.wear_in_rain ? "translate-x-[8px] translate-y-[0px]" : "translate-x-[8px] translate-y-[-20px]"} absolute left-0 transition-transform duration-100 w-[1px] h-2 bg-white`}></div>
              <div className={`${activeSneaker.wear_in_rain ? "translate-x-[17px] translate-y-[4px]" : "translate-x-[17px] translate-y-[-20px]"} absolute left-0 transition-transform w-[1px] h-2 bg-white`}></div>
              <div className={`${activeSneaker.wear_in_rain ? "translate-x-[13px] translate-y-[-6px]" : "translate-x-[13px] translate-y-[-20px]"} absolute left-0 transition-transform duration-250 w-[1px] h-2 bg-white`}></div>
            </label>
          </div>
          <div className='border-t-[1px] border-lightGrey p-4'>
            <p className='text-grey text-xs'>Colours</p>
            <div className='grid grid-cols-[repeat(8,30px)] justify-between mt-2'>
              {activeSneaker.colourData?.length === 0 ? 
                <p className='font-semibold col-span-8'>No colours yet</p> :
                activeSneaker.colourData?.map(({ user_colours }) => (
                <div key={user_colours.id} className='w-[30px] h-[30px] m-auto rounded-full border-[1px] border-lightGrey' style={{ backgroundColor: `#${user_colours.hexcode}` }}></div>
              ))}
            </div>
          </div>
          <div className='border-t-[1px] border-lightGrey p-4'>
            <p className='text-grey text-xs'>Brand</p>
            <p className='font-semibold capitalize'>{activeSneaker?.sneaker_models?.sneaker_silhouettes?.brands?.name}</p>
          </div>
          <div className='border-t-[1px] border-lightGrey p-4'>
            <p className='text-grey text-xs'>Colourway</p>
            <p className='font-semibold'>{activeSneaker?.sneaker_models?.colourway || "N/A"}</p>
          </div>
          <div className='border-t-[1px] border-lightGrey p-4'>
            <p className='text-grey text-xs'>SKU</p>
            <p className='font-semibold'>{activeSneaker?.sneaker_models?.sku || "N/A"}</p>
          </div>
          <div className='border-t-[1px] border-lightGrey p-4'>
            <p className='text-grey text-xs'>Release Date</p>
            <p className='font-semibold'>{activeSneaker?.sneaker_models?.release_date || "N/A"}</p>
          </div>
          <button disabled={deleteSneakerLoading} className={`flex justify-center items-center text-center bg-deleteRed h-[50px] text-white w-[calc(100%-2rem)] mx-auto m-4 p-4 rounded-[10px] font-semibold text-[18px] leading-[18px]`} type="button" onClick={() => handleDeleteSneaker()}>
            {deleteSneakerLoading ? <SpinningLoader /> : "Delete Sneaker"}
          </button>
        </div>
      </div>
    </>
  )
};