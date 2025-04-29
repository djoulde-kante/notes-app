import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { generateToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ message: "Email et mot de passe requis" }, { status: 400 })
    }

    // Récupérer l'utilisateur
    const users = await db.query("SELECT * FROM users WHERE email = ?", [email])

    if (users.length === 0) {
      return NextResponse.json({ message: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    const user = users[0]

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ message: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Créer un token de session
    const token = generateToken(user.id)

    // Définir le cookie de session
    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: "/",
    })

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Erreur de connexion:", error)
    return NextResponse.json({ message: "Erreur lors de la connexion" }, { status: 500 })
  }
}
