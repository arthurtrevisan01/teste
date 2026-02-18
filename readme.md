# 🏋️ HyperScience v3.0

> Diário de treino científico. PWA offline-first. Zero dependências externas de runtime.

## Estrutura

```
hyperscience/
├── index.html      # Markup, estrutura semântica
├── style.css       # Design system completo com CSS variables
├── script.js       # Toda a lógica do app (SPA, estado, análise)
├── sw.js           # Service Worker com cache estratégico
├── manifest.json   # PWA manifest
└── README.md
```

## Funcionalidades

- **3 planos científicos** — PPL, Upper/Lower (4 dias), Arnold Split
- **Substituição biomecânica** — Troque exercícios por variações equivalentes
- **Sessão persistente** — Sessão ativa sobrevive ao fechar o app
- **Timer em tempo real** — Cronômetro por sessão
- **Análise automática** — Nota S/A/B/C/D baseada em RPE, volume e intensidade
- **Histórico local** — Todos os dados no localStorage do device
- **Offline-first** — Funciona sem internet após primeira abertura
- **Instalável** — Adicione à tela inicial (iOS/Android/Desktop)

## Como usar

1. Clone o repositório
2. Suba em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, etc.)
3. Acesse via HTTPS para ativar o Service Worker e poder instalar como PWA

### GitHub Pages (mais rápido)

```bash
git init
git add .
git commit -m "HyperScience v3.0"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/hyperscience.git
git push -u origin main
```

Depois, em `Settings → Pages`, selecione `branch: main / root`.

## Algoritmo de Análise

| Critério | Peso | Condição |
|---|---|---|
| Intensidade (RPE) | 45pts | >75% das séries com RPE ≥ 8 |
| Falha técnica | 25pts | Alguma série com RPE ≥ 9 |
| Volume | 30pts | 10–25 séries válidas por sessão |

| Pontuação | Nota |
|---|---|
| ≥ 90 | S |
| ≥ 70 | A |
| ≥ 50 | B |
| ≥ 30 | C |
| < 30 | D |

## Notas Técnicas

- **Zero frameworks** — Vanilla JS/CSS puro. Bundle size ≈ 0.
- **Fontes** — Bebas Neue (display) + DM Sans (body) + JetBrains Mono (mono) via Google Fonts
- **Storage** — `localStorage` com try/catch para modo privado/iOS
- **Service Worker** — Cache-first para assets próprios, network-first para CDN externas
- **Re-renders cirúrgicos** — `addSet`/`removeSet` manipulam o DOM diretamente, sem re-render total da view
