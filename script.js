/**
 * script.js
 * - Preserves your original DOMContentLoaded logic and helpers
 * - ADDED: CONFIG block to control glass options:
 *     - glassIntensity: "light" | "medium" | "strong"  (default: "strong")
 *     - glassSheen: true | false                      (default: true)
 *     - glassShortcut: true | false                   (default: true) -- Ctrl/Cmd+G
 * - applyTheme now applies runtime CSS variable overrides based on CONFIG.
 * - Non-structural changes only — no HTML modifications.
 */

document.addEventListener("DOMContentLoaded", () => {
  // ====== ADDED: Options / config (edit these values) ======
  // You can change these values to quickly adjust behavior without touching CSS.
  const CONFIG = {
    glassIntensity: 'strong', // 'light' | 'medium' | 'strong'
    glassSheen: true,         // true = enable sheen animation on hero/profile
    glassShortcut: true       // true = enable Ctrl/Cmd + G to toggle glass
  };
  // ====== end CONFIG ======

  // helpers
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));
  const safe = fn => { try { fn(); } catch (e) { console.warn(e); } };

  // elements
  const root = document.documentElement;
  const themeButtons = $$('.theme-btn');
  const THEME_KEY = 'site-theme'; // preserved key name
  const stored = localStorage.getItem(THEME_KEY);

  // ADDED: helper to map intensity -> blur values (keeps CSS flexible)
  function intensityToBlurs(intensity) {
    switch ((intensity || '').toLowerCase()) {
      case 'light':
        return { blur: '10px', blurStrong: '18px' };
      case 'medium':
        return { blur: '18px', blurStrong: '26px' };
      case 'strong':
      default:
        return { blur: '28px', blurStrong: '36px' };
    }
  }

  // Apply theme (also updates nav/button visuals)
  function applyTheme(theme, persist = true) {
    // add a smooth transition utility class for nicer switch (ADDED)
    document.body.classList.remove('theme-transition');
    void document.body.offsetWidth; // force reflow
    document.body.classList.add('theme-transition');

    // remove any previous data-theme (light = no data-theme)
    if (theme === 'light' || !theme) {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }

    // update active state on buttons
    themeButtons.forEach(btn => {
      const t = btn.dataset.theme;
      const on = (t === (theme || 'light'));
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    if (persist) {
      try { localStorage.setItem(THEME_KEY, theme || 'light'); } catch (e) { /* ignore */ }
    }

    // ADDED: apply intensity overrides (set CSS variables at runtime)
    // Only apply when glass theme is active; leaving CSS defaults otherwise.
    if ((theme || '') === 'glass') {
      const blurs = intensityToBlurs(CONFIG.glassIntensity);
      root.style.setProperty('--glass-blur', blurs.blur);
      root.style.setProperty('--glass-blur-strong', blurs.blurStrong);
      // optionally adjust glass opacity / drop shadow tuning (keeps consistent)
      if (CONFIG.glassIntensity === 'light') {
        root.style.setProperty('--glass-opacity', '0.035');
        root.style.setProperty('--glass-drop-shadow', 'rgba(7,12,20,0.36)');
      } else if (CONFIG.glassIntensity === 'medium') {
        root.style.setProperty('--glass-opacity', '0.05');
        root.style.setProperty('--glass-drop-shadow', 'rgba(7,12,20,0.44)');
      } else {
        root.style.setProperty('--glass-opacity', '0.06');
        root.style.setProperty('--glass-drop-shadow', 'rgba(7,12,20,0.48)');
      }
    } else {
      // Remove overrides to fall back to CSS defaults for other themes
      root.style.removeProperty('--glass-blur');
      root.style.removeProperty('--glass-blur-strong');
      root.style.removeProperty('--glass-opacity');
      root.style.removeProperty('--glass-drop-shadow');
    }

    // If glass: toggle sheen to hero/profile elements depending on CONFIG
    if ((theme || '') === 'glass' && CONFIG.glassSheen) {
      document.querySelectorAll('.profile-photo-container, .hero-text-content h1').forEach(el => el.classList.add('glass-sheen'));
    } else {
      document.querySelectorAll('.profile-photo-container, .hero-text-content h1').forEach(el => el.classList.remove('glass-sheen'));
    }
  }

  // initialize theme: stored -> prefer-color-scheme -> light
  (function initTheme() {
    let theme = stored;
    if (!theme) {
      // try OS preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    applyTheme(theme, false);
  })();

  // listeners on theme buttons
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.theme;
      applyTheme(t, true);
    });
    // keyboard support
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // ADDED: keyboard shortcut (ctrl/cmd + g) to toggle glass quickly (only if enabled)
  if (CONFIG.glassShortcut) {
    window.addEventListener('keydown', (e) => {
      // ensure not typing in inputs (prevent accidental toggles)
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
        const current = root.getAttribute('data-theme') || 'light';
        const newTheme = current === 'glass' ? 'light' : 'glass';
        applyTheme(newTheme, true);
      }
    });
  }

  /* ---------- rest of your existing JS (nav, smooth scroll, reveal, etc.) ---------- */

  // nav / burger
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.getElementById('navLinks') || document.querySelector('.nav-links');
  const burgerMenu = document.getElementById('burgerMenu') || document.querySelector('.burger-menu');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const revealEls = $$('.reveal');
  const heroTypingEl = document.getElementById('hero-typing') || null;
  const contactForm = document.getElementById('contactForm') || document.querySelector('.contact-form');
  const formMessage = document.getElementById('form-message') || null;

  function toggleMenu() {
    if (!navLinks || !burgerMenu) return;
    navLinks.classList.toggle('nav-active');
    burgerMenu.classList.toggle('toggle');
    const expanded = navLinks.classList.contains('nav-active');
    burgerMenu.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    $$('.nav-links li').forEach((li,i) => {
      li.style.animation = navLinks.classList.contains('nav-active') ? `navLinkFade 0.5s ease forwards ${i/7 + 0.15}s` : '';
    });
  }
  if (burgerMenu) {
    burgerMenu.addEventListener('click', toggleMenu);
    burgerMenu.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
    });
  }
  if (navLinks) {
    navLinks.addEventListener('click', (e) => {
      if (e.target && e.target.tagName === 'A' && navLinks.classList.contains('nav-active')) {
        setTimeout(() => {
          navLinks.classList.remove('nav-active');
          if (burgerMenu) burgerMenu.classList.remove('toggle');
          if (burgerMenu) burgerMenu.setAttribute('aria-expanded', 'false');
          $$('.nav-links li').forEach(li => li.style.animation = '');
        }, 150);
      }
    });
  }

  // smooth scroll + active nav
  safe(() => {
    const headerHeight = mainNav ? mainNav.offsetHeight : 0;
    $$('a[href^="#"]').filter(a => a.getAttribute('href') !== '#').forEach(a => {
      a.addEventListener('click', (ev) => {
        const href = a.getAttribute('href'); if (!href) return;
        const targetId = href.slice(1); const target = document.getElementById(targetId);
        if (target) { ev.preventDefault(); const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8; window.scrollTo({ top, behavior: 'smooth' }); }
      });
    });

    const sections = $$('section[id]');
    if (sections.length && navLinks) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const id = entry.target.id;
          const link = navLinks.querySelector(`a[href="#${id}"]`);
          if (!link) return;
          if (entry.isIntersecting) {
            $$('.nav-links a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      }, { root: null, rootMargin: `-${(headerHeight+20)}px 0px -40% 0px`, threshold: 0.2});
      sections.forEach(s => io.observe(s));
    }
  });

  // back to top
  safe(() => {
    if (!backToTopBtn) return;
    const threshold = 300;
    const onScroll = () => {
      const show = window.pageYOffset > threshold;
      backToTopBtn.style.display = show ? 'block' : 'none';
      backToTopBtn.style.opacity = show ? '1' : '0';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    backToTopBtn.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  });

  // sticky nav shadow
  safe(() => { if (!mainNav) return; window.addEventListener('scroll', () => mainNav.classList.toggle('scrolled', window.pageYOffset > 50), { passive: true }); });

  // reveal on scroll
  safe(() => {
    if (!revealEls.length) return;
    const rv = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('active'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => rv.observe(el));
  });

  // typing effect (optional)
  safe(() => {
    if (!heroTypingEl) return;
    const original = heroTypingEl.textContent.trim();
    const lines = heroTypingEl.dataset.lines ? heroTypingEl.dataset.lines.split('|') : [original];
    let i=0,j=0,forward=true;
    function tick(){
      heroTypingEl.textContent = lines[i].slice(0,j);
      if (forward) { if (j++ === lines[i].length){ forward=false; setTimeout(tick,900); return; } } 
      else { if (j-- === 0){ forward=true; i=(i+1)%lines.length; setTimeout(tick,250); return; } }
      setTimeout(tick, forward ? 70 : 30);
    }
    tick();
  });

  // contact form
  safe(() => {
    if (!contactForm) return;
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('#name')?.value.trim() || '';
      const email = contactForm.querySelector('#email')?.value.trim() || '';
      const message = contactForm.querySelector('#message')?.value.trim() || '';
      if (!name || !email || !message) {
        if (formMessage) { formMessage.textContent = "Please fill out all fields."; formMessage.classList.add("error"); setTimeout(()=>{ formMessage.textContent=''; formMessage.classList.remove('error'); }, 3000); }
        else alert("Please fill out all fields.");
        return;
      }
      if (formMessage) { formMessage.textContent = "Thank you! Your message has been sent."; formMessage.classList.remove("error"); } else alert("Thank you! Your message has been sent.");
      contactForm.reset();
      setTimeout(()=>{ if (formMessage) formMessage.textContent=''; }, 4000);
    });
    contactForm.addEventListener('input', (e) => { if (e.target) e.target.style.borderColor = ''; });
  });

  // photo modal
  safe(()=> {
    const profile = document.querySelector('.profile-photo'); if (!profile) return;
    const modal = document.createElement('div'); modal.className = 'photo-modal'; modal.style.display='none';
    const img = document.createElement('img'); img.src = profile.currentSrc || profile.src; img.alt = profile.alt || document.title || 'Profile';
    modal.appendChild(img); document.body.appendChild(modal);
    profile.style.cursor='zoom-in';
    profile.addEventListener('click', ()=>{ modal.style.display='flex'; document.body.style.overflow='hidden'; });
    modal.addEventListener('click', (evt)=>{ if (evt.target === modal){ modal.style.display='none'; document.body.style.overflow=''; }});
    document.addEventListener('keydown', (evt)=>{ if (evt.key==='Escape' && modal.style.display==='flex'){ modal.style.display='none'; document.body.style.overflow=''; }});
  });

  // scroll progress bar
  safe(()=> {
    let prog = document.getElementById('scrollProgress'); if (!prog){ prog = document.createElement('div'); prog.id='scrollProgress'; document.body.appendChild(prog); }
    const update = ()=>{ const docH = document.documentElement.scrollHeight - window.innerHeight; const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0; prog.style.width = Math.min(100, Math.max(0, pct)).toFixed(2) + '%'; };
    window.addEventListener('scroll', update, { passive:true }); update();
  });

  // lazy load images
  safe(()=> {
    const lazyImgs = $$('img[data-src]'); if (!lazyImgs.length) return;
    const li = new IntersectionObserver((entries, obs) => { entries.forEach(entry => { if (entry.isIntersecting){ const img = entry.target; if (img.dataset.src) img.src = img.dataset.src; if (img.dataset.srcset) img.srcset = img.dataset.srcset; img.removeAttribute('data-src'); obs.unobserve(img); } }); }, { rootMargin:'200px 0px', threshold:0.01 });
    lazyImgs.forEach(img => li.observe(img));
  });

  // copy-to-clipboard
  safe(()=> {
    const copyBtns = $$('.copy-btn'); if (!copyBtns.length || !navigator.clipboard) return;
    copyBtns.forEach(btn => { btn.addEventListener('click', async ()=>{ const value = btn.dataset.copy || btn.getAttribute('data-copy'); if (!value) return; try { await navigator.clipboard.writeText(value); const t = document.createElement('div'); t.className = 'copy-toast'; t.textContent = 'Copied to clipboard'; document.body.appendChild(t); setTimeout(()=>t.style.opacity='0',1500); setTimeout(()=>t.remove(),2000); } catch(e){ console.warn('copy failed',e); } }); });
  });

  // testimonials carousel (if present)
  safe(()=> {
    const carousel = document.querySelector('.testimonials'); if (!carousel) return;
    const slides = Array.from(carousel.querySelectorAll('.testimonial')); if (!slides.length) return;
    let idx=0, timer=null;
    const show = n => slides.forEach((s,i)=> s.style.display = (i===n ? 'block' : 'none'));
    const next = ()=> show((idx+1)%slides.length);
    const prev = ()=> show((idx-1+slides.length)%slides.length);
    const ctrls = document.createElement('div'); ctrls.className='test-ctrls'; ctrls.innerHTML = `<button class="prev" aria-label="Previous testimonial">‹</button><button class="next" aria-label="Next testimonial">›</button>`;
    carousel.appendChild(ctrls);
    ctrls.querySelector('.next').addEventListener('click', ()=>{ resetTimer(); next(); });
    ctrls.querySelector('.prev').addEventListener('click', ()=>{ resetTimer(); prev(); });
    show(0);
    const startTimer = ()=> { timer = setInterval(()=>{ idx = (idx+1)%slides.length; show(idx); }, 4500); };
    const resetTimer = ()=>{ clearInterval(timer); startTimer(); };
    carousel.addEventListener('mouseenter', ()=> clearInterval(timer));
    carousel.addEventListener('mouseleave', ()=> startTimer());
    startTimer();
    carousel.tabIndex = 0;
    carousel.addEventListener('keydown', (e)=> { if (e.key==='ArrowLeft') prev(); if (e.key==='ArrowRight') next(); });
  });

}); // DOMContentLoaded
