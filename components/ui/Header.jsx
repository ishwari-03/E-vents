import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


const Header = () => {
  return (
    <>
    <nav className='fixed top-0 left-0 right-0  backdrop-blur-3xl '>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'> 
            {/*Logo//*/}
            <Link href={"/"} className='flex items-center'>
            <Image src="/logo.svg" alt="logo" width={0} height={500} className="h-18 w-auto object-contain pt-3 " priority/>
              </Link>
            {/* search location -desktop*/ }
       
       
        {/* right ones*/ }
        </div>
        
        {/* mobile*/ }
    </nav>
    {/*modals*/}
    </>
  )
}

export default Header