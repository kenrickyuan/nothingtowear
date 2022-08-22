import Image from 'next/image'

export const SneakersGrid = ({ isSneakerViewGrid, filteredSneakers, handleSneakerClick }) => {
  return (
    <ul className={`${isSneakerViewGrid ? "grid grid-cols-3 px-4 gap-[1px]" : ""} pt-[calc(40px+3rem)]`}>
      {filteredSneakers.map((sneaker) => {
        const { publicThumbnailUrl, sneaker_model_id: sneakerModelId, sneaker_models: sneakerModel } = sneaker;
        return (
          <li key={sneakerModelId} className={`${isSneakerViewGrid ? "grid-shadow flex justify-center items-center" : "grid grid-cols-[7rem_1fr] p-4 gap-4 border-t border-lightGrey"}`} onClick={() => handleSneakerClick(sneaker)}>
            <div className={`${isSneakerViewGrid ? "h-24 w-[calc(100%-0.75rem)]" : "h-16 w-full"} relative`}>
              <Image unoptimized src={publicThumbnailUrl || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt={sneakerModel.name} layout="fill" objectFit="contain" />
            </div>
            <div className={`${isSneakerViewGrid ? "hidden" : ""} flex flex-col justify-center w-[calc(100vw-10rem)]`}>
              <p className='text-grey text-sm w-full overflow-hidden whitespace-nowrap text-ellipsis capitalize'>{sneakerModel.sneaker_silhouettes.name}</p>
              <p className='font-semibold'>{sneakerModel.colourway_name}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
};