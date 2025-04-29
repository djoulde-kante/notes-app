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
  <div className="min-h-screen bg-[#f8fbfe] flex flex-col">
    {/* HEADER MODERNE */}
    <header className="notes-header flex items-center justify-between px-6 py-5 relative z-10" style={{borderBottom: 'none'}}>
      <div className="flex items-center gap-3 w-full">
        <Button variant="ghost" size="icon" asChild style={{background:'rgba(255,255,255,0.18)', boxShadow:'0 2px 8px #b993f84a'}}>
          <Link href="/notes">
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
        />
      </div>
      <div className="flex items-center gap-3 ml-6">
        <Button
          className="notes-btn"
          style={{minWidth:120, marginLeft:16, borderRadius:'2em', fontWeight:700, fontSize:'1.04rem'}}
          type="button"
          disabled={loading || !title}
          onClick={handleSubmit}
        >
          {loading ? translations.common.loading : "Enregistrer"}
        </Button>
      </div>
    </header>
    {/* CANVAS ET ELEMENTS FULL WIDTH */}
    <div className="flex-1 flex flex-col items-center justify-start px-0 pb-8 w-full" style={{background:'#f8fbfe'}}>
      <div className="w-full" style={{maxWidth:'100vw'}}>
        <Canvas elements={elements} setElements={setElements} />
      </div>
    </div>
  </div>
)
}
