// Corporation NW — アクセス解析（Google アナリティクス 4）と Cookie の同意バナー
// cnw2026.com の本体・各LP（/mobile/ /agent/ /tonaritabi/）で共通に読み込む。
// - 同意してもらえたときだけ GA4 を読み込む（同意しないときは何も送らない）
// - 同意の記録は localStorage の "cnw_consent"（granted / denied）。本体と各LPで共通
// - ボタン類のクリックは「cta_click」、メール・電話は「contact_click」として記録する
//   （他サイトへのリンクは GA4 の拡張計測機能が「click」として自動で記録する）
(function () {
  var GA_ID = 'G-D770V7R31C';
  var KEY = 'cnw_consent';
  var loaded = false;

  function getConsent() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setConsent(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* 保存できなくても続ける */ }
  }

  function lang() {
    var l = (document.documentElement.lang || 'ja').toLowerCase();
    if (l.indexOf('zh-hant') === 0 || l === 'zh-tw') return 'zh-tw';
    if (l.indexOf('zh') === 0) return 'zh-cn';
    if (l.indexOf('en') === 0) return 'en';
    return 'ja';
  }

  var TEXT = {
    'ja': {
      msg: 'このサイトでは、閲覧状況を知るために Google アナリティクスの Cookie を使います。同意いただいた場合だけ使います。',
      more: '詳しく', yes: '同意する', no: '同意しない', href: '/privacy/'
    },
    'zh-tw': {
      msg: '本網站使用 Google Analytics 的 Cookie 了解瀏覽情形，僅在您同意後才會使用。',
      more: '詳細說明', yes: '同意', no: '不同意', href: '/zh-tw/privacy/'
    },
    'zh-cn': {
      msg: '本网站使用 Google Analytics 的 Cookie 了解浏览情况，仅在您同意后才会使用。',
      more: '详细说明', yes: '同意', no: '不同意', href: '/zh-cn/privacy/'
    },
    'en': {
      msg: 'We use Google Analytics cookies to understand how this site is used, only if you agree.',
      more: 'Details', yes: 'Accept', no: 'Decline', href: '/en/privacy/'
    }
  };

  function loadGA() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function track(name, params) {
    if (loaded && typeof window.gtag === 'function') window.gtag('event', name, params);
  }

  // ボタン・カード類のクリック
  var CTA = '.btn, .cta, .head-cta, .nav-cta, .nav__cta, .to-mobile, .to-agent, .to-tonari, ' +
            '.biz-card, .col-card, .nwm__link, .partner-logo, [data-track]';
  document.addEventListener('click', function (e) {
    if (!loaded || !e.target.closest) return;
    var a = e.target.closest('a, button');
    if (!a || a.closest('.cnw-consent')) return;
    var href = a.getAttribute('href') || '';
    var label = (a.getAttribute('data-track') || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    if (/^mailto:/i.test(href) || /^tel:/i.test(href)) {
      track('contact_click', { method: /^mailto:/i.test(href) ? 'mail' : 'tel', link_text: label });
    } else if (a.matches(CTA)) {
      track('cta_click', { link_text: label, link_url: a.href || '', link_classes: a.className || '' });
    }
  }, true);

  function removeBanner() {
    var b = document.querySelector('.cnw-consent');
    if (b) b.parentNode.removeChild(b);
  }

  function showBanner() {
    if (document.querySelector('.cnw-consent')) return;
    var t = TEXT[lang()];
    var css = document.createElement('style');
    css.textContent =
      '.cnw-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:640px;margin:0 auto;' +
      'background:#1f2329;color:#f5f5f5;border-radius:12px;padding:16px 18px;box-shadow:0 8px 28px rgba(0,0,0,.28);' +
      'font:14px/1.7 system-ui,-apple-system,"Hiragino Sans","Noto Sans JP","PingFang TC","Microsoft JhengHei",sans-serif}' +
      '.cnw-consent p{margin:0 0 12px}' +
      '.cnw-consent a{color:#9cc9ff;text-decoration:underline}' +
      '.cnw-consent__btns{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}' +
      '.cnw-consent button{font:inherit;font-weight:600;border-radius:999px;padding:8px 18px;cursor:pointer;border:1px solid #f5f5f5}' +
      '.cnw-consent__no{background:transparent;color:#f5f5f5}' +
      '.cnw-consent__yes{background:#f5f5f5;color:#1f2329}';
    document.head.appendChild(css);

    var box = document.createElement('div');
    box.className = 'cnw-consent';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Cookie');
    var p = document.createElement('p');
    p.appendChild(document.createTextNode(t.msg + ' '));
    var more = document.createElement('a');
    more.href = t.href;
    more.textContent = t.more;
    p.appendChild(more);
    var btns = document.createElement('div');
    btns.className = 'cnw-consent__btns';
    var no = document.createElement('button');
    no.type = 'button'; no.className = 'cnw-consent__no'; no.textContent = t.no;
    var yes = document.createElement('button');
    yes.type = 'button'; yes.className = 'cnw-consent__yes'; yes.textContent = t.yes;
    no.addEventListener('click', function () { setConsent('denied'); removeBanner(); });
    yes.addEventListener('click', function () { setConsent('granted'); removeBanner(); loadGA(); });
    btns.appendChild(no); btns.appendChild(yes);
    box.appendChild(p); box.appendChild(btns);
    document.body.appendChild(box);
  }

  // 個人情報の方針のページにある「Cookie の設定を変更する」ボタン
  function bindReset() {
    document.querySelectorAll('[data-cnw-consent-reset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        try { localStorage.removeItem(KEY); } catch (e) { /* 何もしない */ }
        // GA の Cookie（_ga, _ga_XXXX）を消す
        document.cookie.split(';').forEach(function (c) {
          var name = c.split('=')[0].trim();
          if (/^_ga/.test(name)) {
            ['', '; domain=' + location.hostname, '; domain=.' + location.hostname.replace(/^www\./, '')].forEach(function (d) {
              document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
            });
          }
        });
        if (loaded) { location.reload(); return; }
        showBanner();
      });
    });
  }

  function start() {
    var c = getConsent();
    if (c === 'granted') loadGA();
    else if (c !== 'denied') showBanner();
    bindReset();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
