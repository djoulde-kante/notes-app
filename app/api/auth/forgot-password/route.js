import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateResetToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { email } = await request.json()

    // Validation
    if (!email) {
      return NextResponse.json({ message: "Email requis" }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe
    const users = await db.query("SELECT * FROM users WHERE email = ?", [email])

    if (users.length === 0) {
      // Pour des raisons de sécurité, ne pas indiquer que l'email n'existe pas
      return NextResponse.json({ success: true })
    }

    const user = users[0]

    // Générer un token de réinitialisation
    const resetToken = generateResetToken(user.id)

    // Stocker le token dans la base de données
    await db.query(
      "UPDATE users SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?",
      [resetToken, user.id],
    )

    // Dans une application réelle, envoyer un email avec le lien de réinitialisation
    // Pour cette démo, nous allons simplement retourner un succès
    console.log(`Lien de réinitialisation: /reset-password?token=${resetToken}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur de réinitialisation de mot de passe:", error)
    return NextResponse.json({ message: "Erreur lors de la demande de réinitialisation" }, { status: 500 })
  }
}
