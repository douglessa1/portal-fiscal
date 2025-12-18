import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

/**
 * FilterBar - Barra de filtros avançados
 */
export default function FilterBar({
    onFilterChange,
    categories = [],
    availableTags = [],
    currentFilters = {}
}) {
    const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(currentFilters.category || 'Todas');
    const [selectedTags, setSelectedTags] = useState(currentFilters.tags || []);
    const [sortBy, setSortBy] = useState(currentFilters.sort || 'newest');
    const [showFilters, setShowFilters] = useState(false);

    const sortOptions = [
        { value: 'newest', label: 'Mais recentes' },
        { value: 'popular', label: 'Mais votados' },
        { value: 'unanswered', label: 'Sem resposta' },
        { value: 'trending', label: 'Em alta' }
    ];

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        // Debounce: emitir mudança após 500ms
        setTimeout(() => {
            onFilterChange({ search: value });
        }, 500);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        onFilterChange({ category });
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        onFilterChange({ sort: value });
    };

    const toggleTag = (tag) => {
        const newTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];
        setSelectedTags(newTags);
        onFilterChange({ tags: newTags });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('Todas');
        setSelectedTags([]);
        setSortBy('newest');
        onFilterChange({ search: '', category: 'Todas', tags: [], sort: 'newest' });
    };

    const hasActiveFilters = searchTerm || selectedCategory !== 'Todas' || selectedTags.length > 0 || sortBy !== 'newest';

    return (
        <div className="space-y-4">
            {/* Main Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar discussões..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    />
                </div>

                {/* Sort */}
                <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="px-4 py-2.5 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium min-w-[180px]"
                >
                    {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Toggle Advanced Filters */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2.5 rounded-lg border font-medium text-sm transition-all flex items-center gap-2 ${showFilters || hasActiveFilters
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-input bg-background hover:bg-muted'
                        }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filtros
                    {hasActiveFilters && (
                        <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {(selectedCategory !== 'Todas' ? 1 : 0) + selectedTags.length}
                        </span>
                    )}
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2.5 rounded-lg border border-input bg-background hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all text-sm font-medium"
                    >
                        Limpar
                    </button>
                )}
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
                <div className="bg-muted/50 border border-border rounded-lg p-6 space-y-6 animate-in slide-in-from-top-4 fade-in duration-200">
                    {/* Categories */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Categoria</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'bg-background border border-input hover:border-primary/50 hover:bg-primary/5'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {availableTags.slice(0, 12).map(tag => (
                                <button
                                    key={tag.slug}
                                    onClick={() => toggleTag(tag.slug)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${selectedTags.includes(tag.slug)
                                            ? 'shadow-sm'
                                            : 'hover:scale-105'
                                        }`}
                                    style={{
                                        backgroundColor: selectedTags.includes(tag.slug) ? tag.color : `${tag.color}15`,
                                        color: selectedTags.includes(tag.slug) ? '#fff' : tag.color,
                                        borderColor: `${tag.color}40`
                                    }}
                                >
                                    {tag.name}
                                    {selectedTags.includes(tag.slug) && (
                                        <X className="w-3 h-3 inline ml-1" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Filters Summary */}
                    {hasActiveFilters && (
                        <div className="pt-4 border-t border-border">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    {selectedTags.length > 0 && `${selectedTags.length} tags selecionadas`}
                                    {selectedCategory !== 'Todas' && ` • Categoria: ${selectedCategory}`}
                                </span>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-destructive hover:underline font-medium"
                                >
                                    Limpar todos os filtros
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
