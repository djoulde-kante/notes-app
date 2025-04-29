import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Supprimer le cookie de session
    cookies().delete("auth_token")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur de déconnexion:", error)
    return NextResponse.json({ message: "Erreur lors de la déconnexion" }, { status: 500 })
  }
}
