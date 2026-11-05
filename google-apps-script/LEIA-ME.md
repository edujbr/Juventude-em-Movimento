# Ativar a lista de interessados (Planilha Google)

Leva uns 5 minutos e é feito uma vez só.

1. Abra https://sheets.new e dê o nome **Juventude em Movimento – Interessados**.
2. No menu: **Extensões → Apps Script**.
3. Apague o que estiver no editor e cole todo o conteúdo de `Cadastro.gs`. Clique em **Salvar**.
4. Clique em **Implantar → Nova implantação**.
   - Tipo: **App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
5. Clique em **Implantar** e autorize com sua conta Google (aparece um aviso de "app não verificado": clique em *Avançado → Acessar*; o app é seu).
6. Copie o **URL do app da Web** (termina em `/exec`).
7. Cole esse endereço no `script.js`, em `SHEETS_URL: ""`, e publique (ou mande para o Claude publicar).

Os cadastros aparecem na aba **Cadastros**, um por linha.

## Cuidados com os dados (LGPD)
- A planilha deve ficar **só com quem coordena o projeto**. Não compartilhe com link público.
- Use os dados apenas para chamar as pessoas para o projeto.
- Se alguém pedir para sair, apague a linha da pessoa.
- Menores de 18 anos só ficam na lista com nome, WhatsApp e autorização do responsável.
