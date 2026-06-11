/* ─── PMG Services — Cookie Consent + Google Analytics 4 (Consent Mode v2) ───
   GDPR/TTDSG-compliant: GA4 loads ONLY after the visitor accepts analytics cookies.
   Setup: replace GA_ID below with your Measurement ID from analytics.google.com
   (Admin → Data Streams → Web). One edit here covers every page of the site. */
(function () {
  var GA_ID = 'G-XXXXXXXXXX';

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  // Consent Mode v2 — everything denied until the visitor decides
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });
  gtag('js', new Date());

  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded || GA_ID.indexOf('XXXXXXXXXX') !== -1) return;
    gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  // Safe event helper used across the site — no-ops if consent was declined
  window.pmgTrack = function (name, params) {
    try { gtag('event', name, params || {}); } catch (e) { /* analytics must never break the site */ }
  };

  function getStored(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function setStored(key, val) {
    try { localStorage.setItem(key, val); } catch (e) { /* private mode */ }
  }

  var choice = getStored('pmg-consent');
  if (choice === 'granted') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
    loadGA();
    return;
  }
  if (choice === 'denied') return;

  // ── No stored choice → show the consent banner ──
  var texts = {
    en: {
      msg: 'We use cookies for anonymous analytics to understand how visitors use this site. No marketing or advertising trackers.',
      accept: 'Accept',
      decline: 'Decline',
      privacy: 'Privacy Policy'
    },
    de: {
      msg: 'Wir verwenden Cookies für anonyme Analysen, um zu verstehen, wie Besucher diese Website nutzen. Keine Marketing- oder Werbe-Tracker.',
      accept: 'Akzeptieren',
      decline: 'Ablehnen',
      privacy: 'Datenschutzerklärung'
    }
  };
  var lang = getStored('pmg-lang') === 'de' ? 'de' : 'en';
  var t = texts[lang];

  function showBanner() {
    var banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<p class="consent-text">' + t.msg +
      ' <a href="./privacy-policy.html" target="_blank" rel="noopener">' + t.privacy + '</a></p>' +
      '<div class="consent-actions">' +
      '<button type="button" class="consent-btn consent-accept">' + t.accept + '</button>' +
      '<button type="button" class="consent-btn consent-decline">' + t.decline + '</button>' +
      '</div>';
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.classList.add('consent-visible'); });

    function close(decision) {
      setStored('pmg-consent', decision);
      banner.classList.remove('consent-visible');
      setTimeout(function () { banner.remove(); }, 400);
      if (decision === 'granted') {
        gtag('consent', 'update', { analytics_storage: 'granted' });
        loadGA();
      }
    }
    banner.querySelector('.consent-accept').addEventListener('click', function () { close('granted'); });
    banner.querySelector('.consent-decline').addEventListener('click', function () { close('denied'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showBanner);
  } else {
    showBanner();
  }
})();
