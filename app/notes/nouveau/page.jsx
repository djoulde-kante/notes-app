"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/providers"
import { translations } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import Canvas from "@/components/canvas"

export default function NewNote() {
  const [title, setTitle] = useState("")
  const [elements, setElements] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user && !loading) {
      router.push("/connexion")
    }
  }, [user, loading, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!title) {
      setError(translations.common.required)
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          elements,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || translations.errors.generic)
      }

      router.push(`/notes/${data.note.id}`)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="p-8 text-center">{translations.common.loading}</div>
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/notes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{translations.notes.createNote}</h1>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="title">{translations.notes.noteTitle}</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
        </form>
      </header>

      <div className="mb-8">
        <Canvas elements={elements} setElements={setElements} />
      </div>

      <div className="flex justify-end gap-4 max-w-2xl">
        <Button variant="outline" asChild>
          <Link href="/notes">{translations.common.cancel}</Link>
        </Button>
        <Button type="submit" disabled={loading} onClick={handleSubmit}>
          {loading ? translations.common.loading : translations.common.save}
        </Button>
      </div>
    </div>
  )
}
