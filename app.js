/* ==========================================================================
   APP.JS — LOGIQUE INTERACTIVE & EXPÉRIENCE ROMANTIQUE HAUT DE GAMME
   Auteur : Antigravity UI/UX Senior Full-Stack
   ========================================================================== */

(function () {
  'use strict';

  // État global complet de l'application
  const state = {
    herName: '',
    placeId: '',
    placeTitle: '',
    customPlace: '',
    foods: new Set(),
    customFood: '',
    extras: new Set(),
    moment: '',
    date: '',
    customNote: '',
    quizAnswers: {},
    unlockedSurprises: new Set(),
    confidences: {},
    currentStepId: 'step-1',
    escapeCount: 0,
    soundEnabled: true,
    musicPlaying: false,
    musicVolume: 0.3,
    complimentIdx: 0,
    whatsappNumber: (window.APP_CONFIG && window.APP_CONFIG.whatsappNumber) || '237655752004'
  };

  // 22 Compliments doux, drôles, chaleureux et raffinés
  const complimentsList = [
    "Ton sourire mérite probablement son propre réseau social.",
    "Je pense que même Google aurait du mal à trouver quelqu'un comme toi.",
    "Tu as quelque chose de spécial, et je ne parle pas de ton Wi-Fi. 😂",
    "Certaines rencontres méritent qu'on prenne le temps de les découvrir.",
    "Si la gentillesse était une matière à la fac, tu aurais 20/20 avec mention.",
    "Tu as cette énergie rare qui rend n'importe quelle journée plus lumineuse.",
    "Même le café le plus fort ne réveille pas autant que de croiser ton regard.",
    "Il y a des gens qu'on croise et d'autres qu'on a envie de connaître pour de vrai.",
    "Ton rire devrait être remboursé par la sécurité sociale tellement il fait du bien.",
    "Tu as un charme naturel, sans filtre et sans aucun effort.",
    "Je me demande souvent comment tu fais pour être aussi captivante sans même essayer.",
    "La faculté a beaucoup plus de style depuis que tu y passes.",
    "Tu es le genre de personne avec qui 5 minutes de discussion passent comme 2 secondes.",
    "Si la beauté était un délit, tu passerais en comparution immédiate. 😇",
    "Tu as une façon d'être qui donne immédiatement envie d'en savoir plus sur toi.",
    "Si j'avais un vœu pour cette semaine, ce serait simplement de partager un fou rire avec toi.",
    "Tu as cette étincelle dans les yeux qui ne s'invente pas.",
    "On ne se connaît pas encore beaucoup, mais mon intuition ne se trompe jamais sur les personnes rares.",
    "Passer du temps avec toi promet d'être le meilleur moment de ma semaine.",
    "Tu es la preuve vivante qu'il existe encore des personnes exceptionnelles.",
    "Tu as ce petit truc en plus qui fait toute la différence. ✨",
    "Promis, je serai sage… mais je ne garantis rien si tu me souris comme ça ! 😉"
  ];

  // Messages taquins lorsque le bouton "Non" s'enfuit
  const escapeMessages = [
    "Oups, le bouton a glissé ! 🙈",
    "Bien tenté, mais non ! 😜",
    "Erreur 404 : Le 'Non' est introuvable ❤️",
    "Tu es sûre ? Regarde le bouton 'Oui' comme il est beau ✨",
    "Allez, dis oui… 🥺❤️",
    "Impossible d'appuyer ici, c'est le destin ! 😇",
    "Ce bouton est réservé aux personnes sans goût 😉",
    "Réessaie encore pour voir… 🤭"
  ];

  // Surprises disponibles
  const surprisesData = {
    1: "Une glace offerte pendant notre rendez-vous. 🍦",
    2: "Le droit de choisir notre prochaine destination. 🌍",
    3: "Une surprise que je préfère te révéler en personne. 🤫❤️"
  };

  // ==========================================================================
  // SYSTÈME AUDIO & SONS DOUX (Web Audio API)
  // ==========================================================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration, type = 'sine', gainVal = 0.15) {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playTone error", e);
    }
  }

  function playChime() {
    playTone(523.25, 0.25, 'triangle', 0.12);
    setTimeout(() => playTone(659.25, 0.35, 'sine', 0.1), 110);
  }

  function playEscapeSound() {
    playTone(320, 0.1, 'sine', 0.15);
    setTimeout(() => playTone(480, 0.15, 'triangle', 0.12), 60);
  }

  function playCelebrationFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 0.45, 'sine', 0.16);
      }, idx * 110);
    });
  }

  // ==========================================================================
  // LECTEUR MUSICAL DISCRET (Synthèse Lo-Fi / Piano Romantique Doux)
  // ==========================================================================
  let musicMasterGain = null;
  let musicInterval = null;

  const romanticChords = [
    // Fmaj9
    [174.61, 261.63, 329.63, 392.00, 440.00],
    // Dmin9
    [146.83, 220.00, 261.63, 329.63, 349.23],
    // Bbmaj7
    [116.54, 174.61, 220.00, 293.66, 349.23],
    // C9
    [130.81, 196.00, 246.94, 293.66, 392.00]
  ];

  let chordIndex = 0;

  function startMusicLoop() {
    if (!audioCtx) initAudio();
    if (!audioCtx) return;

    if (!musicMasterGain) {
      musicMasterGain = audioCtx.createGain();
      musicMasterGain.gain.setValueAtTime(state.musicVolume, audioCtx.currentTime);
      musicMasterGain.connect(audioCtx.destination);
    }

    function playArpeggio() {
      if (!state.musicPlaying) return;
      const currentChord = romanticChords[chordIndex % romanticChords.length];
      chordIndex++;

      currentChord.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, audioCtx.currentTime);

        const startTime = audioCtx.currentTime + i * 0.45;
        const dur = 2.4;

        noteGain.gain.setValueAtTime(0.001, startTime);
        noteGain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.12);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(musicMasterGain);

        osc.start(startTime);
        osc.stop(startTime + dur);
      });
    }

    playArpeggio();
    musicInterval = setInterval(() => {
      if (state.musicPlaying) {
        playArpeggio();
      }
    }, 2400);
  }

  function stopMusicLoop() {
    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
  }

  function setupMusicPlayer() {
    const toggleBtn = document.getElementById('music-toggle-btn');
    const volumeSlider = document.getElementById('music-volume');
    const musicIcon = document.getElementById('music-icon');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        initAudio();
        state.musicPlaying = !state.musicPlaying;

        if (state.musicPlaying) {
          toggleBtn.classList.add('playing');
          if (musicIcon) musicIcon.textContent = '⏸️';
          startMusicLoop();
        } else {
          toggleBtn.classList.remove('playing');
          if (musicIcon) musicIcon.textContent = '🎵';
          stopMusicLoop();
        }
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        state.musicVolume = parseFloat(e.target.value);
        if (musicMasterGain && audioCtx) {
          musicMasterGain.gain.setValueAtTime(state.musicVolume, audioCtx.currentTime);
        }
      });
    }
  }

  // ==========================================================================
  // DOSE DE COMPLIMENTS (MODALE & PARCOURS)
  // ==========================================================================
  function setupCompliments() {
    const openBtn = document.getElementById('open-compliments-btn');
    const modal = document.getElementById('compliments-modal');
    const closeBtn = document.getElementById('close-compliments-btn');
    const closeSubBtn = document.getElementById('btn-close-compliments-sub');
    const nextBtn = document.getElementById('btn-next-compliment');
    const displayEl = document.getElementById('compliment-text-display');
    const counterEl = document.getElementById('compliment-counter-text');

    function renderCompliment() {
      if (!displayEl) return;
      let text = complimentsList[state.complimentIdx % complimentsList.length];
      if (state.herName) {
        text = text.replace(/\[Prénom\]/g, state.herName);
      } else {
        text = text.replace(/\[Prénom\]/g, '');
      }
      displayEl.textContent = `« ${text} »`;
      if (counterEl) {
        counterEl.textContent = `Compliment ${(state.complimentIdx % complimentsList.length) + 1} sur ${complimentsList.length}`;
      }
      playTone(580, 0.15, 'sine', 0.08);
    }

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        renderCompliment();
        modal.classList.add('show');
      });
    }

    const closeModal = () => {
      if (modal) modal.classList.remove('show');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeSubBtn) closeSubBtn.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        state.complimentIdx++;
        renderCompliment();
        fireRomanticConfetti(35);
      });
    }
  }

  // ==========================================================================
  // CANVAS AMBIENT (Cœurs & Étincelles Flottants)
  // ==========================================================================
  function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class HeartParticle {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 20;
        this.size = Math.random() * 14 + 10;
        this.speedY = Math.random() * 0.75 + 0.35;
        this.speedX = (Math.random() - 0.5) * 0.45;
        this.opacity = Math.random() * 0.35 + 0.12;
        this.rotation = Math.random() * Math.PI;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.isSparkle = Math.random() > 0.65;
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
        this.rotation += this.rotSpeed;
        if (this.y < -30) {
          this.reset(false);
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        if (this.isSparkle) {
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#E11D48';
          const s = this.size;
          ctx.beginPath();
          ctx.moveTo(0, s * 0.3);
          ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.1, 0, s);
          ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.3, 0, s * 0.3);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const count = Math.min(26, Math.floor(window.innerWidth / 32));
    for (let i = 0; i < count; i++) {
      particles.push(new HeartParticle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let p of particles) {
        p.update();
        p.draw();
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ==========================================================================
  // CONFETTI ROMANTIQUE
  // ==========================================================================
  function fireRomanticConfetti(customCount = 180) {
    if (typeof confetti !== 'function') return;

    confetti({
      particleCount: customCount,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#E11D48', '#BE123C', '#F43F5E', '#FECDD3', '#F59E0B']
    });
  }

  // ==========================================================================
  // GESTIONNAIRE D'ÉTAPES & PROGRESSION
  // ==========================================================================
  const stepsMetadata = {
    'step-1': { title: 'Bienvenue', percent: 10 },
    'step-secret-message': { title: 'Message secret', percent: 20 },
    'step-2': { title: 'La Question', percent: 35 },
    'step-quiz': { title: 'Test complice', percent: 45 },
    'step-3': { title: 'Le Lieu', percent: 60 },
    'step-4': { title: 'Le Repas', percent: 75 },
    'step-surprises': { title: 'Surprises', percent: 85 },
    'step-5': { title: 'Les Petits Plus', percent: 90 },
    'step-confidences': { title: 'Confidences', percent: 94 },
    'step-letter': { title: 'Mots Doux', percent: 97 },
    'step-6': { title: 'L’Invitation', percent: 100 }
  };

  function goToStep(stepId) {
    const prevEl = document.getElementById(state.currentStepId);
    const nextEl = document.getElementById(stepId);

    if (prevEl) prevEl.classList.remove('active');

    state.currentStepId = stepId;

    if (nextEl) {
      nextEl.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateProgress();
    playChime();
  }

  function updateProgress() {
    const progressContainer = document.getElementById('progress-container');
    const fillEl = document.getElementById('progress-fill');
    const stepTextEl = document.getElementById('progress-step-text');
    const badgeEl = document.getElementById('progress-percent-badge');

    if (state.currentStepId === 'step-1') {
      if (progressContainer) progressContainer.style.display = 'none';
      return;
    }

    if (progressContainer) progressContainer.style.display = 'block';

    const info = stepsMetadata[state.currentStepId] || { title: '', percent: 100 };
    if (fillEl) fillEl.style.width = `${info.percent}%`;
    if (stepTextEl) stepTextEl.textContent = info.title;
    if (badgeEl) badgeEl.textContent = `${info.percent}%`;
  }

  // ==========================================================================
  // ÉTAPE 1 : PRÉNOM
  // ==========================================================================
  function submitName() {
    const input = document.getElementById('her-name-input');
    if (!input) return;

    let val = input.value.trim();
    if (!val) {
      input.focus();
      return;
    }

    val = val.charAt(0).toUpperCase() + val.slice(1);
    state.herName = val;

    document.querySelectorAll('.user-name-target').forEach(el => {
      el.textContent = val;
    });

    // Passer au message secret de l'enveloppe
    goToStep('step-secret-message');
  }

  // ==========================================================================
  // ÉTAPE 1-B : MESSAGE SECRET PERSONNALISÉ
  // ==========================================================================
  function setupSecretEnvelope() {
    const trigger = document.getElementById('secret-envelope-trigger');
    const envelopeEl = document.getElementById('secret-envelope-el');
    const hint = document.getElementById('envelope-click-hint');
    const btnOpen = document.getElementById('btn-open-envelope');

    if (!trigger || !envelopeEl) return;

    trigger.addEventListener('click', () => {
      if (!envelopeEl.classList.contains('opened')) {
        envelopeEl.classList.add('opened');
        if (hint) hint.style.display = 'none';
        if (btnOpen) btnOpen.style.display = 'inline-flex';

        playCelebrationFanfare();
        fireRomanticConfetti(60);
      }
    });

    if (btnOpen) {
      btnOpen.addEventListener('click', () => {
        goToStep('step-2');
      });
    }
  }

  // ==========================================================================
  // ÉTAPE 2 : LA QUESTION (OUI / NON FUGITIF)
  // ==========================================================================
  function setupEvasiveButton() {
    const btnNo = document.getElementById('btn-no');
    const arena = document.getElementById('arena-actions');
    const toast = document.getElementById('escape-toast');

    if (!btnNo || !arena) return;
    let toastTimeout = null;

    function showToast() {
      if (!toast) return;
      const msg = escapeMessages[state.escapeCount % escapeMessages.length];
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 2000);
    }

    function dodge(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      state.escapeCount++;
      playEscapeSound();
      showToast();

      const maxRangeX = Math.min(160, window.innerWidth * 0.35);
      const maxRangeY = 60;
      const angle = Math.random() * Math.PI * 2;
      const distanceX = (Math.cos(angle) * maxRangeX) * (Math.random() * 0.5 + 0.6);
      const distanceY = (Math.sin(angle) * maxRangeY) * (Math.random() * 0.5 + 0.6);

      btnNo.style.transform = `translate(${distanceX}px, ${distanceY}px)`;
    }

    btnNo.addEventListener('mouseenter', dodge);
    btnNo.addEventListener('mouseover', dodge);
    btnNo.addEventListener('touchstart', dodge, { passive: false });
    btnNo.addEventListener('pointerdown', dodge, { passive: false });
    btnNo.addEventListener('click', dodge);
  }

  function onYesClicked() {
    playCelebrationFanfare();
    fireRomanticConfetti(150);

    const overlay = document.getElementById('celebration-overlay');
    if (overlay) overlay.classList.add('show');

    setTimeout(() => {
      if (overlay) overlay.classList.remove('show');
      goToStep('step-quiz');
    }, 2200);
  }

  // ==========================================================================
  // ÉTAPE 2-B : MINI-JEU TEST DE COMPATIBILITÉ
  // ==========================================================================
  function setupQuiz() {
    const quizBoxes = document.querySelectorAll('.quiz-question-box');
    const resultCard = document.getElementById('quiz-result-card');
    const btnContinue = document.getElementById('btn-continue-quiz');
    const btnSkip = document.getElementById('btn-skip-quiz');

    quizBoxes.forEach(box => {
      const qNum = box.getAttribute('data-q');
      const buttons = box.querySelectorAll('.quiz-option-btn');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          state.quizAnswers[qNum] = btn.getAttribute('data-val');

          playTone(600, 0.1, 'sine', 0.08);

          // Si les 5 questions sont complétées
          if (Object.keys(state.quizAnswers).length >= 5) {
            if (resultCard) resultCard.style.display = 'block';
            if (btnContinue) btnContinue.disabled = false;
            fireRomanticConfetti(70);
            playCelebrationFanfare();
          }
        });
      });
    });

    if (btnSkip) {
      btnSkip.addEventListener('click', () => {
        goToStep('step-3');
      });
    }

    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        goToStep('step-3');
      });
    }
  }

  // ==========================================================================
  // ÉTAPE 3 : LIEU DU RENDEZ-VOUS
  // ==========================================================================
  function setupPlaces() {
    const grid = document.getElementById('places-grid');
    const customBox = document.getElementById('custom-place-box');
    const customInput = document.getElementById('custom-place-input');
    const btnContinue = document.getElementById('btn-continue-step-3');
    const btnBack = document.getElementById('btn-back-step-3');

    if (!grid) return;

    grid.querySelectorAll('.choice-card').forEach(card => {
      card.addEventListener('click', () => {
        grid.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        state.placeId = card.getAttribute('data-id');
        state.placeTitle = card.getAttribute('data-title');

        if (state.placeId === 'autre') {
          if (customBox) customBox.classList.add('show');
          if (customInput) customInput.focus();
        } else {
          if (customBox) customBox.classList.remove('show');
        }

        if (btnContinue) btnContinue.disabled = false;
        playTone(600, 0.15, 'sine', 0.08);
      });
    });

    if (customInput) {
      customInput.addEventListener('input', () => {
        state.customPlace = customInput.value.trim();
      });
    }

    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        goToStep('step-4');
      });
    }

    if (btnBack) {
      btnBack.addEventListener('click', () => goToStep('step-quiz'));
    }
  }

  // ==========================================================================
  // ÉTAPE 4 : NOURRITURE
  // ==========================================================================
  function setupFood() {
    const grid = document.getElementById('food-grid');
    const customInput = document.getElementById('custom-food-input');
    const btnContinue = document.getElementById('btn-continue-step-4');
    const btnBack = document.getElementById('btn-back-step-4');

    if (!grid) return;

    function checkFoodValidity() {
      const hasSelection = state.foods.size > 0 || (state.customFood && state.customFood.length > 0);
      if (btnContinue) btnContinue.disabled = !hasSelection;
    }

    grid.querySelectorAll('.choice-card').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.getAttribute('data-title');

        if (state.foods.has(title)) {
          state.foods.delete(title);
          card.classList.remove('selected');
        } else {
          state.foods.add(title);
          card.classList.add('selected');
          playTone(680, 0.12, 'sine', 0.07);
        }

        checkFoodValidity();
      });
    });

    if (customInput) {
      customInput.addEventListener('input', () => {
        state.customFood = customInput.value.trim();
        checkFoodValidity();
      });
    }

    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        goToStep('step-surprises');
      });
    }

    if (btnBack) {
      btnBack.addEventListener('click', () => goToStep('step-3'));
    }
  }

  // ==========================================================================
  // ÉTAPE 4-B : LA BOÎTE À SURPRISES
  // ==========================================================================
  function setupSurprises() {
    const cards = document.querySelectorAll('.gift-box-card');
    const btnContinue = document.getElementById('btn-continue-surprises');
    const btnBack = document.getElementById('btn-back-step-surprises');

    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        card.classList.add('opened');

        const rewardText = surprisesData[id];
        if (rewardText) {
          state.unlockedSurprises.add(rewardText);
        }

        playCelebrationFanfare();
        fireRomanticConfetti(50);
      });
    });

    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        goToStep('step-5');
      });
    }

    if (btnBack) {
      btnBack.addEventListener('click', () => goToStep('step-4'));
    }
  }

  // ==========================================================================
  // ÉTAPE 5 : LES PETITS PLUS & DATE
  // ==========================================================================
  function setupExtras() {
    const extrasList = document.getElementById('extras-list');
    const momentPills = document.getElementById('moment-pills');
    const dateInput = document.getElementById('date-picker-input');
    const noteInput = document.getElementById('custom-note-input');
    const btnContinue = document.getElementById('btn-continue-step-5');
    const btnBack = document.getElementById('btn-back-step-5');

    if (dateInput) {
      dateInput.min = new Date().toISOString().split('T')[0];
      dateInput.addEventListener('change', () => {
        state.date = dateInput.value;
      });
    }

    if (extrasList) {
      extrasList.querySelectorAll('.extra-item').forEach(item => {
        item.addEventListener('click', () => {
          const label = item.querySelector('.extra-label').textContent.trim();
          if (state.extras.has(label)) {
            state.extras.delete(label);
            item.classList.remove('selected');
          } else {
            state.extras.add(label);
            item.classList.add('selected');
            playTone(720, 0.1, 'sine', 0.08);
          }
        });
      });
    }

    if (momentPills) {
      momentPills.querySelectorAll('.moment-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          momentPills.querySelectorAll('.moment-pill').forEach(p => p.classList.remove('selected'));
          pill.classList.add('selected');
          state.moment = pill.getAttribute('data-moment');
          playTone(650, 0.1, 'sine', 0.08);
        });
      });
    }

    if (noteInput) {
      noteInput.addEventListener('input', () => {
        state.customNote = noteInput.value.trim();
      });
    }

    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        goToStep('step-confidences');
      });
    }

    if (btnBack) {
      btnBack.addEventListener('click', () => goToStep('step-surprises'));
    }
  }

  // ==========================================================================
  // ÉTAPE 5-B : ESPACE DE CONFIDENCES (FACULTATIF)
  // ==========================================================================
  function setupConfidences() {
    const btnSkip = document.getElementById('btn-skip-confidences');
    const btnContinue = document.getElementById('btn-continue-confidences');
    const btnBack = document.getElementById('btn-back-step-5');

    function saveConfidences() {
      state.confidences.smile = document.getElementById('conf-smile')?.value.trim() || '';
      state.confidences.pleasure = document.getElementById('conf-pleasure')?.value.trim() || '';
      state.confidences.dreamPlace = document.getElementById('conf-dream-place')?.value.trim() || '';
      state.confidences.dateDef = document.getElementById('conf-date-def')?.value.trim() || '';
      state.confidences.attention = document.getElementById('conf-attention')?.value.trim() || '';
    }

    if (btnSkip) {
      btnSkip.addEventListener('click', () => {
        goToStep('step-letter');
      });
    }

    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        saveConfidences();
        goToStep('step-letter');
      });
    }
  }

  // ==========================================================================
  // ÉTAPE 5-C : LETTRE ROMANTIQUE FINALE
  // ==========================================================================
  function setupLetter() {
    const btnContinue = document.getElementById('btn-continue-letter');
    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        populateRecap();
        goToStep('step-6');
      });
    }
  }

  // ==========================================================================
  // ÉTAPE 6 : RÉCAPITULATIF FINAL & WHATSAPP
  // ==========================================================================
  function populateRecap() {
    const nameEl = document.getElementById('recap-name');
    const placeEl = document.getElementById('recap-place');
    const foodEl = document.getElementById('recap-food');
    const extrasEl = document.getElementById('recap-extras');
    const datetimeEl = document.getElementById('recap-datetime');
    const messageEl = document.getElementById('recap-message');

    if (nameEl) nameEl.textContent = state.herName || 'Non précisé';

    let finalPlace = state.placeTitle || 'Surprise';
    if (state.placeId === 'autre' && state.customPlace) {
      finalPlace = `${state.customPlace} ✨`;
    }
    if (placeEl) placeEl.textContent = finalPlace;

    const foodArr = Array.from(state.foods);
    if (state.customFood) foodArr.push(state.customFood);
    if (foodEl) foodEl.textContent = foodArr.length > 0 ? foodArr.join(', ') : 'Au gré de nos envies 😋';

    const extrasArr = Array.from(state.extras);
    if (extrasEl) extrasEl.textContent = extrasArr.length > 0 ? extrasArr.join(' • ') : 'Juste nous deux ❤️';

    let dt = [];
    if (state.date) {
      try {
        const dObj = new Date(state.date + 'T12:00:00');
        const formattedDate = dObj.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        });
        dt.push(formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1));
      } catch (e) {
        dt.push(state.date);
      }
    }
    if (state.moment) dt.push(`(${state.moment})`);
    if (datetimeEl) datetimeEl.textContent = dt.length > 0 ? dt.join(' ') : 'À définir ensemble 😊';

    if (messageEl) {
      messageEl.textContent = state.customNote || '« Rendez-vous très bientôt ! »';
    }
  }

  function generateWhatsAppText() {
    let finalPlace = state.placeTitle || 'Une belle surprise';
    if (state.placeId === 'autre' && state.customPlace) {
      finalPlace = state.customPlace;
    }

    const foodArr = Array.from(state.foods);
    if (state.customFood) foodArr.push(state.customFood);
    const finalFood = foodArr.length > 0 ? foodArr.join(', ') : 'Ce que tu choisiras';

    const extrasArr = Array.from(state.extras);
    const finalExtras = extrasArr.length > 0 ? extrasArr.join(', ') : 'Juste ta compagnie';

    let dt = [];
    if (state.date) {
      try {
        const dObj = new Date(state.date + 'T12:00:00');
        dt.push(dObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }));
      } catch (e) {
        dt.push(state.date);
      }
    }
    if (state.moment) dt.push(`(${state.moment})`);
    const finalDateTime = dt.length > 0 ? dt.join(' ') : 'À convenir ensemble';

    // Ajout des surprises débloquées
    let surprisesSection = '';
    if (state.unlockedSurprises.size > 0) {
      surprisesSection = `\n🎁 Mes surprises débloquées : ${Array.from(state.unlockedSurprises).join(' | ')}`;
    }

    // Ajout des confidences si remplies
    let confSection = '';
    const answeredConf = [];
    if (state.confidences.smile) answeredConf.push(`Sourire : ${state.confidences.smile}`);
    if (state.confidences.pleasure) answeredConf.push(`Plaisir : ${state.confidences.pleasure}`);
    if (state.confidences.dreamPlace) answeredConf.push(`Rêve : ${state.confidences.dreamPlace}`);
    if (answeredConf.length > 0) {
      confSection = `\n💬 Mes confidences : ${answeredConf.join(' • ')}`;
    }

    const text = 
