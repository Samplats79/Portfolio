// Timeline: grijze track eindigt bij laatste dot; paarse vulling stopt daar ook.
// Dots worden actief zodra de vulling ze "raakt". Klikken blijft werken.
// Scroll je weer omhoog (vulling voorbij dot) dan verdwijnt de tekst weer.
(function () {
  const tl   = document.getElementById('bfTimeline');
  const fill = document.getElementById('bfFill');
  if (!tl || !fill) return;

  const steps = Array.from(tl.querySelectorAll('.bf-step'));

  const absTop = el => el.getBoundingClientRect().top + window.scrollY;
  const clamp  = (n,a,b) => Math.max(a, Math.min(b, n));

  // px-positie binnen de timeline van het midden van de laatste bol
  function lastDotCenterPx() {
    const lastStep = steps[steps.length - 1];
    const lastDot  = lastStep.querySelector('.bf-dot');
    const tlTop    = absTop(tl);
    return (absTop(lastDot) - tlTop) + lastDot.offsetHeight / 2;
  }

  function update() {
    const tlTop   = absTop(tl);
    const yCenter = window.scrollY + window.innerHeight * 0.35;

    const maxFill = lastDotCenterPx();      // cap op laatste bol
    const trackH  = Math.max(1, maxFill);   // grijze track hoogte
    tl.style.setProperty('--bf-track-h', trackH + 'px');

    const rawPx   = yCenter - tlTop;
    const fillPx  = clamp(rawPx, 0, maxFill);

    // hoogte in % t.o.v. track
    fill.style.height = (fillPx / trackH) * 100 + '%';

    // Activeer/deactiveer stappen op basis van vulling
    steps.forEach(step => {
      const dot  = step.querySelector('.bf-dot');
      const card = step.querySelector('.bf-card');
      const dotCenter = (absTop(dot) - tlTop) + dot.offsetHeight / 2;

      if (fillPx >= dotCenter) {
        step.classList.add('active');   // kaart mag verschijnen (als ook 'inview')
      } else {
        step.classList.remove('active'); // kaart verdwijnt meteen
      }

      // zachte fade-in zodra card ongeveer in beeld komt
      if (absTop(card) < yCenter + 80) step.classList.add('inview');
    });
  }

  // Fade-in observer (zet/laat 'inview' staan; zichtbaarheid hangt óók van 'active' af)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('inview'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -20% 0px' });
  steps.forEach(s => io.observe(s));

  // Klik op dot → scroll naar kaart + vulling tot die dot (max: laatste dot)
  steps.forEach(step => {
    const dot  = step.querySelector('.bf-dot');
    const card = step.querySelector('.bf-card');
    if (!dot || !card) return;

    dot.addEventListener('click', () => {
      step.classList.add('inview');
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        const tlTop   = absTop(tl);
        const maxFill = lastDotCenterPx();
        const trackH  = Math.max(1, maxFill);
        let px = (absTop(dot) - tlTop) + dot.offsetHeight / 2;
        px = Math.min(px, maxFill);
        fill.style.height = (px / trackH) * 100 + '%';

        steps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');
      }, 220);
    });
  });

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  document.addEventListener('DOMContentLoaded', update);
  update();
})();
