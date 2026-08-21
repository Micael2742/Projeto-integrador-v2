// =====================================================================
// BEESIDE — FORMULÁRIO DE CONTATO (contato.html)
// Incluir depois de supabase-client.js (usa o cliente global "beeside")
// Salva a mensagem na tabela "contatos" do Supabase.
// =====================================================================
const formContato = document.querySelector(".contact-page-form");

if (formContato) {
  formContato.addEventListener("submit", async (e) => {
    e.preventDefault();
    const feedback = formContato.querySelector(".form-feedback");
    const botao = formContato.querySelector("button[type=submit]");

    const dados = {
      nome: document.getElementById("pageContactName").value.trim(),
      email: document.getElementById("pageContactEmail").value.trim(),
      telefone: document.getElementById("pageContactPhone").value.trim(),
      assunto: document.getElementById("pageContactSubject").value.trim(),
      mensagem: document.getElementById("pageContactMessage").value.trim(),
    };

    botao.disabled = true;
    feedback.textContent = "Enviando mensagem...";
    feedback.style.color = "#1c8a4c";

    const { error } = await beeside.from("contatos").insert([dados]);

    botao.disabled = false;

    if (error) {
      console.error("Erro ao salvar contato no Supabase:", error);
      feedback.textContent = "Não foi possível enviar sua mensagem. Tente novamente.";
      feedback.style.color = "#c0392b";
      return;
    }

    feedback.textContent = "Mensagem enviada! Nossa equipe vai te responder em breve.";
    feedback.style.color = "#1c8a4c";
    formContato.reset();
    beesideMostrarAnimacaoContatoEnviado();
  });
}

// ---------- Animação de "mensagem enviada" ----------
function beesideMostrarAnimacaoContatoEnviado() {
  const animacao = document.getElementById("contactSentAnimation");
  if (!animacao) return;

  animacao.classList.remove("is-complete");
  animacao.classList.add("is-active");
  // pequeno atraso pra reiniciar as animações de entrada do texto a cada envio
  requestAnimationFrame(() => {
    setTimeout(() => animacao.classList.add("is-complete"), 20);
  });
}

document.getElementById("closeContactSentAnimation")?.addEventListener("click", () => {
  document.getElementById("contactSentAnimation")?.classList.remove("is-active", "is-complete");
});