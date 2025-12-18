import { createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';

const AuthContext = createContext({});

/**
 * AuthProvider - Adapter leve sobre NextAuth
 * Nota: NextAuth é a fonte da verdade. Este é apenas um wrapper conveniente.
 */
export function AuthProvider({ children }) {
    const { data: session, status } = useSession();

    const value = {
        user: session?.user || null,
        loading: status === 'loading',
        isAuthenticated: !!session,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
