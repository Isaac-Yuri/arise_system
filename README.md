# 🌌 Sistema Arise: O seu sistema MVP de evolução gamificada

O **Sistema Arise** é uma plataforma de produtividade e gamificação inspirada na estética e nas mecânicas de evolução de *Solo Leveling*. O objetivo é transformar suas tarefas diárias (Daily Quests) em missões reais de RPG, permitindo que você acumule experiência (XP), suba de nível e desperte o seu verdadeiro potencial.

---

## 🚀 Funcionalidades Atuais (v0.1)

O sistema central já está operando com as seguintes fundações:

*   **Portal de Autenticação da Guilda:** Controle de acesso seguro com rotas protegidas, cadastro de codinome de Hunter, login tradicional e login social via Google OAuth.
*   **Interface de Caçador (Dark/Cyberpunk):** Design imersivo utilizando Tailwind CSS, efeitos de aura neon azul, fontes monoespaçadas e uma barra de progresso dinâmica de XP.
*   **Painel de Daily Quests:** Gerenciamento completo de missões diárias com *Optimistic Updates* (criação, edição in-line, conclusão e exclusão de tarefas em tempo real).
*   **Mecânica de Level Up:** Sistema de cálculo automatizado onde completar missões garante XP, e atingir o limite da barra aciona o avanço de nível com alertas visuais integrados via *Sonner*.

---

## 🗺️ Roadmap de Evolução (v0.2)

Abaixo está o planejamento de desenvolvimento para os próximos passos do sistema. Sinta-se livre para acompanhar o progresso das implementações:

- [X] **PASSO 1: RANKS DE MISSÃO & XP DINÂMICO**
  - [X] Criar coluna de texto/enum (`difficulty_rank`) na tabela `daily_tasks` do Supabase (Ranks: E, D, C, B, A, S).
  - [X] Atualizar o arquivo `gameconfig.ts` com o mapeamento de XP por Rank (Rank E: +10 XP até Rank S: +300 XP).
  - [X] Modificar o `QuestForm.tsx` para incluir um campo de seleção de Rank ao criar a tarefa.
  - [X] Alterar a função `toggleTask` no `Dashboard.tsx` para somar/subtrair o valor de XP dinâmico correspondente ao Rank.

- [X] **PASSO 2: VISUAL DOS CARDS DE TAREFA & RECOMPENSAS**
  - [X] Modificar o `QuestItem.tsx` para exibir um badge com o Rank e o XP da missão abaixo do título (Ex: `[RANK C] +40 XP`).
  - [X] Criar mapeamento de cores neon no Tailwind baseado no Rank da tarefa (Zinco para Rank E, Vermelho para Rank A, Dourado com pulso para Rank S).

- [X] **PASSO 3: SISTEMA DE RANKS PARA O CAÇADOR (PLAYER RANKS)**
  - [X] Adicionar a coluna `rank` na tabela `users` do Supabase (Padrão inicial: `E`).
  - [X] Implementar a lógica de evolução de Rank por faixas de nível na função de Level Up do `Dashboard.tsx` (Ex: Rank D no Nível 10, Rank S no Nível 70+).
  - [X] Atualizar o `ProfileHeader.tsx` para exibir o Rank atual ao lado do nível (Ex: `LVL 12 · RANK D`).

- [X] **PASSO 4: CORES DINÂMICAS DO APP CONFORME O RANK DO CAÇADOR**
  - [X] Mapear as auras blur de fundo do aplicativo com base no Rank do jogador carregado do banco.
  - [X] Tornar a atmosfera visual responsiva (o app inteiro muda de tom conforme o Hunter se torna mais poderoso).

- [X] **PASSO 5: O EVENTO DE "DESPERTAR" (ONBOARDING)**
  - [X] Criar a coluna booleana `has_awakened` na tabela `users` do Supabase.
  - [X] Desenvolver uma tela de introdução preta com efeito de digitação lenta (*typewriter*) simulando as caixas de alerta do Sistema de Solo Leveling avaliando a mana do jogador.
  - [X] Bloquear o painel até que o jogador clique em `[ ACEITAR DESPERTAR ]`, atualizando o banco de dados.

---

## 🛠️ Tecnologias Utilizadas

*   **Front-end:** React, TypeScript, Tailwind CSS, React Router.
*   **Back-end & Auth:** Supabase (Auth & PostgreSQL).
*   **Notificações:** Sonner (Alertas customizados com tema escuro).
*   **Deploy:** Vercel.

---
*Mantenha o foco, complete suas quests diárias e evite a Zona de Penalidade.*