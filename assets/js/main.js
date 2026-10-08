/* =========================================================
   داده‌های گالری و کادر مدرسه
   عکس‌ها را در پوشه‌های images/gallery و images/staff قرار دهید
   و نام فایل‌ها را در لیست‌های زیر تنظیم کنید.
   ========================================================= */

const GALLERY = [
  { src: 'images/gallery/1.jpg',  title: 'حیاط مدرسه',                 cat: 'yard',  size: 'wide tall', icon: '🏫' },
  { src: 'images/gallery/2.jpg',  title: 'کلاس درس',                   cat: 'class', icon: '📚' },
  { src: 'images/gallery/3.jpg',  title: 'آموزش جغرافی با دیوارنگاره', cat: 'class', icon: '🗺️' },
  { src: 'images/gallery/4.jpg',  title: 'انتخابات شورای دانش‌آموزی',  cat: 'event', size: 'tall', icon: '🗳️' },
  { src: 'images/gallery/5.jpg',  title: 'اجرای نمایش روی صحنه',       cat: 'event', icon: '🎭' },
  { src: 'images/gallery/6.jpg',  title: 'جشن اقوام ایرانی',           cat: 'event', size: 'wide', icon: '🎉' },
  { src: 'images/gallery/7.jpg',  title: 'تغذیه سالم در کلاس',         cat: 'class', icon: '🥛' },
  { src: 'images/gallery/8.jpg',  title: 'زنگ تفریح',                  cat: 'yard',  icon: '⚽' },
  { src: 'images/gallery/9.jpg',  title: 'مراسم صبحگاه',               cat: 'yard',  size: 'wide', icon: '🌅' },
  { src: 'images/gallery/10.jpg', title: 'مانور ایمنی زلزله',          cat: 'event', icon: '🛡️' },
];

const STAFF = [
  { photo: 'images/staff/1.jpg', name: 'خانم مریم احمدی',  role: 'مدیر دبستان' },
  { photo: 'images/staff/2.jpg', name: 'خانم زهرا کریمی',  role: 'معاون آموزشی' },
  { photo: 'images/staff/3.jpg', name: 'آقای علی رضایی',   role: 'معاون پرورشی' },
  { photo: 'images/staff/4.jpg', name: 'خانم فاطمه موسوی', role: 'آموزگار پایه اول' },
  { photo: 'images/staff/5.jpg', name: 'خانم سارا حسینی',  role: 'آموزگار پایه دوم' },
  { photo: 'images/staff/6.jpg', name: 'خانم نرگس جعفری',  role: 'آموزگار پایه سوم' },
  { photo: 'images/staff/7.jpg', name: 'خانم لیلا صادقی',  role: 'مشاور مدرسه' },
  { photo: 'images/staff/8.jpg', name: 'آقای رضا محمدی',   role: 'مربی رباتیک' },
  { photo: 'images/staff/9.jpg', name: 'آقای حمید نوری',   role: 'مربی هنر' },
];

const PLACEHOLDER_COLORS = [
  'linear-gradient(135deg,#cddbff,#eaf0ff)',
  'linear-gradient(135deg,#ffe2b3,#fff4e0)',
  'linear-gradient(135deg,#c9f2dd,#ecfbf3)',
  'linear-gradient(135deg,#e4d6ff,#f4eeff)',
];

const toFa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

/* ---------- Gallery ---------- */
const grid = document.getElementById('galleryGrid');
GALLERY.forEach((item, i) => {
  const fig = document.createElement('figure');
  fig.className = `gallery__item reveal ${item.size || ''}`;
  fig.dataset.cat = item.cat;
  fig.dataset.index = i;
  fig.style.setProperty('--ph', PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length]);
  fig.innerHTML = `
    <span class="ph">${item.icon}</span>
    <img src="${item.src}" alt="${item.title}" loading="lazy">
    <figcaption>${item.title}</figcaption>`;
  // اگر عکس هنوز اضافه نشده، پیش‌نمایش رنگی نمایش داده شود
  fig.querySelector('img').addEventListener('error', e => e.target.remove());
  grid.appendChild(fig);
});

document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('.filter');
  if (!btn) return;
  document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b === btn));
  const f = btn.dataset.filter;
  grid.querySelectorAll('.gallery__item').forEach(el => {
    el.classList.toggle('hidden', f !== 'all' && el.dataset.cat !== f);
  });
});

/* ---------- Lightbox ---------- */
const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('img');
const lbCap = lb.querySelector('figcaption');
let current = 0;

const visibleItems = () => [...grid.querySelectorAll('.gallery__item:not(.hidden)')].filter(el => el.querySelector('img'));

function openLightbox(index) {
  const el = grid.querySelector(`[data-index="${index}"]`);
  const img = el && el.querySelector('img');
  if (!img) return; // عکسی برای نمایش وجود ندارد
  current = index;
  lbImg.src = img.src;
  lbCap.textContent = GALLERY[index].title;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}
