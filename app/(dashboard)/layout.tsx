import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { SessionProvider } from "@/components/providers/session-provider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <SessionProvider session={session}>
      <div className="h-screen flex bg-black">
        <div className="w-64 hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto bg-black">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}