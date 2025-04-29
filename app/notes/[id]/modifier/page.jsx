"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/providers"
import { translations } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import Canvas from "@/components/canvas"

export default function EditNote() {
  const [title, setTitle] = useState("")
  const [elements, setElements] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const noteId = params.id

  useEffect(() => {
    if (!user && !loading) {
      router.push("/connexion")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchNote = async () => {
      if (!user || !noteId) return

      try {
        const res = await fetch(`/api/notes/${noteId}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || translations.errors.generic)
        }

        setTitle(data.note.title)
        setElements(data.note.elements || [])
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [user, noteId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!title) {
      setError(translations.common.required)
      return
    }

    setSaving(true)

    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
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

      router.push(`/notes/${noteId}`)
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
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
            <Link href={`/notes/${noteId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{translations.notes.editNote}</h1>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="h-10 w-full max-w-md bg-muted animate-pulse rounded mb-4" />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="title">{translations.notes.noteTitle}</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
          </form>
        )}
      </header>

      {loading ? (
        <div className="h-96 bg-muted animate-pulse rounded" />
      ) : (
        <div className="mb-8">
          <Canvas elements={elements} setElements={setElements} />
        </div>
      )}

      <div className="flex justify-end gap-4 max-w-2xl">
        <Button variant="outline" asChild>
          <Link href={`/notes/${noteId}`}>{translations.common.cancel}</Link>
        </Button>
        <Button type="submit" disabled={saving} onClick={handleSubmit}>
          {saving ? translations.common.loading : translations.common.save}
        </Button>
      </div>
    </div>
  )
}
