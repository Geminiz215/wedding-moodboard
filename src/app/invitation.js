// Soft Romance in Bloom — Interactive Logic for Zahra & Fachri
import { weddingConfig } from '../config/weddingConfig';
import { submitRsvpRecord } from '../services/supabaseClient';

let started = false;

export function initInvitation() {
  if (started) return; // Prevent double execution in React StrictMode
  started = true;

  /* ------------------------------------------------------------------------
     1. STATE & SAFE STORAGE HELPERS
     ------------------------------------------------------------------------ */
  let activeGuestPreset = weddingConfig.guestPresets[0];
  let currentStepperPax = 2;
  let activeLightboxIndex = 0;
  let lastFocusedThumbnail = null;
  let toastTimeoutId = null;

  function safeGetStorage(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function safeSetStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // Ignore quota error
    }
  }

  function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;
    msgEl.textContent = message;
    toast.classList.remove('opacity-0', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    toastTimeoutId = setTimeout(function () {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-2');
    }, 3200);
  }

  /* ------------------------------------------------------------------------
     2. DYNAMIC LIVE COUNTDOWN TIMER (Days, Hours, Minutes, Seconds)
     ------------------------------------------------------------------------ */
  const cdDaysEl = document.getElementById('cd-days');
  const cdHoursEl = document.getElementById('cd-hours');
  const cdMinutesEl = document.getElementById('cd-minutes');
  const cdSecondsEl = document.getElementById('cd-seconds');

  function getTargetWeddingTimestamp() {
    const configuredDate = new Date(weddingConfig.weddingDateISO);
    const now = new Date();
    if (configuredDate.getTime() > now.getTime()) {
      return configuredDate.getTime();
    }
    // If configured date has passed, compute next upcoming June 14 at 16:00 WIB (+07:00)
    let targetYear = now.getFullYear();
    let candidate = new Date(`${targetYear}-06-14T16:00:00+07:00`);
    if (candidate.getTime() <= now.getTime()) {
      candidate = new Date(`${targetYear + 1}-06-14T16:00:00+07:00`);
    }
    return candidate.getTime();
  }

  const targetTimestamp = getTargetWeddingTimestamp();

  function updateCountdownUnit(el, value) {
    if (!el) return;
    const formatted = String(value).padStart(2, '0');
    if (el.textContent !== formatted) {
      el.textContent = formatted;
      el.classList.remove('countdown-tick');
      void el.offsetWidth; // trigger reflow for smooth tick
      el.classList.add('countdown-tick');
    }
  }

  function tickCountdown() {
    const now = Date.now();
    const diff = Math.max(0, targetTimestamp - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    updateCountdownUnit(cdDaysEl, days);
    updateCountdownUnit(cdHoursEl, hours);
    updateCountdownUnit(cdMinutesEl, minutes);
    updateCountdownUnit(cdSecondsEl, seconds);
  }

  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ------------------------------------------------------------------------
     3. URL QUERY PARAMETERS & PERSONALIZED GUEST INITIALIZATION
     ------------------------------------------------------------------------ */
  function parseUrlParameters() {
    try {
      const params = new URLSearchParams(window.location.search);
      const toParam = params.get('to') || params.get('u');
      const paxParam = parseInt(params.get('pax') || '', 10);

      if (toParam && toParam.trim()) {
        const decodedName = decodeURIComponent(toParam.replace(/\+/g, ' ')).trim();
        const quota = !isNaN(paxParam) && paxParam > 0 && paxParam <= 10 ? paxParam : 2;
        return { name: decodedName, maxQuota: quota };
      }
    } catch (err) {
      // URL parsing fallback
    }
    return weddingConfig.guestPresets[0];
  }

  function applyGuestData(guestObj) {
    activeGuestPreset = guestObj;
    currentStepperPax = Math.min(2, guestObj.maxQuota);

    // Update Cover
    const coverGuestName = document.getElementById('cover-guest-name');
    const coverGuestBadge = document.getElementById('cover-guest-quota-badge');
    if (coverGuestName) coverGuestName.textContent = guestObj.name;
    if (coverGuestBadge) {
      coverGuestBadge.textContent =
        'Undangan Berlaku untuk ' + guestObj.maxQuota + ' Orang Tamu';
    }

    // Update RSVP
    const stepperVal = document.getElementById('rsvp-stepper-value');
    const stepperInput = document.getElementById('rsvp-pax-input');
    if (stepperVal) stepperVal.textContent = String(currentStepperPax);
    if (stepperInput) stepperInput.value = String(currentStepperPax);

    const rsvpRegGuest = document.getElementById('rsvp-registered-guest');
    const rsvpQuotaPill = document.getElementById('rsvp-quota-pill');
    const rsvpNameInput = document.getElementById('rsvp-name');
    const rsvpPaxHint = document.getElementById('rsvp-pax-hint');

    if (rsvpRegGuest) rsvpRegGuest.textContent = guestObj.name;
    if (rsvpQuotaPill) {
      rsvpQuotaPill.textContent = 'Reserved: ' + guestObj.maxQuota + ' Seats';
    }
    if (rsvpNameInput) rsvpNameInput.value = guestObj.name;
    if (rsvpPaxHint) {
      rsvpPaxHint.textContent =
        'Jumlah tamu disesuaikan dengan kuota undangan (maksimal ' + guestObj.maxQuota + ' tamu).';
    }

    // Prefill Guestbook name
    const gbNameInput = document.getElementById('gb-name');
    if (gbNameInput && !gbNameInput.value) {
      gbNameInput.value = guestObj.name;
    }
  }

  applyGuestData(parseUrlParameters());

  // RSVP Stepper Actions
  const btnPaxDec = document.getElementById('btn-pax-decrement');
  const btnPaxInc = document.getElementById('btn-pax-increment');
  const stepperVal = document.getElementById('rsvp-stepper-value');
  const stepperInput = document.getElementById('rsvp-pax-input');

  if (btnPaxDec && btnPaxInc && stepperVal && stepperInput) {
    btnPaxDec.addEventListener('click', function () {
      if (currentStepperPax > 1) {
        currentStepperPax -= 1;
        stepperVal.textContent = String(currentStepperPax);
        stepperInput.value = String(currentStepperPax);
      }
    });

    btnPaxInc.addEventListener('click', function () {
      if (currentStepperPax < activeGuestPreset.maxQuota) {
        currentStepperPax += 1;
        stepperVal.textContent = String(currentStepperPax);
        stepperInput.value = String(currentStepperPax);
      } else {
        showToast('Jumlah maksimal sesuai kuota undangan Anda (' + activeGuestPreset.maxQuota + ' tamu).');
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. CINEMATIC CURTAIN REVEAL & OPENING AUDIO TRIGGER
     ------------------------------------------------------------------------ */
  const coverEl = document.getElementById('invitation-cover');
  const btnOpenInvitation = document.getElementById('btn-open-invitation');
  const btnOpenLabel = document.getElementById('btn-open-invitation-label');
  const btnReopenCover = document.getElementById('btn-reopen-cover');
  const mainInvitationEl = document.getElementById('main-invitation');

  function playOpeningArpeggio() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const notes = [261.63, 329.63, 392.0, 523.25, 659.25];
      const now = audioCtx.currentTime;

      notes.forEach(function (freq, i) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);

        gain.gain.setValueAtTime(0.0001, now + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.04, now + i * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 1.25);
      });
    } catch (e) {
      // Audio context error fallback
    }
  }

  function openInvitationCover() {
    if (!coverEl) return;
    if (btnOpenLabel) btnOpenLabel.textContent = 'Opening Invitation...';

    // Play elegant opening arpeggio and start gentle background melody only on user click
    playOpeningArpeggio();
    if (!isMusicPlaying) {
      setTimeout(function () {
        toggleBackgroundMusic(true);
      }, 400);
    }

    coverEl.classList.add('is-opening');
    document.body.classList.remove('cover-locked');

    const isReduced =
      document.body.classList.contains('reduced-motion-mode') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = isReduced ? 200 : 850;

    setTimeout(function () {
      coverEl.classList.add('is-opened');
      coverEl.setAttribute('aria-hidden', 'true');
      if (btnReopenCover) btnReopenCover.classList.remove('hidden');

      const openingSection = document.getElementById('opening');
      if (openingSection) {
        openingSection.scrollIntoView({ behavior: 'smooth' });
      } else if (mainInvitationEl) {
        mainInvitationEl.focus({ preventScroll: true });
      }
    }, duration);
  }

  function reopenInvitationCover() {
    if (!coverEl) return;
    if (btnOpenLabel) btnOpenLabel.textContent = 'Tap Wax Seal to Open Invitation';
    coverEl.classList.remove('is-opened', 'is-opening');
    coverEl.removeAttribute('aria-hidden');
    document.body.classList.add('cover-locked');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (btnReopenCover) btnReopenCover.classList.add('hidden');
    if (btnOpenInvitation) btnOpenInvitation.focus();
  }

  if (btnOpenInvitation) {
    btnOpenInvitation.addEventListener('click', openInvitationCover);
  }
  if (btnReopenCover) {
    btnReopenCover.addEventListener('click', reopenInvitationCover);
  }

  /* ------------------------------------------------------------------------
     5. REFINED BACKGROUND HARP & PIANO SYNTHESIZER (Web Audio API)
     ------------------------------------------------------------------------ */
  let audioCtx = null;
  let isMusicPlaying = false;
  let musicIntervalId = null;
  const btnMusicToggle = document.getElementById('btn-music-toggle');
  const soundwaveContainer = document.getElementById('soundwave-container');
  const iconMusicOff = document.getElementById('icon-music-off');
  const musicStatusLabel = document.getElementById('music-status-label');

  // Pentatonic romantic harp melody sequence (Hz)
  const melodySequence = [349.23, 440.0, 523.25, 659.25, 587.33, 523.25, 440.0, 392.0];
  let noteIdx = 0;

  function playGentleHarpNote(freq) {
    if (!audioCtx || !isMusicPlaying) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 2.15);
    } catch (e) {
      // Audio error fallback
    }
  }

  function toggleBackgroundMusic(forceStart) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!isMusicPlaying || forceStart) {
      try {
        if (!audioCtx) audioCtx = new AudioContextClass();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        isMusicPlaying = true;
        playGentleHarpNote(melodySequence[noteIdx]);
        if (musicIntervalId) clearInterval(musicIntervalId);
        musicIntervalId = setInterval(function () {
          noteIdx = (noteIdx + 1) % melodySequence.length;
          playGentleHarpNote(melodySequence[noteIdx]);
        }, 1600);

        if (btnMusicToggle) btnMusicToggle.setAttribute('aria-pressed', 'true');
        if (soundwaveContainer) soundwaveContainer.classList.remove('hidden');
        if (iconMusicOff) iconMusicOff.classList.add('hidden');
        if (musicStatusLabel) musicStatusLabel.textContent = 'Music: On';
        if (!forceStart) showToast('Background music enabled');
      } catch (err) {
        // Autoplay policy prevented start
      }
    } else {
      isMusicPlaying = false;
      if (musicIntervalId) {
        clearInterval(musicIntervalId);
        musicIntervalId = null;
      }
      if (btnMusicToggle) btnMusicToggle.setAttribute('aria-pressed', 'false');
      if (soundwaveContainer) soundwaveContainer.classList.add('hidden');
      if (iconMusicOff) iconMusicOff.classList.remove('hidden');
      if (musicStatusLabel) musicStatusLabel.textContent = 'Music: Off';
      showToast('Background music muted');
    }
  }

  if (btnMusicToggle) {
    btnMusicToggle.addEventListener('click', function () {
      toggleBackgroundMusic(false);
    });
  }

  /* ------------------------------------------------------------------------
     6. REDUCED MOTION TOGGLE & SCROLL CHOREOGRAPHY
     ------------------------------------------------------------------------ */
  const btnReducedMotion = document.getElementById('btn-reduced-motion');
  const reducedMotionLabel = document.getElementById('reduced-motion-label');

  function setReducedMotionMode(enabled) {
    document.body.classList.toggle('reduced-motion-mode', enabled);
    if (btnReducedMotion) btnReducedMotion.setAttribute('aria-pressed', String(enabled));
    if (reducedMotionLabel) {
      reducedMotionLabel.textContent = enabled ? 'Motion: Minimal' : 'Motion: On';
    }
    if (enabled) {
      document.querySelectorAll('[data-motion]').forEach(function (el) {
        el.classList.add('is-visible');
      });
    }
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setReducedMotionMode(true);
  }

  if (btnReducedMotion) {
    btnReducedMotion.addEventListener('click', function () {
      const nextState = !document.body.classList.contains('reduced-motion-mode');
      setReducedMotionMode(nextState);
      showToast(nextState ? 'Reduced motion mode enabled' : 'Standard editorial animations enabled');
    });
  }

  // Scroll Reveals via IntersectionObserver
  const motionElements = document.querySelectorAll('[data-motion]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -30px 0px' }
    );
    motionElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    motionElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // Active Section Highlighting across all 11 Scenes
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const desktopNavLinks = document.querySelectorAll('.nav-anchor');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const trackedSections = [
    'opening',
    'ayat',
    'kisah',
    'mempelai',
    'akad',
    'resepsi',
    'lokasi',
    'ucapan',
    'rsvp',
    'tanda-kasih',
    'closing',
  ];

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const activeId = entry.target.id;
            desktopNavLinks.forEach(function (link) {
              const isMatch = link.getAttribute('data-nav-link') === activeId;
              link.classList.toggle('text-[#784653]', isMatch);
              link.classList.toggle('font-semibold', isMatch);
              link.classList.toggle('border-[#D8C37B]', isMatch);
            });
            mobileNavLinks.forEach(function (link) {
              const navTarget = link.getAttribute('data-nav-link');
              const isMatch =
                navTarget === activeId ||
                (navTarget === 'opening' && activeId === 'ayat') ||
                (navTarget === 'akad' && (activeId === 'resepsi' || activeId === 'lokasi'));
              link.classList.toggle('is-active', isMatch);
            });
          }
        });
      },
      { threshold: 0.22, rootMargin: '-70px 0px -45% 0px' }
    );

    trackedSections.forEach(function (id) {
      const sec = document.getElementById(id);
      if (sec) navObserver.observe(sec);
    });
  }

  // Passive Scroll Progress
  let tickingScroll = false;
  window.addEventListener(
    'scroll',
    function () {
      if (!tickingScroll) {
        window.requestAnimationFrame(function () {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
          if (scrollProgressBar) {
            scrollProgressBar.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
          }
          tickingScroll = false;
        });
        tickingScroll = true;
      }
    },
    { passive: true }
  );

  /* ------------------------------------------------------------------------
     7. ACCESSIBLE GALLERY LIGHTBOX
     ------------------------------------------------------------------------ */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const btnCloseLightbox = document.getElementById('btn-close-lightbox');
  const btnLightboxPrev = document.getElementById('btn-lightbox-prev');
  const btnLightboxNext = document.getElementById('btn-lightbox-next');

  function renderLightboxSlide(index) {
    const total = weddingConfig.gallery.length;
    activeLightboxIndex = (index + total) % total;
    const item = weddingConfig.gallery[activeLightboxIndex];
    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
    }
    if (lightboxCaption) lightboxCaption.textContent = item.caption;
    if (lightboxCounter) {
      lightboxCounter.textContent = activeLightboxIndex + 1 + ' / ' + total;
    }
  }

  function openLightbox(index, triggerEl) {
    lastFocusedThumbnail = triggerEl || document.activeElement;
    renderLightboxSlide(index);
    if (lightboxModal) {
      lightboxModal.classList.remove('hidden');
      lightboxModal.classList.add('flex');
    }
    if (btnCloseLightbox) btnCloseLightbox.focus();
  }

  function closeLightbox() {
    if (!lightboxModal || lightboxModal.classList.contains('hidden')) return;
    lightboxModal.classList.add('hidden');
    lightboxModal.classList.remove('flex');
    if (lastFocusedThumbnail && typeof lastFocusedThumbnail.focus === 'function') {
      lastFocusedThumbnail.focus();
    }
  }

  document.querySelectorAll('[data-gallery-index]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const idx = parseInt(btn.getAttribute('data-gallery-index') || '0', 10);
      openLightbox(idx, btn);
    });
  });

  if (btnCloseLightbox) btnCloseLightbox.addEventListener('click', closeLightbox);
  if (btnLightboxPrev) {
    btnLightboxPrev.addEventListener('click', function () {
      renderLightboxSlide(activeLightboxIndex - 1);
    });
  }
  if (btnLightboxNext) {
    btnLightboxNext.addEventListener('click', function () {
      renderLightboxSlide(activeLightboxIndex + 1);
    });
  }
  if (lightboxModal) {
    lightboxModal.addEventListener('click', function (e) {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  /* ------------------------------------------------------------------------
     8. VENUE MAP MODAL
     ------------------------------------------------------------------------ */
  const venueModal = document.getElementById('venue-map-modal');
  const venueSubtitle = document.getElementById('venue-modal-subtitle');
  const btnCloseVenue = document.getElementById('btn-close-venue-modal');
  const btnCancelVenue = document.getElementById('btn-cancel-venue-modal');
  let lastVenueTrigger = null;

  document.querySelectorAll('[data-venue-modal-trigger]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      lastVenueTrigger = btn;
      if (venueSubtitle) {
        venueSubtitle.textContent = btn.getAttribute('data-venue-modal-trigger');
      }
      if (venueModal) {
        venueModal.classList.remove('hidden');
        venueModal.classList.add('flex');
      }
      if (btnCloseVenue) btnCloseVenue.focus();
    });
  });

  function closeVenueModal() {
    if (!venueModal || venueModal.classList.contains('hidden')) return;
    venueModal.classList.add('hidden');
    venueModal.classList.remove('flex');
    if (lastVenueTrigger) lastVenueTrigger.focus();
  }

  if (btnCloseVenue) btnCloseVenue.addEventListener('click', closeVenueModal);
  if (btnCancelVenue) btnCancelVenue.addEventListener('click', closeVenueModal);
  if (venueModal) {
    venueModal.addEventListener('click', function (e) {
      if (e.target === venueModal) closeVenueModal();
    });
  }

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', function (e) {
    if (lightboxModal && !lightboxModal.classList.contains('hidden')) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        renderLightboxSlide(activeLightboxIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        renderLightboxSlide(activeLightboxIndex + 1);
      }
      return;
    }
    if (venueModal && !venueModal.classList.contains('hidden') && e.key === 'Escape') {
      e.preventDefault();
      closeVenueModal();
    }
  });

  /* ------------------------------------------------------------------------
     9. RSVP CONFIRMATION WITH BACKEND / STORAGE & DUPLICATE PREVENTION
     ------------------------------------------------------------------------ */
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpNameInput = document.getElementById('rsvp-name');
  const rsvpNameError = document.getElementById('rsvp-name-error');
  const rsvpPaxWrapper = document.getElementById('rsvp-pax-wrapper');
  const rsvpDietaryWrapper = document.getElementById('rsvp-dietary-wrapper');
  const rsvpSubmitBtn = document.getElementById('btn-submit-rsvp');
  const rsvpSubmitLabel = document.getElementById('rsvp-submit-label');
  const rsvpConfirmPanel = document.getElementById('rsvp-confirmation-panel');
  const rsvpConfirmSummary = document.getElementById('rsvp-confirmation-summary');
  const btnEditRsvp = document.getElementById('btn-edit-rsvp');
  const btnRsvpWhatsApp = document.getElementById('btn-rsvp-whatsapp');

  document.querySelectorAll('input[name="attendance"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      const isAttending = radio.value === 'hadir' && radio.checked;
      if (rsvpPaxWrapper) rsvpPaxWrapper.classList.toggle('hidden', !isAttending);
      if (rsvpDietaryWrapper) rsvpDietaryWrapper.classList.toggle('hidden', !isAttending);
    });
  });

  function showRsvpConfirmedView(record) {
    if (rsvpForm) rsvpForm.classList.add('hidden');
    if (rsvpConfirmPanel) rsvpConfirmPanel.classList.remove('hidden');

    if (rsvpConfirmSummary) {
      rsvpConfirmSummary.textContent =
        record.attendance === 'hadir'
          ? 'Thank you, ' +
            record.guestName +
            '. Your attendance for ' +
            record.pax +
            ' guest(s) has been recorded.' +
            (record.dietary ? ' Note: ' + record.dietary + '.' : '')
          : 'Thank you for letting us know, ' +
            record.guestName +
            '. Your warm prayers and wishes mean the world to us.';
    }

    if (btnRsvpWhatsApp) {
      const waMessage =
        record.attendance === 'hadir'
          ? `Halo Zahra %26 Fachri, saya ${encodeURIComponent(record.guestName)} mengonfirmasi HADIR pada perayaan pernikahan kalian untuk ${record.pax} tamu. ${record.dietary ? `(Catatan: ${encodeURIComponent(record.dietary)})` : ''}`
          : `Halo Zahra %26 Fachri, saya ${encodeURIComponent(record.guestName)} mohon maaf belum dapat hadir, namun mendoakan kebahagiaan dan kelancaran untuk pernikahan kalian.`;
      btnRsvpWhatsApp.href = `https://wa.me/?text=${waMessage}`;
    }
  }

  // Restore saved RSVP if already submitted to prevent accidental duplicate submission
  const existingRsvp = safeGetStorage('srib_rsvp', null);
  if (existingRsvp && existingRsvp.guestName) {
    showRsvpConfirmedView(existingRsvp);
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (rsvpNameError) rsvpNameError.classList.add('hidden');
      if (rsvpNameInput) rsvpNameInput.removeAttribute('aria-invalid');

      const guestName = rsvpNameInput ? rsvpNameInput.value.trim() : '';
      const attendanceRadio = rsvpForm.querySelector('input[name="attendance"]:checked');
      const attendance = attendanceRadio ? attendanceRadio.value : 'hadir';
      const pax = attendance === 'hadir' ? currentStepperPax : 0;
      const dietary = document.getElementById('rsvp-dietary')?.value.trim() || '';

      if (guestName.length < 2) {
        if (rsvpNameError) {
          rsvpNameError.textContent = 'Please enter your full name (at least 2 characters).';
          rsvpNameError.classList.remove('hidden');
        }
        if (rsvpNameInput) {
          rsvpNameInput.setAttribute('aria-invalid', 'true');
          rsvpNameInput.focus();
        }
        return;
      }

      if (rsvpSubmitBtn) rsvpSubmitBtn.disabled = true;
      if (rsvpSubmitLabel) rsvpSubmitLabel.textContent = 'Saving Response...';

      const payload = {
        guestSlug: guestName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        guestName: guestName,
        attendance: attendance,
        pax: pax,
        dietary: dietary,
        dietaryNotes: dietary,
        updatedAt: new Date().toISOString(),
      };

      try {
        await submitRsvpRecord(payload);
      } catch (err) {
        // Fallback to localStorage if remote backend fails
        safeSetStorage('srib_rsvp', payload);
      }
      safeSetStorage('srib_rsvp', payload);

      if (rsvpSubmitBtn) rsvpSubmitBtn.disabled = false;
      if (rsvpSubmitLabel) rsvpSubmitLabel.textContent = 'Confirm Attendance';

      showRsvpConfirmedView(payload);
      showToast('Thank you! Your RSVP confirmation has been saved.');
    });
  }

  if (btnEditRsvp) {
    btnEditRsvp.addEventListener('click', function () {
      if (rsvpConfirmPanel) rsvpConfirmPanel.classList.add('hidden');
      if (rsvpForm) rsvpForm.classList.remove('hidden');
      if (rsvpNameInput) rsvpNameInput.focus();
    });
  }

  /* ------------------------------------------------------------------------
     10. DIGITAL GUESTBOOK STREAM (Validation, Loading, Feedback, Empty State)
     ------------------------------------------------------------------------ */
  const gbForm = document.getElementById('guestbook-form');
  const gbNameInput = document.getElementById('gb-name');
  const gbRelationInput = document.getElementById('gb-relation');
  const gbMessageInput = document.getElementById('gb-message');
  const gbNameError = document.getElementById('gb-name-error');
  const gbMessageError = document.getElementById('gb-message-error');
  const gbFeedbackBanner = document.getElementById('gb-feedback-banner');
  const gbSubmitBtn = document.getElementById('btn-submit-gb');
  const gbSubmitLabel = document.getElementById('gb-submit-label');
  const gbList = document.getElementById('guestbook-list');

  let guestbookMessages = safeGetStorage('srib_guestbook', weddingConfig.initialGuestbook);

  function renderGuestbook() {
    if (!gbList) return;
    gbList.innerHTML = '';

    if (!guestbookMessages || guestbookMessages.length === 0) {
      const emptyCard = document.createElement('div');
      emptyCard.className = 'stationery-card p-8 text-center text-xs sm:text-sm text-[#9A7078] italic font-serif';
      emptyCard.textContent = 'Be the first to leave a warm note of love and prayer for Zahra & Fachri.';
      gbList.appendChild(emptyCard);
      return;
    }

    guestbookMessages.forEach(function (entry) {
      const card = document.createElement('article');
      card.className = 'stationery-card p-5 sm:p-6 shadow-sm relative overflow-hidden';

      const header = document.createElement('div');
      header.className = 'flex items-baseline justify-between gap-2 border-b border-[#D8C37B]/45 pb-2 mb-2.5 relative z-10';

      const titleWrap = document.createElement('div');
      const author = document.createElement('h3');
      author.className = 'font-display text-base text-[#784653] font-semibold inline';
      author.textContent = entry.name;
      titleWrap.appendChild(author);

      if (entry.relation) {
        const rel = document.createElement('span');
        rel.className = 'ml-2 text-[10px] text-[#9A7078] uppercase tracking-wider font-sans';
        rel.textContent = '• ' + entry.relation;
        titleWrap.appendChild(rel);
      }

      const time = document.createElement('span');
      time.className = 'text-[11px] text-[#6B6F52] font-medium';
      time.textContent = entry.timestamp || 'Just now';

      header.appendChild(titleWrap);
      header.appendChild(time);

      const body = document.createElement('p');
      body.className = 'text-xs sm:text-sm text-[#493237] leading-relaxed font-serif italic relative z-10';
      body.textContent = '“' + entry.message + '”';

      card.appendChild(header);
      card.appendChild(body);
      gbList.appendChild(card);
    });
  }

  renderGuestbook();

  if (gbForm) {
    gbForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (gbNameError) gbNameError.classList.add('hidden');
      if (gbMessageError) gbMessageError.classList.add('hidden');
      if (gbFeedbackBanner) gbFeedbackBanner.classList.add('hidden');

      const name = gbNameInput ? gbNameInput.value.trim() : '';
      const relation = gbRelationInput ? gbRelationInput.value.trim() : '';
      const message = gbMessageInput ? gbMessageInput.value.trim() : '';

      let hasErr = false;
      if (name.length < 2) {
        if (gbNameError) {
          gbNameError.textContent = 'Please enter your name (at least 2 characters).';
          gbNameError.classList.remove('hidden');
        }
        if (gbNameInput) gbNameInput.focus();
        hasErr = true;
      }
      if (message.length < 4) {
        if (gbMessageError) {
          gbMessageError.textContent = 'Please write a message (at least 4 characters).';
          gbMessageError.classList.remove('hidden');
        }
        if (!hasErr && gbMessageInput) gbMessageInput.focus();
        hasErr = true;
      }
      if (hasErr) return;

      if (gbSubmitBtn) gbSubmitBtn.disabled = true;
      if (gbSubmitLabel) gbSubmitLabel.textContent = 'Sending Wishes...';

      setTimeout(function () {
        const newEntry = {
          id: 'gb-' + Date.now(),
          name: name,
          relation: relation,
          message: message,
          timestamp: 'Just now',
        };

        guestbookMessages = [newEntry].concat(guestbookMessages);
        safeSetStorage('srib_guestbook', guestbookMessages);
        renderGuestbook();

        if (gbMessageInput) gbMessageInput.value = '';
        if (gbSubmitBtn) gbSubmitBtn.disabled = false;
        if (gbSubmitLabel) gbSubmitLabel.textContent = 'Send Wishes';

        if (gbFeedbackBanner) {
          gbFeedbackBanner.textContent = 'Thank you! Your wishes and prayers have been added.';
          gbFeedbackBanner.className =
            'rounded-xl px-4 py-2.5 text-xs font-medium bg-[#6B6F52]/15 text-[#493237] border border-[#6B6F52]/40';
        }
        showToast('Thank you! Your note of love has been published.');
      }, 300);
    });
  }

  /* ------------------------------------------------------------------------
     11. 1-TAP COPY ACCOUNT NUMBER WITH TOAST FEEDBACK
     ------------------------------------------------------------------------ */
  function copyTextWithFallback(text, onSuccess) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard
        .writeText(text)
        .then(onSuccess)
        .catch(function () {
          fallbackExecCopy(text, onSuccess);
        });
    } else {
      fallbackExecCopy(text, onSuccess);
    }
  }

  function fallbackExecCopy(text, onSuccess) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      onSuccess();
    } catch (err) {
      showToast('Copy number manually: ' + text);
    }
  }

  document.querySelectorAll('.btn-copy-account').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const val = btn.getAttribute('data-copy-value') || '';
      const label = btn.getAttribute('data-copy-label') || 'Account number';
      const textSpan = btn.querySelector('.copy-btn-text');

      copyTextWithFallback(val, function () {
        if (textSpan) textSpan.textContent = 'Copied Successfully!';
        btn.classList.add('bg-[#6B6F52]', 'text-[#FFF9F5]', 'border-[#6B6F52]');
        showToast(label + ' copied to clipboard');

        setTimeout(function () {
          if (textSpan) textSpan.textContent = 'Copy Account Number';
          btn.classList.remove('bg-[#6B6F52]', 'text-[#FFF9F5]', 'border-[#6B6F52]');
        }, 2200);
      });
    });
  });
}
