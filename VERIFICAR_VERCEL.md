# Como Verificar Commit e Branch na Vercel

## 🎯 Objetivo
Confirmar qual commit e branch a Vercel está usando para buildar o Portal Fiscal.

---

## 📋 Passo 1: Acessar o Dashboard da Vercel

1. Abra seu navegador
2. Vá para: **https://vercel.com**
3. Faça login (se necessário)
4. Você verá a lista de projetos

---

## 📋 Passo 2: Abrir o Projeto Portal Fiscal

1. Clique no projeto **"portal-fiscal"** (ou "douglessa1s-projects/portal-fiscal")
2. Você será levado para a página inicial do projeto

---

## 📋 Passo 3: Ver o Último Deployment

### Opção A: Pela aba Deployments
1. Clique na aba **"Deployments"** no topo
2. O primeiro item da lista é o deployment mais recente em produção
3. Você verá:
   - **Status:** ✅ Ready (verde)
   - **Branch:** (nome da branch, ex: "main")
   - **Commit:** (mensagem do commit + SHA curto)

### Opção B: Pela página inicial
1. Na página inicial do projeto, você verá um card grande com **"Production Deployment"**
2. Abaixo dele terá:
   - **Branch:** (ex: main, dev, staging)
   - **Commit:** Mensagem + SHA

---

## 📋 Passo 4: Ver o Commit SHA Completo

1. **Clique** no deployment (card ou linha da tabela)
2. Você entrará na página de detalhes do deployment
3. No topo, procure por:
   - **"Source"** ou **"Commit"**
   - Terá o **SHA completo** (ex: `5a877d8abc123...`)
   - E o **link para o commit no GitHub**

---

## 📋 Passo 5: Verificar Production Branch (Configuração)

1. Na página do projeto, clique em **"Settings"** (aba no topo)
2. No menu lateral esquerdo, clique em **"Git"**
3. Procure por **"Production Branch"**
4. Confirme qual branch está configurada (deve ser **"main"**)

---

## ✅ O que me informar

Depois de seguir os passos, me diga:

**3️⃣ Production Branch:**  
(Ex: "main", "dev", "staging", etc.)

**4️⃣ Commit SHA do último deploy:**  
(Ex: "5a877d8", "a71f704", ou outro)

---

## 🎯 Por que isso é importante?

Se o commit for **diferente de 5a877d8** (ou posterior), significa que a Vercel está buildando de um commit antigo que ainda tem `pages/home.js`.

Se a branch for **diferente de "main"**, significa que a Vercel está buildando de outra branch que pode ter código diferente.

---

## 💡 Atalho Rápido

Se preferir, você pode ir direto para:
**https://vercel.com/douglessa1s-projects/portal-fiscal**

E clicar no último deployment para ver todas as informações.
