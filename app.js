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
  const tc = $('#timecode');
  if (tc && !reducedMotion) {
    const start = performance.now();
    const pad = (n) => String(n).padStart(2, '0');
    let last = -1;
    const tick = (now) => {
      const frames = Math.floor(((now - start) / 1000) * 25);
      if (frames !== last) {
        last = frames;
        const f = frames % 25, s = Math.floor(frames / 25);
        tc.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
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
   * 4. Scroll-driven skills + center video
   * ------------------------------------------------------------------ */
  const skillsSection = $('#skills');
  const skills = $$('.skill').sort((a, b) => a.dataset.i - b.dataset.i);
  const steps = $$('.skills-steps i');
  const skillsVideo = $('#skillsVideo');
  const choice = $('#videoChoice');
  const caption = $('#skillCaption');
  const progressBar = $('#skillsProgress');
  const reelDialog = $('#reelDialog');
  const reelVideo = $('#reelVideo');

  const CHOICE_AT = 0.86; // scroll progress where the "continue / keep scrolling" prompt appears
  let lastActive = -2;
  let choiceDismissed = false;
  let skillsTicking = false;

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
    if (p > 0.02) active = clamp(Math.floor(((p - 0.02) / (CHOICE_AT - 0.06)) * n), 0, n - 1);
    if (active !== lastActive) {
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
        const cur = skills[Math.max(active, 0)];
        const title = $('h3', cur).textContent;
        const text = $('p', cur).textContent;
        caption.innerHTML = `<b>${esc(title)}</b>${esc(text)}`;
      }
    }

    // Video: plays a bit while scrolling, then offers a choice
    const atChoice = p >= CHOICE_AT;
    const showChoice = inView && !choiceDismissed && (atChoice || reducedMotion);
    choice.hidden = !showChoice;

    if (!inView || atChoice || reducedMotion || reelDialog.open) {
      if (!skillsVideo.paused) skillsVideo.pause();
    } else if (skillsVideo.paused) {
      skillsVideo.play().catch(() => { choice.hidden = false; });
    }
    if (!atChoice && !inView) choiceDismissed = false;
  }
  const requestSkills = () => {
    if (!skillsTicking) { skillsTicking = true; requestAnimationFrame(updateSkills); }
  };
  window.addEventListener('scroll', requestSkills, { passive: true });
  window.addEventListener('resize', requestSkills);
  updateSkills();

  skillsVideo.addEventListener('timeupdate', () => {
    if (skillsVideo.duration) progressBar.style.transform = `scaleX(${skillsVideo.currentTime / skillsVideo.duration})`;
  });

  $('#watchFullBtn').addEventListener('click', () => {
    skillsVideo.pause();
    reelVideo.preload = 'auto';
    try { reelVideo.currentTime = skillsVideo.currentTime || 0; } catch (_) { /* metadata not ready */ }
    reelVideo.muted = false;
    reelDialog.showModal();
    reelVideo.play().catch(() => {});
  });
  $('#keepScrollBtn').addEventListener('click', () => {
    choiceDismissed = true;
    choice.hidden = true;
    skillsVideo.pause();
    $('#work').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  });
  $('#reelClose').addEventListener('click', () => reelDialog.close());
  reelDialog.addEventListener('close', () => { reelVideo.pause(); requestSkills(); });

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
    switch (v.type) {
      case 'drive': return { thumb: THUMBS[v.id] ? `assets/thumbs/drive/${v.id}.jpg` : null, o: THUMBS[v.id] || 'v', ext: `https://drive.google.com/file/d/${v.id}/view` };
      case 'image': return { thumb: THUMBS[v.id] ? `assets/thumbs/drive/${v.id}.jpg` : null, o: THUMBS[v.id] || 'h', ext: `https://drive.google.com/file/d/${v.id}/view` };
      case 'instagram': return { thumb: null, o: 'v', ext: `https://www.instagram.com/reel/${v.id}/` };
      case 'local': return { thumb: v.poster || null, o: 'v', ext: v.src };
      default: return { thumb: null, o: 'v', ext: '#' };
    }
  }
  const fallbackPoster = (title, label, ico = 'play') =>
    `<span class="poster-fallback">${icon(ico)}<span>${esc(label)}</span></span>`;

  function videoCard(raw, key) {
    const v = normalize(raw);
    const m = mediaInfo(v);
    const typeIcon = v.type === 'instagram' ? 'instagram' : v.type === 'image' ? 'image' : null;
    const label = v.type === 'instagram' ? 'Instagram reel' : v.type === 'image' ? 'Grade still' : 'Watch video';
    const media = m.thumb
      ? `<img src="${esc(m.thumb)}" alt="" loading="lazy" decoding="async">`
      : fallbackPoster(v.title, label, typeIcon || 'play');
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
          ${p.cover ? `<img src="${esc(p.cover)}" alt="" loading="${i < 3 ? 'eager' : 'lazy'}" decoding="async">`
            : `<span class="poster-fallback">${icon('stage')}<strong>${esc(p.client.split('·')[0].trim())}</strong><span>${esc(p.tag)}</span></span>`}
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
      skillsVideo.pause();
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
  function playCard(card) {
    const v = findItem(card.dataset.key);
    if (!v) return;
    stopPlaying(card);
    cardTemplates.set(card.dataset.key, card.outerHTML);

    let inner = '';
    if (v.type === 'drive') inner = `<iframe src="https://drive.google.com/file/d/${encodeURIComponent(v.id)}/preview" title="${esc(v.title)}" allow="autoplay; fullscreen; encrypted-media" allowfullscreen loading="lazy"></iframe>`;
    else if (v.type === 'instagram') inner = `<iframe src="https://www.instagram.com/reel/${encodeURIComponent(v.id)}/embed/" title="${esc(v.title)}" allow="autoplay; fullscreen; encrypted-media" allowfullscreen loading="lazy" scrolling="no"></iframe>`;
    else if (v.type === 'image') inner = `<img class="vcard-full" src="https://drive.google.com/thumbnail?id=${encodeURIComponent(v.id)}&sz=w1600" alt="${esc(v.title)}">`;
    else if (v.type === 'local') inner = `<video src="${esc(v.src)}" poster="${esc(v.poster || '')}" controls autoplay playsinline></video>`;

    const media = $('.vcard-media', card);
    const holder = document.createElement('div');
    holder.className = 'vcard-media';
    holder.innerHTML = inner;
    media.replaceWith(holder);
    card.classList.add('is-playing');
    requestAnimationFrame(() => card.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' }));
  }

  viewerBody.addEventListener('click', (e) => {
    const playBtn = e.target.closest('button.vcard-media');
    if (playBtn) { playCard(playBtn.closest('.vcard')); return; }
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
