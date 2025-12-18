import { getSession } from "next-auth/react";
import db from "../../../../lib/db";

export default async function handler(req, res) {
    const session = await getSession({ req });
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            // 1. User Info
            const userRes = await db.query(`
                SELECT id, name, email, role, plan, created_at 
                FROM users 
                WHERE id = ?
            `, [id]);

            if (userRes.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            const user = userRes.rows[0];

            // 2. Stats (Followers, Following, Posts Count)
            const followersRes = await db.query("SELECT COUNT(*) as count FROM follows WHERE following_id = ?", [id]);
            const followingRes = await db.query("SELECT COUNT(*) as count FROM follows WHERE follower_id = ?", [id]);
            const postsCountRes = await db.query("SELECT COUNT(*) as count FROM posts WHERE user_id = ?", [id]);

            // 3. Check if current user follows this profile
            let isFollowing = false;
            if (session) {
                const checkFollow = await db.query(
                    "SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?",
                    [session.user.id, id]
                );
                isFollowing = checkFollow.rows.length > 0;
            }

            // 4. Recent Posts
            const postsRes = await db.query(`
                SELECT p.*, (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comments_count 
                FROM posts p 
                WHERE p.user_id = ? 
                ORDER BY p.created_at DESC 
                LIMIT 10
            `, [id]);

            res.status(200).json({
                user: {
                    ...user,
                    stats: {
                        followers: followersRes.rows[0].count,
                        following: followingRes.rows[0].count,
                        posts: postsCountRes.rows[0].count
                    },
                    isFollowing
                },
                posts: postsRes.rows
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'DB Error' });
        }
    } else {
        res.status(405).end();
    }
}
