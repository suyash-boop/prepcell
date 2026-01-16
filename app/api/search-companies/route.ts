import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")?.toLowerCase() || ""

    if (!query || query.length < 2) {
      const popularCompanies = [
        { name: "Google", logo: "https://logo.clearbit.com/google.com", domain: "google.com" },
        { name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com", domain: "microsoft.com" },
        { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com", domain: "amazon.com" },
        { name: "Meta", logo: "https://logo.clearbit.com/facebook.com", domain: "facebook.com" },
        { name: "Apple", logo: "https://logo.clearbit.com/apple.com", domain: "apple.com" },
        { name: "Netflix", logo: "https://logo.clearbit.com/netflix.com", domain: "netflix.com" },
        { name: "Adobe", logo: "https://logo.clearbit.com/adobe.com", domain: "adobe.com" },
        { name: "Salesforce", logo: "https://logo.clearbit.com/salesforce.com", domain: "salesforce.com" },
      ]
      return NextResponse.json(popularCompanies)
    }

    try {
      // Use Clearbit Autocomplete API
      const clearbitResponse = await fetch(
        `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(query)}`,
        {
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-store',
        }
      )

      if (clearbitResponse.ok) {
        const companies = await clearbitResponse.json()
        
        const formattedCompanies = companies.map((company: any) => ({
          name: company.name,
          logo: company.logo || `https://logo.clearbit.com/${company.domain}`,
          domain: company.domain
        }))

        return NextResponse.json(formattedCompanies.slice(0, 10))
      }
    } catch (error) {
      console.error("Clearbit API error:", error)
    }

    // Fallback: return the query as a company name
    return NextResponse.json([
      {
        name: query.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        logo: null, // We'll handle this on the frontend
        domain: `${query.toLowerCase().replace(/\s+/g, '')}.com`
      }
    ])
    
  } catch (error) {
    console.error("Failed to search companies:", error)
    return NextResponse.json(
      { error: "Failed to search companies" },
      { status: 500 }
    )
  }
}