/* ==========================================================
   CONFIGURAÇÃO — edite só esta parte
   ----------------------------------------------------------
   WHATSAPP: número com DDI + DDD, só dígitos. Ex.: "5565999998888"
   INSTAGRAM: endereço completo do perfil. Ex.: "https://instagram.com/juventudeemmovimento"
   Enquanto ficarem vazios, o formulário NÃO envia nada e mostra
   a mensagem pronta para copiar.
   ========================================================== */
const CONFIG = {
  WHATSAPP: "",
  INSTAGRAM: ""
};

(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  /* Barra superior muda ao rolar */
  const topbar = document.querySelector(".topbar");
  const onScroll = () => topbar.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Revelação discreta ao rolar */
  const els = document.querySelectorAll(".reveal, .timeline");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("in"));
  }

  /* Fotos: se assets/img/acao-0X.jpg existir, esconde o ícone ilustrativo */
  document.querySelectorAll(".card").forEach((card) => {
    const m = (card.getAttribute("style") || "").match(/url\('([^']+)'\)/);
    if (!m) return;
    const img = new Image();
    img.onload = () => card.querySelector(".card-photo").classList.add("has-photo");
    img.src = m[1];
  });

  /* Links configuráveis do rodapé */
  const ig = document.getElementById("link-instagram");
  const wa = document.getElementById("link-whatsapp");
  const setLink = (a, url) => {
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
    else { a.classList.add("pending"); a.title = "Em breve"; a.addEventListener("click", (e) => e.preventDefault()); }
  };
  setLink(ig, CONFIG.INSTAGRAM);
  setLink(wa, CONFIG.WHATSAPP ? "https://wa.me/" + CONFIG.WHATSAPP.replace(/\D/g, "") : "");

  /* Formulário → WhatsApp (sem backend, sem envio simulado) */
  const form = document.getElementById("form-interesse");
  const errorBox = document.getElementById("form-error");
  const fallback = document.getElementById("form-fallback");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorBox.hidden = true;
    form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));

    const data = Object.fromEntries(new FormData(form).entries());
    const missing = [];
    ["nome", "idade", "telefone", "area"].forEach((k) => {
      if (!String(data[k] || "").trim()) { missing.push(k); form.elements[k].classList.add("invalid"); }
    });
    const digits = String(data.telefone || "").replace(/\D/g, "");
    if (data.telefone && digits.length < 10) { missing.push("telefone"); form.elements.telefone.classList.add("invalid"); }

    if (missing.length) {
      errorBox.textContent = "Preencha nome, idade, um telefone válido e a área de interesse.";
      errorBox.hidden = false;
      form.querySelector(".invalid").focus();
      return;
    }
    if (!form.elements.lgpd.checked) {
      errorBox.textContent = "Para continuar, marque a autorização de uso dos dados (LGPD).";
      errorBox.hidden = false;
      form.elements.lgpd.focus();
      return;
    }

    const msg =
      "Olá! Quero fazer parte do *Juventude em Movimento – Sapezal*.\n\n" +
      "*Nome:* " + data.nome.trim() + "\n" +
      "*Idade:* " + data.idade + "\n" +
      "*WhatsApp:* " + data.telefone.trim() + "\n" +
      "*Quero colaborar em:* " + data.area + "\n" +
      (data.mensagem && data.mensagem.trim() ? "*Mensagem:* " + data.mensagem.trim() + "\n" : "") +
      "\nAutorizo o uso destes dados apenas para contato sobre o projeto (LGPD).";

    const number = CONFIG.WHATSAPP.replace(/\D/g, "");
    if (number) {
      window.location.href = "https://wa.me/" + number + "?text=" + encodeURIComponent(msg);
      return;
    }

    /* Número ainda não configurado: mostra a mensagem para copiar, sem fingir envio */
    fallback.hidden = false;
    fallback.innerHTML = "";
    const p = document.createElement("p");
    p.style.margin = "0";
    p.innerHTML = "<b>O canal de WhatsApp do projeto ainda está sendo configurado.</b> Nada foi enviado. Copie sua mensagem e envie para quem te apresentou o projeto:";
    const pre = document.createElement("pre");
    pre.textContent = msg.replace(/\*/g, "");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Copiar mensagem";
    btn.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(pre.textContent); btn.textContent = "Copiado ✓"; }
      catch (_) { btn.textContent = "Selecione o texto acima e copie"; }
    });
    fallback.append(p, pre, btn);
  });
})();
