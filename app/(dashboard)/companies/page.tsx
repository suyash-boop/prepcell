import { prisma } from "@/lib/prisma"
import { CompanyCard } from "@/components/companies/company-card"
import { CompanyDialog } from "@/components/companies/company-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Building2, TrendingUp } from "lucide-react"

async function getCompanies() {
  return await prisma.company.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function CompaniesPage() {
  const companies = await getCompanies()

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-white">Companies</h1>
          <p className="text-gray-400">Track company-wise interview preparation and chat with AI</p>
        </div>
        <CompanyDialog>
          <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all">
            <Plus className="mr-2 h-4 w-4" />
            Add Company with AI
          </Button>
        </CompanyDialog>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-2 border-purple-500 shadow-[4px_4px_0px_0px_rgba(168,85,247,1)]">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300 mb-1">Total Companies</p>
                <p className="text-3xl font-bold text-white">{companies.length}</p>
              </div>
              <Building2 className="h-10 w-10 text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-2 border-blue-500 shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300 mb-1">Companies Tracked</p>
                <p className="text-3xl font-bold text-white">{companies.length}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-400" />
            </div>
          </div>
        </Card>

        {/* <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500 shadow-[4px_4px_0px_0px_rgba(34,197,94,1)]">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300 mb-1">AI Generated</p>
                <p className="text-3xl font-bold text-white">{companies.length}</p>
              </div>
              <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
            </div>
          </div>
        </Card> */}
      </div>

      {companies.length === 0 ? (
        <Card className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-2 border-white/20 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">No companies added yet</h3>
            <p className="text-gray-400">Start tracking companies you're interested in and get AI-powered interview preparation insights</p>
            <CompanyDialog>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Company
              </Button>
            </CompanyDialog>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  )
}