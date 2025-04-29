import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { db } from "@/lib/db"

// Récupérer une note spécifique
export async function GET(request, { params }) {
  try {
    const noteId = params.id

    // Vérifier l'authentification
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const userId = decoded.userId

    // Récupérer la note
    const notes = await db.query(
      "SELECT id, title, elements, created_at, updated_at FROM notes WHERE id = ? AND user_id = ?",
      [noteId, userId],
    )

    if (notes.length === 0) {
      return NextResponse.json({ message: "Note non trouvée" }, { status: 404 })
    }

    const note = notes[0]

    // Convertir les éléments en JSON
    note.elements = JSON.parse(note.elements || "[]")

    return NextResponse.json({ note })
  } catch (error) {
    console.error("Erreur lors de la récupération de la note:", error)
    return NextResponse.json({ message: "Erreur lors de la récupération de la note" }, { status: 500 })
  }
}

// Mettre à jour une note
export async function PUT(request, { params }) {
  try {
    const noteId = params.id

    // Vérifier l'authentification
    const token = cookies().get("auth_token")?.value

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

    // Vérifier que la note appartient à l'utilisateur
    const notes = await db.query("SELECT id FROM notes WHERE id = ? AND user_id = ?", [noteId, userId])

    if (notes.length === 0) {
      return NextResponse.json({ message: "Note non trouvée" }, { status: 404 })
    }

    // Mettre à jour la note
    await db.query("UPDATE notes SET title = ?, elements = ?, updated_at = NOW() WHERE id = ?", [
      title,
      JSON.stringify(elements || []),
      noteId,
    ])

    // Récupérer la note mise à jour
    const updatedNotes = await db.query("SELECT id, title, elements, created_at, updated_at FROM notes WHERE id = ?", [
      noteId,
    ])

    if (updatedNotes.length === 0) {
      return NextResponse.json({ message: "Erreur lors de la mise à jour de la note" }, { status: 500 })
    }

    const note = updatedNotes[0]

    // Convertir les éléments en JSON
    note.elements = JSON.parse(note.elements || "[]")

    return NextResponse.json({ note })
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la note:", error)
    return NextResponse.json({ message: "Erreur lors de la mise à jour de la note" }, { status: 500 })
  }
}

// Supprimer une note
export async function DELETE(request, { params }) {
  try {
    const noteId = params.id

    // Vérifier l'authentification
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const userId = decoded.userId

    // Vérifier que la note appartient à l'utilisateur
    const notes = await db.query("SELECT id FROM notes WHERE id = ? AND user_id = ?", [noteId, userId])

    if (notes.length === 0) {
      return NextResponse.json({ message: "Note non trouvée" }, { status: 404 })
    }

    // Supprimer la note
    await db.query("DELETE FROM notes WHERE id = ?", [noteId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de la note:", error)
    return NextResponse.json({ message: "Erreur lors de la suppression de la note" }, { status: 500 })
  }
}
