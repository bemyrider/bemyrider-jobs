"use client"

import Link from "next/link"
import { UserMenu } from "./user-menu"

export function Navigation() {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-bemyrider-blue">
            bemyrider Jobs
          </Link>
          
          <UserMenu />
        </div>
      </div>
    </nav>
  )
}
