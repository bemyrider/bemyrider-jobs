"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { useSession, signIn, signOut } from "next-auth/react"
import { User, LogOut, LayoutDashboard } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function UserMenu() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <Button onClick={() => signIn()} className="bg-bemyrider-blue hover:bg-bemyrider-blue/90 text-white">
        Login
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100 text-bemyrider-blue">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">{session.user?.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <Link href="/dashboard">
          <DropdownMenuItem className="cursor-pointer">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-700"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 