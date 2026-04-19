# Changelog

## v1.3.0 — Legendas por bloco, preview de ícone e versionamento dinâmico

### 🎁 Novos recursos

#### Legendas personalizadas por bloco no Gerador em Lote
Cada bloco de capas agora tem suas **próprias legendas independentes**:
- Legenda linha 1 (regular)
- Legenda linha 2 (negrito)
- Toggles individuais pra ativar/desativar cada linha por bloco

Permite, por exemplo, que o Bloco 1 (Meios de Pagamento) tenha a legenda "Tecnologia que destrava **o seu dia a dia financeiro.**" enquanto o Bloco 5 (Pix Parcelado) tenha "Tecnologia que destrava **o futuro do Pix Parcelado.**" — cada um com suas próprias ativações.

#### Preview visual do ícone selecionado
Ao lado de todo select de ícone, agora há um **card de preview** mostrando o ícone escolhido no mesmo estilo do card amarelo da capa final. Aplicado em:
- Editor individual
- Cada bloco do Gerador em Lote (versão compacta)

Torna a escolha do ícone muito mais visual — você vê exatamente como vai ficar sem precisar gerar a capa.

#### Versionamento dinâmico no footer
A versão exibida no rodapé agora é lida **automaticamente** do `package.json` via `__APP_VERSION__` (exposto pelo Vite em build). Ano exibido também é dinâmico (`new Date().getFullYear()`). Não precisa mais atualizar manualmente a versão no código.

#### Logo Potencial Tecnologia aumentado no footer
Aumentado de `h-12` (48px) para `h-20` (80px), dando mais presença à marca na interface.

### 🔧 Implementação técnica

**Novo componente**: `src/app/components/SelectIconeComPreview.tsx`
- Exporta `iconesDisponiveis` centralizado (era duplicado em 2 arquivos antes)
- Componente reutilizável de select + preview de ícone
- Prop `tamanhoPreview` aceita `"pequeno"` ou `"medio"` pra adaptação contextual

**Nova estrutura no GeradorLote**:
- Tipo `BlocoConfig` com todos os campos editáveis por bloco (ícone, imagem, legendas, toggles)
- State único `blocos: BlocoConfig[]` substitui 6 states separados
- Função `atualizarBloco(index, patch)` pra mutação imutável
- Contador `quantidadeBlocosNecessarios` mostra quais blocos estão em uso (baseado em títulos + tamanho de grupo)
- Blocos não usados ficam com `opacity-60` e tag "não usado"

**Vite config**:
- Lê `package.json` em tempo de build
- Expõe `__APP_VERSION__` via `define`
- Arquivo `src/vite-env.d.ts` adiciona declaração TS

### 💫 UX

- **Info box** no lugar da antiga seção "Legendas padrão" explicando que legendas são agora por bloco
- Em cada bloco `<details>`: indicador visual `Image` icon (verde) quando bloco tem imagem configurada
- Tag "não usado" em blocos além do necessário (baseado no total de títulos)
- `select-none` nos summaries pra evitar seleção acidental de texto ao abrir/fechar

### ⚠️ Breaking changes

Apenas internos — o state do lote agora é uma única estrutura `blocos[]` em vez de 6 arrays paralelos (`imagens`, `icones`, etc.). Comportamento do usuário final é retrocompatível: ao abrir pela primeira vez, tudo já vem preenchido com defaults razoáveis.

---

## v1.2.2 — Correção do logo gigante na exportação

### 🐛 Bug corrigido

Na v1.2.1, o logo "parceleaqui" aparecia **enorme** nas capas exportadas (ocupando mais de 30% da capa), enquanto no preview do app aparecia corretamente pequeno. O número "#XX" também saía em posição errada.

**Causa:** O código original do logo usava um truque frágil exportado do Figma — valores percentuais extremos (`height: 280.41%`, `top: -94.89%`, `left: -7.98%`) com `overflow: hidden` no container. Funcionava no navegador mas o `html-to-image` calculava esses percentuais de forma diferente ao serializar pro canvas, fazendo o logo escapar do container.

**Correção:** Substituído pelo padrão CSS robusto:
- Container do logo: `200×40px`
- Imagem: `width: 100%; height: 100%; object-fit: contain; object-position: left center`

`object-fit: contain` é uma propriedade CSS nativa, estável em todos os renderizadores (browser, html-to-image, dom-to-image, etc). Resultado visualmente idêntico ao preview do app.

### ✅ Teste de validação

Renderizado via Playwright em 1200×675 → escalado pra 1280×720 via LANCZOS → comparação visual com o modelo Parcele News #72 → **idêntico**. Logo compacto, número à direita, card amarelo preenchendo todo o canvas sem sobras.

---

## v1.2.1 — Correção do espaço em branco nas capas geradas

### 🐛 Bug corrigido

As capas geradas pela v1.2 apresentavam **espaço em branco extra** nas bordas direita e inferior. O card amarelo ocupava apenas 1200×675 dentro de um canvas de 1280×720, deixando ~80px de faixa branca à direita e ~45px embaixo.

**Causa:** Uso simultâneo de `width/height` (tamanho do elemento) e `canvasWidth/canvasHeight` (tamanho do canvas final) no `html-to-image` criava um canvas maior que o elemento renderizado.

**Correção:** Remoção de `canvasWidth` e `canvasHeight`. Agora o `pixelRatio = 1.0667` escala proporcionalmente ambas as dimensões:
- 1200 × 1.0667 = **1280**
- 675 × 1.0667 = **720**

A proporção 16:9 é preservada exatamente (1200/675 = 1280/720 = 1.7778), então não há distorção nem bordas vazias.

---

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
