/* ==========================================
   SCRIPT.JS — Our Story — Relationship Editorial
   ========================================== */

function initApp() {
  // Инициализация GSAP и ScrollTrigger для плавного появления
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.fade-item').forEach(item => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out'
      });
    });
  }

  // Helper для вибрации (Тактильный микро-отклик)
  const triggerHaptic = (ms = 10) => {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(ms); } catch (e) {}
    }
  };

  /* --- 1. MAGNETIC HOVER FOR BUTTONS --- */
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touchMode = window.matchMedia && window.matchMedia('(hover: none)').matches;
  // Only buttons get a subtle magnetic effect. Photos/cards never get transforms on click or hover.
  if (!reducedMotion && !touchMode) {
    document.querySelectorAll('button.magnetic-hover, a.magnetic-hover').forEach(el => {
      el.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.translate = `${x * 0.06}px ${y * 0.06}px`;
      });
      el.addEventListener('pointerleave', () => { el.style.translate = ''; });
    });
  }

  /* --- 2. THREAD SCROLLBAR PROGRESS --- */
  const scrollThread = document.getElementById('scroll-thread');
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollThread) {
      scrollThread.style.setProperty('--scroll-progress', `${scrolled}%`);
    }
  });

  /* --- 3. LOGIN: PIN 2411 + FOUR-NOTE MELODY --- */
  let pin = '';
  let isAuthenticated = false;
  let waltzToastShown = false;
  const dots = document.querySelectorAll('.pin-dot');
  const err = document.getElementById('pin-error');
  const overlay = document.getElementById('auth-overlay');
  const melodyStatus = document.getElementById('melody-status');
  const noteFrequencies = { '0': 261.63, '1': 293.66, '2': 329.63, '3': 349.23, '4': 392.00, '5': 440.00, '6': 493.88, '7': 523.25, '8': 587.33, '9': 659.25 };
  let audioContext = null;
  function playPinNote(key) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass || !noteFrequencies[key]) return;
      audioContext ||= new AudioContextClass();
      if (audioContext.state === 'suspended') audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = noteFrequencies[key];
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.22);
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(); oscillator.stop(audioContext.currentTime + 0.23);
    } catch (_) { /* audio is an enhancement; PIN still works without it */ }
  }
  // Tiny synthesized sounds: no extra audio files or third-party sound requests required.
  // The first keypad interaction unlocks AudioContext on mobile browsers.
  function playOurStorySound(kind = 'click') {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioContext ||= new AudioContextClass();
      if (audioContext.state === 'suspended') audioContext.resume();
      const presets = {
        click: [{ f: 740, t: 0, d: .055, v: .025, type: 'sine' }],
        unlock: [{ f: 523.25, t: 0, d: .16, v: .035, type: 'sine' }, { f: 659.25, t: .075, d: .2, v: .03, type: 'sine' }],
        reveal: [{ f: 392, t: 0, d: .32, v: .035, type: 'sine' }, { f: 523.25, t: .12, d: .4, v: .028, type: 'sine' }, { f: 783.99, t: .23, d: .5, v: .018, type: 'sine' }],
        notification: [{ f: 659.25, t: 0, d: .17, v: .032, type: 'sine' }, { f: 880, t: .11, d: .34, v: .025, type: 'sine' }]
      };
      (presets[kind] || presets.click).forEach(note => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const startAt = audioContext.currentTime + note.t;
        oscillator.type = note.type;
        oscillator.frequency.setValueAtTime(note.f, startAt);
        gain.gain.setValueAtTime(.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(note.v, startAt + .012);
        gain.gain.exponentialRampToValueAtTime(.0001, startAt + note.d);
        oscillator.connect(gain); gain.connect(audioContext.destination);
        oscillator.start(startAt); oscillator.stop(startAt + note.d + .02);
      });
    } catch (_) { /* Audio is decorative; all controls work without it. */ }
  }
  window.playOurStorySound = playOurStorySound;

  function paintPin() {
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx < pin.length));
    if (melodyStatus) {
      melodyStatus.textContent = pin.length ? `Мелодия: ${pin.split('').join(' · ')}${' · ○'.repeat(Math.max(0, 4 - pin.length))}` : 'Каждая цифра звучит по-своему.';
      melodyStatus.classList.remove('is-success', 'is-error');
    }
  }
  function resetPin() { pin = ''; paintPin(); }
  function checkWaltzToastAtBottom() {
    if (!isAuthenticated || waltzToastShown) return;
    const root = document.documentElement;
    const atBottom = window.scrollY + window.innerHeight >= root.scrollHeight - 90;
    if (!atBottom) return;
    const toast = document.getElementById('waltz-toast');
    if (toast) {
      toast.classList.remove('hidden');
      toast.setAttribute('role', 'status');
      playOurStorySound('notification');
      waltzToastShown = true;
      triggerHaptic([12, 25, 12]);
    }
  }
  document.querySelectorAll('.key-btn[data-key]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      triggerHaptic(8);
      if (key === 'del') {
        pin = pin.slice(0, -1);
      } else if (/^\d$/.test(key || '') && pin.length < 4) {
        pin += key;
        playPinNote(key);
      }
      paintPin();
      if (err) err.classList.remove('show');
    });
  });
  function enterPin() {
    const expectedPin = String(window.APP_DATA?.config?.pinCode || '2411');
    if (pin === expectedPin) {
      isAuthenticated = true;
      triggerHaptic([30, 50, 30]);
      playOurStorySound('unlock');
      if (melodyStatus) {
        melodyStatus.textContent = 'Мелодия совпала. Добро пожаловать домой. ♡';
        melodyStatus.classList.add('is-success');
      }
      const finishLogin = () => {
        if (overlay) overlay.style.display = 'none';
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        // The waltz note deliberately waits until the very bottom of the story.
        checkWaltzToastAtBottom();
      };
      if (overlay && typeof gsap !== 'undefined') {
        gsap.to(overlay, { opacity: 0, scale: 1.025, filter: 'blur(8px)', duration: 0.85, ease: 'power2.inOut', onComplete: finishLogin });
      } else finishLogin();
    } else {
      triggerHaptic(80);
      if (err) err.classList.add('show');
      if (melodyStatus) {
        melodyStatus.textContent = 'Мелодия пока не совпала. Попробуй 2 — 4 — 1 — 1.';
        melodyStatus.classList.add('is-error');
      }
      if (typeof gsap !== 'undefined') gsap.to('.auth-card', { x: 7, duration: 0.05, repeat: 5, yoyo: true });
      window.setTimeout(() => { resetPin(); if (err) err.classList.remove('show'); }, 1000);
    }
  }
  document.getElementById('btn-enter-pin')?.addEventListener('click', enterPin);
  document.addEventListener('keydown', (event) => {
    if (!overlay || overlay.style.display === 'none') return;
    if (/^\d$/.test(event.key) && pin.length < 4) {
      pin += event.key; playPinNote(event.key); paintPin();
    } else if (event.key === 'Backspace') {
      pin = pin.slice(0, -1); paintPin();
    } else if (event.key === 'Enter') enterPin();
    if (/^\d$/.test(event.key) || event.key === 'Backspace' || event.key === 'Enter') {
      if (err) err.classList.remove('show');
    }
  });
  window.addEventListener('scroll', checkWaltzToastAtBottom, { passive: true });
  window.addEventListener('resize', checkWaltzToastAtBottom, { passive: true });

  /* --- 4. LIVE TIMER --- */
  const start = new Date(APP_DATA.config.startDate);
  function updateTimer() {
    const now = new Date();
    const diff = now - start;
    if (diff < 0) return;

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 365);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const min = Math.floor((diff / (1000 * 60)) % 60);
    const sec = Math.floor((diff / 1000) % 60);

    if (document.getElementById('t-years')) document.getElementById('t-years').innerText = years;
    if (document.getElementById('t-days')) document.getElementById('t-days').innerText = String(days).padStart(3, '0');
    if (document.getElementById('t-hours')) document.getElementById('t-hours').innerText = String(hours).padStart(2, '0');
    if (document.getElementById('t-min')) document.getElementById('t-min').innerText = String(min).padStart(2, '0');
    if (document.getElementById('t-sec')) document.getElementById('t-sec').innerText = String(sec).padStart(2, '0');
  }
  setInterval(updateTimer, 1000);
  updateTimer();

  /* --- 5. FREQUENCY TUNER (РАДИОПРИЕМНИК ВРЕМЕНИ) --- */
  const freqSlider = document.getElementById('freq-slider');
  const freqNumber = document.getElementById('freq-number');
  const tunerQuote = document.getElementById('tuner-quote');

  if (freqSlider && freqNumber && tunerQuote) {
    freqSlider.addEventListener('input', (e) => {
      triggerHaptic(5);
      const val = parseFloat(e.target.value).toFixed(2);
      freqNumber.innerText = val;

      // Поиск ближайшей цитаты
      let closestVal = "22.00";
      let minDiff = 999;
      Object.keys(APP_DATA.frequencyQuotes).forEach(qKey => {
        const diff = Math.abs(parseFloat(qKey) - val);
        if (diff < minDiff) {
          minDiff = diff;
          closestVal = qKey;
        }
      });
      tunerQuote.innerText = APP_DATA.frequencyQuotes[closestVal];
    });
  }

  /* --- 6. LARGE VINYL + INTEGRATED AUDIO TRACK --- */
  let isPlayingVinyl = false;
  const pngDisc = document.getElementById('vinyl-disc');
  const tonearm = document.getElementById('tonearm');
  const btnVinyl = document.getElementById('btn-vinyl');
  const vinylIcon = document.getElementById('vinyl-icon');
  const vinylText = document.getElementById('vinyl-btn-text');
  const vinylWaveform = document.getElementById('vinyl-waveform');
  const vinylAudioTime = document.getElementById('vinyl-audio-time');
  const vinylTrackNote = document.getElementById('vinyl-track-note');
  const vAudio = new Audio(window.APP_DATA?.config?.audioSrc || 'assets/audio/favorite_song.mp3');
  vAudio.preload = 'metadata';
  vAudio.loop = true;
  const formatAudioTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const value = Math.max(0, Math.floor(seconds));
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
  };
  if (vinylWaveform) {
    // A restrained visual waveform: it also acts as a seek bar.
    const heights = [22,35,16,48,28,58,32,44,20,62,38,25,52,30,43,18,57,35,47,23,64,30,42,19,51,34,60,25,45,17,54,31,40,22,59,28,46,18,37,55,24,43,30,62,20,48,34,26];
    vinylWaveform.innerHTML = heights.map((height, index) => `<span style="--bar-height:${height}%;--bar-index:${index}"></span>`).join('');
  }
  function paintVinylAudio() {
    if (vinylAudioTime) vinylAudioTime.textContent = `${formatAudioTime(vAudio.currentTime)} / ${formatAudioTime(vAudio.duration)}`;
    if (vinylWaveform && Number.isFinite(vAudio.duration) && vAudio.duration > 0) {
      const progress = vAudio.currentTime / vAudio.duration * 100;
      vinylWaveform.style.setProperty('--track-progress', `${progress}%`);
      vinylWaveform.setAttribute('aria-valuenow', String(Math.round(progress)));
    }
    if (vinylWaveform) vinylWaveform.classList.toggle('is-playing', !vAudio.paused);
    if (vinylIcon) {
      vinylIcon.innerHTML = vAudio.paused ? '<i data-lucide="play" aria-hidden="true"></i>' : '<i data-lucide="pause" aria-hidden="true"></i>';
      if (window.lucide?.createIcons) window.lucide.createIcons({ attrs: { 'stroke-width': 1.7 } });
    }
    if (vinylText) vinylText.textContent = vAudio.paused ? 'Запустить винил' : 'Пауза';
    isPlayingVinyl = !vAudio.paused;
  }
  if (btnVinyl) {
    btnVinyl.addEventListener('click', async () => {
      triggerHaptic(15);
      playOurStorySound('click');
      if (vAudio.paused) {
        try {
          await vAudio.play();
          if (pngDisc) pngDisc.classList.add('spin');
          if (tonearm) tonearm.classList.add('drop');
          if (vinylTrackNote) vinylTrackNote.textContent = 'Сейчас играет — оставайся ещё на одну песню.';
        } catch (_) {
          if (vinylTrackNote) vinylTrackNote.textContent = 'Аудиофайл не найден. Проверь assets/audio/favorite_song.mp3.';
        }
      } else {
        vAudio.pause();
        if (pngDisc) pngDisc.classList.remove('spin');
        if (tonearm) tonearm.classList.remove('drop');
        if (vinylTrackNote) vinylTrackNote.textContent = 'Пауза. Продолжим, когда захочешь.';
      }
      paintVinylAudio();
    });
  }
  ['timeupdate', 'loadedmetadata', 'durationchange', 'play', 'pause', 'ended'].forEach(event => vAudio.addEventListener(event, () => {
    if (pngDisc) pngDisc.classList.toggle('spin', !vAudio.paused);
    if (tonearm) tonearm.classList.toggle('drop', !vAudio.paused);
    paintVinylAudio();
  }));
  vAudio.addEventListener('error', () => {
    if (vinylTrackNote) vinylTrackNote.textContent = 'Дорожка появится, когда файл будет на месте: assets/audio/favorite_song.mp3';
  });
  if (vinylWaveform) {
    const seekVinyl = (event) => {
      if (!Number.isFinite(vAudio.duration) || vAudio.duration <= 0) return;
      const rect = vinylWaveform.getBoundingClientRect();
      const x = event.clientX ?? rect.left;
      vAudio.currentTime = Math.max(0, Math.min(1, (x - rect.left) / rect.width)) * vAudio.duration;
      paintVinylAudio();
    };
    vinylWaveform.addEventListener('pointerdown', seekVinyl);
    vinylWaveform.addEventListener('keydown', (event) => {
      if (!Number.isFinite(vAudio.duration)) return;
      if (event.key === 'ArrowRight') vAudio.currentTime = Math.min(vAudio.duration, vAudio.currentTime + 5);
      else if (event.key === 'ArrowLeft') vAudio.currentTime = Math.max(0, vAudio.currentTime - 5);
      else return;
      event.preventDefault(); paintVinylAudio();
    });
  }
  paintVinylAudio();

  /* --- 7. MEMORY BOARD — smooth shuffle, stable cards --- */
  const chaosBoard = document.getElementById('chaos-board');
  const btnShuffle = document.getElementById('btn-shuffle-collage');
  const chaosItems = [];
  function placeChaosCard(el, idx, animate = false) {
    if (!chaosBoard) return;
    const maxX = Math.max(8, chaosBoard.clientWidth - el.offsetWidth - 8);
    const maxY = Math.max(8, chaosBoard.clientHeight - el.offsetHeight - 8);
    el.style.left = `${Math.random() * maxX}px`;
    el.style.top = `${Math.random() * maxY}px`;
    el.style.transform = `rotate(${(Math.random() - .5) * 16}deg)`;
    el.style.zIndex = String(idx + 1);
    if (animate) { el.classList.add('is-shuffling'); window.setTimeout(() => el.classList.remove('is-shuffling'), 760); }
  }
  function renderChaosBoard() {
    if (!chaosBoard || typeof APP_DATA === 'undefined') return;
    chaosBoard.innerHTML = ''; chaosItems.length = 0;
    APP_DATA.chaosPhotos.forEach((item, idx) => {
      const el = document.createElement('div'); el.className = 'chaos-item';
      el.innerHTML = `<img src="${item.image}" alt="${item.title || 'Наш момент'}" draggable="false" onerror="this.src='https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400';"><span>${item.title}</span>`;
      chaosBoard.appendChild(el); chaosItems.push(el); placeChaosCard(el, idx, false);
    });
  }
  renderChaosBoard();
  if (btnShuffle) btnShuffle.addEventListener('click', () => {
    triggerHaptic(10); chaosItems.forEach(el => void el.offsetWidth);
    chaosItems.forEach((el, idx) => placeChaosCard(el, (idx + 2) % Math.max(1, chaosItems.length), true));
    window.playOurStorySound?.('tap');
  });

  /* --- 8. 35MM FILM STRIP --- */
  const filmWrap = document.getElementById('film-strip-wrap');
  if (filmWrap && typeof APP_DATA !== 'undefined') {
    APP_DATA.filmFrames.forEach(f => {
      const frame = document.createElement('div');
      frame.className = 'film-frame';
      frame.innerHTML = `
        <div class="film-meta"><span>${f.title}</span><span>KODAK 400</span></div>
        <img src="${f.image}" alt="${f.title}" onerror="this.src='https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400';">
        <div class="film-meta"><span>${f.subtitle}</span><span>[ 2411 ]</span></div>
      `;
      filmWrap.appendChild(frame);
    });
  }

  /* --- 9. POLAROID DEVELOPING LAB — press and hold, not a tap --- */
  const developerLayer = document.getElementById('developer-layer');
  if (developerLayer) {
    let holdTimer = null, revealed = false;
    const cancelHold = () => { if (holdTimer) clearTimeout(holdTimer); holdTimer = null; developerLayer.classList.remove('is-holding'); };
    developerLayer.addEventListener('pointerdown', event => {
      if (revealed || event.button > 0) return;
      cancelHold(); developerLayer.classList.add('is-holding');
      holdTimer = setTimeout(() => { revealed = true; developerLayer.classList.remove('is-holding'); developerLayer.classList.add('developed'); developerLayer.setAttribute('aria-label','Снимок проявлен'); triggerHaptic(24); window.playOurStorySound?.('reveal'); }, 700);
    });
    ['pointerup','pointercancel','pointerleave','lostpointercapture'].forEach(type => developerLayer.addEventListener(type, cancelHold));
    developerLayer.addEventListener('contextmenu', event => event.preventDefault());
    developerLayer.setAttribute('role','button'); developerLayer.setAttribute('tabindex','0'); developerLayer.setAttribute('aria-label','Удерживай, чтобы проявить снимок');
    developerLayer.addEventListener('keydown', event => { if (revealed || !['Enter',' '].includes(event.key)) return; event.preventDefault(); revealed = true; developerLayer.classList.add('developed'); triggerHaptic(20); window.playOurStorySound?.('reveal'); });
  }

  /* --- 10. WAXY LETTER & SVG INK REVEAL --- */
  const waxBadge = document.getElementById('wax-badge');
  const letterText = document.getElementById('letter-text');
  const inkPath = document.getElementById('ink-path');
  const btnNextReason = document.getElementById('btn-next-reason');
  
  let availableReasons = [];
  if (typeof APP_DATA !== 'undefined' && APP_DATA.reasons) {
    availableReasons = [...APP_DATA.reasons];
  }

  function nextReason() {
    triggerHaptic(15);
    if (!letterText || !availableReasons.length) {
      if (typeof APP_DATA !== 'undefined') availableReasons = [...APP_DATA.reasons];
    }
    const randomIndex = Math.floor(Math.random() * availableReasons.length);
    const r = availableReasons.splice(randomIndex, 1)[0];
    
    if (inkPath) {
      inkPath.classList.remove('revealed');
      setTimeout(() => inkPath.classList.add('revealed'), 50);
    }

    if (typeof gsap !== 'undefined') gsap.fromTo(letterText, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2 });
    letterText.innerText = r;
  }

  if (waxBadge) {
    waxBadge.addEventListener('click', () => {
      playOurStorySound('reveal');
      waxBadge.style.transform = 'translateX(-50%) scale(0.8) rotate(15deg)';
      setTimeout(() => waxBadge.style.opacity = '0.6', 200);
      nextReason();
    });
  }
  if (btnNextReason) btnNextReason.addEventListener('click', nextReason);

  /* --- 11. TELEGRAM CHAT --- */
  const chatBox = document.getElementById('chat-box');
  if (chatBox && typeof APP_DATA !== 'undefined' && APP_DATA.telegramChat) {
    APP_DATA.telegramChat.forEach(m => {
      const div = document.createElement('div');
      div.className = `msg ${m.sender}`;
      if (m.type === 'text') div.innerText = m.text;
      else if (m.type === 'image') div.innerHTML = `<img src="${m.image}" alt=""><p>${m.caption || ''}</p>`;
      chatBox.appendChild(div);
    });
  }

  /* --- 12. WALTZ NOTIFICATION --- */
  const toast = document.getElementById('waltz-toast');
  const btnOpenQuest = document.getElementById('btn-open-quest');
  if (btnOpenQuest) {
    btnOpenQuest.addEventListener('click', () => {
      triggerHaptic(15);
      if (toast) toast.classList.add('hidden');
      window.location.href = 'waltz.html';
    });
  }

}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
/* ==========================================
   ARCHIVE ENHANCEMENTS — additional interactions
   This layer is additive: it preserves the original archive logic above.
   ========================================== */
