import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-border py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-muted-foreground text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} Portal Fiscal — Todos os direitos reservados.</div>
          <div className="flex gap-4">
            <Link href="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-primary transition-colors">Termos</Link>
            <Link href="/contato" className="hover:text-primary transition-colors">Contato</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
