// Romantic Editorial & Botanical Interactive Logic — Zahra & Fachri
let started = false;

export function initInvitation() {
  if (started) return; // Prevent double execution in React StrictMode
  started = true;

  /* ------------------------------------------------------------------------
     1. CENTRALIZED WEDDING CONFIGURATION OBJECT
     ------------------------------------------------------------------------ */
  const weddingConfig = {
    couple: {
      brideShort: 'Zahra',
      brideFull: 'Zahra',
      groomShort: 'Fachri',
      groomFull: 'Fachri',
    },
    weddingDateISO: '2025-06-14T16:00:00+07:00',
    timezone: 'Asia/Jakarta',
    venueName: 'The Grand Santika, Jakarta',
    guestPresets: [
      { name: 'Keluarga Besar Bpk. Wijaya', maxQuota: 2 },
      { name: 'Sahabat — Rania Putri', maxQuota: 1 },
      { name: 'Keluarga Dr. Hendra Kusuma', maxQuota: 4 },
    ],
    gallery: [
      {
        src: '/assets/editorial_couple_conservatory.jpg',
        alt: 'Potret Zahra dan Fachri berpegangan tangan di bawah tirai hijau sage dan sutra merah muda',
        caption: 'I. Conservatory Vows — Zahra & Fachri dalam nuansa klasik taman Eropa',
      },
      {
        src: '/assets/editorial_garden_table.jpg',
        alt: 'Tata meja jamuan resepsi pernikahan dengan lilin emas, bunga peony merah muda, dan kain kursi hijau sage',
        caption: 'II. Candlelit Garden Reception — Jamuan makan malam bertabur bunga peony & mawar',
      },
      {
        src: '/assets/editorial_bouquet_flatlay.jpg',
        alt: 'Buket pengantin mawar merah muda dan peony dengan pita sutra di atas kertas undangan',
        caption: 'III. Botanical Stationery Suite — Buket peony dusty pink & cetakan kertas katun',
      },
      {
        src: '/assets/opt_bow_drapery.jpg',
        alt: 'Komposisi pita besar merah muda dengan tirai hijau sage dan lilin hangat dari moodboard',
        caption: 'IV. Soft Romance in Bloom — Detail pita sutra & tirai beludru hijau sage',
      },
    ],
    initialGuestbook: [
      {
        id: 'gb-1',
        name: 'Keluarga Besar Bpk. Hendrawan',
        relation: 'Kerabat Keluarga',
        message: 'Selamat menempuh hidup baru untuk Zahra & Fachri. Semoga Allah SWT memberkahi ikatan suci pernikahan kalian dengan mawaddah dan rahmah.',
        timestamp: '18 Mei 2025',
      },
      {
        id: 'gb-2',
        name: 'Clarissa & Adi',
        relation: 'Sahabat Mempelai',
        message: 'Turut berbahagia atas pernikahan Zahra dan Fachri! Semoga senantiasa saling melengkapi dan menjadi keluarga yang sakinah.',
        timestamp: '19 Mei 2025',
      },
    ],
  };

  /* ------------------------------------------------------------------------
     2. STATE & SAFE STORAGE HELPERS
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
      rsvpQuotaPill.textContent = 'Kuota Maksimal: ' + guestObj.maxQuota + ' Tamu';
    }
    if (rsvpNameInput) rsvpNameInput.value = guestObj.name;
    if (rsvpPaxHint) {
      rsvpPaxHint.textContent =
        'Jumlah tamu dibatasi sesuai kuota personal (maksimal ' + guestObj.maxQuota + ' tamu).';
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
        showToast('Jumlah maksimal sesuai kuota personal Anda (' + activeGuestPreset.maxQuota + ' tamu).');
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. CINEMATIC CURTAIN REVEAL & OPENING AUDIO TRIGGER (600–900ms)
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
    if (btnOpenLabel) btnOpenLabel.textContent = 'Membuka Lembaran Kasih...';

    // Play elegant opening arpeggio and start gentle background melody
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
    const duration = isReduced ? 200 : 800; // 800ms within 600-900ms range

    setTimeout(function () {
      coverEl.classList.add('is-opened');
      coverEl.setAttribute('aria-hidden', 'true');
      if (btnReopenCover) btnReopenCover.classList.remove('hidden');
      
      // Smooth scroll to Scene 2 (Ayat Suci)
      const ayatSection = document.getElementById('ayat');
      if (ayatSection) {
        ayatSection.scrollIntoView({ behavior: 'smooth' });
      } else if (mainInvitationEl) {
        mainInvitationEl.focus({ preventScroll: true });
      }
    }, duration);
  }

  function reopenInvitationCover() {
    if (!coverEl) return;
    if (btnOpenLabel) btnOpenLabel.textContent = 'Ketuk Segel untuk Membuka';
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
        if (musicStatusLabel) musicStatusLabel.textContent = 'Musik: Aktif';
        if (!forceStart) showToast('Musik latar instrumental diaktifkan');
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
      if (musicStatusLabel) musicStatusLabel.textContent = 'Musik: Mati';
      showToast('Musik latar dihentikan');
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
      reducedMotionLabel.textContent = enabled ? 'Animasi: Minimal' : 'Animasi: Normal';
    }
    if (enabled) {
      document.querySelectorAll('[data-motion], .ornament-path').forEach(function (el) {
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
      showToast(nextState ? 'Mode Gerak Minimal diaktifkan' : 'Animasi editorial normal diaktifkan');
    });
  }

  // Scroll Reveals via IntersectionObserver
  const motionElements = document.querySelectorAll('[data-motion], .ornament-path');
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
      { threshold: 0.16, rootMargin: '0px 0px -40px 0px' }
    );
    motionElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    motionElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // Active Section Highlighting on Desktop Header & Mobile Dock
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const desktopNavLinks = document.querySelectorAll('.nav-anchor');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const trackedSections = ['ayat', 'kisah', 'mempelai', 'akad', 'resepsi', 'lokasi', 'ucapan', 'rsvp', 'tanda-kasih', 'closing'];

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const activeId = entry.target.id;
            desktopNavLinks.forEach(function (link) {
              const isMatch = link.getAttribute('data-nav-link') === activeId;
              link.classList.toggle('text-[#493237]', isMatch);
              link.classList.toggle('font-semibold', isMatch);
              link.classList.toggle('border-[#D8C37B]', isMatch);
            });
            mobileNavLinks.forEach(function (link) {
              const isMatch = link.getAttribute('data-nav-link') === activeId;
              link.classList.toggle('is-active', isMatch);
            });
          }
        });
      },
      { threshold: 0.25, rootMargin: '-70px 0px -45% 0px' }
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
     9. FRICTIONLESS RSVP VALIDATION & WHATSAPP ACTION
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

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
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
          rsvpNameError.textContent = 'Mohon isi nama lengkap Anda (minimal 2 karakter).';
          rsvpNameError.classList.remove('hidden');
        }
        if (rsvpNameInput) {
          rsvpNameInput.setAttribute('aria-invalid', 'true');
          rsvpNameInput.focus();
        }
        return;
      }

      // Process RSVP
      if (rsvpSubmitBtn) rsvpSubmitBtn.disabled = true;
      if (rsvpSubmitLabel) rsvpSubmitLabel.textContent = 'Menyimpan Konfirmasi...';

      setTimeout(function () {
        const payload = {
          guestName: guestName,
          attendance: attendance,
          pax: pax,
          dietary: dietary,
          updatedAt: new Date().toISOString(),
        };
        safeSetStorage('srib_rsvp', payload);

        if (rsvpSubmitBtn) rsvpSubmitBtn.disabled = false;
        if (rsvpSubmitLabel) rsvpSubmitLabel.textContent = 'Kirim Konfirmasi';

        if (rsvpForm) rsvpForm.classList.add('hidden');
        if (rsvpConfirmPanel) rsvpConfirmPanel.classList.remove('hidden');

        if (rsvpConfirmSummary) {
          rsvpConfirmSummary.textContent =
            attendance === 'hadir'
              ? 'Terima kasih ' +
              guestName +
              '. Konfirmasi kehadiran untuk ' +
              pax +
              ' orang tamu telah berhasil kami catat.' +
              (dietary ? ' Catatan: ' + dietary + '.' : '')
              : 'Terima kasih atas kabar dari ' +
              guestName +
              '. Doa restu dan ketulusan Anda sangat berarti bagi kami.';
        }

        // Generate Pre-Filled WhatsApp Confirmation Link for Zahra & Fachri
        if (btnRsvpWhatsApp) {
          const waMessage =
            attendance === 'hadir'
              ? `Halo Zahra %26 Fachri, saya ${encodeURIComponent(guestName)} mengonfirmasi HADIR pada perayaan pernikahan kalian untuk ${pax} tamu. ${dietary ? `(Catatan: ${encodeURIComponent(dietary)})` : ''}`
              : `Halo Zahra %26 Fachri, saya ${encodeURIComponent(guestName)} berhalangan hadir namun mendoakan kebahagiaan dan kelancaran untuk pernikahan kalian.`;
          btnRsvpWhatsApp.href = `https://wa.me/?text=${waMessage}`;
        }

        showToast('Terima kasih, konfirmasi kehadiran Anda berhasil disimpan.');
      }, 400);
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
     10. DIGITAL GUESTBOOK STREAM
     ------------------------------------------------------------------------ */
  const gbForm = document.getElementById('guestbook-form');
  const gbNameInput = document.getElementById('gb-name');
  const gbRelationInput = document.getElementById('gb-relation');
  const gbMessageInput = document.getElementById('gb-message');
  const gbNameError = document.getElementById('gb-name-error');
  const gbMessageError = document.getElementById('gb-message-error');
  const gbList = document.getElementById('guestbook-list');

  let guestbookMessages = safeGetStorage('srib_guestbook', weddingConfig.initialGuestbook);

  function renderGuestbook() {
    if (!gbList) return;
    gbList.innerHTML = '';
    guestbookMessages.forEach(function (entry) {
      const card = document.createElement('article');
      card.className = 'stationery-card p-5 sm:p-6 shadow-sm';

      const header = document.createElement('div');
      header.className = 'flex items-baseline justify-between gap-2 border-b border-[#493237]/10 pb-2 mb-2.5';

      const titleWrap = document.createElement('div');
      const author = document.createElement('h3');
      author.className = 'font-display text-base text-[#493237] font-medium inline';
      author.textContent = entry.name;
      titleWrap.appendChild(author);

      if (entry.relation) {
        const rel = document.createElement('span');
        rel.className = 'ml-2 text-[11px] text-[#9A7078] uppercase tracking-wider font-sans';
        rel.textContent = '• ' + entry.relation;
        titleWrap.appendChild(rel);
      }

      const time = document.createElement('span');
      time.className = 'text-[11px] text-[#6B6F52]';
      time.textContent = entry.timestamp || 'Baru saja';

      header.appendChild(titleWrap);
      header.appendChild(time);

      const body = document.createElement('p');
      body.className = 'text-xs sm:text-sm text-[#493237]/90 leading-relaxed font-serif italic';
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

      const name = gbNameInput ? gbNameInput.value.trim() : '';
      const relation = gbRelationInput ? gbRelationInput.value.trim() : '';
      const message = gbMessageInput ? gbMessageInput.value.trim() : '';

      let hasErr = false;
      if (name.length < 2) {
        if (gbNameError) {
          gbNameError.textContent = 'Mohon cantumkan nama Anda.';
          gbNameError.classList.remove('hidden');
        }
        if (gbNameInput) gbNameInput.focus();
        hasErr = true;
      }
      if (message.length < 4) {
        if (gbMessageError) {
          gbMessageError.textContent = 'Mohon tuliskan ucapan minimal 4 karakter.';
          gbMessageError.classList.remove('hidden');
        }
        if (!hasErr && gbMessageInput) gbMessageInput.focus();
        hasErr = true;
      }
      if (hasErr) return;

      const newEntry = {
        id: 'gb-' + Date.now(),
        name: name,
        relation: relation,
        message: message,
        timestamp: 'Baru saja',
      };

      guestbookMessages = [newEntry].concat(guestbookMessages);
      safeSetStorage('srib_guestbook', guestbookMessages);
      renderGuestbook();

      gbForm.reset();
      showToast('Terima kasih, untaian doa Anda telah ditambahkan');
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
      showToast('Salin manual nomor: ' + text);
    }
  }

  document.querySelectorAll('.btn-copy-account').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const val = btn.getAttribute('data-copy-value') || '';
      const label = btn.getAttribute('data-copy-label') || 'Nomor rekening';
      const textSpan = btn.querySelector('.copy-btn-text');

      copyTextWithFallback(val, function () {
        if (textSpan) textSpan.textContent = 'Nomor Berhasil Disalin';
        btn.classList.add('bg-[#6B6F52]', 'text-[#FAF6F0]', 'border-[#6B6F52]');
        showToast(label + ' berhasil disalin ke clipboard');

        setTimeout(function () {
          if (textSpan) textSpan.textContent = 'Salin Nomor Rekening';
          btn.classList.remove('bg-[#6B6F52]', 'text-[#FAF6F0]', 'border-[#6B6F52]');
        }, 2200);
      });
    });
  });
}
