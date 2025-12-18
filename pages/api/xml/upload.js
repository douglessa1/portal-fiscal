import fs from 'fs'
import { parseStringPromise } from 'xml2js'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end('Method not allowed')

    // Upload XML temporariamente desabilitado due to formidable issues
    // Para habilitar, instale com: npm install formidable
    return res.status(200).json({
        message: 'Upload XML temporariamente desabilitado. Use a UI para enviar.'
    })
}
