"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers"
import { translations } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, LogOut } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    if (!user && !loading) {
      router.push("/connexion")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return

      try {
        const res = await fetch("/api/notes")
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || translations.errors.generic)
        }

        setNotes(data.notes)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [user])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (!user) {
    return <div className="p-8 text-center">{translations.common.loading}</div>
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{translations.notes.myNotes}</h1>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/notes/nouveau">
              <Plus className="mr-2 h-4 w-4" />
              {translations.notes.createNote}
            </Link>
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            {translations.common.logout}
          </Button>
        </div>
      </header>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="text-center p-8">{translations.common.loading}</div>
      ) : notes.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted">
          <p className="mb-4">{translations.notes.noNotes}</p>
          <Button asChild>
            <Link href="/notes/nouveau">{translations.notes.createNote}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`}>
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-muted-foreground">{note.preview || "..."}</p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    {translations.notes.lastEdited}: {formatDate(note.updated_at)}
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
