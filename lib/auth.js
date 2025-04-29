import jwt from "jsonwebtoken"

// Clé secrète pour signer les tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || "votre_clé_secrète_jwt"

// Générer un token d'authentification
export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

// Vérifier un token d'authentification
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Générer un token de réinitialisation de mot de passe
export function generateResetToken(userId) {
  return jwt.sign({ userId, type: "reset" }, JWT_SECRET, { expiresIn: "1h" })
}

// Vérifier un token de réinitialisation de mot de passe
export function verifyResetToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded.type === "reset" ? decoded : null
  } catch (error) {
    return null
  }
}
