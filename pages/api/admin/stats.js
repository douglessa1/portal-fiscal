import { getSession } from "next-auth/react";
import db from "../../../lib/db";

export default function handler(req, res) {
    // Basic protection manually here or use middleware
    // We already check in frontend, but good to check status
    return handleStats(req, res);
}

async function handleStats(req, res) {
    const session = await getSession({ req });
    if (!session || session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        // Count Users
        const usersCount = await db.query('SELECT COUNT(*) as count FROM users');
        const totalUsers = usersCount.rows[0].count; // SQLite returns array of objects, PG returns rows array? 
        // Need to be careful with knex raw result structure difference.
        // My lib/db.js wrapper normalizes to .rows for both!

        // Count Pro Users
        const proCount = await db.query("SELECT COUNT(*) as count FROM users WHERE plan = 'pro'");

        // Count Reports
        const reportsCount = await db.query("SELECT COUNT(*) as count FROM reports WHERE status = 'open'");

        // Recent Reports
        const recentReports = await db.query("SELECT * FROM reports ORDER BY created_at DESC LIMIT 5");

        res.status(200).json({
            stats: {
                totalUsers: totalUsers,
                activeSubs: proCount.rows[0].count,
                openReports: reportsCount.rows[0].count,
                mrr: proCount.rows[0].count * 99.90 // Mocked price
            },
            recentReports: recentReports.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
