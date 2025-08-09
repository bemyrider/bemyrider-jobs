"use client"

import { UserMenu } from "./user-menu"
import { NotificationBell } from "./notification-bell"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200/50' 
        : 'bg-white shadow-sm border-b'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
              <Image
                src="/bemyrider.svg"
                alt="bemyrider"
                width={24}
                height={24}
                className="h-6 w-auto"
              />
              <span className="text-xl font-bold text-[#333366] font-manrope">
                bemyrider
              </span>
              <span className="text-xl font-bold text-[#333366] font-manrope">
                Jobs
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {session && <NotificationBell />}
            <div className="user-menu">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
