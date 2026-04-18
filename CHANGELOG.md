# Changelog

## v1.2 — ZIP único + tamanho LinkedIn otimizado

### 🎁 Novos recursos

#### Download em lote como ZIP único
- O **Gerador em Lote** agora empacota todas as capas em um arquivo ZIP único
- Nome do arquivo: `parcele-news-capas-YYYY-MM-DD.zip`
- Cada capa dentro do ZIP segue o padrão: `parcele-news-{numero-com-zero-a-esquerda}-{slug-do-titulo}.png` (ex: `parcele-news-01-pix-domina-boleto-parcelado-cresce.png`)
- Ordenação alfabética automática pelo número da edição
- Compressão DEFLATE nível 6 (balanceado entre tamanho e velocidade)

#### Tamanho de saída otimizado: 1280 × 720 px
- Todas as capas agora são exportadas em **1280 × 720 pixels** (ideal para LinkedIn e outras redes sociais em 16:9)
- O design continua sendo renderizado internamente em 1200 × 675 (para preservar todos os ajustes visuais do template)
- O `html-to-image` faz o upscaling automático via `canvasWidth`/`canvasHeight` mantendo nitidez
- Visible no label "Saída: 1280 × 720 px" nos previews

### 🔧 Implementação técnica

**Biblioteca adicionada:**
- `jszip@^3.10.1` — compactação no lado do cliente, sem backend

**Novas funções em `src/app/lib/gerarCapa.ts`:**
- `gerarCapaBlob(elemento, { tamanho })` — gera PNG e retorna Blob (para agrupar em ZIP)
- `TAMANHO_LINKEDIN` — constante exportada com `{ width: 1280, height: 720 }`
- `gerarCapaPNG(elemento, { nomeArquivo, tamanho })` — mantida para download individual (usada pelo editor)

**Fluxo do lote:**
1. Usuário clica "Baixar ZIP (N capas)"
2. Para cada capa: app muda o preview → aguarda render → `gerarCapaBlob()` → adiciona ao ZIP em memória
3. Após todas processadas: `zip.generateAsync()` → dispara download único
4. `URL.revokeObjectURL()` após 2s para liberar memória

### 💫 UX

- Botão de lote renomeado de "Baixar todas (N)" para **"Baixar ZIP (N capas)"** (mais claro)
- Ícone mudou de `Download` para **`FileArchive`** (mostra visualmente que é arquivo zipado)
- Progress bar diferencia as fases:
  - "Gerando imagens: X / Y" durante processamento individual
  - "Compactando ZIP..." na última etapa
- Mensagem final: "ZIP baixado com N capa(s)" (era "N imagens baixadas")
- Label "Saída: 1280 × 720 px" nos previews (editor e lote)

### 📊 Impacto

**Antes (v1.1):**
- 60 downloads separados, um por um, com confirmação do navegador
- Demorava vários minutos, usuário tinha que clicar "Permitir" várias vezes
- Resolução 1200×675

**Agora (v1.2):**
- 1 único arquivo ZIP baixado ao final
- Sem múltiplas confirmações do navegador
- Resolução 1280×720 (ideal para LinkedIn)
- ~40-50% mais rápido no total por não ter delays entre downloads

---

## v1.1 — Correção de bugs e revisão UI/UX

### 🐛 Correções de bugs

#### Erro `{ isTrusted: true }` ao gerar imagem (bug crítico resolvido)

**Causa raiz:** O componente `LinkedInCover` renderizava imagens (`<img>` do logo e da foto de capa) **sem o atributo `crossOrigin="anonymous"`**. Quando o `html-to-image` tentava capturar o DOM como PNG, o canvas interno do navegador era marcado como "tainted" (contaminado) por política de segurança, e o `SecurityError` se propagava como um `ErrorEvent` genérico com `isTrusted: true` e stack vazio — daí a dificuldade de diagnóstico.

**Correções aplicadas:**

1. **Assets movidos para `/public/assets/`** (mesma origem do app, não contaminam canvas):
   - `public/assets/f105090c0d8399c4c5ddf6f3b68c32fc5dfd387f.png` (logo)
   - `public/assets/94f0de88dd7da2aa7b58f6680bcc081b5b16c90f.png` (foto padrão)

2. **`LinkedInCover.tsx` reescrito:**
   - Removido `import imgLogoParceleAqui1 from "figma:asset/..."`
   - Todos os `<img>` agora têm `crossOrigin="anonymous"`
   - Helper `resolveFotoUrl()` converte paths legados `figma:asset/...` para `/assets/...` automaticamente

