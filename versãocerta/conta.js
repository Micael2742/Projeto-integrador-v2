// =====================================================================
// BEESIDE — MINHA CONTA (minha-conta.html)
// Incluir depois de supabase-client.js, header.js e produtos.js
// Reutiliza moeda(), favoritos(), BEESIDE_PRODUTOS e cartao() de produtos.js
// =====================================================================

function beesideFormatarData(iso) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function beesideCardPedidoHTML(pedido) {
  const itens = pedido.order_items || [];
  const resumoItens = itens.map((i) => `${i.quantity}× ${i.product_name}`).join(", ");
  return `
    <article class="account-order-card">
      <div class="account-order-head">
        <span class="account-order-id">Pedido #${pedido.id.slice(0, 8).toUpperCase()}</span>
        <span class="account-order-status">Confirmado</span>
      </div>
      <p class="account-order-date">${beesideFormatarData(pedido.created_at)}</p>
      <p class="account-order-items">${resumoItens || "Sem itens registrados"}</p>
      <strong class="account-order-total">${moeda(Number(pedido.total))}</strong>
    </article>
  `;
}

// ---------- Pedidos ----------
async function beesideCarregarPedidos(userId) {
  const listaCompleta = document.getElementById("ordersList");
  const ultimoPedidoBox = document.getElementById("overviewUltimoPedido");

  const { data: pedidos, error } = await beeside
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    listaCompleta.innerHTML = `<p class="account-empty">Não foi possível carregar seus pedidos agora.</p>`;
    ultimoPedidoBox.innerHTML = "";
    return;
  }

  document.getElementById("statOrders").textContent = pedidos.length;
  const totalGasto = pedidos.reduce((soma, p) => soma + Number(p.total), 0);
  document.getElementById("statTotal").textContent = moeda(totalGasto);

  if (!pedidos.length) {
    listaCompleta.innerHTML = `<p class="account-empty">Você ainda não fez nenhum pedido. <a href="produtos.html">Ver produtos</a></p>`;
    ultimoPedidoBox.innerHTML = `<p class="account-empty">Nenhum pedido ainda.</p>`;
    return;
  }

  listaCompleta.innerHTML = pedidos.map(beesideCardPedidoHTML).join("");
  ultimoPedidoBox.innerHTML = beesideCardPedidoHTML(pedidos[0]);
}

// ---------- Favoritos ----------
function beesideRenderizarFavoritos() {
  const grid = document.getElementById("favoritesGrid");
  const ids = favoritos();
  const produtos = ids.map((id) => BEESIDE_PRODUTOS.find((p) => p.id === id)).filter(Boolean);

  document.getElementById("statFavorites").textContent = produtos.length;

  if (!produtos.length) {
    grid.innerHTML = `<p class="account-empty">Você ainda não favoritou nenhum produto. <a href="produtos.html">Ver produtos</a></p>`;
    return;
  }

  grid.innerHTML = produtos.map((p, i) => cartao(p, i)).join("");
}

function beesideConfigurarFavoritos() {
  document.getElementById("favoritesGrid")?.addEventListener("click", (e) => {
    // O clique em ♥ já é tratado pelo listener global de produtos.js (em <main>).
    // Aguardamos o próximo ciclo pra re-renderizar esta lista já sem o item removido.
    if (e.target.closest("[data-favorite]")) setTimeout(beesideRenderizarFavoritos, 0);
  });
}

// ---------- Perfil ----------
async function beesideCarregarPerfil(session) {
  const userId = session.user.id;

  document.getElementById("accountEmail").textContent = session.user.email;
  document.getElementById("accountEmailField").value = session.user.email;

  const { data: perfil } = await beeside
    .from("profiles")
    .select("nome, telefone, created_at")
    .eq("id", userId)
    .maybeSingle();

  const nome = perfil?.nome || session.user.email.split("@")[0];
  const iniciais = nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("");

  document.getElementById("accountAvatar").textContent = iniciais || "?";
  document.getElementById("accountGreeting").textContent = "Olá, " + nome.split(" ")[0] + "!";
  document.getElementById("overviewNome").textContent = perfil?.nome || "Não informado";
  document.getElementById("overviewTelefone").textContent = perfil?.telefone || "Não informado";
  document.getElementById("overviewDesde").textContent = perfil?.created_at
    ? beesideFormatarData(perfil.created_at)
    : "—";

  document.getElementById("accountNome").value = perfil?.nome || "";
  document.getElementById("accountTelefone").value = perfil?.telefone || "";
}

function beesideConfigurarFormularioConta(session) {
  const form = document.getElementById("accountForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const feedback = form.querySelector(".form-feedback");
    const botao = form.querySelector("button[type=submit]");
    const nome = document.getElementById("accountNome").value.trim();
    const telefone = document.getElementById("accountTelefone").value.trim();

    botao.disabled = true;
    feedback.textContent = "Salvando...";
    feedback.style.color = "#1c8a4c";

    const { error } = await beeside.from("profiles").update({ nome, telefone }).eq("id", session.user.id);

    botao.disabled = false;

    if (error) {
      feedback.textContent = "Não foi possível salvar. Tente novamente.";
      feedback.style.color = "#c0392b";
      return;
    }

    feedback.textContent = "Dados atualizados com sucesso!";
    feedback.style.color = "#1c8a4c";

    const primeiroNome = nome.split(" ")[0] || "Cliente";
    const iniciais = nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("");
    document.getElementById("accountGreeting").textContent = "Olá, " + primeiroNome + "!";
    document.getElementById("overviewNome").textContent = nome || "Não informado";
    document.getElementById("overviewTelefone").textContent = telefone || "Não informado";
    document.getElementById("accountAvatar").textContent = iniciais || "?";
  });
}

// ---------- Logout ----------
function beesideConfigurarLogout() {
  document.getElementById("accountLogout")?.addEventListener("click", async () => {
    if (!confirm("Deseja sair da sua conta?")) return;
    await beeside.auth.signOut();
    window.location.href = "index.html";
  });
}

// ---------- Inicialização ----------
document.addEventListener("DOMContentLoaded", async () => {
  const { data } = await beeside.auth.getSession();

  if (!data.session) {
    window.location.href = "login.html";
    return;
  }

  const session = data.session;

  await beesideCarregarPerfil(session);
  await beesideCarregarPedidos(session.user.id);
  beesideRenderizarFavoritos();
  beesideConfigurarFormularioConta(session);
  beesideConfigurarLogout();
  beesideConfigurarFavoritos();
});
