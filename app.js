/**
 * AZ STUDIO — Interactive layer
 * Made by maher-aladdin.me
 *
 *  1. Header, mobile menu & scroll-spy
 *  2. Hero viewfinder timecode
 *  3. Reveal-on-scroll, counters, clients marquee
 *  4. Scroll-driven skills + center video (with "continue / keep scrolling" choice)
 *  5. Projects & services rendering
 *  6. Deep-linked viewer dialog  (?project=slug  /  ?service=slug)
 *  7. Bot-protected Web3Forms contact form (AJAX, no mail client)
 */
(function () {
  'use strict';

  const DATA = window.AZ_DATA || { PROJECTS: [], SERVICES: [] };
  const THUMBS = window.AZ_THUMBS || {};
  const HAS_THUMB = window.AZ_HAS_THUMB || new Set();
  const WA_NUMBER = '201014673393';
  const BASE_TITLE = document.title;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const isArabic = (s) => /[\u0600-\u06FF]/.test(s || '');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

  /* ------------------------------------------------------------------ *
   * 0. Hero entrance animation scene
   * ------------------------------------------------------------------ */
  (function initHeroAnimation() {
    const heroTitle = $('#heroTitle');
    const heroSection = $('.hero');
    if (!heroTitle || !heroSection) return;

    // Skip if user prefers reduced motion, or arrived via deep link / already scrolled
    const params = new URLSearchParams(window.location.search);
    if (
      reducedMotion ||
      window.scrollY > 80 ||
      window.location.hash ||
      params.has('project') ||
      params.has('service')
    ) {
      return;
    }

    // 1. Measure natural coordinates before applying any intro classes
    const rect = heroTitle.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    // 2. Set intro state: hides surrounding elements cleanly
    document.body.classList.add('hero-intro');

    const naturalCenterX = rect.left + rect.width / 2;
    const naturalCenterY = rect.top + rect.height / 2;
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;

    const deltaX = Math.round(screenCenterX - naturalCenterX);
    const deltaY = Math.round(screenCenterY - naturalCenterY);

    // Calculate scale: bigger font in the middle, strictly constrained on mobile to prevent overflow
    const isMobile = window.innerWidth <= 900;
    const maxSafeWidth = window.innerWidth - (isMobile ? 32 : 80);
    let targetScale = Math.min(1.36, maxSafeWidth / rect.width);
    if (isMobile) {
      targetScale = Math.min(Math.max(1.02, targetScale), 1.08);
    } else {
      targetScale = Math.min(Math.max(1.15, targetScale), 1.36);
    }

    // Place title at the center in its larger state
    heroTitle.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${targetScale * 0.94})`;
    heroTitle.style.opacity = '0';
    heroTitle.style.filter = 'blur(10px)';
    heroTitle.style.transition = 'none';

    // Force layout reflow
    void heroTitle.offsetWidth;

    // Phase 1: Fade & zoom in at the center
    heroTitle.style.transition = 'opacity 0.45s ease-out, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s ease-out';
    heroTitle.style.opacity = '1';
    heroTitle.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${targetScale})`;
    heroTitle.style.filter = 'blur(0)';

    let completed = false;

    function finish() {
      if (completed) return;
      completed = true;
      clearTimeout(tMove);
      clearTimeout(tReveal);
      clearTimeout(tDone);
      document.body.classList.remove('hero-intro');
      document.body.classList.add('hero-ready');
      heroTitle.style.transition = 'transform 0.4s var(--ease), opacity 0.3s';
      heroTitle.style.transform = 'translate(0, 0) scale(1)';
      heroTitle.style.opacity = '1';
      heroTitle.style.filter = 'none';

      setTimeout(() => {
        document.body.classList.remove('hero-ready');
        heroTitle.style.transform = '';
        heroTitle.style.transition = '';
        heroTitle.style.opacity = '';
        heroTitle.style.filter = '';
      }, 700);

      window.removeEventListener('scroll', onEarlyInteract);
      window.removeEventListener('pointerdown', onEarlyInteract);
      window.removeEventListener('keydown', onEarlyInteract);
    }

    function onEarlyInteract() {
      finish();
    }

    // Allow user to skip immediately with scroll, tap, or key press
    window.addEventListener('scroll', onEarlyInteract, { passive: true, once: true });
    window.addEventListener('pointerdown', onEarlyInteract, { passive: true, once: true });
    window.addEventListener('keydown', onEarlyInteract, { passive: true, once: true });

    // Phase 2: Hold for ~0.85s, then glide title to its natural place
    const tMove = setTimeout(() => {
      if (completed) return;
      heroTitle.style.transition = 'transform 0.95s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease';
      heroTitle.style.transform = 'translate(0, 0) scale(1)';
    }, 1100);

    // Phase 3: Cascade all other components into view
    const tReveal = setTimeout(() => {
      if (completed) return;
      document.body.classList.remove('hero-intro');
      document.body.classList.add('hero-ready');
    }, 1500);

    // Phase 4: Clean up classes and inline styles
    const tDone = setTimeout(() => {
      if (completed) return;
      completed = true;
      document.body.classList.remove('hero-ready');
      heroTitle.style.transform = '';
      heroTitle.style.transition = '';
      heroTitle.style.opacity = '';
      heroTitle.style.filter = '';
      window.removeEventListener('scroll', onEarlyInteract);
      window.removeEventListener('pointerdown', onEarlyInteract);
      window.removeEventListener('keydown', onEarlyInteract);
    }, 2500);
  })();

  /* ------------------------------------------------------------------ *
   * 1. Header, mobile menu & scroll-spy
   * ------------------------------------------------------------------ */
  const header = $('#siteHeader');
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');
  const fab = $('.fab-wa');

  function onScrollChrome() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    fab.classList.toggle('is-visible', y > window.innerHeight * 0.85);
  }
  window.addEventListener('scroll', onScrollChrome, { passive: true });
  onScrollChrome();

  function setMenu(open) {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('is-open', open);
  }
  navToggle.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
  navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  const spyLinks = new Map($$('.nav-links a').map((a) => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      spyLinks.forEach((a) => a.classList.remove('is-active'));
      const link = spyLinks.get(entry.target.id);
      if (link) link.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => spy.observe(s));

  $('#year').textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ *
   * 2. Hero viewfinder timecode (25 fps)
   * ------------------------------------------------------------------ */
  const tcList = $$('.vf-tc');
  if (tcList.length && !reducedMotion) {
    const start = performance.now();
    const pad = (n) => String(n).padStart(2, '0');
    let last = -1;
    const tick = (now) => {
      const frames = Math.floor(((now - start) / 1000) * 25);
      if (frames !== last) {
        last = frames;
        const f = frames % 25, s = Math.floor(frames / 25);
        const str = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
        tcList.forEach((el) => { el.textContent = str; });
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------ *
   * 3. Reveal, counters, marquee
   * ------------------------------------------------------------------ */
  const revealer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.15 });
  const observeReveals = (root = document) => $$('.reveal:not(.is-in)', root).forEach((el) => revealer.observe(el));
  observeReveals();

  const counterObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      $$('[data-count]', entry.target).forEach((el) => {
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        if (reducedMotion) return;
        const t0 = performance.now();
        const dur = 1400;
        const step = (now) => {
          const k = clamp((now - t0) / dur, 0, 1);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    });
  }, { threshold: 0.4 });
  const stats = $('.stats');
  if (stats) counterObs.observe(stats);

  const track = $('.marquee-track');
  if (track) {
    $$('li', track).forEach((li) => {
      const clone = li.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }

  /* ------------------------------------------------------------------ *
   * 4. Scroll-driven skills + center video (Downloaded MP4s per craft)
   * ------------------------------------------------------------------ */
  const skillsSection = $('#skills');
  const skills = $$('.skill').sort((a, b) => a.dataset.i - b.dataset.i);
  const steps = $$('.skills-steps i');
  const videoFrame = $('#skillsVideoFrame');
  const skillsVideo = $('#skillsVideo');
  const badge = $('#videoBadge');
  const caption = $('#skillCaption');
  const progressBar = $('#skillsProgress');
  const soundBtn = $('#videoSoundBtn');

  /*
   * ─── CRAFT VIDEOS (downloaded local MP4s with tailored aspect ratios) ─
   *   0  Editing & Pacing      → 16:9 widescreen (STENG Fashion)
   *   1  Colour Grading        → 9:16 vertical reel (ALEX Before/After)
   *   2  Motion & 3D           → 16:9 widescreen (3D Earth Orbit)
   *   3  Sound Design          → 16:9 widescreen (Tamer Hosny Concert)
   *   4  Generative AI         → 4:5 portrait (AI Cinema Showcase)
   *   5  Cinematography        → 16:9 widescreen (Formula 1 Highlight)
   * ───────────────────────────────────────────────────────────────────────
   */
  const SKILL_VIDEOS = [
    {
      src: 'assets/videos/skills/craft_0_editing.mp4',
      poster: 'assets/videos/skills/craft_0_editing.jpg',
      label: 'Editing & Pacing',
      caption: 'STENG Fashion — Store Launch',
      ar: '16/9'
    },
    {
      src: 'assets/videos/skills/craft_1_color.mp4',
      poster: 'assets/videos/skills/craft_1_color.jpg',
      label: 'Colour Grading',
      caption: 'ALEX — Colour Grade Pass',
      ar: '9/16'
    },
    {
      src: 'assets/videos/skills/craft_2_motion.mp4',
      poster: 'assets/videos/skills/craft_2_motion.jpg',
      label: 'Motion & 3D',
      caption: '3D Earth Orbit — Blender VFX',
      ar: '16/9'
    },
    {
      src: 'assets/videos/skills/craft_3_sound.mp4',
      poster: 'assets/videos/skills/craft_3_sound.jpg',
      label: 'Sound Design',
      caption: 'Tamer Hosny — Live Concert Package',
      ar: '16/9'
    },
    {
      src: 'assets/videos/skills/craft_4_ai.mp4',
      poster: 'assets/videos/skills/craft_4_ai.jpg',
      label: 'Generative AI',
      caption: 'AI Cinema Showcase — Veo 3 · Google Flow · Higgsfield',
      ar: '4/5'
    },
    {
      src: 'assets/videos/skills/craft_5_cinematography.mp4',
      poster: 'assets/videos/skills/craft_5_cinematography.jpg',
      label: 'Cinematography',
      caption: 'Formula 1 — Motorsport Highlight',
      ar: '16/9'
    }
  ];

  let lastActive = -2;
  let skillsTicking = false;
  let currentSrc = '';

  function setSkillVideo(index) {
    if (!skillsVideo) return;
    const info = SKILL_VIDEOS[clamp(index, 0, SKILL_VIDEOS.length - 1)];
    if (info.src === currentSrc) return;
    currentSrc = info.src;

    // Dynamically adjust container aspect ratio per program
    if (videoFrame) {
      videoFrame.dataset.ar = info.ar;
    }

    skillsVideo.poster = info.poster;
    skillsVideo.src = info.src;
    skillsVideo.setAttribute('aria-label', `${info.label} showcase by Abdelrazek Mahmoud`);
    skillsVideo.currentTime = 0;
    skillsVideo.play().catch(() => {});

    if (badge) badge.innerHTML = `<i></i> Now playing · ${esc(info.label)}`;
  }

  // Sound toggle button (Mute / Unmute)
  if (soundBtn && skillsVideo) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      skillsVideo.muted = !skillsVideo.muted;
      soundBtn.classList.toggle('is-unmuted', !skillsVideo.muted);
      soundBtn.setAttribute('aria-label', skillsVideo.muted ? 'Unmute video' : 'Mute video');
      const text = soundBtn.querySelector('span');
      if (text) text.textContent = skillsVideo.muted ? 'Sound off' : 'Sound on';
    });
  }

  // Click on video frame toggles play/pause
  if (videoFrame && skillsVideo) {
    videoFrame.addEventListener('click', (e) => {
      if (e.target.closest('#videoSoundBtn')) return;
      if (skillsVideo.paused) skillsVideo.play().catch(() => {});
      else skillsVideo.pause();
    });
  }

  // Progress bar update
  if (progressBar && skillsVideo) {
    skillsVideo.addEventListener('timeupdate', () => {
      if (skillsVideo.duration) {
        progressBar.style.transform = `scaleX(${skillsVideo.currentTime / skillsVideo.duration})`;
      }
    });
  }

  // Allow clicking on any skill to activate immediately and scroll to it
  skills.forEach((el, i) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      if (!skillsSection) return;
      lastActive = i;
      skills.forEach((s, idx) => {
        s.classList.toggle('is-active', idx === i);
        s.classList.toggle('is-done', idx < i);
      });
      steps.forEach((s, idx) => {
        s.classList.toggle('is-on', idx <= i);
        s.classList.toggle('is-current', idx === i);
      });
      if (caption) {
        const cur = skills[i];
        const title = $('h3', cur).textContent;
        const text = $('p', cur).textContent;
        caption.innerHTML = `<b>${esc(title)}</b>${esc(text)}`;
      }
      setSkillVideo(i);

      const total = skillsSection.offsetHeight - window.innerHeight;
      const targetP = 0.03 + ((i + 0.5) / skills.length) * 0.78;
      const targetY = window.scrollY + skillsSection.getBoundingClientRect().top + targetP * total;
      window.scrollTo({ top: targetY, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });

  function updateSkills() {
    skillsTicking = false;
    if (!skillsSection) return;
    const rect = skillsSection.getBoundingClientRect();
    const total = skillsSection.offsetHeight - window.innerHeight;
    const p = clamp(-rect.top / Math.max(total, 1), 0, 1);
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    // Which skill is "on"
    const n = skills.length;
    let active = -1;
    if (p > 0.02) active = clamp(Math.floor(((p - 0.02) / 0.80) * n), 0, n - 1);
    if (active === -1 && inView) active = 0;

    if (active !== -1 && active !== lastActive) {
      lastActive = active;
      skills.forEach((el, i) => {
        el.classList.toggle('is-active', i === active);
        el.classList.toggle('is-done', i < active);
      });
      steps.forEach((el, i) => {
        el.classList.toggle('is-on', i <= active);
        el.classList.toggle('is-current', i === active);
      });
      if (caption) {
        const cur = skills[active];
        const title = $('h3', cur).textContent;
        const text = $('p', cur).textContent;
        caption.innerHTML = `<b>${esc(title)}</b>${esc(text)}`;
      }
      setSkillVideo(active);
    }

    if (skillsVideo) {
      if (!inView || (viewer && viewer.open) || reducedMotion) {
        if (!skillsVideo.paused) skillsVideo.pause();
      } else if (skillsVideo.paused) {
        skillsVideo.play().catch(() => {});
      }
    }
  }
  const requestSkills = () => {
    if (!skillsTicking) { skillsTicking = true; requestAnimationFrame(updateSkills); }
  };
  window.addEventListener('scroll', requestSkills, { passive: true });
  window.addEventListener('resize', requestSkills);
  // Set first video on load
  setSkillVideo(0);
  updateSkills();

  /* ------------------------------------------------------------------ *
   * 5. Projects & services rendering
   * ------------------------------------------------------------------ */
  const projectBySlug = new Map(DATA.PROJECTS.map((p) => [p.slug, p]));
  const serviceBySlug = new Map(DATA.SERVICES.map((s) => [s.slug, s]));

  function normalize(item) {
    if (Array.isArray(item)) return { type: 'drive', id: item[0], title: item[1], sub: item[2] || '' };
    return { sub: '', ...item };
  }
  function mediaInfo(v) {
    const o = (THUMBS && THUMBS[v.id]) || (v.type === 'image' ? 'h' : 'v');
    const hasThumb = HAS_THUMB instanceof Set ? HAS_THUMB.has(v.id) : Boolean(HAS_THUMB && HAS_THUMB[v.id]);
    switch (v.type) {
      case 'drive':
      case 'image':
        return {
          thumb: hasThumb ? `assets/thumbs/drive/${v.id}.jpg` : null,
          o,
          ext: `https://drive.google.com/file/d/${v.id}/view`
        };
      case 'instagram':
        return { thumb: null, o: 'v', ext: `https://www.instagram.com/reel/${v.id}/` };
      case 'local':
        return { thumb: v.poster || null, o, ext: v.src };
      default:
        return { thumb: null, o: 'v', ext: '#' };
    }
  }

  const fallbackPoster = (v, m) => {
    const tagLabel = m.o === 'h' ? '16:9 Cinema' : (m.o === 's' ? '1:1 Square' : '9:16 Reel');
    return `
      <span class="poster-fallback" aria-hidden="true">
        <span class="pf-brand">${icon('stage')} AZ STUDIO</span>
        <span class="pf-foot">
          <strong class="pf-title"${isArabic(v.title) ? ' dir="rtl" lang="ar"' : ''}>${esc(v.title)}</strong>
          <span class="pf-tag">${esc(tagLabel)}</span>
        </span>
      </span>`;
  };

  function videoCard(raw, key) {
    const v = normalize(raw);
    const m = mediaInfo(v);
    const typeIcon = v.type === 'instagram' ? 'instagram' : v.type === 'image' ? 'image' : null;
    const poster = fallbackPoster(v, m);
    const media = m.thumb
      ? `${poster}<img src="${esc(m.thumb)}" alt="" loading="lazy" decoding="async" onerror="this.remove()">`
      : poster;
    return `
      <article class="vcard" data-key="${esc(key)}" data-type="${v.type}" data-o="${m.o}">
        <button type="button" class="vcard-media" aria-label="${v.type === 'image' ? 'View' : 'Play'}: ${esc(v.title)}">
          ${media}
          <span class="vcard-play">${icon(v.type === 'image' ? 'image' : 'play')}</span>
          ${v.badge ? `<span class="vcard-badge">${esc(v.badge)}</span>` : ''}
          ${typeIcon ? `<span class="vcard-type">${icon(typeIcon)}</span>` : ''}
        </button>
        <div class="vcard-info">
          <div>
            <h4>${esc(v.title)}</h4>
            ${v.sub ? `<p${isArabic(v.sub) ? ' dir="rtl" lang="ar"' : ''}>${esc(v.sub)}</p>` : ''}
          </div>
          <a class="vcard-ext" href="${esc(m.ext)}" target="_blank" rel="noopener" aria-label="Open ${esc(v.title)} in a new tab">${icon('external')}</a>
        </div>
      </article>`;
  }

  function renderProjects() {
    const grid = $('#projectGrid');
    grid.innerHTML = DATA.PROJECTS.map((p, i) => `
      <a class="project-card reveal" href="?project=${encodeURIComponent(p.slug)}" data-open-project="${esc(p.slug)}" aria-label="Open project: ${esc(p.title)}">
        <div class="project-cover">
          <span class="poster-fallback" aria-hidden="true">${icon('stage')}<strong>${esc(p.client.split('·')[0].trim())}</strong><span>${esc(p.tag)}</span></span>
          ${p.cover ? `<img src="${esc(p.cover)}" alt="" loading="${i < 3 ? 'eager' : 'lazy'}" decoding="async" onerror="this.remove()">` : ''}
          <span class="project-tag">${esc(p.tag)}</span>
          <span class="project-count">${icon('play')} ${p.videos.length} ${p.videos.length === 1 ? 'film' : 'videos'}</span>
          <span class="project-play">${icon('play')}</span>
        </div>
        <div class="project-body">
          <p class="project-client">${esc(p.client)}</p>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.description)}</p>
          <div class="project-foot">
            <span class="project-metric">${esc(p.metric)}</span>
            <span class="project-open">Open project ${icon('arrow-right')}</span>
          </div>
        </div>
      </a>`).join('');
  }

  function renderServices() {
    const grid = $('#serviceGrid');
    grid.innerHTML = DATA.SERVICES.map((s) => `
      <article class="service-card reveal">
        <span class="service-ico">${icon(s.icon)}</span>
        <h3>${esc(s.title)}</h3>
        <p class="service-outcome">${esc(s.outcome)}</p>
        <p>${esc(s.description)}</p>
        <ul class="service-list">${s.deliverables.map((d) => `<li>${icon('check')}${esc(d)}</li>`).join('')}</ul>
        <div class="service-actions">
          <a class="btn btn-accent" href="?service=${encodeURIComponent(s.slug)}" data-open-service="${esc(s.slug)}">${icon('play')} See related videos &amp; Q&amp;A</a>
        </div>
      </article>`).join('');
  }

  renderProjects();
  renderServices();
  observeReveals();

  /* ------------------------------------------------------------------ *
   * 6. Deep-linked viewer dialog
   * ------------------------------------------------------------------ */
  const viewer = $('#viewer');
  const viewerBody = $('#viewerBody');
  const shareTip = $('#shareTip');
  let openedByPush = false;
  let ignoreNextPop = false;
  let closingFromPop = false;
  let afterClose = null;

  function projectView(p) {
    const related = DATA.SERVICES.filter((s) => s.projects.includes(p.slug));
    return `
      <header class="viewer-head">
        <p class="kicker">${esc(p.client)}</p>
        <h2 id="viewerTitle">${esc(p.title)}</h2>
        <p>${esc(p.description)}</p>
        <div class="viewer-meta">
          <span class="chip accent">${esc(p.tag)}</span>
          <span class="chip">${esc(p.metric)}</span>
          <span class="chip">${p.videos.length} ${p.videos.length === 1 ? 'film' : 'videos'}</span>
        </div>
        <div class="viewer-ctas">
          <a class="btn btn-wa" href="${waLink(`Hi Abdelrazek, I watched your "${p.title}" project and I'd like something similar.`)}" target="_blank" rel="noopener">${icon('whatsapp')} I want something like this</a>
        </div>
      </header>
      <div class="video-grid">${p.videos.map((v, i) => videoCard(v, `${p.slug}:${i}`)).join('')}</div>
      ${related.length ? `
        <div class="viewer-foot">
          <p>Services behind this project</p>
          <div class="viewer-ctas">${related.map((s) => `<a class="btn btn-ghost btn-sm" href="?service=${encodeURIComponent(s.slug)}" data-open-service="${esc(s.slug)}">${esc(s.title)}</a>`).join('')}</div>
        </div>` : ''}`;
  }

  function serviceView(s) {
    const groups = s.projects.map((slug) => projectBySlug.get(slug)).filter(Boolean);
    return `
      <header class="viewer-head">
        <p class="kicker">Service</p>
        <h2 id="viewerTitle">${esc(s.title)}</h2>
        <p>${esc(s.description)}</p>
        <div class="viewer-meta">
          <span class="chip accent">${esc(s.outcome)}</span>
          ${s.deliverables.map((d) => `<span class="chip">${esc(d)}</span>`).join('')}
        </div>
        <div class="viewer-ctas">
          <a class="btn btn-wa" href="${waLink(`Hi Abdelrazek, I'm interested in your "${s.title}" service.`)}" target="_blank" rel="noopener">${icon('whatsapp')} Book this service</a>
          <button type="button" class="btn btn-ghost" data-goto-contact>${icon('mail')} Send a brief</button>
        </div>
      </header>

      <section class="viewer-qa" aria-label="Questions about this service">
        <h3>Quick answers</h3>
        <div class="qa-list">
          ${s.qa.map(([q, a], i) => `
            <details class="qa" name="svc-qa"${i === 0 ? ' open' : ''}>
              <summary>${esc(q)}</summary>
              <div class="qa-body"><p>${esc(a)}</p></div>
            </details>`).join('')}
        </div>
      </section>

      ${groups.map((p) => `
        <section class="video-group">
          <div class="group-head">
            <h3>${esc(p.title)} <small>${esc(p.client)}</small></h3>
            <a class="link-arrow" href="?project=${encodeURIComponent(p.slug)}" data-open-project="${esc(p.slug)}">Open full project ${icon('arrow-right')}</a>
          </div>
          <div class="video-grid">${p.videos.slice(0, 6).map((v, i) => videoCard(v, `${p.slug}:${i}`)).join('')}</div>
        </section>`).join('')}

      <div class="viewer-foot">
        <p>Want results like these?</p>
        <div class="viewer-ctas">
          <a class="btn btn-wa" href="${waLink(`Hi Abdelrazek, I'd like a quote for "${s.title}".`)}" target="_blank" rel="noopener">${icon('whatsapp')} Get a quote</a>
          <button type="button" class="btn btn-light" data-goto-contact>Use the contact form</button>
        </div>
      </div>`;
  }

  function cleanUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete('project');
    url.searchParams.delete('service');
    return url;
  }

  /**
   * @param {'project'|'service'} type
   * @param {string} slug
   * @param {'push'|'replace'|'none'} mode  how to update the address bar
   */
  function openView(type, slug, mode = 'push') {
    const item = type === 'project' ? projectBySlug.get(slug) : serviceBySlug.get(slug);
    if (!item) return false;

    viewerBody.innerHTML = type === 'project' ? projectView(item) : serviceView(item);
    viewerBody.scrollTop = 0;
    document.title = `${item.title} — AZ Studio`;

    if (mode !== 'none') {
      const url = cleanUrl();
      url.searchParams.set(type, slug);
      url.hash = '';
      if (mode === 'push' && !viewer.open) {
        history.pushState({ az: true }, '', url);
        openedByPush = true;
      } else {
        history.replaceState(history.state, '', url);
      }
    }
    if (!viewer.open) {
      if (skillsVideo && !skillsVideo.paused) skillsVideo.pause();
      viewer.showModal();
    }
    return true;
  }

  function closeView(then) {
    afterClose = then || null;
    if (viewer.open) viewer.close();
  }

  viewer.addEventListener('close', () => {
    viewerBody.innerHTML = ''; // stops any playing iframe / video
    document.title = BASE_TITLE;
    if (closingFromPop) {
      closingFromPop = false;
    } else if (openedByPush) {
      ignoreNextPop = true;
      history.back();
    } else {
      history.replaceState(history.state, '', cleanUrl());
    }
    openedByPush = false;
    if (afterClose) { const fn = afterClose; afterClose = null; setTimeout(fn, 60); }
    requestSkills();
  });

  window.addEventListener('popstate', () => {
    if (ignoreNextPop) { ignoreNextPop = false; return; }
    const params = new URLSearchParams(window.location.search);
    const project = params.get('project');
    const service = params.get('service');
    if (project && openView('project', project, 'none')) return;
    if (service && openView('service', service, 'none')) return;
    if (viewer.open) { closingFromPop = true; openedByPush = false; viewer.close(); }
  });

  $('#viewerClose').addEventListener('click', () => closeView());

  // Light-dismiss fallback for browsers without <dialog closedby>
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const outside = (e, d) => {
      const r = d.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    $$('dialog[closedby="any"]').forEach((d) => {
      let pressedOutside = false;
      d.addEventListener('pointerdown', (e) => { pressedOutside = outside(e, d); });
      d.addEventListener('pointerup', (e) => { if (pressedOutside && outside(e, d)) d.close(); });
    });
  }

  $('#viewerShare').addEventListener('click', async () => {
    const url = window.location.href;
    if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
      try { await navigator.share({ title: document.title, url }); return; } catch (_) { /* cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      shareTip.textContent = 'Link copied';
    } catch (_) {
      shareTip.textContent = 'Copy the address bar link';
    }
    shareTip.classList.add('is-on');
    setTimeout(() => shareTip.classList.remove('is-on'), 1800);
  });

  // Open from page (project cards / service buttons)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-open-project], [data-open-service]');
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    const inViewer = viewer.contains(link);
    const mode = inViewer ? 'replace' : 'push';
    if (link.dataset.openProject) openView('project', link.dataset.openProject, mode);
    else openView('service', link.dataset.openService, mode);
  });

  // Inside the viewer: play cards, contact shortcuts
  const cardTemplates = new Map();
  function stopPlaying(except) {
    $$('.vcard.is-playing', viewerBody).forEach((card) => {
      if (card === except) return;
      const html = cardTemplates.get(card.dataset.key);
      if (html) card.outerHTML = html;
    });
  }
  function findItem(key) {
    const [slug, idx] = key.split(':');
    const p = projectBySlug.get(slug);
    return p ? normalize(p.videos[Number(idx)]) : null;
  }
  const theater = $('#theaterDialog');
  const theaterHolder = $('#theaterMediaHolder');
  const theaterFrame = $('#theaterMediaFrame');
  const theaterTitle = $('#theaterTitle');
  const theaterSub = $('#theaterSub');
  const theaterExt = $('#theaterExt');
  const theaterClose = $('#theaterClose');
  const theaterDirectLink = $('#theaterDirectLink');

  function openTheater(card) {
    if (!theater || !card) return;
    const v = findItem(card.dataset.key);
    if (!v) return;
    const m = mediaInfo(v);

    theaterTitle.textContent = v.title;
    theaterSub.textContent = v.sub || '';
    if (v.sub && isArabic(v.sub)) {
      theaterSub.setAttribute('dir', 'rtl');
      theaterSub.setAttribute('lang', 'ar');
    } else {
      theaterSub.removeAttribute('dir');
      theaterSub.removeAttribute('lang');
    }

    if (theaterExt) theaterExt.href = m.ext;
    if (theaterFrame) theaterFrame.dataset.o = m.o;

    if (theaterDirectLink) {
      if (v.type === 'drive') {
        theaterDirectLink.href = `https://drive.google.com/file/d/${encodeURIComponent(v.id)}/view`;
        theaterDirectLink.style.display = 'inline-flex';
        const span = theaterDirectLink.querySelector('span');
        if (span) span.textContent = 'Open directly in Google Drive';
      } else if (v.type === 'instagram') {
        theaterDirectLink.href = `https://www.instagram.com/reel/${encodeURIComponent(v.id)}/`;
        theaterDirectLink.style.display = 'inline-flex';
        const span = theaterDirectLink.querySelector('span');
        if (span) span.textContent = 'Open on Instagram';
      } else {
        theaterDirectLink.style.display = 'none';
      }
    }

    let inner = '';
    if (v.type === 'drive') {
      inner = `<iframe class="drive-frame" src="https://drive.google.com/file/d/${encodeURIComponent(v.id)}/preview" title="${esc(v.title)}" allow="autoplay; fullscreen; encrypted-media" allowfullscreen loading="eager"></iframe>`;
    } else if (v.type === 'instagram') {
      inner = `<iframe class="insta-frame" src="https://www.instagram.com/reel/${encodeURIComponent(v.id)}/embed/" title="${esc(v.title)}" allow="autoplay; fullscreen; encrypted-media" allowfullscreen loading="eager" scrolling="no"></iframe>`;
    } else if (v.type === 'image') {
      inner = `<img src="https://drive.google.com/thumbnail?id=${encodeURIComponent(v.id)}&sz=w1600" alt="${esc(v.title)}">`;
    } else if (v.type === 'local') {
      inner = `<video src="${esc(v.src)}" poster="${esc(v.poster || '')}" controls autoplay playsinline></video>`;
    }

    theaterHolder.innerHTML = inner;
    theater.showModal();
  }

  function closeTheater() {
    if (theater && theater.open) theater.close();
  }

  if (theater) {
    theater.addEventListener('close', () => {
      if (theaterHolder) theaterHolder.innerHTML = ''; // stops playing iframe / video
    });
    // Backdrop click dismisses modal
    theater.addEventListener('click', (e) => {
      if (e.target === theater || e.target.classList.contains('theater-shell')) closeTheater();
    });
  }
  if (theaterClose) {
    theaterClose.addEventListener('click', closeTheater);
  }

  viewerBody.addEventListener('click', (e) => {
    // If clicking external link in card info, let standard link behavior proceed
    if (e.target.closest('.vcard-ext')) return;

    // Tapping anywhere on the video card opens theater
    const card = e.target.closest('.vcard');
    if (card) {
      openTheater(card);
      return;
    }

    if (e.target.closest('[data-goto-contact]')) {
      closeView(() => {
        $('#contact').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
        setTimeout(() => $('#cfName').focus({ preventScroll: true }), 700);
      });
    }
  });

  // Initial deep link
  (function initFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('project')) openView('project', params.get('project'), 'none') || history.replaceState(null, '', cleanUrl());
    else if (params.get('service')) openView('service', params.get('service'), 'none') || history.replaceState(null, '', cleanUrl());
  })();

  /* ------------------------------------------------------------------ *
   * Email obfuscation (address is assembled only on click)
   * ------------------------------------------------------------------ */
  $$('.js-mail').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const addr = `${el.dataset.u}@${el.dataset.d}`;
      $$('.js-mail-text').forEach((t) => { t.textContent = addr; });
      window.location.href = `mailto:${addr}`;
    });
  });

  /* ------------------------------------------------------------------ *
   * 7. Bot-protected Web3Forms contact form
   * ------------------------------------------------------------------ */
  const form = $('#emailForm');
  const submitBtn = $('#submitBtn');
  const statusEl = $('#formStatus');
  const msgEl = $('#cfMessage');
  const countEl = $('#cfCount');
  const RATE_KEY = 'az_contact_sent';
  const MIN_FILL_MS = 3500;
  const submitLabel = submitBtn.innerHTML;

  let formStartedAt = 0;
  let humanSignals = 0;
  ['pointerdown', 'keydown', 'touchstart', 'focusin'].forEach((evt) =>
    form.addEventListener(evt, () => {
      if (!formStartedAt) formStartedAt = Date.now();
      humanSignals += 1;
    }, { passive: true })
  );

  msgEl.addEventListener('input', () => { countEl.textContent = msgEl.value.length; });

  const fields = {
    name: { el: $('#cfName'), err: $('#cfNameErr') },
    email: { el: $('#cfEmail'), err: $('#cfEmailErr') },
    message: { el: msgEl, err: $('#cfMessageErr') }
  };
  Object.values(fields).forEach(({ el, err }) => {
    el.setAttribute('aria-describedby', err.id);
    el.addEventListener('input', () => setFieldError(el, err, ''));
    el.addEventListener('blur', () => { if (el.value) validateField(el); });
  });

  function setFieldError(el, err, msg) {
    err.textContent = msg;
    el.toggleAttribute('aria-invalid', Boolean(msg));
    el.classList.toggle('is-invalid', Boolean(msg));
  }

  const URL_RE = /(https?:\/\/|www\.)/gi;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateField(el) {
    const v = el.value.trim();
    const f = Object.values(fields).find((x) => x.el === el);
    let msg = '';
    if (el === fields.name.el) {
      if (v.length < 2) msg = 'Please enter your name.';
      else if (v.length > 80) msg = 'Name is too long.';
      else if (URL_RE.test(v) || /[<>]/.test(v)) msg = 'Please enter a real name.';
    } else if (el === fields.email.el) {
      if (!EMAIL_RE.test(v)) msg = 'Please enter a valid email address.';
    } else if (el === fields.message.el) {
      if (v.length < 10) msg = 'Please write at least a short sentence (10+ characters).';
      else if (v.length > 2000) msg = 'Message is too long (2000 characters max).';
      else if ((v.match(URL_RE) || []).length > 2) msg = 'Please include at most 2 links.';
    }
    URL_RE.lastIndex = 0;
    setFieldError(el, f.err, msg);
    return !msg;
  }

  function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = `form-status is-${type}`;
  }

  function readSent() {
    try { return JSON.parse(localStorage.getItem(RATE_KEY) || '[]').filter((t) => Date.now() - t < 3600e3); }
    catch (_) { return []; }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    // Trap 1 + 2: Web3Forms honeypot checkbox and decoy text field
    const botcheck = form.querySelector('input[name="botcheck"]');
    const decoy = form.querySelector('input[name="website_url"]');
    if ((botcheck && botcheck.checked) || (decoy && decoy.value)) {
      showStatus('Thank you! Your message has been received.', 'success'); // silent drop
      form.reset();
      return;
    }

    // Field validation
    const valid = Object.values(fields).map(({ el }) => validateField(el));
    if (valid.includes(false)) {
      const firstBad = Object.values(fields).find(({ el }) => el.hasAttribute('aria-invalid'));
      if (firstBad) firstBad.el.focus();
      return;
    }

    // Trap 3: humans need a few seconds and real input events
    if (!formStartedAt || Date.now() - formStartedAt < MIN_FILL_MS || humanSignals < 3) {
      showStatus('That was quick! Please take a moment to review your message, then send again.', 'error');
      formStartedAt = formStartedAt || Date.now();
      return;
    }

    // Trap 4: rate limit (1 per minute, 3 per hour per browser)
    const sent = readSent();
    if (sent.length && Date.now() - sent[sent.length - 1] < 60e3) {
      showStatus('Message already sent — please wait a minute before sending another.', 'error');
      return;
    }
    if (sent.length >= 3) {
      showStatus('You have sent several messages already. For anything urgent, please use WhatsApp.', 'error');
      return;
    }

    // Trap 5: hCaptcha (rendered by the Web3Forms client script)
    const captcha = form.querySelector('[name="h-captcha-response"]');
    if (captcha && !captcha.value) {
      showStatus('Please complete the captcha to prove you are human.', 'error');
      return;
    }

    const formData = new FormData(form);
    if (formData.get('access_key') === 'YOUR_ACCESS_KEY_HERE') {
      showStatus('The contact form is not configured yet. Please reach out on WhatsApp for now.', 'error');
      console.warn('[AZ Studio] Add your Web3Forms access key to the hidden "access_key" input in index.html.');
      return;
    }
    formData.delete('website_url');
    formData.set('name', fields.name.el.value.trim());
    formData.set('email', fields.email.el.value.trim());
    formData.set('message', fields.message.el.value.trim());
    formData.set('replyto', fields.email.el.value.trim());

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
        signal: controller.signal
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        showStatus('Message sent! Abdelrazek will get back to you within 24 hours.', 'success');
        form.reset();
        countEl.textContent = '0';
        sent.push(Date.now());
        try { localStorage.setItem(RATE_KEY, JSON.stringify(sent)); } catch (_) { /* private mode */ }
        formStartedAt = 0;
        humanSignals = 0;
      } else {
        showStatus(json.message || 'Something went wrong. Please try again or use WhatsApp.', 'error');
      }
    } catch (err) {
      showStatus(err.name === 'AbortError'
        ? 'The request timed out. Please check your connection and try again.'
        : 'Unable to send right now. Please try again or reach out on WhatsApp.', 'error');
    } finally {
      clearTimeout(timer);
      if (window.hcaptcha && typeof window.hcaptcha.reset === 'function') {
        try { window.hcaptcha.reset(); } catch (_) { /* widget not ready */ }
      }
      submitBtn.disabled = false;
      submitBtn.innerHTML = submitLabel;
    }
  });
})();
