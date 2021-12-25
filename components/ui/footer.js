import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'


export const Footer = () => {
  const router = useRouter()
  const {pathname} = router
  console.log(router)
  return (
    <div className="fixed bottom-0 flex justify-evenly w-full py-4 rounded-tl-3xl rounded-tr-3xl bg-white footer-shadow">
      <Link href="/" passHref>
        <div className={`relative w-10 h-10 flex justify-center items-center ${pathname === "/" && "active-footer"}`}>
          <Image src="/home.svg" height={30} width={30} alt="Home button" />
        </div>
      </Link>
      <div className={`relative w-10 h-10 flex justify-center items-center ${pathname === "/add" && "active-footer"}`}>
        <Image src="/add.svg" height={30} width={30} alt="Add sneaker button"/>
      </div>
      <Link href="/account" passHref>
        <div className={`relative w-10 h-10 flex justify-center items-center ${pathname === "/account" && "active-footer"}`}>
          <Image src="/account.svg" height={30} width={30} alt="Account button"/>
        </div>
      </Link>
    </div>
  )
}