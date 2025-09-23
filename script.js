/* ====== Nav glass + active link + full-screen mobile menu ====== */
const nav        = document.querySelector('nav');
const navMenu    = document.querySelector('.navdaar');
const hamburger  = document.querySelector('.hamburger');
const navLinks   = document.querySelectorAll('.navdaar a');

function updateNavGlass() {
  if (!nav) return;
  nav.classList.toggle('glass', window.scrollY > 8);
}

function highlightActiveLink() {
  const sections = document.querySelectorAll('header.one, section[id]');
  let currentId = 'top';
  sections.forEach((s) => {
    const top = s.offsetTop - 100;
    const bottom = top + s.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      currentId = s.id || 'top';
    }
  });
  navLinks.forEach((a) => {
    const hash = (a.getAttribute('href') || '').replace('#','') || 'top';
    a.classList.toggle('active', hash === currentId);
  });
}

/* --- menu controls --- */
function openMobileMenu(){
  if (!hamburger || !navMenu) return;
  document.body.dataset.scrollY = window.scrollY;     // iOS fix
  document.body.classList.add('menu-open');
  hamburger.classList.add('active');
  navMenu.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  // lock body without jumping
  document.body.style.top = `-${document.body.dataset.scrollY}px`;
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
}

function closeMobileMenu(){
  if (!hamburger || !navMenu) return;
  document.body.classList.remove('menu-open');
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  // restore scroll
  const y = parseInt(document.body.style.top || '0') * -1;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, y || 0);
}

function toggleMobileMenu(){
  if (navMenu.classList.contains('active')) closeMobileMenu();
  else openMobileMenu();
}

/* --- init + listeners --- */
function onScrollOrResize(){
  updateNavGlass();
  highlightActiveLink();
}
onScrollOrResize();

window.addEventListener('scroll', onScrollOrResize, { passive:true });
window.addEventListener('resize', () => {
  onScrollOrResize();
  if (window.innerWidth >= 641) closeMobileMenu(); // force close on desktop
});

if (hamburger){
  hamburger.addEventListener('click', toggleMobileMenu);
  navLinks.forEach(a => a.addEventListener('click', closeMobileMenu));
  document.addEventListener('click', (e) => {
    if (!navMenu.classList.contains('active')) return;
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}
