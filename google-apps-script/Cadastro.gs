/**
 * Juventude em Movimento — recebe a lista de interessados da landing page
 * e grava na aba "Cadastros" desta planilha.
 * Veja LEIA-ME.md para publicar.
 */
const ABA = 'Cadastros';
const COLUNAS = ['Data', 'Nome', 'Idade', 'WhatsApp', 'Frente de interesse', 'Mensagem',
                 'Responsável', 'WhatsApp do responsável', 'Responsável autorizou', 'Consentimento LGPD', 'Origem'];

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents || '{}');
    const limpa = (v, max) => String(v || '').replace(/^[=+\-@]+/, '').trim().slice(0, max); // evita fórmulas
    const idade = parseInt(d.idade, 10);
    const fone = (v) => String(v || '').replace(/\D/g, '');

    if (!limpa(d.nome, 80)) return json({ ok: false, error: 'nome' });
    if (!(idade >= 12 && idade <= 110)) return json({ ok: false, error: 'idade' });
    if (fone(d.whatsapp).length < 10) return json({ ok: false, error: 'whatsapp' });
    if (d.lgpd !== 'sim') return json({ ok: false, error: 'lgpd' });
    if (idade < 18 && (!limpa(d.responsavel_nome, 80) || fone(d.responsavel_whatsapp).length < 10 || d.responsavel_autorizou !== 'sim')) {
      return json({ ok: false, error: 'responsavel' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sh = aba_();
      sh.appendRow([new Date(), limpa(d.nome, 80), idade, limpa(d.whatsapp, 20), limpa(d.frente, 60), limpa(d.mensagem, 500),
                    limpa(d.responsavel_nome, 80), limpa(d.responsavel_whatsapp, 20), d.responsavel_autorizou === 'sim' ? 'sim' : '',
                    'sim', limpa(d.origem, 200)]);
    } finally {
      lock.releaseLock();
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: 'servidor' });
  }
}

function doGet() {
  return json({ ok: true, servico: 'Juventude em Movimento — lista de interessados' });
}

function aba_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ABA);
  if (!sh) {
    sh = ss.insertSheet(ABA);
    sh.appendRow(COLUNAS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLUNAS.length).setFontWeight('bold').setBackground('#0B3326').setFontColor('#FBFAF6');
  }
  return sh;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
