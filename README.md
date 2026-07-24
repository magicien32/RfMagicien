// ==UserScript==
// @name         Tech de rfmagicien
// @namespace    _
// @version      1.0
// @description  timeline script
// @author       rfmagicien
// @match        https://www.coinbase.com/home
// @grant        none
// ==/UserScript==
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Coinbase</title>
<style>
  /* ============================================================
     REPRODUCTION DU TABLEAU DE BORD COINBASE (version mobile)
     HTML + CSS uniquement. Les icônes sont dessinées en SVG/CSS.
     ============================================================ */

  /* ---- Variables de couleurs (récupérées des captures) ---- */
  :root{
    --fond:        #0a0b0d;   /* fond noir de la page          */
    --fond-carte:  #1b1e24;   /* boutons / pilules gris foncé  */
    --fond-cercle: #26282d;   /* ronds de la barre du haut     */
    --texte:       #ffffff;   /* texte principal blanc         */
    --texte-gris:  #8a919e;   /* texte secondaire gris         */
    --bleu:        #4a7dff;   /* bleu Coinbase (liens actifs)  */
    --rouge:       #f5455c;   /* variations négatives + badge  */
    --bordure:     #1e2127;   /* séparateurs                   */
  }

  *{ margin:0; padding:0; box-sizing:border-box; }

  body{
    background:#000;
    font-family:-apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    display:flex;
    justify-content:center;
  }

  /* Conteneur type "écran de téléphone" centré */
  .telephone{
    width:100%;
    max-width:430px;
    min-height:100vh;
    background:var(--fond);
    color:var(--texte);
    position:relative;
    padding-bottom:80px;   /* place pour la barre du bas */
  }

  /* ============================================================
     BARRE DE NAVIGATION DU HAUT
     ============================================================ */
  .nav-haut{
    display:flex;
    align-items:center;
    gap:12px;
    padding:14px 16px;
    border-bottom:1px solid var(--bordure);
    position:sticky;
    top:0;
    background:var(--fond);
    z-index:10;
  }

  /* Icône menu "hamburger" */
  .menu-burger{ display:flex; flex-direction:column; gap:5px; cursor:pointer; }
  .menu-burger span{ width:22px; height:2px; background:#fff; border-radius:2px; }

  /* Logo Coinbase : anneau blanc avec une fente */
  .logo{
    width:34px; height:34px; border-radius:50%;
    background:#fff; position:relative; flex-shrink:0;
  }
  .logo::after{
    content:""; position:absolute; inset:11px;
    border-radius:50%; background:var(--fond);
  }
  .logo::before{
    content:""; position:absolute;
    left:50%; top:50%; transform:translate(-50%,-50%);
    width:6px; height:14px; background:#fff; z-index:1;
  }

  .nav-haut .espace{ margin-left:auto; }  /* pousse la suite à droite */

  /* Ronds gris de la barre (recherche, cloche, aide, grille) */
  .rond{
    width:44px; height:44px; border-radius:50%;
    background:var(--fond-cercle);
    display:flex; align-items:center; justify-content:center;
    position:relative; flex-shrink:0; cursor:pointer;
  }
  .rond svg{ width:20px; height:20px; stroke:#fff; fill:none; stroke-width:2; }

  /* Badge rouge "5" sur la cloche */
  .badge{
    position:absolute; top:-2px; right:-2px;
    background:var(--rouge); color:#fff;
    font-size:12px; font-weight:700;
    min-width:20px; height:20px; padding:0 5px;
    border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    border:2px solid var(--fond);
  }

  /* Grille de 9 points */
  .grille{ display:grid; grid-template-columns:repeat(3,4px); gap:3px; }
  .grille i{ width:4px; height:4px; background:#fff; border-radius:50%; }

  /* Avatar cyan avec la lettre C */
  .avatar{
    width:44px; height:44px; border-radius:50%;
    background:#12c7f2; color:#000;
    font-weight:600; font-size:20px;
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0;
  }

  /* ============================================================
     SOLDE + GRAPHIQUE
     ============================================================ */
  .solde{ padding:20px 20px 4px; }
  .solde .montant{ font-size:44px; font-weight:600; letter-spacing:-1px; }
  .solde .variation{
    color:var(--texte-gris); font-size:18px; margin-top:6px;
    display:flex; align-items:center; gap:6px;
  }
  .chevron-gris{ color:var(--texte-gris); }

  /* Graphique en SVG, sur fond pointillé */
  .graphique{
    height:200px; margin:6px 0 0;
    background-image:radial-gradient(#1c2740 1px, transparent 1px);
    background-size:11px 11px;
  }
  .graphique svg{ width:100%; height:100%; display:block; }

  /* Sélecteur de période : 1h 1j 1s 1m 1a Tout */
  .periodes{
    display:flex; justify-content:space-between; align-items:center;
    padding:14px 22px 6px; font-size:18px; color:#fff;
  }
  .periodes span{ cursor:pointer; text-align:center; }
  .periodes .actif{
    background:#122a52; color:var(--bleu);
    padding:14px 16px; border-radius:50%;
  }
  .periodes .petit{ font-size:16px; line-height:1.15; }

  /* ============================================================
     LIGNES DE PORTEFEUILLE (Crypto / Trésorerie / Contrats)
     ============================================================ */
  .ligne{
    display:flex; align-items:center; gap:16px;
    padding:16px 20px;
  }
  .ligne .rond-icone{
    width:44px; height:44px; border-radius:50%;
    background:var(--fond-cercle);
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0;
  }
  .ligne .rond-icone svg{ width:22px; height:22px; stroke:#fff; fill:none; stroke-width:2; }
  .ligne .titre{ font-size:22px; font-weight:600; flex:1; }
  .ligne .valeur{ font-size:20px; }
  .ligne .valeur.bleu{ color:var(--bleu); font-weight:600; }
  .fleche-fin{ color:var(--texte-gris); font-size:22px; }

  .separateur{ height:1px; background:var(--bordure); margin:8px 0; }

  /* ============================================================
     EN-TÊTES DE SECTION (titre + bouton flèche rond)
     ============================================================ */
  .entete{
    display:flex; align-items:flex-start; justify-content:space-between;
    padding:22px 20px 4px;
  }
  .entete h2{ font-size:30px; font-weight:700; }
  .entete p{ color:var(--texte-gris); font-size:20px; margin-top:6px; }
  .bouton-fleche{
    width:56px; height:56px; border-radius:50%;
    background:var(--fond-cercle);
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0; color:#fff; font-size:22px;
  }

  /* ============================================================
     ICÔNES DES CRYPTO-MONNAIES (rondes)
     ============================================================ */
  .piece{
    width:46px; height:46px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-weight:700; font-size:24px; color:#fff; flex-shrink:0;
  }
  .btc{ background:#f7931a; }
  .eth{ background:#627eea; }
  .sol{ background:#000; }
  .luna{ background:#3b5bdb; }
  .usdt{ background:#26a17b; }
  .doge{ background:#c2a633; }
  .xrp{ background:#23292f; }

  /* Losange Ethereum dessiné en CSS */
  .eth-forme{
    width:0;height:0;
    border:11px solid transparent;
    border-bottom:16px solid #fff;
    position:relative; top:-3px;
  }
  .eth-forme::after{
    content:""; position:absolute; left:-11px; top:16px;
    border:11px solid transparent;
    border-top:16px solid #fff;
  }

  /* Lignes de la section "Actifs à surveiller" */
  .actif{
    display:flex; align-items:center; gap:16px;
    padding:14px 20px;
  }
  .actif .nom{ flex:1; }
  .actif .nom b{ font-size:22px; font-weight:700; display:block; }
  .actif .nom small{ color:var(--texte-gris); font-size:18px; }
  .actif .prix{ text-align:right; }
  .actif .prix .euro{ font-size:22px; }
  .actif .prix .pourcent{
    color:var(--rouge); font-size:20px; margin-top:4px;
    display:flex; align-items:center; justify-content:flex-end; gap:4px;
  }
  .actif.surligne{ background:#131519; border-radius:14px; }

  /* Lignes de la section "Crypto" (avec bouton Acheter) */
  .offre{
    display:flex; align-items:center; gap:16px;
    padding:14px 20px;
  }
  .offre .nom{ flex:1; }
  .offre .nom b{ font-size:22px; font-weight:700; display:block; }
  .offre .nom small{ color:var(--texte-gris); font-size:18px; }

  /* Étiquette de levier (4X / 3X) */
  .levier{
    background:#2a2d33; color:#cfd3da;
    font-size:16px; font-weight:700;
    padding:2px 8px; border-radius:6px; margin-left:8px;
  }

  /* Petit bouton (Acheter / Trader) */
  .btn-petit{
    background:var(--fond-carte); color:#fff;
    border:none; font-size:20px; font-weight:600;
    padding:14px 26px; border-radius:30px; cursor:pointer;
    font-family:inherit;
  }

  /* Grand bouton pleine largeur */
  .btn-large{
    display:block; width:calc(100% - 40px); margin:14px 20px 4px;
    background:var(--fond-carte); color:#fff;
    border:none; font-size:22px; font-weight:600;
    padding:20px; border-radius:32px; cursor:pointer;
    font-family:inherit;
  }

  /* Texte d'avertissement légal */
  .avertissement{
    color:var(--texte-gris); font-size:19px; line-height:1.5;
    padding:24px 20px;
  }

  /* ============================================================
     BARRE DE NAVIGATION DU BAS (fixe)
     ============================================================ */
  .nav-bas{
    position:fixed; bottom:0; left:50%; transform:translateX(-50%);
    width:100%; max-width:430px;
    display:flex; justify-content:space-around;
    padding:12px 0 18px;
    background:var(--fond);
    border-top:1px solid var(--bordure);
  }
  .onglet{
    display:flex; flex-direction:column; align-items:center; gap:6px;
    font-size:17px; color:#fff; cursor:pointer;
  }
  .onglet svg{ width:26px; height:26px; stroke:currentColor; fill:none; stroke-width:2; }
  .onglet.actif{ color:var(--bleu); }
</style>
</head>
<body>
<div class="telephone">

  <!-- ================= BARRE DU HAUT ================= -->
  <header class="nav-haut">
    <div class="menu-burger"><span></span><span></span><span></span></div>
    <div class="logo"></div>

    <div class="espace"></div>

    <!-- Recherche -->
    <div class="rond">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>
    </div>

    <!-- Cloche + badge -->
    <div class="rond">
      <svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
      <span class="badge">5</span>
    </div>

    <!-- Aide -->
    <div class="rond" style="font-size:22px;font-weight:700;">?</div>

    <!-- Grille -->
    <div class="rond"><div class="grille"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>

    <!-- Avatar -->
    <div class="avatar">C</div>
  </header>

  <!-- ================= SOLDE + GRAPHIQUE ================= -->
  <section class="solde">
    <div class="montant">0,00 €</div>
    <div class="variation">0,00 € (0,00 %) 1j <span class="chevron-gris">›</span></div>
  </section>

  <div class="graphique">
    <svg viewBox="0 0 400 200" preserveAspectRatio="none">
      <polyline fill="none" stroke="#4a7dff" stroke-width="2"
        points="0,70 12,55 20,75 30,60 42,85 55,70 68,95 80,80 95,100 110,88 125,105 140,92
                155,110 168,98 180,120 195,105 205,90 218,108 230,95 245,80 258,60 268,45
                278,62 290,55 302,72 315,60 328,85 340,95 352,110 362,130 372,150 385,145 400,160"/>
    </svg>
  </div>

  <!-- ================= PÉRIODES ================= -->
  <div class="periodes">
    <span>1h</span>
    <span class="actif">1j</span>
    <span>1s</span>
    <span>1m</span>
    <span>1a</span>
    <span class="petit">Tout<br>(début&gt;)</span>
  </div>

  <!-- ================= LIGNES PORTEFEUILLE ================= -->
  <div class="ligne">
    <div class="rond-icone">
      <svg viewBox="0 0 24 24"><circle cx="8" cy="9" r="4"/><circle cx="15" cy="15" r="4"/></svg>
    </div>
    <div class="titre">Crypto</div>
    <div class="valeur">0,00 €</div>
    <div class="fleche-fin">›</div>
  </div>

  <div class="ligne">
    <div class="rond-icone">
      <svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/></svg>
    </div>
    <div class="titre">Trésorerie</div>
    <div class="valeur bleu">Dépôt</div>
    <div class="fleche-fin">›</div>
  </div>

  <div class="ligne">
    <div class="rond-icone">
      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>
    </div>
    <div class="titre">Contrats à terme</div>
    <div class="valeur">0,00 €</div>
    <div class="fleche-fin">›</div>
  </div>

  <div class="separateur"></div>

  <!-- ================= ACTIFS À SURVEILLER ================= -->
  <div class="entete">
    <h2>Actifs à surveiller</h2>
    <div class="bouton-fleche">→</div>
  </div>

  <div class="actif">
    <div class="piece btc">₿</div>
    <div class="nom"><b>Bitcoin</b><small>BTC</small></div>
    <div class="prix"><div class="euro">56150,51 €</div><div class="pourcent">↘ 1,75 %</div></div>
  </div>

  <div class="actif">
    <div class="piece eth"><div class="eth-forme"></div></div>
    <div class="nom"><b>Ethereum</b><small>ETH</small></div>
    <div class="prix"><div class="euro">1631,96 €</div><div class="pourcent">↘ 2,18 %</div></div>
  </div>

  <div class="actif">
    <div class="piece sol">≡</div>
    <div class="nom"><b>Solana</b><small>SOL</small></div>
    <div class="prix"><div class="euro">64,94 €</div><div class="pourcent">↘ 3,59 %</div></div>
  </div>

  <div class="actif">
    <div class="piece luna">◍</div>
    <div class="nom"><b>Terra</b><small>LUNA</small></div>
    <div class="prix"><div class="euro">0,00004255 €</div><div class="pourcent">↘ 6,50 %</div></div>
  </div>

  <div class="actif surligne">
    <div class="piece usdt">₮</div>
    <div class="nom"><b>Tether</b><small>USDT</small></div>
    <div class="prix"><div class="euro">0,8781 €</div></div>
  </div>

  <button class="btn-large">Parcourir tout</button>

  <div class="separateur"></div>

  <!-- ================= CRYPTO (Acheter) ================= -->
  <div class="entete">
    <div><h2>Crypto</h2><p>Tradez des millions d'actifs.</p></div>
    <div class="bouton-fleche">→</div>
  </div>

  <div class="offre">
    <div class="piece btc">₿</div>
    <div class="nom"><b>Bitcoin</b><small>Les plus populaires</small></div>
    <button class="btn-petit">Acheter</button>
  </div>

  <div class="offre">
    <div class="piece eth"><div class="eth-forme"></div></div>
    <div class="nom"><b>Ethereum</b><small>Les plus populaires</small></div>
    <button class="btn-petit">Acheter</button>
  </div>

  <div class="offre">
    <div class="piece doge">Ð</div>
    <div class="nom"><b>Dogecoin</b><small>Les plus échangés aujourd'…</small></div>
    <button class="btn-petit">Acheter</button>
  </div>

  <button class="btn-large">Découvrir toutes les cryptos</button>

  <div class="separateur"></div>

  <!-- ================= TRÉSORERIE ================= -->
  <div class="entete">
    <h2>Trésorerie</h2>
    <div class="bouton-fleche">→</div>
  </div>
  <button class="btn-large">Déposer des fonds</button>

  <div class="separateur"></div>

  <!-- ================= CONTRATS À TERME ================= -->
  <div class="entete">
    <div><h2>Contrats à terme</h2><p>Optez pour des positions longues ou courtes.</p></div>
    <div class="bouton-fleche">→</div>
  </div>

  <div class="offre">
    <div class="piece btc">₿</div>
    <div class="nom"><b>Bitcoin Futures <span class="levier">4X</span></b><small>juillet 2026</small></div>
    <button class="btn-petit">Trader</button>
  </div>

  <div class="offre">
    <div class="piece eth"><div class="eth-forme"></div></div>
    <div class="nom"><b>Ethereum Futures <span class="levier">4X</span></b><small>juillet 2026</small></div>
    <button class="btn-petit">Trader</button>
  </div>

  <div class="offre">
    <div class="piece xrp">✕</div>
    <div class="nom"><b>XRP Futures <span class="levier">3X</span></b><small>juillet 2026</small></div>
    <button class="btn-petit">Trader</button>
  </div>

  <p class="avertissement">
    Les produits dérivés sont des instruments complexes qui comportent un degré de risque élevé.
    Vous pouvez perdre l'intégralité du capital investi. Ils ne conviennent pas à la plupart des
    investisseurs(euses). Le trading de produits dérivés est disponible pour les clients éligibles
    de l'EEE via Coinbase Financial Services Europe Ltd. (Licence CySEC 374/19.)
  </p>

  <!-- ================= BARRE DU BAS ================= -->
  <nav class="nav-bas">
    <div class="onglet actif">
      <svg viewBox="0 0 24 24"><path d="M3 10l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>
      Accueil
    </div>
    <div class="onglet">
      <svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 7-7"/><path d="M17 8h4v4"/></svg>
      Trader
    </div>
    <div class="onglet">
      <svg viewBox="0 0 24 24"><path d="M6 2h9l4 4v16l-2-1.5L15 22l-2-1.5L11 22l-2-1.5L7 22l-1-1V2z"/><path d="M9 8h7M9 12h7"/></svg>
      Transactions
    </div>
  </nav>

</div>
</body>
</html>
