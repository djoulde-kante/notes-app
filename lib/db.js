import mysql from "mysql2/promise"

// Créer un pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "noteflex",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Fonction pour exécuter des requêtes SQL
export const db = {
  query: async (sql, params) => {
    try {
      const [rows] = await pool.execute(sql, params)
      return rows
    } catch (error) {
      console.error("Erreur de base de données:", error)
      throw error
    }
  },
}
