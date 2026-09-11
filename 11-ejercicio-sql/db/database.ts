import Database from 'better-sqlite3'

const db = new Database('jobs.db')

// Las lecturas no se bloquean mientras se escribe
db.pragma('journal_mode = WAL')

// Activa las claves foráneas
db.pragma('foreign_keys = ON')

export { db }
