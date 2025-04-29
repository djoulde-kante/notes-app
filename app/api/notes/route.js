import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { db } from "@/lib/db"

// Récupérer toutes les notes de l'utilisateur
export async function GET() {
  try {
    // Vérifier l'authentification
    const cookieStore = await cookies();
const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const userId = decoded.userId

    // Récupérer les notes
    const rows = await db.query(
      "SELECT id, title, elements, created_at, updated_at FROM notes WHERE user_id = ? ORDER BY updated_at DESC",
      [userId],
    )

    // Générer un vrai preview lisible
    const notes = rows.map(note => {
      let preview = ""
      try {
        const elements = JSON.parse(note.elements || "[]")
        const firstText = elements.find(el => el.type === 'text' && el.content)
        if (firstText) {
          preview = firstText.content.slice(0, 96) + (firstText.content.length > 96 ? '…' : '')
        } else if (elements.find(el => el.type === 'image')) {
          preview = '[Image]'
        } else if (elements.find(el => el.type === 'link')) {
          preview = '[Lien]'
        }
      } catch {
        preview = "…"
      }
      return {
        id: note.id,
        title: note.title,
        preview,
        created_at: note.created_at,
        updated_at: note.updated_at
      }
    })

    return NextResponse.json({ notes })
  } catch (error) {
    console.error("Erreur lors de la récupération des notes:", error)
    return NextResponse.json({ message: "Erreur lors de la récupération des notes" }, { status: 500 })
  }
}

// Créer une nouvelle note
export async function POST(request) {
  try {
    // Vérifier l'authentification
    const cookieStore = await cookies();
const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const userId = decoded.userId

    // Récupérer les données de la note
    const { title, elements } = await request.json()

    // Validation
    if (!title) {
      return NextResponse.json({ message: "Le titre est requis" }, { status: 400 })
    }

    // Créer la note
    const result = await db.query("INSERT INTO notes (user_id, title, elements) VALUES (?, ?, ?)", [
      userId,
      title,
      JSON.stringify(elements || []),
    ])

    const noteId = result.insertId

    // Récupérer la note créée
    const notes = await db.query("SELECT id, title, elements, created_at, updated_at FROM notes WHERE id = ?", [noteId])

    if (notes.length === 0) {
      return NextResponse.json({ message: "Erreur lors de la création de la note" }, { status: 500 })
    }

    const note = notes[0]

    // Convertir les éléments en JSON
    note.elements = JSON.parse(note.elements || "[]")

    return NextResponse.json({ note })
  } catch (error) {
    console.error("Erreur lors de la création de la note:", error)
    return NextResponse.json({ message: "Erreur lors de la création de la note" }, { status: 500 })
  }
}
