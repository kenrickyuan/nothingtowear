import Image from 'next/image'
import { SpinningLoader } from '../../../sharedUi/spinningLoader'


export const SneakersFilterModal = (
  { showFilterModal,
    handleSetShowFilterModal,
    scrollableDetailsRef,
    areFiltersActive,
    handleFiltersClear,
    searchQuery,
    handleSetSearchQuery,
    filterCanWearInRain,
    toggleFilterCanWearInRain,
    filterSelectedBrands,
    userBrands,
    handleFilterBrandToggle,
    filterSelectedColourIds,
    userColours,
    handleFilterColourToggle,
    handleFilterSneakersClick,
    filterSearchLoading
  }) => { return (
    <>
      {/* Filter sneakers modal overlay */}
      <div className={`${showFilterModal ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0"} fixed z-[60] inset-0 bg-black transition-opacity duration-[400ms]`} onTouchMove={e => e.preventDefault()} onClick={e => {
        e.preventDefault();
        handleSetShowFilterModal(false);
      }}></div>
      {/* Filter sneakers modal */}
      <div className={`${showFilterModal ? "translate-x-0" : "translate-y-full"} fixed z-[60] top-8 bottom-0 left-0 right-0 bg-white rounded-tl-3xl rounded-tr-3xl transition-transform duration-[400ms]`}>
        <button type="button" className='absolute top-4 right-4 flex justify-center items-center p-2' onClick={() => {
          handleSetShowFilterModal(false);
          console.log(scrollableDetailsRef)
          scrollableDetailsRef.current.scrollTop = 0;
        }}>
          <Image unoptimized src="/cross.svg" height={20} width={20} alt="Close modal button" />
        </button>
        <div className='pointer-events-none relative flex flex-col items-center justify-center py-5 px-4 border-b-[1px] border-lightGrey '>
          <button className={`pointer-events-auto absolute left-4 text-xl underline ${!areFiltersActive() && 'hidden'}`} onClick={() => handleFiltersClear()}>Clear</button>
          <h2 className='font-semibold text-2xl text-center overflow-hidden text-ellipsis whitespace-nowrap w-[calc(100vw-1rem)]'>Find Sneakers</h2>
        </div>
        <div className='relative flex p-4 gap-4 border-b border-lightGrey'>
          <input className='grow bg-lighterGrey pl-8' type="text" name="searchQuery" value={searchQuery} onChange={e => handleSetSearchQuery(e.target.value)} />
          <div className='absolute left-6 top-[27px] pointer-events-none flex items-center'>
            <Image unoptimized src="/search.svg" height={20} width={20} alt="Magnifying glass" />
          </div>
          <button type='button' className={`${searchQuery !== "" ? "flex" : "hidden"} absolute items-center right-4 top-4 py-[11px] px-[10px]`}
            onClick={() => handleSetSearchQuery("")}>
            <Image unoptimized src="/cross-cancel.svg" height={20} width={20} alt="Clear search button" />
          </button>
        </div>
        <div className='h-[calc(100vh-256px)] overflow-y-scroll pb-4'>
          <div className='border-b-[1px] border-lightGrey p-4 flex justify-between items-center'>
            <input className="hidden peer" id="wearInRain" type="checkbox" name="wearInRain" checked={filterCanWearInRain} onChange={() => toggleFilterCanWearInRain()} />
            <p className='font-semibold text-xl'>Can Wear</p>
            <label className="relative flex flex-row-reverse items-center gap-2 font-semibold overflow-hidden capitalize before:transition-colors before:peer-checked:bg-[#6c7abb] before:bg-[#97dded] before:border-[#72cce3] before:peer-checked:border-[#5e6baa] before:border-2 before:rounded-full before:w-12 before:h-7 after:content-[''] after:transition-transform after:absolute after:h-5 after:w-5 after:rounded-full after:top-1 after:right-6 after:bg-[#fffba9] peer-checked:after:bg-white after:border-[#f6eb71] peer-checked:after:border-[#e7e8ea] after:border-2 peer-checked:after:translate-x-full" htmlFor="wearInRain">
              {filterCanWearInRain ? "even in the rain" : "on sunny days"}
              <div className={`${filterCanWearInRain ? "translate-x-[8px] translate-y-[0px]" : "translate-x-[8px] translate-y-[-20px]"} absolute right-12 transition-transform duration-100 w-[1px] h-2 bg-white`}></div>
              <div className={`${filterCanWearInRain ? "translate-x-[17px] translate-y-[4px]" : "translate-x-[17px] translate-y-[-20px]"} absolute right-12 transition-transform w-[1px] h-2 bg-white`}></div>
              <div className={`${filterCanWearInRain ? "translate-x-[13px] translate-y-[-6px]" : "translate-x-[13px] translate-y-[-20px]"} absolute right-12 transition-transform duration-250 w-[1px] h-2 bg-white`}></div>
            </label>
          </div>
          <div className='relative overflow-hidden border-b-[1px] border-lightGrey'>
            <input id="accordionBrands" className='hidden peer' type="checkbox" />
            <label htmlFor="accordionBrands" className=''>
              <div className='flex items-center gap-2 p-4'>
                <p className='font-semibold text-xl'>Brands</p>
                {filterSelectedBrands?.length > 0 && (<p className='font-semibold text-lg'>({filterSelectedBrands.length })</p>)}
              </div>
            </label>
            <span className="absolute top-7 right-5 w-5 h-[2px] bg-black"></span>
            <span className="absolute top-7 right-5 w-5 h-[2px] bg-black peer-checked:rotate-0 rotate-90 transition-transform duration-150 ease-linear"></span>
            <div className='max-h-0 peer-checked:max-h-screen transition-maxHeight duration-300 ease-in-out'>
              <ul className='flex flex-wrap justify-evenly p-4 pt-0 gap-3'>
                {userBrands && userBrands.map(brand => (
                  <li key={brand} className='flex'>
                    <input id={`checkbox-${brand}`} className='hidden' type="checkbox" onChange={() => handleFilterBrandToggle(brand)} />
                    <label htmlFor={`checkbox-${brand}`} className={`py-2 px-4 border-2 border-lightGrey rounded-3xl capitalize ${filterSelectedBrands.length > 0 && filterSelectedBrands.includes(brand) && 'border-black bg-black text-white'}`}>{brand}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='relative overflow-hidden border-b-[1px] border-lightGrey'>
            <input id="accordionColours" className='hidden peer' type="checkbox" />
            <label htmlFor="accordionColours" className=''>
              <div className='flex items-center gap-2 p-4'>
                <p className='font-semibold text-xl'>Colours</p>
                {filterSelectedColourIds?.length > 0 && (<p className='font-semibold text-lg'>({filterSelectedColourIds.length})</p>)}
              </div>
            </label>
            <span className="absolute top-7 right-5 w-5 h-[2px] bg-black"></span>
            <span className="absolute top-7 right-5 w-5 h-[2px] bg-black peer-checked:rotate-0 rotate-90 transition-transform duration-300 ease-in-out"></span>
            <div className='max-h-0 peer-checked:max-h-screen transition-maxHeight duration-300 ease-in-out'>
              <ul className='flex flex-wrap justify-evenly p-4 pt-1 gap-3'>
                {userColours && userColours.map(colour => {
                  const { name, hexcode, id } = colour;
                  return (
                    <li key={id} className='flex'>
                      <input id={`checkbox-${name}`} className='hidden' type="checkbox" onChange={() => handleFilterColourToggle(id)} />
                      <label htmlFor={`checkbox-${name}`} className={`flex items-center gap-2 p-2 rounded-3xl border-2 relative ${filterSelectedColourIds.length > 0 && filterSelectedColourIds.includes(id) ? 'border-black' : 'border-lighterGrey'}`}>
                        <span className={`capitalize p-3 rounded-full border-2 border-lighterGrey relative`} style={{ backgroundColor: `#${hexcode}` }}></span>
                        <span className='capitalize' >{name}</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
        <button onClick={() => handleFilterSneakersClick()} className={`${filterSearchLoading && "h-[50px] pointer-events-none"} bg-black flex justify-center items-center text-center text-white absolute left-4 right-4 bottom-4 w-[calc(100%-2rem)] p-4 rounded-[10px] font-semibold text-[18px] leading-[18px]`}>
          {filterSearchLoading ? <SpinningLoader /> : "Find Sneaker"}
        </button>
      </div>
    </>
  )
};