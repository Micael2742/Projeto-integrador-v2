// =====================================================================
// BEESIDE — MOSTRAR ERROS NA TELA (temporário, para diagnosticar sem F12)
// Deve ser o PRIMEIRO script da página, antes de qualquer outro.
// Depois que o problema for resolvido, pode remover este arquivo e a
// linha <script src="debug-erros.js"></script> de cada página.
// =====================================================================
(function () {
  function mostrarErroVisivel(texto) {
    let caixa = document.getElementById("beesideDebugBox");
    if (!caixa) {
      caixa = document.createElement("div");
      caixa.id = "beesideDebugBox";
      caixa.style.cssText =
        "position:fixed;bottom:0;left:0;right:0;background:#c0392b;color:#fff;" +
        "padding:12px;font-family:monospace;font-size:13px;z-index:999999;" +
        "white-space:pre-wrap;max-height:40vh;overflow:auto;";
      document.addEventListener("DOMContentLoaded", () => document.body.appendChild(caixa));
      if (document.body) document.body.appendChild(caixa);
    }
    const linha = document.createElement("div");
    linha.textContent = texto;
    linha.style.borderTop = "1px solid rgba(255,255,255,.3)";
    linha.style.paddingTop = "4px";
    linha.style.marginTop = "4px";
    caixa.appendChild(linha);
  }

  window.addEventListener("error", function (e) {
    mostrarErroVisivel(
      "ERRO JS: " + e.message + "\nArquivo: " + e.filename + " (linha " + e.lineno + ")"
    );
  });

  window.addEventListener("unhandledrejection", function (e) {
    const motivo = e.reason && e.reason.message ? e.reason.message : String(e.reason);
    mostrarErroVisivel("ERRO (promise): " + motivo);
  });
})();
