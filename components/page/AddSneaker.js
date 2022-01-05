import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { searchSneakers, supabase, addSneakerToDb, addUserSneaker, addUserColour, getUserColours } from '../../utils';
import { HexColorPicker, HexColorInput } from "react-colorful";
import { useUI } from "../../hooks"
import { SpinningLoader } from "../ui/spinningLoader"

export default function AddSneaker({ session }) {
  const { openErrorModal, closeErrorModal, displayErrorModal } = useUI()
  const [sneakerQuery, setSneakerQuery] = useState('')
  const [stockXSneakersList, setStockXSneakersList] = useState([])
  const [sneakerToAddData, setSneakerToAddData] = useState({})
  const { stockXSneakerData } = sneakerToAddData
  const [showAddSneakerModal, setShowAddSneakerModal] = useState(false)
  const [showEditColoursModal, setShowEditColoursModal] = useState(false)
  const [showCreateUserColourModal, setShowCreateUserColourModal] = useState(false)
  const [addSneakerModalStep, setAddSneakerModalStep] = useState("")
  const [loading, setLoading] = useState(false)
  const [addToDbLoading, setAddToDbLoading] = useState(false)
  const [addUserColourLoading, setAddUserColourLoading] = useState(false)
  const [newColourHex, setNewColourHex] = useState("#397273");
  const [newColourName, setNewColourName] = useState("");
  const searchInputRef = useRef(null)
  const [userColours, setUserColours] = useState([]);
  const [selectedSneakerColours, setSelectedSneakerColours] = useState([])

  const handleSearchSubmit = async e => {
    console.log('search submitted')
    e.preventDefault()
    searchInputRef.current.blur()
    window.scrollTo(0, 0)
    setStockXSneakersList([])
    setLoading(true)
    const result = await searchSneakers(sneakerQuery)
    console.log(result)
    setStockXSneakersList(result)
    setLoading(false)
  }

  const handleStockXSneakerClick = async (stockXSneakerData) => {
    // if the saved state's sneaker is different to the clicked one
    if (stockXSneakerData?._id !== sneakerToAddData?.stockXSneakerData?._id) {
      // setSneakerToAddData
      setSneakerToAddData({stockXSneakerData})
      // open SneakerToAddModal
      setAddSneakerModalStep("")
    }
    setShowAddSneakerModal(true)
  }

  const handleAddSneakerToDbClick = async (e) => {
    e.preventDefault();
    setAddToDbLoading(true);
    await addSneakerToDb({ sneakerToAddData, setSneakerToAddData, setAddSneakerModalStep })
    setAddToDbLoading(false);
  }

  const handleFormSubmit = async e => {
    e.preventDefault()
    if (addSneakerModalStep === "details") {
      setAddToDbLoading(true);
      await addUserSneaker({ sneakerToAddData, setAddSneakerModalStep, profileId: session.user.id, openErrorModal });
      setShowAddSneakerModal(false)
      setAddToDbLoading(false);
      setTimeout(() => {
        console.log('resetting data')
        setSneakerToAddData({})
        setAddSneakerModalStep("")
        setSelectedSneakerColours([])
      }, 1000)
    } else {
      handleAddSneakerToDbClick(e)
    }
  }

  const handleAddNewUserColourClick = async (e) => {
    e.preventDefault()
    setAddUserColourLoading(true)
    await addUserColour({ newColourHex, setNewColourHex, newColourName, setNewColourName, openErrorModal, setShowCreateUserColourModal, userColours, setUserColours, profileId: session.user.id })
    setAddUserColourLoading(false)
  }

  const handleColourNameInputKeyDown = e => {
    switch (e.keyCode) {
      case 8:  // Backspace
      case 9:  // Tab
      case 13: // Enter
      case 37: // Left
      case 38: // Up
      case 39: // Right
      case 40: // Down
        break;
      default:
        const regex = /^[a-zA-Z\s]*$/;
        const key = e.key;
        if (!regex.test(key)) {
          console.log('invalid key!')
          e.preventDefault();
          return false;
        }
        break;
    }
  }

  const handleAddSelectedColour = (colour) => {
    setSelectedSneakerColours([...selectedSneakerColours, colour])
  }

  const handleRemoveSelectedColour = (colour) => {
    setSelectedSneakerColours(selectedSneakerColours.filter(selectedColour => selectedColour.id !== colour.id))
  }

  const handleSaveSneakerColoursClick = () => {
    setSneakerToAddData({...sneakerToAddData, sneakerColours: selectedSneakerColours})
    setShowEditColoursModal(false)
  }
  
  useEffect(() => {
    (async () => {
      const fetchedUserColours = await getUserColours()
      setUserColours(fetchedUserColours)
    })();
  }, [])

  useEffect(() => {
    console.log(userColours)
  }, [userColours])

  return (
    <div className='mt-[79px]'>
      <div className={`${loading ? "flex" : "hidden"} fixed inset-0 justify-center items-center bg-black opacity-50 z-40`}>
        <div className="flex justify-center items-center">
          <SpinningLoader big />
        </div>
      </div>
      <header className='fixed top-0 left-0 right-0 z-10 bg-white'>
        <form className='flex p-4 gap-4 border-b border-lightGrey' onSubmit={e => handleSearchSubmit(e)}>
          <input autoFocus ref={searchInputRef} className='grow bg-lighterGrey pl-8' type="text" name="sneakerQuery" value={sneakerQuery} onChange={e => setSneakerQuery(e.target.value)}>
          </input>
          <div className='absolute left-6 top-[27px] pointer-events-none flex items-center'>
            <Image src="/search.svg" height={20} width={20} alt="Magnifying glass" />
          </div>
          <button type='button' className={`${sneakerQuery !== "" ? "flex" : "hidden"} absolute items-center right-4 top-4 py-[11px] px-[10px]`} 
            onClick={e => {
              console.log('clear button clicked')
              e.preventDefault();
              setSneakerQuery("");
              setStockXSneakersList([]);
              searchInputRef.current.focus()
            }
          }>
            <Image src="/cross-cancel.svg" height={20} width={20} alt="Clear search button" />
          </button>
        </form>
      </header>

      {/* Sneaker to add modal overlay */}
      <div className={`${showAddSneakerModal ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0"} fixed z-[60] inset-0 bg-black transition-opacity duration-[400ms]`} onClick={e => {
        e.preventDefault()
        setShowAddSneakerModal(false)
      }}></div>
      {/* Sneaker to add modal */}
      <div className={`${showAddSneakerModal ? "translate-x-0" : "translate-y-full"} fixed z-[60] top-8 bottom-0 left-0 right-0 bg-white rounded-tl-3xl rounded-tr-3xl transition-transform duration-[400ms]`}>
        <button type="button" className='absolute top-4 right-4 flex justify-center items-center p-2' onClick={e => {
          e.preventDefault()
          setShowAddSneakerModal(false)
        }}>
          <Image src="/cross.svg" height={20} width={20} alt="Close modal button" />
        </button>
        <div className="w-full h-32 mt-4 relative pointer-events-none">
          <Image src={stockXSneakerData?.thumbnail || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt={stockXSneakerData?.stockXSneakerData?.shoeName} layout="fill" objectFit="contain" />
        </div>
        <div className='flex flex-col items-center justify-center pb-6 px-4'>
          <h4 className='text-grey text-lg text-center'>{stockXSneakerData?.silhoutte}</h4>
          <h3 className='font-semibold text-xl text-center'>{stockXSneakerData?.shoeName.replace(stockXSneakerData?.silhoutte, "").trim()}</h3>
        </div>
        <div className='h-[calc(100vh-256px)] overflow-y-scroll pb-[82px]'>
          {addSneakerModalStep === "" ? (
            <>
              <div className='border-t-[1px] border-lightGrey p-4'>
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
              <div className='border-t-[1px] border-lightGrey p-4'>
                <p className='text-grey text-xs'>Nickname</p>
                <input className='w-full mt-2 font-semibold' type="text" name="name" value={sneakerToAddData.customName} onChange={e => setSneakerToAddData({ ...sneakerToAddData, customName: e.target.value })} />
              </div>
              <div className='border-t-[1px] border-lightGrey p-4'>
                <p className='text-grey text-xs'>Location Notes</p>
                <textarea className='w-full mt-2 font-semibold' rows="2" name="location" value={sneakerToAddData.location || ""} onChange={e => setSneakerToAddData({ ...sneakerToAddData, location: e.target.value })} ></textarea>
              </div>
              <div className='border-t-[1px] border-lightGrey p-4'>
                <p className='text-grey text-xs'>Can Wear</p>
                <input className="hidden peer" id="wearInRain" type="checkbox" name="wearInRain" checked={sneakerToAddData.wearInRain} onChange={e => setSneakerToAddData({ ...sneakerToAddData, wearInRain: !sneakerToAddData.wearInRain })} />
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
                    <button type='button' className='relative w-[30px] h-[30px] m-auto bg-lightGrey rounded-full flex items-center justify-center pointer-events-none' onClick={() => setShowEditColoursModal(true)}>
                    <Image className='pointer-events-auto' src="/pencil.svg" height={14} width={14} alt="Edit colours" />
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
            ) : null }
        </div>
        <button className={`${addSneakerModalStep === "exists" ? "hidden" : ""} ${addToDbLoading && "h-[50px] pointer-events-none"} bg-black flex justify-center items-center text-center text-white absolute left-4 right-4 bottom-4 w-[calc(100%-2rem)] p-4 rounded-[10px] font-semibold text-[18px] leading-[18px]`} type="button" onClick={e => handleFormSubmit(e)}>
          {addToDbLoading ? <SpinningLoader /> : addSneakerModalStep === "" ? "Add To Collection" : "Save"}
        </button>
      </div>
      {/* Sneaker colour edit modal overlay */}
      <div className={`${showEditColoursModal ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0"} fixed z-[70] inset-0 bg-black transition-opacity duration-[400ms]`} onClick={e => {
        e.preventDefault()
        setShowEditColoursModal(false)
      }}></div>
      {/* Sneaker colour edit modal */}
      <div className={`${showEditColoursModal ? "translate-x-0" : "translate-y-full"} fixed z-[70] top-16 bottom-0 left-0 right-0 bg-white rounded-tl-3xl rounded-tr-3xl transition-transform duration-[400ms]`}>
        <button type="button" className='absolute top-4 right-4 flex justify-center items-center p-2' onClick={e => {
          e.preventDefault()
          setShowEditColoursModal(false)
        }}>
          <Image src="/cross.svg" height={20} width={20} alt="Close modal button" />
        </button>
        <div className="w-full h-32 mt-4 relative pointer-events-none">
          <Image src={stockXSneakerData?.thumbnail || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt={stockXSneakerData?.stockXSneakerData?.shoeName} layout="fill" objectFit="contain" />
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
                  <div className='pointer-events-auto w-10 h-10 rounded-full mr-4 border-[1px] border-lightGrey' style={{backgroundColor:`#${colour.hexcode}`}}></div>
                  <p className='pointer-events-auto capitalize'>{colour.name}</p>
                </button>
              ))}
              <button type="button" className='relative w-10 h-10 bg-lightGrey rounded-full flex items-center justify-center pointer-events-none col-span-2' onClick={() => setShowCreateUserColourModal(true)}>
                <Image className='pointer-events-auto' src="/plus.svg" height={20} width={20} alt="Add more colours" />
                <p className='absolute left-full ml-2 whitespace-nowrap text-grey pointer-events-auto'>Create a new colour</p>
              </button>
            </div>
          </div>
        </div>
        <button className={`bg-black text-center text-white absolute left-4 right-4 bottom-4 w-[calc(100%-2rem)] p-4 rounded-[10px] font-semibold text-[18px] leading-[18px]`} type="button" onClick={() => handleSaveSneakerColoursClick()}>
          Save Colours
        </button>
      </div>
      
      {/* Sneaker colour edit modal overlay */}
      <div className={`${showCreateUserColourModal ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0"} fixed z-[80] inset-0 bg-black transition-opacity duration-[400ms]`} onClick={e => {
        e.preventDefault()
        setShowCreateUserColourModal(false)
        setNewColourHex("#397273")
        setNewColourName("")
      }}></div>
      {/* Sneaker colour edit modal */}
      <div className={`${showCreateUserColourModal ? "translate-x-0" : "translate-y-full"} fixed z-[80] top-24 bottom-0 left-0 right-0 bg-white rounded-tl-3xl rounded-tr-3xl transition-transform duration-[400ms]`}>
        <button type="button" className='absolute top-4 right-4 flex justify-center items-center p-2' onClick={e => {
          e.preventDefault()
          setShowCreateUserColourModal(false)
          setNewColourHex("#397273")
          setNewColourName("")
        }}>
          <Image src="/cross.svg" height={20} width={20} alt="Close modal button" />
        </button>
        <div className="w-full h-32 mt-4 relative pointer-events-none">
          <Image src={stockXSneakerData?.thumbnail || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt={stockXSneakerData?.stockXSneakerData?.shoeName} layout="fill" objectFit="contain" />
        </div>
        <div className='border-t-[1px] border-lightGrey p-4 h-[calc(100vh-15rem)] overflow-y-scroll pb-[82px]'>
          <HexColorPicker color={newColourHex} onChange={setNewColourHex} />
          <div className='flex items-center justify-center gap-4 mt-4'>
            <div className='rounded-full w-10 h-10 border-2 border-lightGrey' style={{backgroundColor: newColourHex}}></div>
            <div className='relative before:content-["#"] before:absolute before:top-[9px] before:left-2'>
              <HexColorInput className='text-center w-[10ch] uppercase' color={newColourHex} onChange={setNewColourHex} />
            </div>
          </div>
          <input className='mx-auto block mt-4' type="text" placeholder='*Name your colour' onKeyDown={e => handleColourNameInputKeyDown(e)} value={newColourName} onChange={e => setNewColourName(e.target.value)}></input>
        </div>
        <button disabled={newColourName === ""} className={`${addUserColourLoading && "flex justify-center items-center h-[50px]"} disabled:opacity-20 bg-black text-center text-white absolute left-4 right-4 bottom-4 w-[calc(100%-2rem)] p-4 rounded-[10px] font-semibold text-[18px] leading-[18px]`} type="button" onClick={e => handleAddNewUserColourClick(e)}>
          {addUserColourLoading ? <SpinningLoader /> : "Add Colour"}
        </button>
      </div>

      <ul>
        {stockXSneakersList?.map(stockXSneaker => (
          <li key={stockXSneaker._id} className='grid grid-cols-[7rem_1fr] p-4 gap-4 border-b border-lightGrey' onClick={() => handleStockXSneakerClick(stockXSneaker)}>
            <div className="w-full h-16 relative">
              <Image src={stockXSneaker.thumbnail || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt={stockXSneaker.shoeName} layout="fill" objectFit="contain"/>
            </div>
            <div className='flex flex-col justify-center w-[calc(100vw-10rem)]'>
              <p className='text-grey text-sm w-full overflow-hidden whitespace-nowrap text-ellipsis'>{stockXSneaker.silhoutte}</p>
              <p className='font-semibold'>{stockXSneaker.shoeName.replace(stockXSneaker.silhoutte, "").trim()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}