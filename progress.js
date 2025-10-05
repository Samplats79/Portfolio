// Timeline: scroll laat kaarten faden, vulling groeit mee.
// Dot wordt actief zodra de paarse vulling hem raakt.
// Klik op dot => scroll naar de juiste kaart.
(function () {
  const tl   = document.getElementById('bfTimeline');
  const fill = document.getElementById('bfFill');
  if (!tl || !fill) return;

  const steps = Array.from(tl.querySelectorAll('.bf-step'));

  function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
  function absTop(el){ const r = el.getBoundingClientRect(); return r.top + window.scrollY; }

  // fade-in wanneer in beeld
  const io = new IntersectionObserver((ents)=>{
    ents.forEach(e => { if (e.isIntersecting) e.target.classList.add('inview'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -20% 0px' });
  steps.forEach(s => io.observe(s));

  function update() {
    const tlTop = absTop(tl);
    const tlH   = tl.offsetHeight;

    const yCenter = window.scrollY + window.innerHeight * 0.35;
    const ratio   = clamp((yCenter - tlTop) / tlH, 0, 1);
    fill.style.height = (ratio * 100) + '%';

    const fillPx = ratio * tlH;

    // activeer stappen zodra de vulling de dot raakt
    steps.forEach(step => {
      const dot  = step.querySelector('.bf-dot');
      const card = step.querySelector('.bf-card');
      if (!dot || !card) return;

      const dotCenter = (absTop(dot) - tlTop) + dot.offsetHeight/2;

      if (fillPx >= dotCenter) {
        step.classList.add('active');
        step.classList.add('inview');
      } else {
        step.classList.remove('active');
      }
    });
  }

  // klik op dot → scroll naar kaart
  steps.forEach(step => {
    const dot  = step.querySelector('.bf-dot');
    const card = step.querySelector('.bf-card');
    if (!dot || !card) return;

    dot.addEventListener('click', () => {
      step.classList.add('inview');
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(update, 200);
    });
  });

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  document.addEventListener('DOMContentLoaded', update);
  update();
})();
