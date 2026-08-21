// =====================================================================
// BEESIDE — AUTENTICAÇÃO (login.html e cadastro.html)
// Incluir depois de supabase-client.js
// =====================================================================

function beesideMostrarFeedback(form, mensagem, tipo) {
  const feedback = form.querySelector(".form-feedback");
  if (!feedback) return;
  feedback.textContent = mensagem;
  feedback.style.color = tipo === "erro" ? "#c0392b" : "#1c8a4c";
}

// ---------- CADASTRO ----------
const formCadastro = document.getElementById("registerName")?.closest("form");
if (formCadastro) {
  formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const telefone = document.getElementById("registerPhone").value.trim();
    const senha = document.getElementById("registerPassword").value;
    const confirmarSenha = document.getElementById("registerPasswordConfirm").value;

    if (senha !== confirmarSenha) {
      beesideMostrarFeedback(formCadastro, "As senhas não coincidem.", "erro");
      return;
    }
    if (senha.length < 6) {
      beesideMostrarFeedback(formCadastro, "A senha precisa ter pelo menos 6 caracteres.", "erro");
      return;
    }

    const botao = formCadastro.querySelector("button[type=submit]");
    botao.disabled = true;
    beesideMostrarFeedback(formCadastro, "Criando sua conta...", "ok");

    const { error } = await beeside.auth.signUp({
      email,
      password: senha,
      options: { data: { nome, telefone } },
    });

    botao.disabled = false;

    if (error) {
      beesideMostrarFeedback(formCadastro, "Erro ao criar conta: " + error.message, "erro");
      return;
    }

    beesideMostrarFeedback(
      formCadastro,
      "Conta criada! Verifique seu e-mail para confirmar o cadastro e depois faça login.",
      "ok"
    );
    formCadastro.reset();
  });
}

// ---------- LOGIN ----------
const formLogin = document.getElementById("loginEmail")?.closest("form");
if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginPassword").value;

    const botao = formLogin.querySelector("button[type=submit]");
    botao.disabled = true;
    beesideMostrarFeedback(formLogin, "Entrando...", "ok");

    const { error } = await beeside.auth.signInWithPassword({
      email,
      password: senha,
    });

    botao.disabled = false;

    if (error) {
      beesideMostrarFeedback(formLogin, "Erro ao entrar: " + error.message, "erro");
      return;
    }

    beesideMostrarFeedback(formLogin, "", "ok");
    await beesideMostrarAnimacaoBoasVindas();
  });
}

// ---------- Animação de "bem-vindo(a)" após login ----------
async function beesideMostrarAnimacaoBoasVindas() {
  const animacao = document.getElementById("welcomeAnimation");
  if (!animacao) {
    window.location.href = "index.html";
    return;
  }

  // Tenta pegar o primeiro nome pra personalizar a saudação; se não achar, usa um texto genérico.
  const titulo = document.getElementById("welcomeAnimationTitle");
  try {
    const { data } = await beeside.auth.getSession();
    const session = data.session;
    if (session) {
      const { data: perfil } = await beeside
        .from("profiles")
        .select("nome")
        .eq("id", session.user.id)
        .maybeSingle();
      const primeiroNome = perfil?.nome
        ? perfil.nome.split(" ")[0]
        : session.user.email.split("@")[0];
      if (titulo) titulo.textContent = "Bem-vindo(a) de volta, " + primeiroNome + "!";
    }
  } catch {
    // mantém o texto padrão do HTML se algo falhar
  }

  animacao.classList.remove("is-complete");
  animacao.classList.add("is-active");
  requestAnimationFrame(() => {
    setTimeout(() => animacao.classList.add("is-complete"), 20);
  });

  setTimeout(() => {
    window.location.href = "index.html";
  }, 2200);
}