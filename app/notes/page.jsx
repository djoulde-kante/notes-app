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
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
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
        setSearchResults(data.notes)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [user])

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults(notes)
    } else {
      const q = searchQuery.toLowerCase()
      setSearchResults(notes.filter(note =>
        (note.title && note.title.toLowerCase().includes(q)) ||
        (note.preview && note.preview.toLowerCase().includes(q))
      ))
    }
  }, [searchQuery, notes])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (!user) {
    return <div className="p-8 text-center">{translations.common.loading}</div>
  }

  return (
  <>
    <div className="bg-circles">
      <div className="circle circle1" />
      <div className="circle circle2" />
    </div>
    <div className="min-h-screen p-0 md:p-0 flex flex-col">
      {/* HEADER */}
      <header className="notes-header flex items-center justify-between px-8 py-6 relative z-10">
        <div className="flex items-center gap-2">
          <span className="notes-logo font-bold text-white text-2xl md:text-3xl" style={{letterSpacing:'-1px'}}>NoteFlex</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-white font-semibold hidden md:block">{user?.name || user?.email}</span>
          <Button className="notes-btn logout-btn" style={{padding: '0.6em 1.6em', fontWeight:700, fontSize:'1.01rem', marginLeft:8}} onClick={handleLogout}>
  <LogOut className="mr-2 h-4 w-4" /> Déconnexion
</Button>
        </div>
      </header>
      {/* PAGE CONTENT */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-0">
        <div className="flex items-center justify-between">
          <h1 className="mt-8 mb-3 text-3xl font-bold text-left" style={{color:'#6bb7e5',letterSpacing:'-1px'}}>
            Mes <span style={{color:'#4f8cff'}}>Notes</span>
          </h1>
          <Button asChild className="notes-btn" style={{minWidth: 150}}>
              <Link href="/notes/nouveau">
                <Plus className="mr-2 h-4 w-4" /> Nouvelle Note
              </Link>
          </Button>
        </div>
        {/* SEARCH BAR */}
        <div className="flex items-center w-full mb-8">
          <div className="notes-search-bar flex items-center bg-white rounded-full shadow-md px-5 py-3 w-full max-w-3xl">
            <svg width="22" height="22" fill="none" stroke="#b993f8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              className="flex-1 ml-3 outline-none bg-transparent text-base text-gray-700"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Rechercher parmi les notes"
            />
          </div>
        </div>
        {/* EMPTY STATE */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading ? (
          <div className="text-center p-8">{translations.common.loading}</div>
        ) : notes.length === 0 ? (
          <div className="notes-empty-state flex flex-col items-center justify-center mx-auto p-10 rounded-2xl shadow-lg bg-white/90 backdrop-blur-md max-w-sm mt-12">
            <p className="mb-2 text-gray-600">Vous n'avez pas encore de notes.<br/>Cliquez sur "Nouvelle Note" pour commencer.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {searchResults.map((note) => (
              <Link key={note.id} href={`/notes/${note.id}`} style={{textDecoration:'none'}}>
                <Card
                  className="h-full cursor-pointer group transition-all duration-200 border-0"
                  style={{
                    background: 'linear-gradient(135deg, #f8fbfe 70%, #e5e9fa 100%)',
                    borderRadius: '2.1em',
                    boxShadow: '0 2px 18px #b993f82a, 0 1.5px 8px #b993f822',
                    minHeight: 180,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.18s, transform 0.18s',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'scale(1.035)';
                    e.currentTarget.style.boxShadow = '0 8px 32px #7c3aed22, 0 2px 16px #4f8cff22';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 18px #b993f82a, 0 1.5px 8px #b993f822';
                  }}
                >
                  <div style={{position:'absolute', top:18, left:22, zIndex:2, opacity:0.75}}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="4" fill="#7c3aed"/><rect x="6" y="8" width="12" height="2" rx="1" fill="#fff"/><rect x="6" y="12" width="7" height="2" rx="1" fill="#fff"/></svg>
                  </div>
                  <CardHeader className="pl-12 pt-6 pb-2">
                    <CardTitle className="line-clamp-1 text-lg font-extrabold" style={{color:'#4f8cff', letterSpacing:'-0.5px'}}>{note.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3 px-6">
                    <p className="line-clamp-3" style={{color:'#4b5563', fontSize:'1.08rem', fontWeight:500}}>{note.preview || "..."}</p>
                  </CardContent>
                  <CardFooter className="px-6 pb-5 pt-0">
                    <p className="text-xs italic" style={{color:'#b993f8'}}>
                      {translations.notes.lastEdited}: {formatDate(note.updated_at)}
                    </p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-16 mb-6">
          <a href="#" className="text-xs font-semibold text-[#6b6be5] hover:underline">Gérer mes données personnelles</a>
        </div>
      </main>
    </div>
  </>
)
}