3. **Pré-carregamento de imagens com CORS** (`src/app/lib/gerarCapa.ts`):
   - Antes de chamar `toPng()`, cada imagem é pré-carregada via `new Image()` com `crossOrigin = "anonymous"`
   - Garante que imagens externas (Unsplash) cheguem no canvas já marcadas como CORS-safe
   - Imagens quebradas são filtradas em vez de travar a exportação

4. **Opções do `toPng` ajustadas:**
   - `skipFonts: false` (fontes Kufam embutidas corretamente)
   - `fetchRequestInit: { mode: "cors", credentials: "omit" }` para imagens externas
   - Filtro mais inteligente de nós quebrados

### 🎨 Revisão UI/UX

#### Arquitetura visual
- **Sistema de cores consistente** com variáveis centralizadas (`#0b0b0b` / `#111111` / `#141414` / `#1a1a1a` / `#1f1f1f` em escala de profundidade)
- **Amarelo marca** (`#FFC528`) usado com parcimônia só em ações primárias e highlights
- **Inputs com estilo unificado** via classe `.input-base` (padding, radius, foco, disabled coerentes)
- **Botões secundários** via `.btn-secondary` com estados hover/disabled consistentes

#### Novo App shell
- Header `sticky` com `backdrop-blur` para sensação de app moderno
- Tabs de navegação com estado ativo claro (amarelo sólido) vs inativo (hover sutil)
- Footer compacto e discreto

#### Editor individual (`CoverEditorAvancado`)
- **Preview redimensionado a 75%** pra caber na tela sem scroll horizontal em telas médias
- **Badge de status dinâmico** (`idle` / `gerando` / `sucesso` / `erro`) com ícones contextuais
- **Nome de arquivo automático**: `parcele-news-{numero}-{slug-do-titulo}.png` em vez do genérico
- **Preview do ícone ao lado do select** (feedback instantâneo sem scroll)
- **Contador de caracteres no título** com warning acima de 80 (limite visual seguro)
- **Hints informativos** sob cada campo pra explicar uso
- **Estados de loading/disabled** em todos os botões durante geração
- **Agrupamento visual das legendas** em card próprio (menos ruído)
- **Acessibilidade:** `<label htmlFor>`, `aria-pressed` nas tabs, `aria-label` em botões de ícone

#### Gerador em lote
- **Progress bar visual** durante geração das N imagens:
  - Barra preenchendo em amarelo com porcentagem
  - Contador "X / Y" em tempo real
  - Contagem separada de sucessos (verde) e erros (vermelho)
- **Painel de conclusão** com ícone de check/warning dependendo se houve erros
- **Grupos de imagem/ícone em `<details>` colapsáveis** (UI mais limpa, abre só o que está editando)
- **Indicador visual nos grupos** (checkmark verde quando tem imagem configurada)
- **Miniaturas das capas geradas** com grid responsivo 3/5/6 colunas
- **Contador dinâmico** no botão "Gerar X capas" (deixa claro o que vai acontecer)
- **Botão desabilitado** quando não há títulos (em vez de gerar 0 capas)
- **Slug automático no nome do arquivo** (fácil identificar depois no Downloads)

#### Unsplash search
- **Categorias como chips horizontais** (antes era select escondido)
- **Aspect ratio 4:3 nas miniaturas** com hover sutil
- **Indicador visual da imagem selecionada** (overlay amarelo + checkmark)
- **`loading="lazy"`** nas imagens
- **Créditos do Unsplash** visíveis (boa prática)

### 🔧 Outras melhorias

- **Helper reutilizável** `gerarCapaPNG()` em `src/app/lib/gerarCapa.ts` (evita duplicação entre Editor e Lote)
- **TypeScript mais restrito** em callbacks de erro (tipagem `Error` correta)
- **Callbacks `onSuccess`/`onError`** para UI reagir a estados
- **Limpeza de imports `figma:asset`** no componente crítico

### ⚠️ Breaking changes (mínimos)
- `fotoUrl` deve agora usar `/assets/...` ou URL externa. Paths no formato antigo `figma:asset/xxx` continuam funcionando graças ao `resolveFotoUrl()` que redireciona automaticamente pra `/assets/xxx`.

### 🐛 Correções de bugs

#### Erro `{ isTrusted: true }` ao gerar imagem (bug crítico resolvido)

**Causa raiz:** O componente `LinkedInCover` renderizava imagens (`<img>` do logo e da foto de capa) **sem o atributo `crossOrigin="anonymous"`**. Quando o `html-to-image` tentava capturar o DOM como PNG, o canvas interno do navegador era marcado como "tainted" (contaminado) por política de segurança, e o `SecurityError` se propagava como um `ErrorEvent` genérico com `isTrusted: true` e stack vazio — daí a dificuldade de diagnóstico.

**Correções aplicadas:**

