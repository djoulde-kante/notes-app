import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { generateToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Tous les champs sont requis" }, { status: 400 })
    }

    // Vérifier si l'email existe déjà
    const existingUser = await db.query("SELECT * FROM users WHERE email = ?", [email])

    if (existingUser.length > 0) {
      return NextResponse.json({ message: "Cet email est déjà utilisé" }, { status: 400 })
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'utilisateur
    const result = await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword,
    ])

    const userId = result.insertId

    // Créer un token de session
    const token = generateToken(userId)

    // Définir le cookie de session
    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: "/",
    })

    // Retourner l'utilisateur sans le mot de passe
    return NextResponse.json({
      user: {
        id: userId,
        name,
        email,
      },
    })
  } catch (error) {
    console.error("Erreur d'inscription:", error)
    return NextResponse.json({ message: "Erreur lors de l'inscription" }, { status: 500 })
  }
}
