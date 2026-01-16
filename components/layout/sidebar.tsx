"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  CheckSquare, 
  Building2, 
  Target, 
  FileText, 
  LogOut 
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Skills",
    icon: CheckSquare,
    href: "/skills",
  },
  {
    label: "Companies",
    icon: Building2,
    href: "/companies",
  },
  {
    label: "Goals",
    icon: Target,
    href: "/goals",
  },
  {
    label: "Resume",
    icon: FileText,
    href: "/resume",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="flex flex-col h-full bg-black border-r-2 border-white">
      <div className="p-6 border-b-2 border-white">
        <h1 className="text-2xl font-bold text-white">Prepcell</h1>
      </div>

      {/* User Profile Section */}
      {session?.user && (
        <div className="p-4 border-b-2 border-white">
          <div className="flex items-center gap-3 p-3 bg-white/5 border-2 border-white/20 rounded-lg hover:bg-white/10 transition-all">
            <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {session.user.name || "User"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 p-4 space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-none border-2 border-white transition-all hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
              pathname === route.href
                ? "bg-white text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                : "bg-black text-white hover:translate-x-0.5 hover:translate-y-0.5"
            )}
          >
            <route.icon className="h-5 w-5" />
            <span className="font-medium">{route.label}</span>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t-2 border-white">
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="outline"
          className="w-full border-2 border-white bg-black text-white hover:bg-white hover:text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}