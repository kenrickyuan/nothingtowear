import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'


export const Footer = () => {
  const router = useRouter()
  const { pathname } = router
  const path = pathname.split("/")[1]
  return (
    <footer className="fixed z-50 bottom-0 flex justify-evenly w-full pt-4 pb-6 rounded-tl-3xl rounded-tr-3xl bg-white footer-shadow">
      <Link href="/" passHref>
        <div className={`relative w-10 h-10 flex justify-center items-center ${path === "" && "active-footer"}`}>
          <Image unoptimized src="/home.svg" height={30} width={30} alt="Home button" />
        </div>
      </Link>
      <Link href="/add" passHref>
        <div className={`relative w-10 h-10 flex justify-center items-center ${path === "add" && "active-footer"}`}>
          <Image unoptimized src="/add.svg" height={30} width={30} alt="Account button" />
        </div>
      </Link>
      <Link href="/account" passHref>
        <div className={`relative w-10 h-10 flex justify-center items-center ${path === "account" && "active-footer"}`}>
          <Image unoptimized src="/account.svg" height={30} width={30} alt="Account button" />
        </div>
      </Link>
    </footer>
  )
}