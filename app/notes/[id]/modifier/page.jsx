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
    <div className="min-h-screen bg-[#f8fbfe] flex flex-col">
      {/* HEADER MODERNE */}
      <header className="w-full py-6 px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4" style={{background:'linear-gradient(90deg,#4f8cff 0%,#7c3aed 100%)', boxShadow:'0 2px 18px #b993f84a'}}>
        <div className="flex items-center gap-3 w-full">
          <Button variant="ghost" size="icon" asChild style={{background:'rgba(255,255,255,0.18)', boxShadow:'0 2px 8px #b993f84a'}}>
            <Link href={`/notes/${noteId}`}>
              <ArrowLeft className="h-5 w-5 text-white" />
            </Link>
          </Button>
          <input
            className="notes-title-input"
            style={{
              background:'rgba(255,255,255,0.24)',
              border:'none',
              borderRadius:'1.5em',
              fontWeight:600,
              fontSize:'1.13rem',
              color:'#fff',
              padding:'0.8em 1.6em',
              width:'100%',
              boxShadow:'0 2px 12px #b993f84a',
              outline:'none',
              letterSpacing:'-0.5px',
              marginLeft:8
            }}
            placeholder="Titre de la note"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={60}
            required
          />
        </div>
        <div className="flex items-center gap-3 ml-6">
          <Button
            className="notes-btn"
            style={{minWidth:120, marginLeft:16, borderRadius:'2em', fontWeight:700, fontSize:'1.04rem'}}
            type="button"
            disabled={saving || !title}
            onClick={handleSubmit}
          >
            {saving ? translations.common.loading : "Enregistrer"}
          </Button>
        </div>
      </header>
      {error && (
        <Alert variant="destructive" className="max-w-2xl mx-auto mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="h-96 bg-muted animate-pulse rounded" />
      ) : (
        <div className="mb-8">
          {/* Canvas avec toutes les améliorations récentes (padding, drag fluide, pointer-events, modale non déplaçable, etc.) */}
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
