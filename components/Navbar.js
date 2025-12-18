import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { NotificationPanel } from './Notifications/NotificationPanel';
import { usePlan } from './Permissions/PlanProvider';
import { useTheme } from './ui/ThemeProvider';
import { Sun, Moon, LogOut, User, Settings, Trophy, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const { planInfo } = usePlan();
  const { theme, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border fixed top-0 left-0 right-0 z-40 backdrop-blur-sm bg-background/95">
      <div className="flex items-center justify-between h-[70px] px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
              PF
            </div>
            <span>Portal Fiscal</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/ferramentas/difal" className="hover:text-foreground transition-colors">Ferramentas</Link>
          <Link href="/noticias" className="hover:text-foreground transition-colors">Notícias</Link>
          <Link href="/comunidade" className="hover:text-foreground transition-colors">Comunidade</Link>
          <Link href="/planos" className="hover:text-foreground transition-colors">Planos</Link>
          <Link href="/api-docs" className="hover:text-foreground transition-colors">API</Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {session ? (
            <>
              {/* Notifications */}
              <NotificationPanel />

              {/* User Menu */}
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <span className="text-sm font-medium text-primary">
                        {session.user?.name?.[0] || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-foreground truncate max-w-[120px]">
                      {session.user?.name?.split(' ')[0] || 'Usuário'}
                    </div>
                    <div className="text-xs text-muted-foreground">{planInfo?.name || 'FREE'}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 py-2">
                    <div className="px-4 py-2 border-b border-border">
                      <div className="text-sm font-medium text-foreground">{session.user?.name}</div>
                      <div className="text-xs text-muted-foreground">{session.user?.email}</div>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                      <User className="w-4 h-4 text-muted-foreground" /> Dashboard
                    </Link>
                    <Link href="/perfil/conquistas" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                      <Trophy className="w-4 h-4 text-muted-foreground" /> Conquistas
                    </Link>
                    <Link href="/configuracoes" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                      <Settings className="w-4 h-4 text-muted-foreground" /> Configurações
                    </Link>
                    <div className="border-t border-border mt-2 pt-2">
                      <button onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                Entrar
              </Link>
              <Link href="/auth/register" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

