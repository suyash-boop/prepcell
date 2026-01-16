"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Loader2, Send, Bot, User, Sparkles, Building2 } from "lucide-react"
import type { Company } from "@/types"

interface CompanyDialogProps {
  company?: Company
  children: React.ReactNode
}

interface SearchResult {
  name: string
  logo: string | null
  domain: string
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export function CompanyDialog({ company, children }: CompanyDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearch, setShowSearch] = useState(!company)
  const [isGenerating, setIsGenerating] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState({
    name: company?.name || "",
    examPattern: company?.examPattern || "",
    importantTopics: company?.importantTopics || "",
    notes: company?.notes || "",
  })

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  useEffect(() => {
    const searchCompanies = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`/api/search-companies?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        setSearchResults(data)
      } catch (error) {
        console.error("Failed to search companies:", error)
      } finally {
        setIsSearching(false)
      }
    }

    const debounce = setTimeout(searchCompanies, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery])

  const handleSelectCompany = async (companyName: string) => {
    setFormData({ ...formData, name: companyName })
    setSearchQuery("")
    setSearchResults([])
    setShowSearch(false)
    setIsGenerating(true)

    try {
      const response = await fetch(`/api/company-interview-data?company=${encodeURIComponent(companyName)}`)
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setFormData({
            name: companyName,
            examPattern: data.rounds?.join("\n") || "",
            importantTopics: data.topConcepts?.join(", ") || "",
            notes: `Difficulty: ${data.difficulty}\n\nApproximate LeetCode Problems: ${data.leetcodeCount}\n\nCommon Questions:\n${data.commonQuestions?.join("\n") || ""}\n\nPreparation Tips:\n${data.tips || ""}`,
          })
        }
      }
    } catch (error) {
      console.error("Failed to fetch interview data:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault()
      handleSelectCompany(searchQuery.trim())
    }
  }

  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return

    const userMessage: ChatMessage = {
      role: "user",
      content: chatInput
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput("")
    setIsChatLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          companyContext: `${formData.name} interviews. Current prep info: Rounds: ${formData.examPattern}. Topics: ${formData.importantTopics}.`
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setChatMessages(prev => [...prev, {
          role: "assistant",
          content: data.message
        }])
      }
    } catch (error) {
      console.error("Chat error:", error)
      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again."
      }])
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const method = company ? 'PUT' : 'POST'
      const response = await fetch('/api/companies', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...(company && { id: company.id }),
        }),
      })

      if (response.ok) {
        setOpen(false)
        setFormData({ name: "", examPattern: "", importantTopics: "", notes: "" })
        setChatMessages([])
        setShowSearch(true)
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to save company:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-card border-2 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            {company ? 'Edit Company' : 'Add Company with AI'}
          </DialogTitle>
        </DialogHeader>

        {showSearch && !company && (
          <div className="space-y-3 pb-4 border-b-2 border-white/20">
            <div className="space-y-2">
              <Label className="text-white">Search or Enter Company Name</Label>
              <p className="text-xs text-gray-400">
                Type a company name and press Enter to generate AI-powered interview data
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="Type company name and press Enter (e.g., Google, Microsoft, Startup XYZ...)"
                className="pl-10 border-2 border-white bg-black text-white"
                autoFocus
              />
            </div>

            {isSearching && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <p className="text-xs text-gray-400 px-1">Suggested companies:</p>
                {searchResults.map((result, idx) => (
                  <button
                    key={`${result.domain}-${idx}`}
                    onClick={() => handleSelectCompany(result.name)}
                    className="w-full flex items-center gap-3 p-3 bg-black/50 border-2 border-white/20 hover:border-purple-500 hover:bg-purple-500/10 transition-all rounded-lg group"
                  >
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      {result.logo ? (
                        <img
                          src={result.logo}
                          alt={result.name}
                          className="h-full w-full object-contain bg-white p-1"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent) {
                              parent.innerHTML = `<span class="text-white font-bold text-lg">${getCompanyInitials(result.name)}</span>`
                            }
                          }}
                        />
                      ) : (
                        <span className="text-white font-bold text-lg">
                          {getCompanyInitials(result.name)}
                        </span>
                      )}
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-white">{result.name}</p>
                      <p className="text-xs text-gray-400">{result.domain}</p>
                    </div>
                    <Sparkles className="h-5 w-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
              <div className="text-center py-4 px-4 bg-purple-500/10 border-2 border-purple-500/30 rounded-lg">
                <p className="text-sm text-purple-300 mb-2">
                  No suggestions found for "{searchQuery}"
                </p>
                <p className="text-xs text-gray-400">
                  Press <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white">Enter</kbd> to continue with this company name and generate AI interview data
                </p>
              </div>
            )}
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            <p className="text-white text-sm">AI is generating interview data for {formData.name}...</p>
            <p className="text-gray-400 text-xs">This may take a few seconds</p>
          </div>
        )}

        {!isGenerating && formData.name && (
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/30 border-2 border-white/20">
              <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:text-black">
                Interview Details
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <Bot className="h-4 w-4 mr-2" />
                AI Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Company Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-2 border-white bg-black text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examPattern" className="text-white">Interview Rounds</Label>
                  <Textarea
                    id="examPattern"
                    value={formData.examPattern}
                    onChange={(e) => setFormData({ ...formData, examPattern: e.target.value })}
                    placeholder="AI will generate this based on company"
                    rows={4}
                    className="border-2 border-white bg-black text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="importantTopics" className="text-white">Important Topics/Concepts</Label>
                  <Textarea
                    id="importantTopics"
                    value={formData.importantTopics}
                    onChange={(e) => setFormData({ ...formData, importantTopics: e.target.value })}
                    placeholder="AI will suggest relevant topics"
                    rows={3}
                    className="border-2 border-white bg-black text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white">Notes, Tips & Common Questions</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="AI-generated preparation tips and questions"
                    rows={8}
                    className="border-2 border-white bg-black text-white"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black hover:bg-gray-200 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                >
                  {isLoading ? 'Saving...' : company ? 'Update Company' : 'Save Company'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="chat" className="space-y-4 mt-4">
              <div className="bg-black/30 border-2 border-purple-500/30 rounded-lg p-4 h-96 overflow-y-auto space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                    <Bot className="h-12 w-12 text-purple-400" />
                    <p className="text-white font-semibold">Chat with AI Interview Coach</p>
                    <p className="text-gray-400 text-sm max-w-md">
                      Ask me anything about preparing for {formData.name} interviews, study plans, or specific topics!
                    </p>
                  </div>
                ) : (
                  <>
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.role === "assistant" && (
                          <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === "user"
                              ? "bg-white text-black"
                              : "bg-purple-500/20 text-white border-2 border-purple-500/30"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        {msg.role === "user" && (
                          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-black" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div className="bg-purple-500/20 border-2 border-purple-500/30 rounded-lg p-3">
                          <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask about preparation strategies, topics to focus on..."
                  className="border-2 border-purple-500/30 bg-black text-white"
                  disabled={isChatLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="bg-purple-500 hover:bg-purple-600 border-2 border-purple-500"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}