`Coucou ! ❤️

J'ai répondu à ton invitation !

Mon prénom : ${state.herName || 'Moi'}
Lieu choisi : ${finalPlace}
Ce que j'aimerais manger : ${finalFood}
Mes petits extras : ${finalExtras}${surprisesSection}${confSection}
Date souhaitée : ${finalDateTime}
Mon message : ${state.customNote || 'Rendez-vous bientôt ! 😊'}

J'attends notre rendez-vous avec impatience ! 😊✨`;

    return text;
  }

  function formatWhatsAppNumber(num) {
    let cleaned = (num || '').replace(/[^0-9]/g, '');
    // Si c'est un numéro à 9 chiffres commençant par 6 (format Cameroun ex: 655752004)
    if (cleaned.length === 9 && cleaned.startsWith('6')) {
      cleaned = '237' + cleaned;
    }
    return cleaned;
  }

  function sendWhatsApp() {
    const rawNumber = formatWhatsAppNumber(state.whatsappNumber);
    const message = generateWhatsAppText();
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${rawNumber}?text=${encoded}`;

    fireRomanticConfetti(220);
    playCelebrationFanfare();

    const overlay = document.getElementById('celebration-overlay');
    const titleEl = document.getElementById('celebration-title');
    const descEl = document.getElementById('celebration-desc');
    const emojiEl = document.getElementById('celebration-emoji');

    if (titleEl) titleEl.textContent = "Invitation prête à être envoyée ❤️";
    if (descEl) descEl.textContent = "WhatsApp s'est ouvert pour transmettre tes réponses… J'ai hâte de te voir !";
    if (emojiEl) emojiEl.textContent = "💌✨";
    if (overlay) overlay.classList.add('show');

    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 700);

    setTimeout(() => {
      if (overlay) overlay.classList.remove('show');
    }, 4500);
  }

  function copySummaryToClipboard() {
    const message = generateWhatsAppText();
    const btn = document.getElementById('btn-copy-summary');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message).then(() => {
        if (btn) {
          const original = btn.innerHTML;
          btn.innerHTML = '<span>Copié dans le presse-papier ! ✨</span>';
          setTimeout(() => {
            btn.innerHTML = original;
          }, 2500);
        }
      });
    }
  }

  // ==========================================================================
  // MODALE : REVOIR LES SURPRISES DÉBLOQUÉES
  // ==========================================================================
  function setupSurprisesReviewModal() {
    const btnReview = document.getElementById('btn-review-surprises');
    const modal = document.getElementById('surprises-review-modal');
    const closeBtn = document.getElementById('close-surprises-modal-btn');
    const actionBtn = document.getElementById('close-surprises-modal-action');
    const listEl = document.getElementById('surprises-unlocked-list');

    function openModal() {
      if (!listEl) return;
      listEl.innerHTML = '';

      if (state.unlockedSurprises.size === 0) {
        listEl.innerHTML = `
          <div style="padding: 12px; background: #FFF1F2; border-radius: 12px; font-size: 0.9rem; color: var(--rose-velvet);">
            Toutes les boîtes à surprises t'attendent ! (Une glace offerte 🍦, le choix de destination 🌍, et un cadeau mystère 🤫❤️).
          </div>
        `;
      } else {
        state.unlockedSurprises.forEach(surp => {
          const div = document.createElement('div');
          div.style.cssText = 'padding: 12px 14px; background: #FFF7F8; border-radius: 12px; border: 1px solid #FDA4AF; font-size: 0.92rem; font-weight: 600; color: var(--rose-velvet);';
          div.textContent = `✨ ${surp}`;
          listEl.appendChild(div);
        });
      }

      if (modal) modal.classList.add('show');
    }

    const closeModal = () => {
      if (modal) modal.classList.remove('show');
    };

    if (btnReview) btnReview.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (actionBtn) actionBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }
  }

  // ==========================================================================
  // MODALE CONFIGURATION WHATSAPP
  // ==========================================================================
  function setupConfigModal() {
    const openBtn = document.getElementById('open-config-btn');
    const closeBtn = document.getElementById('close-config-btn');
    const modal = document.getElementById('config-modal');
    const saveBtn = document.getElementById('cfg-save-btn');
    const input = document.getElementById('cfg-whatsapp-input');

    const saved = localStorage.getItem('romantic_wa_number');
    if (saved && saved !== '33612345678') {
      state.whatsappNumber = saved;
    } else {
      state.whatsappNumber = (window.APP_CONFIG && window.APP_CONFIG.whatsappNumber) || '237655752004';
      localStorage.setItem('romantic_wa_number', state.whatsappNumber);
    }
    if (input) input.value = state.whatsappNumber;

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        if (input) input.value = state.whatsappNumber;
        modal.classList.add('show');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
      });
    }

    if (saveBtn && input && modal) {
      saveBtn.addEventListener('click', () => {
        let val = input.value.trim().replace(/[^0-9]/g, '');
        if (val.length === 9 && val.startsWith('6')) {
          val = '237' + val;
        }
        if (val.length >= 7) {
          state.whatsappNumber = val;
          localStorage.setItem('romantic_wa_number', val);
          modal.classList.remove('show');
          playTone(800, 0.2, 'sine', 0.1);
        } else {
          alert('Veuillez entrer un numéro valide (ex: 655752004 ou 237655752004)');
        }
      });
    }
  }

  // ==========================================================================
  // TOGGLE SONS BRUITAGES
  // ==========================================================================
  function setupAudioToggle() {
    const btn = document.getElementById('audio-toggle-btn');
    const onIcon = document.getElementById('sound-on-icon');
    const offIcon = document.getElementById('sound-off-icon');

    const saved = localStorage.getItem('romantic_sound_enabled');
    if (saved !== null) {
      state.soundEnabled = saved === 'true';
    }

    function updateIcons() {
      if (onIcon && offIcon) {
        onIcon.style.display = state.soundEnabled ? 'block' : 'none';
        offIcon.style.display = state.soundEnabled ? 'none' : 'block';
      }
    }
    updateIcons();

    if (btn) {
      btn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        localStorage.setItem('romantic_sound_enabled', state.soundEnabled);
        updateIcons();
        if (state.soundEnabled) {
          playTone(550, 0.15, 'sine', 0.1);
        }
      });
    }
  }

  // Fallback sécurisé en cas de problème d'image externe
  function setupImageFallbacks() {
    document.querySelectorAll('.choice-card-img').forEach(img => {
      img.addEventListener('error', () => {
        img.style.display = 'none';
      });
    });
  }

  // ==========================================================================
  // INITIALISATION GLOBALE
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initAmbientCanvas();
    setupImageFallbacks();
    setupAudioToggle();
    setupMusicPlayer();
    setupCompliments();
    setupConfigModal();
    setupSecretEnvelope();
    setupEvasiveButton();
    setupQuiz();
    setupPlaces();
    setupFood();
    setupSurprises();
    setupExtras();
    setupConfidences();
    setupLetter();
    setupSurprisesReviewModal();

    // Bouton OUI de l'étape 2
    const btnYes = document.getElementById('btn-yes');
    if (btnYes) btnYes.addEventListener('click', onYesClicked);

    // Bouton Retour étape 6
    const btnBack6 = document.getElementById('btn-back-step-6');
    if (btnBack6) btnBack6.addEventListener('click', () => goToStep('step-letter'));

    // Bouton WhatsApp
    const btnWa = document.getElementById('btn-send-whatsapp');
    if (btnWa) btnWa.addEventListener('click', sendWhatsApp);

    // Bouton Copier
    const btnCopy = document.getElementById('btn-copy-summary');
    if (btnCopy) btnCopy.addEventListener('click', copySummaryToClipboard);

    // Prise en charge des clics pour l'AudioContext
    window.addEventListener('click', () => initAudio(), { once: true });
    window.addEventListener('touchstart', () => initAudio(), { once: true });
  });

  // Export dans l'objet global window.App
  window.App = {
    state,
    goToStep,
    submitName,
    onYesClicked,
    sendWhatsApp,
    copySummaryToClipboard
  };

})();
