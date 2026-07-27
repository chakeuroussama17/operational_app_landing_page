/* ─────────────────────────────────────────────────────────────
   HICOM Ops — landing page interactions
   Native scrolling (smooth via CSS) + GSAP reveals + 3D tilt +
   a live LOR% instrument panel echoing the real app.
   ───────────────────────────────────────────────────────────── */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Image placeholders ----------------------------------------------------
// Any <img class="ph"> that fails to load (asset not added yet) becomes a
// labelled placeholder telling you what to drop in + the path.
function placeholder(img) {
  const box = document.createElement('div');
  box.className = 'placeholder ' + (img.className || '');
  box.classList.remove('ph');
  const ratio = img.dataset.ratio || '1/1';
  box.style.aspectRatio = ratio.replace('/', ' / ');

  if (img.hasAttribute('data-mini')) {
    box.classList.add('placeholder--mini');
    box.textContent = '📷';
  } else {
    box.innerHTML = `<span>📷 ${img.dataset.ph || 'Image'}</span><small>${img.getAttribute('src') || ''}</small>`;
  }
  img.replaceWith(box);
}
window.placeholder = placeholder;

document.querySelectorAll('img.ph').forEach((img) => {
  if (img.complete && img.naturalWidth === 0) placeholder(img);
});

// 2. Smooth anchor scrolling ----------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// 3. 3D tilt on the phone --------------------------------------------------
if (window.VanillaTilt && !reduceMotion) {
  VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
    max: 8, speed: 400, glare: true, 'max-glare': 0.12, scale: 1.015,
  });
}

// 4. Scroll-reveal + parallax + stat count-up (GSAP) ----------------------
if (!(window.gsap && window.ScrollTrigger)) {
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
} else {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  gsap.to('.hero-bg', {
    yPercent: 12, ease: 'none',
    scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true },
  });

  gsap.utils.toArray('[data-count]').forEach((el) => {
    const end = parseInt(el.dataset.count, 10);
    const suffix = (el.textContent.match(/[^0-9]+$/) || [''])[0];
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%' },
      onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
    });
  });
}

// 5. Nav glass on scroll ---------------------------------------------------
const header = document.querySelector('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 6. Live LOR% instrument panel -------------------------------------------
// Mirrors the app's real data shape: a part logs Output against Plan, the
// backend returns LOR% (output ÷ plan). We animate that fill to sell the
// "type it in, see it live" idea. Day/Night toggle re-runs with new figures.
(function panel() {
  const CIRC = 327;             // 2π·52, matches the SVG radius
  const PLAN = 300;
  const SLOTS = 6;              // six checkpoints a shift
  const shifts = {
    Day:   { out: 198, mo: 'MO JUL-0451' },   // 66%
    Night: { out: 240, mo: 'MO JUL-0452' },   // 80%
  };

  const gFill = document.getElementById('gFill');
  const lorNum = document.getElementById('lorNum');
  const rOut = document.getElementById('rOut');
  const slotsWrap = document.getElementById('slots');
  const savedTag = document.getElementById('savedTag');
  const panelMo = document.getElementById('panelMo');
  const toggle = document.getElementById('shiftToggle');
  if (!gFill || !slotsWrap) return;

  // Build the six checkpoint bars.
  for (let i = 0; i < SLOTS; i++) {
    const s = document.createElement('div');
    s.className = 'slot';
    slotsWrap.appendChild(s);
  }
  const slotEls = [...slotsWrap.children];

  let raf = null;

  function run(shift) {
    const { out, mo } = shifts[shift];
    panelMo.innerHTML = mo.replace(' ', '&nbsp;');
    savedTag.classList.remove('show');
    if (raf) cancelAnimationFrame(raf);

    if (reduceMotion) {
      paint(out);
      savedTag.classList.add('show');
      return;
    }

    const start = performance.now();
    const DUR = 1200;
    function tick(now) {
      const t = Math.min(1, (now - start) / DUR);
      const eased = 1 - Math.pow(1 - t, 3);     // easeOutCubic
      paint(out * eased);
      if (t < 1) { raf = requestAnimationFrame(tick); }
      else { savedTag.classList.add('show'); }
    }
    raf = requestAnimationFrame(tick);
  }

  function paint(output) {
    const pct = Math.min(100, (output / PLAN) * 100);
    gFill.style.strokeDashoffset = CIRC * (1 - pct / 100);
    lorNum.textContent = Math.round(pct) + '%';
    rOut.textContent = Math.round(output);
    const filled = Math.round((output / PLAN) * SLOTS);
    slotEls.forEach((s, i) => s.classList.toggle('fill', i < filled));
  }

  // Kick off after the "lights on" screen intro clears.
  setTimeout(() => run('Day'), reduceMotion ? 0 : 900);

  toggle.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-shift]');
    if (!btn) return;
    toggle.querySelectorAll('button').forEach((b) => b.classList.remove('on'));
    btn.classList.add('on');
    run(btn.dataset.shift);
  });
})();
