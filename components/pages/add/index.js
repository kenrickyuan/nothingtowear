import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { searchSneakers, addSneakerToDb, addUserSneaker, addUserColour, getUserColours } from '../../../utils';
import { useUI } from "../../../hooks"
import { SpinningLoader } from "../../sharedUi/spinningLoader"
import { AddSneakerModal } from './ui/addSneakerModal'
import { EditSneakerColorsModal } from './ui/editSneakerColorsModal'
import { AddUserColorsModal } from './ui/addUserColorsModal'

export default function AddSneaker({ session }) {
  const { openErrorModal } = useUI()
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
  

  const handleSetShowAddSneakerModal = toggle => {
    setShowAddSneakerModal(toggle);
  }

  const handleSetSneakerToAddData = newData => {
    setSneakerToAddData({ ...sneakerToAddData, ...newData });
  }

  const handleSetShowEditColoursModal = toggle => {
    setShowEditColoursModal(toggle);
  }

  const handleSetShowCreateUserColourModal = toggle => {
    setShowCreateUserColourModal(toggle);
  }
  const handleSearchSubmit = async e => {
    e.preventDefault()
    searchInputRef.current.blur()
    window.scrollTo(0, 0)
    setStockXSneakersList([])
    setLoading(true)
    const result = await searchSneakers(sneakerQuery)
    setStockXSneakersList(result)
    setLoading(false)
  }

  const handleStockXSneakerClick = async (stockXSneakerData) => {
    // if the saved state's sneaker is different to the clicked one
    if (stockXSneakerData?._id !== sneakerToAddData?.stockXSneakerData?._id) {
      // setSneakerToAddData
      setSneakerToAddData({ stockXSneakerData })
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
        setSneakerToAddData({})
        setAddSneakerModalStep("")
        setSelectedSneakerColours([])
      }, 1000)
    } else {
      handleAddSneakerToDbClick(e)
    }
  }

  const closeAddUserColorsModal = () => {
    setShowCreateUserColourModal(false);
    setNewColourHex("#397273");
    setNewColourName("");
  }

  const handleSetNewColourName = name => {
    setNewColourName(name);
  }
  const handleSetNewColourHex = (hex) => {
    setNewColourHex(hex);
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
          // invalid key pressed
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
    setSneakerToAddData({ ...sneakerToAddData, sneakerColours: selectedSneakerColours });
    setShowEditColoursModal(false);
  }

  useEffect(() => {
    (async () => {
      const fetchedUserColours = await getUserColours()
      setUserColours(fetchedUserColours)
    })();
  }, [])

  return (
    <div className='mt-[75px]'>
      <div className={`${loading ? "flex" : "hidden"} fixed inset-0 justify-center items-center bg-black opacity-50 z-40`}>
        <div className="flex justify-center items-center">
          <SpinningLoader big />
        </div>
      </div>
      <header className='fixed top-0 left-0 right-0 z-10 bg-white'>
        <form className='flex p-4 gap-4 border-b border-lightGrey' onSubmit={e => handleSearchSubmit(e)}>
          <input ref={searchInputRef} className='grow bg-lighterGrey pl-8' type="text" name="sneakerQuery" value={sneakerQuery} onChange={e => setSneakerQuery(e.target.value)}>
          </input>
          <div className='absolute left-6 top-[27px] pointer-events-none flex items-center'>
            <Image unoptimized src="/search.svg" height={20} width={20} alt="Magnifying glass" />
          </div>
          <button type='button' className={`${sneakerQuery !== "" ? "flex" : "hidden"} absolute items-center right-4 top-4 py-[11px] px-[10px]`}
            onClick={e => {
              e.preventDefault();
              setSneakerQuery("");
              setStockXSneakersList([]);
              searchInputRef.current.focus()
            }
            }>
            <Image unoptimized src="/cross-cancel.svg" height={20} width={20} alt="Clear search button" />
          </button>
        </form>
      </header>

      <AddSneakerModal {... { showAddSneakerModal, handleSetShowAddSneakerModal, stockXSneakerData, addSneakerModalStep, sneakerToAddData, handleSetSneakerToAddData, handleSetShowEditColoursModal, addToDbLoading, handleFormSubmit }}/>
      <EditSneakerColorsModal {... { showEditColoursModal, handleSetShowEditColoursModal, stockXSneakerData, selectedSneakerColours, handleRemoveSelectedColour, handleAddSelectedColour, userColours, handleSetShowCreateUserColourModal, handleSaveSneakerColoursClick }} />
      <AddUserColorsModal {... { showCreateUserColourModal, closeAddUserColorsModal, stockXSneakerData, newColourHex, handleSetNewColourHex, newColourName, handleColourNameInputKeyDown, handleSetNewColourName, addUserColourLoading, handleAddNewUserColourClick }} />
      
      {
        stockXSneakersList.length === 0 ?
        <div className='flex justify-center items-center h-[calc(100vh-155px)] text-center px-4 text-grey'>
          Search the StockX database using the sneaker name or SKU
        </div> : 
        <ul>
          {stockXSneakersList?.map(stockXSneaker => (
            <li key={stockXSneaker._id} className='grid grid-cols-[7rem_1fr] p-4 gap-4 border-b border-lightGrey' onClick={() => handleStockXSneakerClick(stockXSneaker)}>
              <div className="w-full h-16 relative">
                <Image unoptimized src={stockXSneaker.thumbnail || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt={stockXSneaker.shoeName} layout="fill" objectFit="contain" />
              </div>
              <div className='flex flex-col justify-center w-[calc(100vw-10rem)]'>
                <p className='text-grey text-sm w-full overflow-hidden whitespace-nowrap text-ellipsis'>{stockXSneaker.silhoutte}</p>
                <p className='font-semibold'>{stockXSneaker.shoeName.replace(stockXSneaker.silhoutte, "").trim()}</p>
              </div>
            </li>
          ))}
        </ul>
      }
    </div>
  )
}