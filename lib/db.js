// lib/db.js
// Wrapper seguro para consultas ao banco usando KNEX
// Suporta tanto Postgres (Production) quanto SQLite (Development)

const knexConfig = require('../knexfile');

// Determina o ambiente (development por padrão)
const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

// Inicializa a instância do Knex
const db = require('knex')(config);

// Helper para manter compatibilidade com código antigo se houver queries raw simples
async function query(text, params) {
  try {
    const res = await db.raw(text, params);
    // Knex raw result format varies by dialect
    // SQLite: res is just the array of rows (usually), or object with propertes depending on driver
    // PG: res.rows

    if (environment === 'development') {
      // sqlite3 returns array directly for selects usually
      return { rows: Array.isArray(res) ? res : [] };
    }

    return res;
  } catch (err) {
    console.error('DB query error:', err);
    return { rows: [], rowCount: 0 };
  }
}

module.exports = db; // Exporta a instância do Knex diretamente como default
module.exports.query = query; // Mantém compatibilidade
