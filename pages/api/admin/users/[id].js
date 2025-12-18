import { getSession } from "next-auth/react";
import db from "../../../../lib/db";

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session || session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;

    if (req.method === 'DELETE') {
        try {
            await db.query("DELETE FROM users WHERE id = ?", [id]);
            res.status(200).json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'DB Error' });
        }
    } else if (req.method === 'PUT') {
        const { role, plan } = req.body;
        try {
            // Update role or plan
            await db.query("UPDATE users SET role = ?, plan = ? WHERE id = ?", [role, plan, id]);
            res.status(200).json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'DB Error' });
        }
    } else {
        res.status(405).end();
    }
}
