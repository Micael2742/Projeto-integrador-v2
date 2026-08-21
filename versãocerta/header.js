// =====================================================================
// BEESIDE — CABEÇALHO (login/logout + contador do carrinho)
// Incluir em TODAS as páginas, depois de supabase-client.js
// =====================================================================

// ---------- Contador do carrinho (lê o carrinho salvo no navegador) ----------
function beesideGetCart() {
  try {
    return JSON.parse(localStorage.getItem("beeside_cart") || "[]");
  } catch {
    return [];
  }
}

function beesideUpdateCartCount() {
  const cart = beesideGetCart();
  const total = cart.reduce((soma, item) => soma + item.quantity, 0);
  document.querySelectorAll("#cartCount").forEach((el) => {
    el.textContent = total;
    const btn = el.closest(".cart-btn");
    if (btn) {
      btn.classList.remove("is-bump");
      void btn.offsetWidth; // força reflow pra animação repetir
      btn.classList.add("is-bump");
    }
  });
}

// ---------- Toast "produto adicionado ao carrinho" ----------
function beesideMostrarToastCarrinho(nomeProduto) {
  let toast = document.getElementById("beesideCartToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "beesideCartToast";
    toast.className = "cart-toast";
    toast.innerHTML = `
      <span class="cart-toast-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="21" r="1.4" fill="currentColor"/><circle cx="18" cy="21" r="1.4" fill="currentColor"/></svg>
      </span>
      <span class="cart-toast-text">
        <strong id="beesideCartToastNome"></strong>
        <span>Adicionado ao carrinho</span>
      </span>
    `;
    document.body.appendChild(toast);
  }

  document.getElementById("beesideCartToastNome").textContent = nomeProduto;

  const icone = toast.querySelector(".cart-toast-icon");
  icone.style.animation = "none";
  void icone.offsetWidth; // força reflow pra animação do ícone repetir
  icone.style.animation = "";

  toast.classList.add("is-active");
  clearTimeout(toast._beesideTimeout);
  toast._beesideTimeout = setTimeout(() => toast.classList.remove("is-active"), 2200);
}

// ---------- Estado de login no botão "Entre e cadastre" ----------
async function beesideAtualizarBotaoUsuario() {
  const { data } = await beeside.auth.getSession();
  const session = data.session;
  const userBtn = document.querySelector(".user-btn");
  if (!userBtn) return;

  if (session) {
    const { data: perfil } = await beeside
      .from("profiles")
      .select("nome")
      .eq("id", session.user.id)
      .maybeSingle();

    const primeiroNome = perfil?.nome
      ? perfil.nome.split(" ")[0]
      : session.user.email.split("@")[0];
    // Logado: o botão agora leva para o painel da conta (não faz logout direto).
    userBtn.setAttribute("href", "minha-conta.html");
    userBtn.querySelector(".user-btn-text").textContent = "Olá, " + primeiroNome;
  } else {
    userBtn.setAttribute("href", "login.html");
    userBtn.querySelector(".user-btn-text").textContent = "Entre e cadastre";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  beesideUpdateCartCount();
  beesideAtualizarBotaoUsuario();
});