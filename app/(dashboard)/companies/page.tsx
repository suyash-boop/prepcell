import { prisma } from "@/lib/prisma"
import { CompanyCard } from "@/components/companies/company-card"
import { CompanyDialog } from "@/components/companies/company-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"

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
          <p className="text-gray-400">Track company-wise preparation notes</p>
        </div>
        <CompanyDialog>
          <Button className="bg-white text-black hover:bg-gray-200 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </CompanyDialog>
      </div>

      {companies.length === 0 ? (
        <Card className="bg-card border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] p-12 text-center">
          <p className="text-gray-400 mb-4">No companies added yet</p>
          <CompanyDialog>
            <Button className="bg-white text-black hover:bg-gray-200 border-2 border-white">
              Add Your First Company
            </Button>
          </CompanyDialog>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  )
}