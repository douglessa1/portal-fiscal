import Link from 'next/link';

/**
 * TagPill - Tag colorida clicável
 * 
 * @param {Object} props
 * @param {Object} props.tag - { name, slug, color, postCount? }
 * @param {boolean} props.showCount - Mostrar contagem de posts
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {boolean} props.clickable - Se deve ser um link
 */
export default function TagPill({ tag, showCount = false, size = 'md', clickable = true }) {
    const { name, slug, color = '#3b82f6', postCount } = tag;

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-1.5'
    };

    const content = (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200 ${sizeClasses[size]} ${clickable ? 'hover:shadow-md hover:scale-105 cursor-pointer' : ''
                }`}
            style={{
                backgroundColor: `${color}15`,
                color: color,
                borderColor: `${color}40`,
                borderWidth: '1px',
                borderStyle: 'solid'
            }}
        >
            <span>{name}</span>
            {showCount && postCount !== undefined && (
                <span className="text-xs opacity-70">
                    {postCount}
                </span>
            )}
        </span>
    );

    if (clickable && slug) {
        return (
            <Link href={`/comunidade?tag=${slug}`} className="inline-block">
                {content}
            </Link>
        );
    }

    return content;
}

/**
 * TagList - Lista de tags
 */
export function TagList({ tags, showCount = false, size = 'md', maxTags = null }) {
    const displayTags = maxTags ? tags.slice(0, maxTags) : tags;
    const remaining = maxTags && tags.length > maxTags ? tags.length - maxTags : 0;

    return (
        <div className="flex flex-wrap gap-2 items-center">
            {displayTags.map(tag => (
                <TagPill
                    key={tag.slug || tag.name}
                    tag={tag}
                    showCount={showCount}
                    size={size}
                />
            ))}
            {remaining > 0 && (
                <span className="text-xs text-muted-foreground">
                    +{remaining} mais
                </span>
            )}
        </div>
    );
}
