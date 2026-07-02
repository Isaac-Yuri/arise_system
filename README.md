# 🌌 Sistema Arise: O seu ecossistema de evolução gamificada

O **Sistema Arise** é uma plataforma de produtividade e gamificação profundamente inspirada na estética, atmosfera e mecânicas de evolução de *Solo Leveling*. O objetivo é transformar a monotonia das suas tarefas diárias (Daily Quests) em missões reais de RPG, permitindo que você acumule experiência (XP), junte riquezas, suba de nível e gerencie seu inventário rumo ao Rank S.

---

## 🚀 Funcionalidades Consolidadas (v0.1 & v0.2)

O sistema central opera com as seguintes fundações de caça:

* **Portal de Autenticação da Guilda:** Controle de acesso seguro com rotas protegidas, cadastro de codinome de Hunter, login tradicional e login social via Google OAuth.
* **O Evento de "Despertar" (Onboarding):** Tela de introdução imersiva simulando as caixas de texto do Sistema avaliando o poder do jogador, bloqueando o painel até o caçador aceitar o seu despertar.
* **Ranks Dinâmicos (Hunter & Tasks):** Divisão de missões e jogadores em Ranks (E, D, C, B, A, S). A atmosfera e as auras neon (Tailwind) do aplicativo inteiro mudam de cor dinamicamente com base no Rank atual do Caçador.
* **Painel de Daily Quests:** Gerenciamento completo de missões com *Optimistic Updates* (criação, edição in-line, conclusão e exclusão em tempo real), onde cada Rank de missão concede quantidades proporcionais de XP.
* **Mecânica de Level Up:** Cálculo automatizado de avanço de nível com alertas visuais integrados via *Sonner*.

---

## 🗺️ Roadmap de Evolução (v0.3)

Abaixo está o planejamento de desenvolvimento para a consolidação da interface e introdução da economia e inteligência artificial diretamente no ecossistema atual.

- [X] **PASSO 1: A MATRIZ DE NAVEGAÇÃO (MENU RESPONSIVO GLOBAL)**
    - [X] Criar um layout de navegação unificado utilizando React Router.
    - [X] Desenvolver um **Menu Responsivo**: Sidebar lateral fixa com efeito blur/neon para telas Desktop (`md:flex`) e uma Bottom Navigation Bar (barra inferior) compacta e anatômica para dispositivos Mobile (`md:hidden`).
    - [X] Configurar o roteamento para as três abas principais: Dashboard, Loja e Perfil.

- [ ] **PASSO 2: ECONOMIA E COINS (ARISE COINS & LOJA)**
    - [X] Adicionar a coluna `arise_coins` na tabela de usuários do Supabase.
    - [X] Atualizar os hooks `useQuests` e `usePlayer` para que a conclusão de tarefas recompense o jogador com moedas (além do XP tradicional do Rank).
    - [X] Desenvolver a interface da **Loja do Sistema (Loja)** com cards estilizados no tema Dark/Cyberpunk.
    - [ ] Implementar a lógica de inventário/consumo para itens de recompensa real: *2 horas de lazer*, *Poção de Double XP* (ativa um multiplicador temporário no estado global do player).

- [ ] **PASSO 3: INTEGRAÇÃO DO SCANNER DE IA (AVALIAÇÃO DE PORTÃO)**
    - [ ] Configurar a integração direta do front-end com a API do Gemini utilizando chaves seguras ou através de uma Edge Function do Supabase.
    - [ ] Adicionar o botão `[ ESCANEAR TAREFA ]` com animação de pulso neon no formulário de criação de quests.
    - [ ] Desenvolver o prompt estruturado para que a IA analise a descrição da tarefa e retorne uma recomendação automática do Rank ideal (E a S) e uma justificativa curta.

- [ ] **PASSO 4: SISTEMA DE STREAK & PENALIDADES DIÁRIAS**
    - [ ] Criar colunas `streak_count` e `last_check_in` (timestamp) na tabela de perfis do Supabase.
    - [ ] Desenvolver lógica no carregamento do app para validar a constância: manter missões diárias ativas incrementa o combo de Streak; passar de 24 horas sem atividade quebra a sequência (ou gera status de penalidade).