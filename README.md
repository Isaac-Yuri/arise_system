# 🌌 Sistema Arise: O seu ecossistema de evolução gamificada

O **Sistema Arise** é uma plataforma de produtividade e gamificação profundamente inspirada na estética, atmosfera e mecânicas de evolução de *Solo Leveling*. O objetivo é transformar a monotonia das suas tarefas diárias (Daily Quests) em missões reais de RPG, permitindo que você acumule experiência (XP), junte riquezas, suba de nível e gerencie seu inventário rumo ao Rank S.

---

## 🚀 Funcionalidades Consolidadas (v0.1 & v0.2)

O sistema central opera com as seguintes fundações de caça:

*   **Portal de Autenticação da Guilda:** Controle de acesso seguro com rotas protegidas, cadastro de codinome de Hunter, login tradicional e login social via Google OAuth.
*   **O Evento de "Despertar" (Onboarding):** Tela de introdução imersiva simulando as caixas de texto do Sistema avaliando o poder do jogador, bloqueando o painel até o caçador aceitar o seu despertar.
*   **Ranks Dinâmicos (Hunter & Tasks):** Divisão de missões e jogadores em Ranks (E, D, C, B, A, S). A atmosfera e as auras neon (Tailwind) do aplicativo inteiro mudam de cor dinamicamente com base no Rank atual do Caçador.
*   **Painel de Daily Quests:** Gerenciamento completo de missões com *Optimistic Updates* (criação, edição in-line, conclusão e exclusão em tempo real), onde cada Rank de missão concede quantidades proporcionais de XP.
*   **Mecânica de Level Up:** Cálculo automatizado de avanço de nível com alertas visuais integrados via *Sonner*.

---

## 🗺️ Roadmap de Evolução v0.3:

Abaixo está o planejamento de desenvolvimento para a próxima grande expansão do ecossistema. 

- [ ] **PASSO 1: RECONSTRUÇÃO DA MATRIX (MIGRAÇÃO PARA NEXT.JS)**
    - [ ] Inicializar o novo repositório utilizando Next.js (App Router) e TypeScript.
    - [ ] Migrar as regras de negócio, contextos globais e integrações do Supabase desenvolvidas nas versões anteriores.
    - [ ] Criar um **Menu Responsivo Global**: Sidebar fixa para Desktop e Bottom Navigation Bar (barra inferior) focada em dispositivos Mobile, garantindo acesso rápido a todas as abas.

- [ ] **PASSO 2: INTEGRAÇÃO DO SCANNER DE IA (AVALIAÇÃO DE PORTÃO)**
    - [ ] Integrar a API de LLM (Vercel AI SDK / Gemini API) nas rotas de backend do Next.js.
    - [ ] Desenvolver o botão `[ ESCANEAR TAREFA ]` no formulário de criação de quests.
    - [ ] Implementar prompt estruturado para que a IA analise o texto da tarefa e retorne uma recomendação automática do Rank de dificuldade (E a S) com uma breve justificativa.

- [ ] **PASSO 3: SISTEMA DE STREAK & PENALIDADES DIÁRIAS**
    - [ ] Adicionar colunas `streak_count` e `last_check_in` na tabela de usuários.
    - [ ] Criar cron/função de verificação diária: manter a constância de missões concluídas aumenta o multiplicador de Streak. Falhar por mais de 24 horas reseta o contador (ou aciona o status de penalidade).

- [ ] **PASSO 4: ECONOMIA DO SISTEMA (ARISE COINS & LOJA)**
    - [ ] Criar a coluna `arise_coins` no banco de dados e atualizar as funções de conclusão de missões para renderem moedas além de XP.
    - [ ] Desenvolver a interface da **Loja do Sistema (The Shop)** com cards estilizados para compra de itens de buffs e recompensas da vida real.
    - [ ] Implementar lógica de inventário para itens como: *2 horas de lazer*, *Poção de Double XP* (ativa flag temporária de multiplicador de experiência) e itens de recuperação.

- [ ] **PASSO 5: IDENTIDADE DO CAÇADOR (CUSTOMIZAÇÃO DE PERFIL)**
    - [ ] Desenvolver a tela de Perfil com formulários para alteração de metadados do jogador (Nome/Codinome).
    - [ ] Configurar um Bucket no Storage do Supabase para upload de imagens.
    - [ ] Implementar a funcionalidade de adicionar/alterar Foto de Perfil com compressão de imagem no front-end.

---

## 🛠️ Tecnologias Utilizadas

*   **Framework Base:** Next.js (App Router) & TypeScript.
*   **Estilização & UI:** Tailwind CSS.
*   **Back-end & Infraestrutura:** Supabase (PostgreSQL, Auth & Storage).
*   **Notificações:** Sonner (Alertas customizados com tema escuro).
*   **Deploy:** Vercel.

---
*Mantenha o foco, acumule suas Arise Coins e não quebre o seu Streak. O Sistema observa tudo.*