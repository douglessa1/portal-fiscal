import { useTheme } from './ui/ThemeProvider';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);

    // Evitar erro de hidratação
    useEffect(() => {
        setMounted(true);
    }, []);

    // Usar hook com segurança
    let theme = 'light';
    let toggleTheme = () => { };

    try {
        const themeContext = useTheme();
        theme = themeContext.theme;
        toggleTheme = themeContext.toggleTheme;
    } catch (error) {
        // ThemeProvider não está montado ainda
        console.warn('ThemeToggle: ThemeProvider not available');
    }

    if (!mounted) {
        return <div className="w-14 h-7" />; // Placeholder
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full bg-muted transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            aria-label="Toggle dark mode"
        >
            <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-background transition-transform duration-300 flex items-center justify-center text-xs shadow-sm ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
                    }`}
            >
                {theme === 'light' ? '☀️' : '🌙'}
            </span>
        </button>
    );
}
