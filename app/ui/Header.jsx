"use client";


import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Authenticated, Unauthenticated } from 'convex/react';
import Image from 'next/image'
import Link from 'next/link'
import { BarLoader } from 'react-spinners';
import { useStoreUser } from "@/hooks/use-store-user";
import { Button } from '@/components/ux/button';
import { Building, Plus, Ticket } from 'lucide-react';

export const Header = () => {

  const {isLoading}= useStoreUser();


  return (
    <nav className='fixed top-0 left-0 right-0 backdrop-blur-3xl z-[1000]'>
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" alt="logo" width={40} height={40} className="object-contain" />
        </Link>

        <div className="flex items-center gap-4">

          <Button variant='ghost' size='sm' asChild className={"m-2"}>
            <Link href="/explore">Explore</Link>
          </Button>

          <Authenticated>

            <Button size="sm" asChild className="flex gap-2 mr-4">
              <Link href="/create-event">
              <Plus className='w-4 h-4'/>
              <span className='hidden sm:inline'>Create Event</span></Link>
            </Button>

            <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Tickets"
                    labelIcon={<Ticket size={16} />}
                    href="/my-tickets"
                  />
                  <UserButton.Link
                    label="My Events"
                    labelIcon={<Building size={16} />}
                    href="/my-events"
                  />
                  <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>
            </Authenticated>

         <Unauthenticated>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#9a80ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </Unauthenticated>
            
        </div>
      </div>

      {isLoading &&(
      <div className='absolute bottom-0 left-0 w-full'>
        <BarLoader width={"100%"} color='#ffffff'/>
        </div>
        )}
    </nav>
  );
};

export default Header;
