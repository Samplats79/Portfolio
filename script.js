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

// ===== H1 LETTER-FOR-LETTER =====
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

  el.classList.add('animate-chars');
});

// ===== Profielfoto: 1x auto flip na VOLLEDIGE H1 + klik-toggle =====
(() => {
  const pfWrap = document.querySelector('.profiel');         // paarse cirkel (container)
  const pfImg  = pfWrap ? pfWrap.querySelector('img') : null;
  const nameH1 = document.getElementById('namee');
  if (!pfWrap || !pfImg || !nameH1) return;

  const primary = pfImg.getAttribute('src');
  const alt     = pfImg.dataset.altSrc || 'images/switch.jpg';

  // preload alt
  const pre = new Image();
  pre.src = alt;

  let showingAlt = false;

  // MOET in sync met CSS-animatie van .pf-anim hieronder
  const DURATION = 600; // ms – wat langer/smoother dan eerst

  const swapSrc = () => {
    showingAlt = !showingAlt;
    pfImg.src = showingAlt ? alt : primary;
    pfImg.alt = showingAlt ? 'Samplats aan het basketten' : '3D avatar van Samplats';
  };

  const animateFlip = () => {
    pfWrap.classList.remove('pf-anim');
    // force reflow
    // eslint-disable-next-line no-unused-expressions
    pfWrap.offsetWidth;
    pfWrap.classList.add('pf-anim');

    const midTimer = setTimeout(swapSrc, DURATION / 2);

    pfWrap.addEventListener('animationend', () => {
      clearTimeout(midTimer);
      pfWrap.classList.remove('pf-anim');
    }, { once: true });
  };

  // Interactie (klik + toetsenbord)
  pfImg.style.cursor = 'pointer';
  pfImg.setAttribute('tabindex', '0');
  pfImg.addEventListener('click', animateFlip);
  pfImg.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      animateFlip();
    }
  });

  // Helper: "0.50s" -> 500ms, ".50s" -> 500ms
  const timeToMs = (v, fallbackMs) => {
    if (!v) return fallbackMs;
    const s = String(v).trim();
    if (s.endsWith('ms')) return parseFloat(s);
    if (s.endsWith('s'))  return parseFloat(s) * 1000;
    // soms staat er ".50s" zonder 's' in getComputedStyle? fallback
    const num = parseFloat(s);
    return isNaN(num) ? fallbackMs : num * 1000;
  };

  // 1x automatisch flippen zodra H1 100% in beeld is EN de letters klaar zijn
  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced && 'IntersectionObserver' in window) {
    let done = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && en.intersectionRatio >= 1 && !done) {
          done = true;

          // bereken totaalduur van de H1-letteranimatie
          const styles  = getComputedStyle(nameH1);
          const startMs = timeToMs(styles.getPropertyValue('--start'), 500);
          const stagger = timeToMs(styles.getPropertyValue('--stagger'), 60);
          const animDur = 400; // nameRise duurt .40s in CSS
          const nChars  = nameH1.querySelectorAll('.char').length || 1;

          const totalTextMs = startMs + (Math.max(0, nChars - 1) * stagger) + animDur;

          // kleine buffer zodat het echt “klaar” oogt
          setTimeout(() => {
            animateFlip();
            io.disconnect();
          }, totalTextMs + 120);
        }
      });
    }, { threshold: [1] }); // 100% zichtbaar

    io.observe(nameH1);
  }
})();

