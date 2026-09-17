// Corporation NW — ヘッダーの表示切り替え、スマホメニュー、会社情報のプルダウン
(function () {
  var header = document.getElementById('site-header');
  var menuBtn = header.querySelector('.menu-btn');
  var spMenu = document.getElementById('sp-menu');

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    header.classList.toggle('is-open', open);
    spMenu.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? menuBtn.dataset.labelClose : menuBtn.dataset.labelOpen);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  spMenu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.querySelectorAll('[data-dropdown]').forEach(function (drop) {
    var btn = drop.querySelector('button');
    function set(open) {
      drop.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    }
    btn.addEventListener('click', function () {
      set(btn.getAttribute('aria-expanded') !== 'true');
    });
    drop.addEventListener('mouseleave', function () { set(false); });
    drop.addEventListener('focusout', function (e) {
      if (!drop.contains(e.relatedTarget)) set(false);
    });
    drop.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { set(false); btn.blur(); });
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
    document.querySelectorAll('[data-dropdown].is-open').forEach(function (drop) {
      drop.classList.remove('is-open');
      drop.querySelector('button').setAttribute('aria-expanded', 'false');
    });
  });

  // 動きを減らす設定の人には、動画を止めて静止画だけにする
  var video = document.querySelector('.hero__media video');
  if (video && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
  }
})();
