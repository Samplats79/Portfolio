// ===== HAMBURGER MENU =====
const burger = document.querySelector('.hamburger');
const menu   = document.querySelector('#menu');

if (burger && menu) {
  burger.addEventListener('click', () => {
    const active = burger.classList.toggle('active');
    menu.classList.toggle('active', active);
    burger.setAttribute('aria-expanded', active ? 'true' : 'false');
    document.body.style.overflow = active ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('active');
      menu.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ===== ACTIEVE NAV-LINK BIJ SCROLL =====
const sections = document.querySelectorAll('header[id], section[id]');
const navLinks = document.querySelectorAll('.navdaar a');

const setActive = () => {
  let current = '#top';
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    if (scrollY >= top) current = '#' + sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === current);
  });
};
window.addEventListener('scroll', setActive);
setActive();

// ===== H1 LETTER-FOR-LETTER (meer “1-per-1”) =====
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('namee');
  if (!el) return;

  const letters = [];

  const wrapTextNodes = (node) => {
    Array.from(node.childNodes).forEach(n => {
      if (n.nodeType === Node.TEXT_NODE) {
        const text = n.textContent;
        for (const ch of text) {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = ch;
          letters.push(span);
          node.insertBefore(span, n);
        }
        node.removeChild(n);
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        wrapTextNodes(n);
      }
    });
  };

  wrapTextNodes(el);

  letters.forEach((span, i) => {
    span.style.setProperty('--i', i);
  });

  // start animatie
  el.classList.add('animate-chars');
});

// ===== Profielfoto toggle (simpel src wisselen) =====
const pfImg = document.querySelector('.profiel img');
if (pfImg) {
  const primary = pfImg.getAttribute('src');
  const alt = pfImg.dataset.altSrc || 'images/switch.jpg';

  // preload alt
  const pre = new Image();
  pre.src = alt;

  let showingAlt = false;

  const toggleSrc = () => {
    showingAlt = !showingAlt;
    pfImg.src = showingAlt ? alt : primary;
    pfImg.alt = showingAlt
      ? 'Samplats aan het basketten'
      : '3D avatar van Samplats';
  };

  pfImg.style.cursor = 'pointer';
  pfImg.setAttribute('tabindex', '0');

  pfImg.addEventListener('click', toggleSrc);
  pfImg.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSrc();
    }
  });
}
