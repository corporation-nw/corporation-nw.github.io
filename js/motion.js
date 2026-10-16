/* Corporation NW — 表示の演出
   1. 画面に入った要素が、下からふわりと浮き上がる
   2. 背景の大きな文字が、スクロールに合わせてゆっくり動く
   動きを減らす設定（prefers-reduced-motion）の端末では、何も動かさずに表示する。 */
(function () {
  'use strict';

  // CSS 側の初期状態と同じ並び。ここを変えたら style.css の .js セレクタも合わせる。
  var SELECTOR = [
    '.hero__copy > *', '.stats__item',
    '.section__head > *',
    '.vision__label > *', '.vision__body > *',
    '.product',
    '.biz-card',
    '.message__head > *', '.message__body > *',
    '.company__head > *', '.profile', '.history',
    '.offices__text > *', '.offices__map', '.office',
    '.col-card',
    '.contact__inner > *'
  ].join(', ');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var slow = reduce && reduce.matches;

  function showAll(items) {
    for (var i = 0; i < items.length; i++) items[i].classList.add('is-in');
  }

  // 同じ親の中で何番目かに応じて、少しずつ遅らせる（順番に浮き上がって見える）
  function setDelay(el) {
    var parent = el.parentElement;
    if (!parent) return;
    var step = parent.classList.contains('hero__copy') ? 120 : 70;
    var index = 0;
    for (var i = 0; i < parent.children.length; i++) {
      if (parent.children[i] === el) { index = i; break; }
    }
    var delay = Math.min(index * step, 420);
    if (delay) el.style.transitionDelay = delay + 'ms';
  }

  function reveal() {
    var items = document.querySelectorAll(SELECTOR);
    if (!items.length) return;
    if (slow || !('IntersectionObserver' in window)) { showAll(items); return; }

    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    for (var i = 0; i < items.length; i++) {
      setDelay(items[i]);
      io.observe(items[i]);
    }

    // 保険：裏側のタブで開かれたなどで交差判定が働かないとき、
    // 画面に入っている要素だけは必ず表示しておく（文章が読めないまま残るのを防ぐ）。
    function failsafe() {
      var vh = window.innerHeight;
      for (var i = 0; i < items.length; i++) {
        var el = items[i];
        if (el.classList.contains('is-in')) continue;
        var box = el.getBoundingClientRect();
        if (box.top < vh && box.bottom > 0) el.classList.add('is-in');
      }
    }
    if (document.readyState === 'complete') window.setTimeout(failsafe, 80);
    else window.addEventListener('load', function () { window.setTimeout(failsafe, 80); });
    window.setTimeout(failsafe, 1500);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) window.setTimeout(failsafe, 300);
    });
  }

  // 背景の大きな文字を、そのセクションのスクロール位置に合わせて上下にずらす
  function watermarks() {
    var marks = document.querySelectorAll('[data-watermark]');
    if (!marks.length || slow) return;

    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      for (var i = 0; i < marks.length; i++) {
        var mark = marks[i];
        var box = mark.parentElement.getBoundingClientRect();
        if (box.bottom < -300 || box.top > vh + 300) continue;
        var progress = (vh - box.top) / (vh + box.height); // 0（下から入る）→ 1（上へ抜ける）
        mark.style.transform = 'translate3d(0,' + ((0.5 - progress) * 150).toFixed(1) + 'px,0)';
      }
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  function start() { reveal(); watermarks(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
