# Juventude em Movimento · Sapezal

Landing page institucional da iniciativa **Juventude em Movimento – Sapezal (MT)**.

## Estrutura
```
index.html        página
style.css         visual
script.js         interações + CONFIG (WhatsApp e Instagram)
assets/favicon.svg
assets/logo/      marca (SVG)
assets/img/       fotos (opcional)
google-apps-script/  recebe os cadastros na Planilha Google
```

## Ativar a lista de interessados
Siga `google-apps-script/LEIA-ME.md` e cole o endereço em `SHEETS_URL` no `script.js`.

## Configurar WhatsApp e Instagram
No topo do `script.js`, preencha:
```js
const CONFIG = {
  SHEETS_URL: "https://script.google.com/macros/s/.../exec",
  WHATSAPP: "5565999998888",          // DDI + DDD + número, só dígitos
  INSTAGRAM: "https://instagram.com/seu_perfil"
};
```
Enquanto estiverem vazios, o formulário não envia nada: mostra a mensagem pronta para copiar.

## Colocar fotos reais
Salve em `assets/img/` com estes nomes (JPG, ~1600px de largura):
`hero.jpg`, `frente-01.jpg` … `frente-04.jpg`, `acao-01.jpg` … `acao-06.jpg`. A página usa automaticamente; sem a foto, mostra a ilustração verde.
Use apenas fotos com autorização das pessoas que aparecem.

## Publicar alterações
Edite os arquivos e faça commit/push na branch `main`. O GitHub Pages atualiza em 1–2 minutos.
