import { NextRequest, NextResponse } from "next/server"
import { generateCompanyInterviewData } from "@/lib/groq"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const company = searchParams.get("company")

    if (!company) {
      return NextResponse.json({ error: "Company name required" }, { status: 400 })
    }

    const data = await generateCompanyInterviewData(company)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to fetch interview data:", error)
    return NextResponse.json(
      { error: "Failed to generate interview data" },
      { status: 500 }
    )
  }
}