function step(dir) {
  const items = visibleItems();
  if (!items.length) return;
  const pos = items.findIndex(el => +el.dataset.index === current);
  const next = items[(pos + dir + items.length) % items.length];
  openLightbox(+next.dataset.index);
}

grid.addEventListener('click', e => {
  const item = e.target.closest('.gallery__item');
  if (item) openLightbox(+item.dataset.index);
});
lb.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
lb.querySelector('.lightbox__prev').addEventListener('click', () => step(-1));
lb.querySelector('.lightbox__next').addEventListener('click', () => step(1));
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') step(1);
  if (e.key === 'ArrowRight') step(-1);
});

/* ---------- Staff carousel ---------- */
const AUTOPLAY_MS = 4500;
const carousel = document.getElementById('staffCarousel');
const track = document.getElementById('staffTrack');
const dotsBox = document.getElementById('staffDots');

const memberCard = m => {
  const card = document.createElement('div');
  card.className = 'member';
  card.innerHTML = `
    <figure class="member__card">
      <img src="${m.photo}" alt="${m.name}" loading="lazy">
      <figcaption>
        <h4>${m.name}</h4>
        <span>${m.role}</span>
      </figcaption>
    </figure>`;
  return card;
};

const COUNT = STAFF.length;
let pos = 0, timer, pv;
const perView = () => (innerWidth < 600 ? 1 : innerWidth < 900 ? 2 : 3);

// Cards plus clones of the first few at the end, so the loop always slides forward
// (last → first never rewinds across the whole track).
function build() {
  pv = perView();
  carousel.style.setProperty('--per-view', pv);
  track.innerHTML = '';
  [...STAFF, ...STAFF.slice(0, pv * 2)].forEach(m => track.appendChild(memberCard(m)));
  dotsBox.innerHTML = '';
  for (let i = 0; i < Math.ceil(COUNT / pv); i++) {
    const d = document.createElement('button');
    d.className = 'carousel__dot';
    d.setAttribute('aria-label', `صفحه ${toFa(i + 1)}`);
    d.addEventListener('click', () => { slide(i * pv); restart(); });
    dotsBox.appendChild(d);
  }
  jump(0);
}

// RTL: items flow right-to-left, so moving forward means a positive translate
const place = () => {
  track.style.transform = `translateX(${pos * 100 / pv}%)`;
  const page = Math.min(Math.floor((pos % COUNT) / pv), dotsBox.children.length - 1);
  [...dotsBox.children].forEach((d, k) => d.classList.toggle('active', k === page));
};
function jump(p) {            // move without animation
  track.style.setProperty('transition', 'none', 'important');
  pos = p; place();
  track.offsetHeight;         // flush styles so the next move animates again
  track.style.removeProperty('transition');
}
function slide(p) {
  if (pos >= COUNT) { p -= COUNT; jump(pos - COUNT); } // in case transitionend never fired
  if (p < 0) { jump(pos + COUNT); p += COUNT; }
  pos = p; place();
}
track.addEventListener('transitionend', e => { if (e.target === track && pos >= COUNT) jump(pos - COUNT); });

const next = () => slide(pos + pv);
const prev = () => slide(pos - pv);
function restart() {
  clearInterval(timer);
  timer = setInterval(next, AUTOPLAY_MS);
}

carousel.querySelector('.carousel__next').addEventListener('click', () => { next(); restart(); });
carousel.querySelector('.carousel__prev').addEventListener('click', () => { prev(); restart(); });
carousel.addEventListener('mouseenter', () => clearInterval(timer));
carousel.addEventListener('mouseleave', restart);

let touchX = null;
carousel.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
carousel.addEventListener('touchend', e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 40) dx > 0 ? next() : prev(); // swipe right → next in RTL
  touchX = null;
  restart();
});

addEventListener('resize', () => { if (perView() !== pv) build(); });

build();
restart();

/* ---------- Header / Nav ---------- */
const header = document.getElementById('header');
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');

burger.addEventListener('click', () => nav.classList.toggle('open'));
nav.addEventListener('click', e => { if (e.target.matches('a')) nav.classList.remove('open'); });

const sections = [...document.querySelectorAll('main section[id]')];
const links = [...document.querySelectorAll('.nav__link')];
function onScroll() {
  header.classList.toggle('scrolled', scrollY > 10);
  let id = sections[0].id;
  sections.forEach(s => { if (s.getBoundingClientRect().top < 140) id = s.id; });
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Reveal on scroll + counters ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('visible');
    io.unobserve(en.target);
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const counterIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, target = +el.dataset.count, start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / 1400, 1);
      el.textContent = toFa(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
}, { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));

document.getElementById('year').textContent = toFa(new Date().getFullYear() - 621);
