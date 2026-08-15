// =====================================================================
// BEESIDE — CLIENTE SUPABASE
// Este arquivo cria a conexão usada por auth.js, header.js e carrinho.js
// Deve ser incluído em TODAS as páginas, DEPOIS do script do CDN do
// Supabase e ANTES de header.js, auth.js e carrinho.js.
//
// Ordem correta nas páginas (já é a que você já tem no HTML):
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//   <script src="supabase-client.js"></script>
//   <script src="header.js"></script>
//   <script src="auth.js"></script>      (só em login.html e cadastro.html)
//   <script src="carrinho.js"></script>  (só em carrinho.html)
// =====================================================================

const BEESIDE_SUPABASE_URL = "https://gnbacmlrukftriiwlzih.supabase.co";
const BEESIDE_SUPABASE_KEY = "sb_publishable_KOrw8TrA2vYbGsmiPxBUdQ_fl8BY2Gw";

const beeside = supabase.createClient(
  BEESIDE_SUPABASE_URL,
  BEESIDE_SUPABASE_KEY,
);