(function initArchiveEnhancements() {
  const ready = (fn) => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once: true }) : fn();

  ready(() => {
    if (window.lucide?.createIcons) window.lucide.createIcons({ attrs: { 'stroke-width': 1.7 } });
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
    const data = (typeof APP_DATA !== 'undefined' && APP_DATA.archiveArtifacts) ? APP_DATA.archiveArtifacts : {};
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touchMode = window.matchMedia && window.matchMedia('(hover: none)').matches;
    const haptic = (pattern = 8) => {
      try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (_) {}
    };

    // Magnetic hover is desktop-only and does not overwrite transforms on touch devices.
    if (!touchMode && !reducedMotion) {
      $$('button.magnetic-hover, a.magnetic-hover').forEach((el) => {
        if (el.dataset.archiveMagnetic === '1') return;
        el.dataset.archiveMagnetic = '1';
        el.addEventListener('pointermove', (event) => {
          if (event.pointerType !== 'mouse') return;
          const rect = el.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;
          el.style.setProperty('--magnetic-x', `${x * 0.08}px`);
          el.style.setProperty('--magnetic-y', `${y * 0.08}px`);
          el.style.translate = `${x * 0.08}px ${y * 0.08}px`;
        });
        el.addEventListener('pointerleave', () => {
          el.style.translate = '';
          el.style.removeProperty('--magnetic-x');
          el.style.removeProperty('--magnetic-y');
        });
      });
    }

    // Scroll progress thread + restrained parallax variable.
    const thread = $('#scroll-thread');
    let scrollTicking = false;
    const updateScrollEffects = () => {
      const root = document.documentElement;
      const max = Math.max(1, root.scrollHeight - root.clientHeight);
      const progress = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
      if (thread) thread.style.setProperty('--scroll-progress', `${progress}%`);
      root.style.setProperty('--archive-scroll-progress', `${progress / 100}`);
      scrollTicking = false;
    };
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(updateScrollEffects);
      }
    }, { passive: true });
    updateScrollEffects();

    // Native reveal fallback if GSAP/ScrollTrigger are unavailable.
    if (!('ScrollTrigger' in window) || typeof window.gsap === 'undefined') {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('archive-visible');
            observer.unobserve(entry.target);
          }
        }), { threshold: 0.12 });
        $$('.fade-item').forEach((el) => observer.observe(el));
      } else $$('.fade-item').forEach((el) => el.classList.add('archive-visible'));
    }

    // Golden thread: clicking the progress line scrolls to the next exhibit.
    if (thread) {
      thread.setAttribute('role', 'button');
      thread.setAttribute('tabindex', '0');
      thread.setAttribute('aria-label', 'Перейти к следующему экспонату');
      const goNext = () => {
        const sections = $$('main .editorial-piece');
        const next = sections.find((section) => section.getBoundingClientRect().top > 80);
        (next || sections[0])?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      };
      thread.addEventListener('click', goNext);
      thread.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goNext(); } });
    }

    // Time lock: intentional lock/unlock control. If a target date is configured, honor it;
    // otherwise the switch acts as an explicit visitor-controlled reveal.
    const timeLock = $('#time-lock');
    const timeMessage = $('#time-lock-message');
    const exhibits = $('#archive-exhibits');
    const lockData = data.timeLock || {};
    const unlockAt = lockData.unlockAt ? new Date(lockData.unlockAt) : null;
    const isTimeReady = () => !unlockAt || Number.isNaN(unlockAt.getTime()) || Date.now() >= unlockAt.getTime();
    const paintLock = (unlocked) => {
      if (exhibits) exhibits.classList.toggle('archive-locked-content', !unlocked);
      if (timeLock) {
        timeLock.setAttribute('aria-pressed', String(unlocked));
        timeLock.textContent = unlocked ? 'Закрыть экспонат' : 'Открыть экспонат';
      }
      if (timeMessage) timeMessage.textContent = unlocked
        ? (lockData.unlockedMessage || 'Экспонат открыт. Некоторые воспоминания требуют времени.')
        : (lockData.lockedMessage || 'Этот экспонат пока запечатан. Нажмите, чтобы проверить доступ.');
    };
    if (exhibits) exhibits.classList.remove('archive-locked-content');
    if (timeLock) {
      paintLock(false);
      timeLock.addEventListener('click', () => {
        if (!isTimeReady()) {
          paintLock(false);
          if (timeMessage) timeMessage.textContent = `Доступ откроется ${unlockAt.toLocaleString('ru-RU')}.`;
          haptic(35);
          return;
        }
        const unlocked = timeLock.getAttribute('aria-pressed') !== 'true';
        paintLock(unlocked);
        haptic(unlocked ? [15, 30, 15] : 8);
      });
    }

    // Audio archive player with progress, time display and waveform seek.
    const audio = $('#archive-audio');
    const audioToggle = $('#audio-toggle');
    const waveform = $('#audio-waveform');
    const audioTime = $('#audio-time');
    const audioData = data.audio || {};
    if (audio && audioData.source && !audio.getAttribute('src')) audio.src = audioData.source;
    const formatTime = (seconds) => {
      if (!Number.isFinite(seconds)) return '0:00';
      const s = Math.max(0, Math.floor(seconds));
      return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    };
    const paintAudio = () => {
      if (audioTime) audioTime.textContent = `${formatTime(audio?.currentTime || 0)} / ${formatTime(audio?.duration || 0)}`;
      if (waveform && audio && Number.isFinite(audio.duration) && audio.duration > 0) {
        waveform.style.setProperty('--audio-progress', `${audio.currentTime / audio.duration * 100}%`);
        waveform.setAttribute('aria-valuenow', String(Math.round(audio.currentTime / audio.duration * 100)));
      }
      if (audioToggle) {
        audioToggle.setAttribute('aria-pressed', String(!!audio && !audio.paused));
        audioToggle.textContent = audio && !audio.paused ? 'Ⅱ Пауза' : '▶ Слушать';
      }
    };
    if (audio) {
      ['timeupdate', 'loadedmetadata', 'durationchange', 'play', 'pause', 'ended'].forEach((event) => audio.addEventListener(event, paintAudio));
      audio.addEventListener('error', () => {
        if (audioTime) audioTime.textContent = 'Аудиофайл не найден';
      });
    }
    if (audioToggle && audio) audioToggle.addEventListener('click', async () => {
      haptic(10);
      if (audio.paused) {
        try { await audio.play(); } catch (_) { if (audioTime) audioTime.textContent = 'Нажмите ещё раз, чтобы разрешить воспроизведение'; }
      } else audio.pause();
      paintAudio();
    });
    if (waveform && audio) {
      waveform.setAttribute('role', 'slider');
      waveform.setAttribute('tabindex', '0');
      waveform.setAttribute('aria-label', 'Позиция аудиозаписи');
      waveform.setAttribute('aria-valuemin', '0');
      waveform.setAttribute('aria-valuemax', '100');
      const seek = (event) => {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
        const rect = waveform.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        audio.currentTime = ratio * audio.duration;
        paintAudio();
      };
      waveform.addEventListener('pointerdown', seek);
      waveform.addEventListener('keydown', (event) => {
        if (!Number.isFinite(audio.duration)) return;
        if (event.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
        else if (event.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
        else return;
        event.preventDefault(); paintAudio();
      });
      paintAudio();
    }

    // Metadata drawer, backdrop and Escape key.
    const drawer = $('#metadata-drawer');
    const backdrop = $('#metadata-backdrop');
    const openMeta = $('#metadata-open');
    const closeMeta = $('#metadata-close');
    const setDrawer = (open) => {
      if (!drawer) return;
      drawer.hidden = !open;
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', String(!open));
      if (backdrop) { backdrop.hidden = !open; backdrop.classList.toggle('is-visible', open); }
      document.body.classList.toggle('metadata-drawer-open', open);
      if (open) closeMeta?.focus({ preventScroll: true }); else openMeta?.focus({ preventScroll: true });
    };
    openMeta?.addEventListener('click', () => setDrawer(true));
    closeMeta?.addEventListener('click', () => setDrawer(false));
    backdrop?.addEventListener('click', () => setDrawer(false));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setDrawer(false);
    });

    // Archive ticket: opens a printable record without leaking anything outside this page.
    const ticket = $('#memory-ticket');
    if (ticket) {
      ticket.setAttribute('tabindex', ticket.hasAttribute('tabindex') ? ticket.getAttribute('tabindex') : '0');
      ticket.setAttribute('role', ticket.getAttribute('role') || 'button');
      ticket.setAttribute('aria-label', ticket.getAttribute('aria-label') || 'Показать архивный билет');
      const showTicket = () => {
        ticket.classList.toggle('ticket-expanded');
        haptic(12);
      };
      ticket.addEventListener('click', showTicket);
      ticket.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showTicket(); } });
    }

    // Before/after image comparison slider.
    const split = $('#archive-split');
    const range = $('#split-range');
    const after = $('#split-after');
    const updateSplit = () => {
      if (!range || !after) return;
      const value = Math.max(0, Math.min(100, Number(range.value) || 50));
      after.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
      after.style.setProperty('--split-position', `${value}%`);
      range.setAttribute('aria-valuetext', `${value}% сравнения`);
    };
    if (split && range) {
      range.addEventListener('input', updateSplit);
      updateSplit();
    }

    // Easter egg: keyboard sequence, click trigger and gentle reveal.
    const easterTrigger = $('#easter-key');
    const easterSecret = $('#easter-secret');
    const easterData = data.easterEgg || {};
    const revealEaster = () => {
      if (!easterSecret) return;
      easterSecret.classList.toggle('is-revealed');
      const open = easterSecret.classList.contains('is-revealed');
      easterSecret.hidden = !open;
      easterSecret.setAttribute('aria-hidden', String(!open));
      if (open && easterData.message) easterSecret.textContent = easterData.message;
      haptic(open ? [10, 20, 10] : 8);
    };
    easterTrigger?.addEventListener('click', revealEaster);
    const secretSequence = ['2', '4', '1', '1'];
    let typedSequence = [];
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey || event.altKey || event.metaKey || event.key.length !== 1 || !/\d/.test(event.key)) return;
      typedSequence.push(event.key);
      typedSequence = typedSequence.slice(-secretSequence.length);
      if (typedSequence.join('') === secretSequence.join('')) {
        if (easterSecret && !easterSecret.classList.contains('is-revealed')) revealEaster();
        typedSequence = [];
      }
    });

    // Melodic keypad code. It is a separate interaction from the front-door PIN.
    const keypad = $('#melodic-keypad');
    const melodyMessage = $('#melody-message');
    const melodyData = data.melody || {};
    if (keypad) {
      let entered = [];
      const sequence = Array.isArray(melodyData.sequence) ? melodyData.sequence.map(String) : ['2', '4', '1', '1'];
      const showMelodyMessage = (text, success) => {
        if (melodyMessage) {
          melodyMessage.textContent = text;
          melodyMessage.classList.toggle('is-success', !!success);
          melodyMessage.classList.toggle('is-error', !success);
        }
      };
      $$('[data-note]', keypad).forEach((button) => button.addEventListener('click', () => {
        const note = button.dataset.note;
        if (note === 'clear') { entered = []; showMelodyMessage('Последовательность очищена.', false); return; }
        if (note === 'enter') {
          const correct = entered.join('') === sequence.join('');
          showMelodyMessage(correct ? (melodyData.successMessage || 'Последовательность совпала.') : (melodyData.errorMessage || 'Не та последовательность. Попробуйте ещё раз.'), correct);
          if (correct) {
            haptic([20, 35, 20]);
            if (easterSecret && !easterSecret.classList.contains('is-revealed')) revealEaster();
          } else haptic(40);
          entered = [];
          return;
        }
        if (/^\d$/.test(note)) {
          entered.push(note);
          if (entered.length > sequence.length) entered = entered.slice(-sequence.length);
          showMelodyMessage(`Введено символов: ${entered.length}/${sequence.length}`, false);
          haptic(6);
        }
      }));
    }

    // Small archival details: image captions, focus affordances and safe broken-image fallback.
    $$('img').forEach((img) => {
      if (!img.hasAttribute('loading') && !img.closest('.hero-photo-frame, .vinyl-stage-right')) img.loading = 'lazy';
      img.addEventListener('error', () => img.classList.add('archive-image-missing'), { once: true });
    });
    $$('button, input, [role="button"]').forEach((el) => {
      if (!el.hasAttribute('aria-label') && !el.textContent.trim() && el.title) el.setAttribute('aria-label', el.title);
    });

    // A small, warm surprise on the main page — no camera, upload, or permissions.
    const surpriseButton = $('#surprise-open');
    const surpriseNote = $('#surprise-note');
    surpriseButton?.addEventListener('click', () => {
      if (!surpriseNote) return;
      surpriseNote.hidden = false;
      surpriseNote.classList.add('is-open');
      surpriseButton.innerHTML = 'Записка открыта <i data-lucide="check" aria-hidden="true"></i>';
      if (window.lucide?.createIcons) window.lucide.createIcons({ attrs: { 'stroke-width': 1.7 } });
      window.playOurStorySound?.('reveal');
      surpriseButton.setAttribute('aria-expanded', 'true');
      haptic([12, 24, 12]);
      if (typeof confetti === 'function' && !reducedMotion) {
        confetti({ particleCount: 24, spread: 42, startVelocity: 12, origin: { y: 0.72 }, colors: ['#d9b879', '#f7e8d0'] });
      }
      surpriseNote.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
    });

    // A soft appearance for sections without making the page feel like a museum exhibit.
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      $$('.relationship-section, .little-thing, .love-note-section').forEach(el => revealObserver.observe(el));
    }


    // The night sky and emotional finale are one reveal: the stars wake up near the end.
    const finale = $('#final-credits');
    if (finale && 'IntersectionObserver' in window) {
      let finalePlayed = false;
      const finaleObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || finalePlayed) return;
          finalePlayed = true;
          finale.classList.add('finale-active');
          if (window.lucide?.createIcons) window.lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
          window.setTimeout(() => window.playOurStorySound?.('reveal'), 650);
          finaleObserver.disconnect();
        });
      }, { threshold: 0.58 });
      finaleObserver.observe(finale);
    }

    // Keep keyboard users informed when reduced-motion is preferred.
    if (reducedMotion) document.documentElement.classList.add('prefers-reduced-motion');
  });
})();
