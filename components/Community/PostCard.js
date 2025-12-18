import Link from 'next/link';
import { MessageSquare, Eye, Pin, CheckCircle, Bookmark, MapPin } from 'lucide-react';
import VoteButtons from './VoteButtons';
import { TagList } from './TagPill';
import { BadgeList } from './UserBadge';
import { POST_TYPES } from '../../lib/community/postTypes';
import { REFORMA_TAGS } from '../../lib/community/reformaTags';

/**
 * PostCard - Card moderno de post no feed
 * Suporta tipos estruturados e tags de Reforma Tributária
 */
export default function PostCard({ post, variant = 'full', showVoting = true, showBookmark = true, onVoteUpdate }) {
    const {
        id,
        title,
        content,
        author_name,
        author_id,
        author_role,
        author_badges = [],
        category,
        tags = [],
        upvotes = 0,
        downvotes = 0,
        user_vote = null,
        comments_count = 0,
        views = 0,
        is_solved = false,
        pinned = false,
        created_at,
        updated_at,
        // Novos campos estruturados
        post_type,
        reforma_tag,
        tributo,
        regime,
        uf_origem,
        uf_destino,
        structured_data
    } = post;

    const postTypeInfo = post_type ? POST_TYPES[post_type] : null;
    const reformaTagInfo = reforma_tag ? REFORMA_TAGS.find(t => t.id === reforma_tag) : null;

    const getAvatar = (name) => (name ? name[0].toUpperCase() : 'U');

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = {
            ano: 31536000,
            mês: 2592000,
            semana: 604800,
            dia: 86400,
            hora: 3600,
            minuto: 60
        };

        for (const [name, value] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / value);
            if (interval >= 1) {
                return `há ${interval} ${name}${interval > 1 ? 's' : ''}`;
            }
        }
        return 'agora mesmo';
    };

    return (
        <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative">
            {/* Accent border on hover */}
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className={`flex ${showVoting ? 'gap-4' : ''} p-6`}>
                {/* Voting Sidebar */}
                {showVoting && (
                    <div className="flex-shrink-0">
                        <VoteButtons
                            targetType="post"
                            targetId={id}
                            upvotes={upvotes}
                            downvotes={downvotes}
                            userVote={user_vote}
                            orientation="vertical"
                            onVote={onVoteUpdate}
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <Link href={`/perfil/${author_id}`}>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20 group-hover:scale-105 transition-transform cursor-pointer">
                                    {getAvatar(author_name)}
                                </div>
                            </Link>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Link
                                        href={`/perfil/${author_id}`}
                                        className="font-semibold hover:text-primary transition-colors truncate"
                                    >
                                        {author_name}
                                    </Link>
                                    {author_badges.length > 0 && (
                                        <BadgeList badges={author_badges} maxBadges={2} />
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                    {getTimeAgo(created_at)} • {category}
                                </div>
                            </div>
                        </div>

                        {/* Meta Badges */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {pinned && (
                                <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-md" title="Fixado">
                                    <Pin className="w-4 h-4" />
                                </div>
                            )}
                            {is_solved && (
                                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md" title="Resolvido">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Type Badges Row */}
                    {(postTypeInfo || reformaTagInfo || uf_origem) && (
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            {postTypeInfo && (
                                <span
                                    className="text-xs font-bold px-2 py-1 rounded"
                                    style={{ backgroundColor: postTypeInfo.color, color: '#fff' }}
                                >
                                    {postTypeInfo.icon} {postTypeInfo.label}
                                </span>
                            )}
                            {reformaTagInfo && (
                                <span
                                    className="text-xs font-bold px-2 py-1 rounded"
                                    style={{
                                        backgroundColor: reformaTagInfo.color,
                                        color: reformaTagInfo.id === 'transicao' ? '#000' : '#fff'
                                    }}
                                >
                                    {reformaTagInfo.icon} {reformaTagInfo.shortLabel}
                                </span>
                            )}
                            {uf_origem && (
                                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {uf_origem}{uf_destino ? ` → ${uf_destino}` : ''}
                                </span>
                            )}
                            {tributo && (
                                <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                    {tributo.toUpperCase()}
                                </span>
                            )}
                            {regime && (
                                <span className="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                    {regime}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Post Content */}
                    <Link href={`/comunidade/${id}`} className="block mb-4">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                            {title}
                        </h3>
                        {variant === 'full' && (
                            <p className="text-muted-foreground leading-relaxed line-clamp-3">
                                {content}
                            </p>
                        )}
                    </Link>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="mb-4">
                            <TagList tags={tags} maxTags={4} size="sm" />
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                            <Link
                                href={`/comunidade/${id}`}
                                className="flex items-center gap-2 hover:text-primary transition-colors"
                            >
                                <MessageSquare className="w-5 h-5" />
                                <span>{comments_count} {comments_count === 1 ? 'resposta' : 'respostas'}</span>
                            </Link>
                            <div className="flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                <span>{views} {views === 1 ? 'visualização' : 'visualizações'}</span>
                            </div>
                        </div>

                        {showBookmark && (
                            <button
                                className="p-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                title="Salvar"
                            >
                                <Bookmark className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