1. **Assets movidos para `/public/assets/`** (mesma origem do app, não contaminam canvas):
   - `public/assets/f105090c0d8399c4c5ddf6f3b68c32fc5dfd387f.png` (logo)
   - `public/assets/94f0de88dd7da2aa7b58f6680bcc081b5b16c90f.png` (foto padrão)

2. **`LinkedInCover.tsx` reescrito:**
   - Removido `import imgLogoParceleAqui1 from "figma:asset/..."`
   - Todos os `<img>` agora têm `crossOrigin="anonymous"`
   - Helper `resolveFotoUrl()` converte paths legados `figma:asset/...` para `/assets/...` automaticamente

3. **Pré-carregamento de imagens com CORS** (`src/app/lib/gerarCapa.ts`):
   - Antes de chamar `toPng()`, cada imagem é pré-carregada via `new Image()` com `crossOrigin = "anonymous"`
   - Garante que imagens externas (Unsplash) cheguem no canvas já marcadas como CORS-safe
   - Imagens quebradas são filtradas em vez de travar a exportação

4. **Opções do `toPng` ajustadas:**
   - `skipFonts: false` (fontes Kufam embutidas corretamente)
   - `fetchRequestInit: { mode: "cors", credentials: "omit" }` para imagens externas
   - Filtro mais inteligente de nós quebrados

### 🎨 Revisão UI/UX

#### Arquitetura visual
- **Sistema de cores consistente** com variáveis centralizadas (`#0b0b0b` / `#111111` / `#141414` / `#1a1a1a` / `#1f1f1f` em escala de profundidade)
- **Amarelo marca** (`#FFC528`) usado com parcimônia só em ações primárias e highlights
- **Inputs com estilo unificado** via classe `.input-base` (padding, radius, foco, disabled coerentes)
- **Botões secundários** via `.btn-secondary` com estados hover/disabled consistentes

#### Novo App shell
- Header `sticky` com `backdrop-blur` para sensação de app moderno
- Tabs de navegação com estado ativo claro (amarelo sólido) vs inativo (hover sutil)
- Footer compacto e discreto

#### Editor individual (`CoverEditorAvancado`)
- **Preview redimensionado a 75%** pra caber na tela sem scroll horizontal em telas médias
- **Badge de status dinâmico** (`idle` / `gerando` / `sucesso` / `erro`) com ícones contextuais
- **Nome de arquivo automático**: `parcele-news-{numero}-{slug-do-titulo}.png` em vez do genérico
- **Preview do ícone ao lado do select** (feedback instantâneo sem scroll)
- **Contador de caracteres no título** com warning acima de 80 (limite visual seguro)
- **Hints informativos** sob cada campo pra explicar uso
- **Estados de loading/disabled** em todos os botões durante geração
- **Agrupamento visual das legendas** em card próprio (menos ruído)
- **Acessibilidade:** `<label htmlFor>`, `aria-pressed` nas tabs, `aria-label` em botões de ícone

#### Gerador em lote
- **Progress bar visual** durante geração das N imagens:
  - Barra preenchendo em amarelo com porcentagem
  - Contador "X / Y" em tempo real
  - Contagem separada de sucessos (verde) e erros (vermelho)
- **Painel de conclusão** com ícone de check/warning dependendo se houve erros
- **Grupos de imagem/ícone em `<details>` colapsáveis** (UI mais limpa, abre só o que está editando)
- **Indicador visual nos grupos** (checkmark verde quando tem imagem configurada)
- **Miniaturas das capas geradas** com grid responsivo 3/5/6 colunas
- **Contador dinâmico** no botão "Gerar X capas" (deixa claro o que vai acontecer)
- **Botão desabilitado** quando não há títulos (em vez de gerar 0 capas)
- **Slug automático no nome do arquivo** (fácil identificar depois no Downloads)

#### Unsplash search
- **Categorias como chips horizontais** (antes era select escondido)
- **Aspect ratio 4:3 nas miniaturas** com hover sutil
- **Indicador visual da imagem selecionada** (overlay amarelo + checkmark)
- **`loading="lazy"`** nas imagens
- **Créditos do Unsplash** visíveis (boa prática)

### 🔧 Outras melhorias

- **Helper reutilizável** `gerarCapaPNG()` em `src/app/lib/gerarCapa.ts` (evita duplicação entre Editor e Lote)
- **TypeScript mais restrito** em callbacks de erro (tipagem `Error` correta)
- **Callbacks `onSuccess`/`onError`** para UI reagir a estados
- **Limpeza de imports `figma:asset`** no componente crítico

### ⚠️ Breaking changes (mínimos)
- `fotoUrl` deve agora usar `/assets/...` ou URL externa. Paths no formato antigo `figma:asset/xxx` continuam funcionando graças ao `resolveFotoUrl()` que redireciona automaticamente pra `/assets/xxx`.
