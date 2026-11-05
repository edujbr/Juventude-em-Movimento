/* ==========================================================
   CONFIGURAÇÃO — edite só esta parte
   ----------------------------------------------------------
   SHEETS_URL: endereço do App da Web do Google Apps Script
               (veja google-apps-script/LEIA-ME.md). Ex.:
               "https://script.google.com/macros/s/AKfy.../exec"
   WHATSAPP:   número com DDI + DDD, só dígitos. Ex.: "5565999998888"
   INSTAGRAM:  endereço completo do perfil.
   ========================================================== */
const CONFIG = {
  SHEETS_URL: "https://script.google.com/macros/s/AKfycbyLhJAg-eNUxiLuehetlg79OA0cuDxh8G2NLlHLAMKL2vz56QZxfPs98-plrtSrZFSu/exec",
  WHATSAPP: "",
  INSTAGRAM: ""
};

(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  /* Barra superior */
  const topbar = document.querySelector(".topbar");
  const onScroll = () => topbar.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Menu (celular) */
  const btn = document.querySelector(".menu-btn");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  btn.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* Revelação discreta ao rolar */
  const els = document.querySelectorAll(".reveal, .timeline");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("in"));
  }

  /* Fotos opcionais: se o arquivo existir em assets/img, esconde a ilustração */
  document.querySelectorAll("[style*='--img']").forEach((el) => {
    const m = (el.getAttribute("style") || "").match(/url\('([^']+)'\)/);
    if (!m) return;
    const target = el.classList.contains("card") ? el.querySelector(".card-photo") : el;
    const img = new Image();
    img.onload = () => target.classList.add("has-photo");
    img.src = m[1];
  });

  /* Links do rodapé */
  const setLink = (a, url) => {
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
    else { a.classList.add("pending"); a.title = "Em breve"; a.addEventListener("click", (e) => e.preventDefault()); }
  };
  setLink(document.getElementById("link-instagram"), CONFIG.INSTAGRAM);
  setLink(document.getElementById("link-whatsapp"), CONFIG.WHATSAPP ? "https://wa.me/" + CONFIG.WHATSAPP.replace(/\D/g, "") : "");

  /* ---------- Lista de interessados ---------- */
  const form = document.getElementById("form-interesse");
  const errorBox = document.getElementById("form-error");
  const done = document.getElementById("form-done");
  const submit = document.getElementById("f-submit");
  const guardian = document.getElementById("guardian");
  const age = form.elements.idade;

  const isMinor = () => { const n = parseInt(age.value, 10); return n >= 12 && n < 18; };
  const syncGuardian = () => { guardian.hidden = !isMinor(); };
  age.addEventListener("input", syncGuardian);

  const digits = (v) => String(v || "").replace(/\D/g, "");
  const fail = (msg, el) => {
    errorBox.textContent = msg; errorBox.hidden = false;
    if (el) { el.classList.add("invalid"); el.focus(); }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.hidden = true;
    form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
    const f = form.elements;

    if (!f.nome.value.trim()) return fail("Escreva seu nome.", f.nome);
    const n = parseInt(f.idade.value, 10);
    if (!n) return fail("Informe sua idade.", f.idade);
    if (n < 12) return fail("O cadastro é aberto a partir de 12 anos. Peça para um adulto da sua família falar com a gente.", f.idade);
    if (digits(f.whatsapp.value).length < 10) return fail("Informe um WhatsApp com DDD.", f.whatsapp);
    if (isMinor()) {
      if (!f.responsavel_nome.value.trim()) return fail("Informe o nome do seu responsável.", f.responsavel_nome);
      if (digits(f.responsavel_whatsapp.value).length < 10) return fail("Informe o WhatsApp do seu responsável, com DDD.", f.responsavel_whatsapp);
      if (!f.responsavel_autorizou.checked) return fail("Para menores de 18 anos, o responsável precisa saber e autorizar.", f.responsavel_autorizou);
    }
    if (!f.frente.value) return fail("Escolha a frente que mais te interessa.", f.frente);
    if (!f.lgpd.checked) return fail("Para continuar, marque a autorização de uso dos dados (LGPD).", f.lgpd);
    if (f.site.value) return; // robô

    const data = {
      nome: f.nome.value.trim(),
      idade: n,
      whatsapp: f.whatsapp.value.trim(),
      frente: f.frente.value,
      mensagem: f.mensagem.value.trim(),
      responsavel_nome: isMinor() ? f.responsavel_nome.value.trim() : "",
      responsavel_whatsapp: isMinor() ? f.responsavel_whatsapp.value.trim() : "",
      responsavel_autorizou: isMinor() ? "sim" : "",
      lgpd: "sim",
      origem: location.href
    };

    if (!CONFIG.SHEETS_URL) {
      return fail("A lista de interessados ainda está sendo ativada. Nada foi enviado — tente de novo em breve.");
    }

    submit.disabled = true; submit.textContent = "Enviando…";
    try {
      // text/plain evita a pré-verificação de CORS do navegador (padrão do Google Apps Script)
      const res = await fetch(CONFIG.SHEETS_URL, { method: "POST", body: JSON.stringify(data) });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || "erro");
      form.querySelectorAll("input, select, textarea, button").forEach((el) => { el.disabled = true; });
      submit.hidden = true;
      done.hidden = false;
      done.innerHTML = "<b>Você está na lista, " + data.nome.split(" ")[0].replace(/[<>&]/g, "") + "!</b>Quando o primeiro encontro for marcado, vamos te chamar pelo WhatsApp.";
    } catch (err) {
      submit.disabled = false; submit.textContent = "Entrar na lista";
      fail("Não conseguimos registrar agora. Confira sua conexão e tente de novo em alguns minutos.");
    }
  });
})();
