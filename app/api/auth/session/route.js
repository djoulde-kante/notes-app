import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Récupérer le token depuis les cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ user: null })
    }

    // Vérifier le token
    const decoded = verifyToken(token)

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ user: null })
    }

    // Récupérer l'utilisateur
    const users = await db.query("SELECT * FROM users WHERE id = ?", [decoded.userId])

    if (users.length === 0) {
      return NextResponse.json({ user: null })
    }

    const user = users[0]

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Erreur de session:", error)
    return NextResponse.json({ user: null })
  }
}
