"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/providers"
import { translations } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Canvas from "@/components/canvas"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ViewNote() {
  const [note, setNote] = useState(null)
  const [elements, setElements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
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

        setNote(data.note)
        setElements(data.note.elements || [])
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [user, noteId])

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || translations.errors.generic)
      }

      router.push("/notes")
    } catch (error) {
      setError(error.message)
    }
  }

  if (!user) {
    return <div className="p-8 text-center">{translations.common.loading}</div>
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/notes">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            {loading ? (
              <div className="h-9 w-48 bg-muted animate-pulse rounded" />
            ) : (
              <h1 className="text-3xl font-bold">{note?.title}</h1>
            )}
          </div>
          {!loading && note && (
            <div className="flex gap-2">
              <Button variant="outline" size="icon" asChild>
                <Link href={`/notes/${noteId}/modifier`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="icon" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </header>

      {loading ? (
        <div className="h-96 bg-muted animate-pulse rounded" />
      ) : (
        <div className="mb-8">
          <Canvas elements={elements} readOnly />
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{translations.notes.deleteNoteConfirm}</AlertDialogTitle>
            <AlertDialogDescription>Cette action ne peut pas être annulée.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{translations.common.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {translations.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
