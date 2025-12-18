# Portal Fiscal 📊

Portal web completo para ferramentas fiscais e tributárias, desenvolvido com Next.js. Inclui calculadoras especializadas, área de usuário, sistema de autenticação e muito mais.

## 🚀 Funcionalidades

### Ferramentas Fiscais
- **Calculadora DIFAL** - Diferencial de Alíquota para operações interestaduais
- **Calculadora ICMS-ST** - Substituição Tributária do ICMS
- **Calculadora Simples Nacional** - Inclui Fator R e comparativo com Lucro Presumido
- **Validador SPED** - Validação estrutural de arquivos fiscais
- **Calculadora de Margem de Lucro** - Formação de preço e margem reversa
- **Gerador de Guia Tributária** - Geração automatizada de guias de impostos

### Recursos Adicionais
- Sistema de autenticação (Login/Registro)
- Dashboard de usuário
- Histórico de simulações
- Sistema de alertas fiscais
- Importação de arquivos XML
- Modo claro/escuro

## 🛠️ Tecnologias Utilizadas

- **Framework**: Next.js 13+
- **Estilização**: Tailwind CSS
- **Banco de Dados**: PostgreSQL (Neon) / SQLite (desenvolvimento)
- **ORM**: Knex.js
- **Autenticação**: JWT
- **Parsing XML**: xml2js

## 📋 Pré-requisitos

- Node.js 16.x ou superior
- npm ou yarn
- PostgreSQL (para produção)

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd Portal\ Fiscal
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo de exemplo e configure suas variáveis:
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas configurações:
- `NEXT_PUBLIC_SITE_TITLE`: Nome do site
- `JWT_SECRET`: Chave secreta para JWT (use uma string aleatória segura)
- `DATABASE_URL`: URL de conexão com o banco de dados

4. **Execute as migrações do banco de dados**
```bash
npm run migrate
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse http://localhost:3000 no seu navegador.

## 📦 Deploy

### Vercel (Recomendado)

1. Faça push do código para um repositório GitHub
2. Importe o projeto no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente no painel da Vercel
4. Deploy automático será configurado para cada push

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 🗂️ Estrutura do Projeto

```
Portal Fiscal/
├── components/     # Componentes React reutilizáveis
├── pages/          # Páginas Next.js e rotas API
├── lib/            # Utilitários e funções auxiliares
├── styles/         # Arquivos CSS globais
├── public/         # Arquivos estáticos
├── db/             # Migrações e seeds do banco
└── scripts/        # Scripts de automação
```

## ⚠️ Notas Importantes

### Segurança
- Este é um MVP. Para produção, implemente:
  - Hash de senhas com bcrypt
  - Rate limiting
  - Validação rigorosa de inputs
  - HTTPS obrigatório
  - Proteção CSRF

### Performance
- Para processamento de XMLs em produção, considere:
  - Armazenamento em S3/Cloud Storage
  - Processamento em background (Redis Queue / BullMQ)
  - Cache de resultados

## 📝 Licença

Este projeto é de uso privado.

## 👥 Contribuindo

Para contribuir com o projeto:
1. Faça um fork
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📞 Suporte

Para questões e suporte, abra uma issue no repositório.
