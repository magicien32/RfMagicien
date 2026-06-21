 //==UserScript==
// @name         G2G Triple-A Payment Page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Page de paiement crypto G2G (usage éducatif)
// @author       Demo
// @match        *://app.triple-a.io/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // Petit popup "RF le MAGICIEN"
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #1a2550;
    color: #fff;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    font-family: -apple-system, sans-serif;
    z-index: 999999;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  `;
  popup.innerHTML = `
    <span>RF le MAGICIEN</span>
    <span id="rf-close" style="cursor:pointer;font-size:16px;opacity:0.7;">✕</span>
  `;
  document.body.appendChild(popup);
  document.getElementById('rf-close').addEventListener('click', () => popup.remove());

  document.head.innerHTML = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Triple-A Payment - G2G</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { background: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; }
      .page { background: #fff; display: flex; flex-direction: column; align-items: center; padding: 0 0 80px; }
      .logo-section { width: 100%; display: flex; justify-content: center; align-items: center; padding: 48px 20px 36px; }
      .g2g-logo { width: 170px; height: 170px; }
      .card { background: #fff; border-radius: 24px 24px 0 0; width: 100%; max-width: 480px; box-shadow: 0 -2px 20px rgba(0,0,0,0.07); padding: 32px 24px 0; }
      .merchant-name { font-size: 28px; font-weight: 800; color: #2a2a2a; text-align: center; line-height: 1.2; margin-bottom: 30px; letter-spacing: -0.3px; }
      .info-row { margin-bottom: 18px; }
      .info-label { font-size: 14px; color: #999; margin-bottom: 3px; }
      .info-value { font-size: 22px; font-weight: 700; color: #222; display: flex; align-items: center; gap: 8px; }
      .info-value .unit { font-weight: 400; color: #555; font-size: 20px; }
      .copy-icon { cursor: pointer; margin-left: auto; color: #3b5bdb; display: flex; align-items: center; }
      .copy-icon svg { width: 22px; height: 22px; }
      .divider { height: 1px; background: #f0f0f0; margin: 8px 0 22px; }
      .send-label { font-size: 14px; color: #999; margin-bottom: 10px; }
      .address-block { border: 1.5px dashed #c8d0e0; border-radius: 10px; overflow: hidden; margin-bottom: 10px; }
      .network-banner { background: #1a2550; padding: 9px 16px; text-align: center; }
      .network-banner span { color: #00e676; font-size: 13px; font-weight: 700; letter-spacing: 0.3px; }
      .address-row { display: flex; align-items: center; padding: 13px 14px; gap: 10px; background: #fff; }
      .address-text { font-size: 15px; font-weight: 700; color: #1a2550; flex: 1; word-break: break-all; line-height: 1.45; }
      .addr-copy { color: #3b5bdb; cursor: pointer; flex-shrink: 0; display: flex; }
      .addr-copy svg { width: 22px; height: 22px; }
      .warning-text { font-size: 13px; color: #666; line-height: 1.5; margin-bottom: 24px; }
      .qr-label { font-size: 14px; color: #999; margin-bottom: 14px; }
      .qr-wrap { display: flex; justify-content: center; margin-bottom: 16px; position: relative; }
      #qrcode { position: relative; display: inline-block; }
      #qrcode canvas { display: block; border-radius: 4px; }
      .btc-center-logo { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 46px; height: 46px; border-radius: 10px; background: #f7931a; display: flex; align-items: center; justify-content: center; border: 3px solid #fff; }
      .btc-center-logo svg { width: 26px; height: 26px; }
      .switch-qr-link { text-align: center; margin-bottom: 18px; }
      .switch-qr-link a { font-size: 13px; color: #555; text-decoration: underline; cursor: pointer; }
      .detecting-row { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 22px; }
      .spinner { width: 18px; height: 18px; border: 2.5px solid #e0e0e0; border-top-color: #3b5bdb; border-radius: 50%; animation: spin 0.8s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .detecting-text { font-size: 14px; color: #3b5bdb; font-weight: 500; }
      .open-wallet-btn { display: block; width: 100%; background: #1a2550; color: #fff; border: none; border-radius: 12px; padding: 17px; font-size: 17px; font-weight: 600; text-align: center; cursor: pointer; margin-bottom: 16px; }
      .open-wallet-btn:hover { background: #253070; }
      .cancel-link { text-align: center; margin-bottom: 30px; }
      .cancel-link a { font-size: 14px; color: #555; cursor: pointer; }
      .bottom-bar { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; background: #fff; border-top: 1px solid #f0f0f0; padding: 11px 22px; display: flex; align-items: center; justify-content: space-between; z-index: 10; }
      .timer-left { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #555; }
      .timer-left svg { width: 15px; height: 15px; }
      .timer-val { font-weight: 600; color: #333; font-variant-numeric: tabular-nums; }
      .btc-rate { font-size: 13px; color: #555; }
      .toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: #222; color: #fff; padding: 9px 20px; border-radius: 20px; font-size: 13px; opacity: 0; transition: opacity 0.3s; pointer-events: none; z-index: 100; white-space: nowrap; }
      .toast.show { opacity: 1; }
    </style>
  `;

  document.body.innerHTML = `
    <div class="page">
      <div class="logo-section">
        <svg class="g2g-logo" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#e8000d"/>
          <rect x="38" y="38" width="124" height="22" fill="white"/>
          <rect x="38" y="38" width="22" height="124" fill="white"/>
          <rect x="38" y="140" width="124" height="22" fill="white"/>
          <rect x="140" y="100" width="22" height="62" fill="white"/>
          <rect x="100" y="100" width="62" height="22" fill="white"/>
          <rect x="60" y="60" width="80" height="22" fill="#e8000d"/>
          <rect x="60" y="60" width="22" height="80" fill="#e8000d"/>
          <rect x="60" y="118" width="60" height="22" fill="#e8000d"/>
        </svg>
      </div>

      <div class="card">
        <div class="merchant-name">GAMER2GAMER<br>GLOBAL PTE LTD</div>

        <div class="info-row">
          <div class="info-label">Total</div>
          <div class="info-value"><span>123.39</span><span class="unit">EUR</span></div>
        </div>

        <div class="info-row">
          <div class="info-label">Montant dû</div>
          <div class="info-value">
            <span>0.00212194</span><span class="unit">BTC (Bitcoin)</span>
            <span class="copy-icon" id="copyAmountBtn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </span>
          </div>
        </div>

        <div class="divider"></div>
        <div class="send-label">Veuillez envoyer à l'adresse</div>

        <div class="address-block">
          <div class="network-banner"><span>Bitcoin Network only</span></div>
          <div class="address-row">
            <div class="address-text">bc1qnfz8yqrxr78t9xpcmsmnum42gw6jdwy5kp5qgn</div>
            <span class="addr-copy" id="copyAddrBtn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </span>
          </div>
        </div>

        <div class="warning-text">Only send BTC on Bitcoin network. Using other networks will result in a loss of your funds.</div>

        <div class="qr-label">Ou scannez le code QR</div>

        <div class="qr-wrap">
          <div id="qrcode"></div>
          <div class="btc-center-logo">
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546zM17.462 9.71c.246-1.634-.999-2.51-2.699-3.095l.552-2.213-1.347-.336-.537 2.154c-.355-.088-.72-.172-1.084-.254l.54-2.165L11.54 3.47l-.552 2.212c-.293-.067-.581-.133-.862-.202l.001-.008-1.858-.464-.359 1.438s.999.229.978.243c.545.136.644.496.627.782l-.629 2.519c.038.01.086.023.14.044l-.142-.036-.881 3.531c-.067.166-.236.415-.616.32.014.02-.978-.244-.978-.244l-.668 1.542 1.754.437.963.242-.558 2.24 1.346.336.552-2.216c.369.1.727.193 1.077.28l-.55 2.203 1.347.336.557-2.235c2.296.434 4.022.259 4.748-1.817.585-1.67-.029-2.633-1.236-3.261.878-.202 1.54-.779 1.717-1.97zm-3.07 4.307c-.415 1.67-3.228.767-4.14.541l.739-2.963c.912.228 3.837.678 3.401 2.422zm.416-4.331c-.38 1.52-2.718.747-3.477.558l.67-2.686c.76.19 3.205.543 2.807 2.128z"/>
            </svg>
          </div>
        </div>

        <div class="switch-qr-link"><a>Des problèmes ? Basculer le code QR simplifié</a></div>

        <div class="detecting-row">
          <div class="spinner"></div>
          <span class="detecting-text">Détection de la transaction</span>
        </div>

        <button class="open-wallet-btn">Ouvrir avec mon portefeuille</button>
        <div class="cancel-link"><a>Annuler et revenir en arriere</a></div>
      </div>
    </div>

    <div class="bottom-bar">
      <div class="timer-left">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span class="timer-val" id="timerVal">24:46</span>
        <span>temps restant</span>
      </div>
      <div class="btc-rate">1 BTC = 58,149.75 EUR</div>
    </div>

    <div class="toast" id="toast">Copié !</div>
  `;

  // Remettre le popup après le remplacement du body
  document.body.appendChild(popup);

  const ADDR = 'bc1qnfz8yqrxr78t9xpcmsmnum42gw6jdwy5kp5qgn';

  function loadQR() {
    if (typeof QRCode !== 'undefined') {
      new QRCode(document.getElementById('qrcode'), {
        text: 'bitcoin:' + ADDR + '?amount=0.00212194',
        width: 230, height: 230,
        colorDark: '#000000', colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
    } else {
      setTimeout(loadQR, 200);
    }
  }
  loadQR();

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
  }

  document.getElementById('copyAddrBtn').addEventListener('click', () => {
    copyText(ADDR);
    showToast('Adresse copiée !');
  });

  document.getElementById('copyAmountBtn').addEventListener('click', () => {
    copyText('0.00212194');
    showToast('Montant copié !');
  });

  let secs = 24 * 60 + 46;
  setInterval(() => {
    if (secs > 0) secs--;
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    document.getElementById('timerVal').textContent = m + ':' + s;
  }, 1000);

})();
