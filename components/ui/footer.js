import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'


export const Footer = () => {
  const router = useRouter()
  const {pathname} = router
  const path = pathname.split("/")[1]
  return (
    <footer className="fixed bottom-0 flex justify-evenly w-full py-4 rounded-tl-3xl rounded-tr-3xl bg-white footer-shadow">
      <Link href="/" passHref>
        <div className={`relative w-10 h-10 flex justify-center items-center ${path === "" && "active-footer"}`}>
          <Image src="/home.svg" height={30} width={30} alt="Home button" />
        </div>
      </Link>
      <Link href="/add" passHref>
        <div className={`relative w-10 h-10 flex justify-center items-center ${path === "add" && "active-footer"}`}>
          <Image src="/add.svg" height={30} width={30} alt="Account button" />
        </div>
      </Link>
      <Link href="/account" passHref>
        <div className={`relative w-10 h-10 flex justify-center items-center ${path === "account" && "active-footer"}`}>
          <Image src="/account.svg" height={30} width={30} alt="Account button"/>
        </div>
      </Link>
    </footer>
  )
}