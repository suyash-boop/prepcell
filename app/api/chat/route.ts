import { NextRequest, NextResponse } from "next/server"
import { chatWithAI } from "@/lib/groq"

export async function POST(req: NextRequest) {
  try {
    const { messages, companyContext } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 })
    }

    const response = await chatWithAI(messages, companyContext)
    return NextResponse.json({ message: response })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    )
  }
}