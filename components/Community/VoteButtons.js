import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * VoteButtons - Sistema de votação (upvote/downvote)
 * 
 * @param {Object} props
 * @param {string} props.targetType - 'post' ou 'comment'
 * @param {number} props.targetId - ID do post ou comment
 * @param {number} props.upvotes - Contagem de upvotes
 * @param {number} props.downvotes - Contagem de downvotes
 * @param {string|null} props.userVote - 'up', 'down', ou null
 * @param {'vertical'|'horizontal'} props.orientation - Orientação dos botões
 * @param {Function} props.onVote - Callback ao votar
 */
export default function VoteButtons({
    targetType,
    targetId,
    upvotes = 0,
    downvotes = 0,
    userVote = null,
    orientation = 'vertical',
    onVote
}) {
    const [isVoting, setIsVoting] = useState(false);
    const score = upvotes - downvotes;

    const handleVote = async (voteType) => {
        if (isVoting) return;

        setIsVoting(true);
        try {
            // Se o usuário clicou no mesmo voto, remove o voto
            const newVoteType = userVote === voteType ? 'remove' : voteType;

            const res = await fetch(`/api/community/${targetType}s/${targetId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ voteType: newVoteType })
            });

            if (!res.ok) {
                throw new Error('Falha ao votar');
            }

            const data = await res.json();

            // Call parent callback com os novos dados
            if (onVote) {
                onVote(data);
            }
        } catch (error) {
            console.error('Vote error:', error);
            alert('Erro ao votar. Por favor, faça login.');
        } finally {
            setIsVoting(false);
        }
    };

    const isVertical = orientation === 'vertical';

    return (
        <div className={`flex ${isVertical ? 'flex-col' : 'flex-row'} items-center gap-1`}>
            {/* Upvote Button */}
            <button
                onClick={() => handleVote('up')}
                disabled={isVoting}
                className={`group p-1.5 rounded-md transition-all duration-200 ${userVote === 'up'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'text-muted-foreground hover:bg-muted hover:text-green-600 dark:hover:text-green-400'
                    } disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
                title="Útil"
                aria-label="Upvote"
            >
                <ChevronUp
                    className={`w-5 h-5 transition-transform ${userVote === 'up' ? 'scale-110' : 'group-hover:scale-110'
                        }`}
                />
            </button>

            {/* Score Display */}
            <div className={`${isVertical ? 'py-1' : 'px-2'
                } font-bold text-sm min-w-[2rem] text-center ${score > 0 ? 'text-green-600 dark:text-green-400' :
                    score < 0 ? 'text-red-600 dark:text-red-400' :
                        'text-foreground'
                }`}>
                {score > 0 && '+'}{score}
            </div>

            {/* Downvote Button */}
            <button
                onClick={() => handleVote('down')}
                disabled={isVoting}
                className={`group p-1.5 rounded-md transition-all duration-200 ${userVote === 'down'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'text-muted-foreground hover:bg-muted hover:text-red-600 dark:hover:text-red-400'
                    } disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
                title="Não útil"
                aria-label="Downvote"
            >
                <ChevronDown
                    className={`w-5 h-5 transition-transform ${userVote === 'down' ? 'scale-110' : 'group-hover:scale-110'
                        }`}
                />
            </button>
        </div>
    );
}
