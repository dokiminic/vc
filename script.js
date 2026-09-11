/* ==========================================================
   PEANUTS VIDEO CALL INVITATION - INTERACTION SCRIPT
   Pure Vanilla JavaScript with Web Audio & Particle Effects
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const attemptHint = document.getElementById('attempt-hint');
  const celebrationModal = document.getElementById('celebration-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const soundToggle = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const btnCopyMsg = document.getElementById('btn-copy-msg');
  const copyToast = document.getElementById('copy-toast');
  const btnWhatsapp = document.getElementById('btn-whatsapp');
  const woodstockWrapper = document.getElementById('woodstock-wrapper');
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');

  // State
  let noAttempts = 0;
  let isSoundEnabled = true;
  let audioCtx = null;
  let confettiParticles = [];
  let isConfettiRunning = false;

  // Funny NO Button texts
  const noButtonTexts = [
    "NO 😭",
    "Yakin nih? 🥺",
    "Eits gak bisa! 😜",
    "Jangan kabur! 🏃",
    "Pliss mau ya? 🥺",
    "Masih gamau? 😭",
    "Udah kecil bgt! 🤏",
    "Gak bakal kena! 🙈",
    "Pencet YES aja! ❤️"
  ];

  // Playful teaser hints
  const hintTexts = [
    "Psst... jangan coba-coba tekan tombol merah ya! 😜",
    "Wah, tombol NO-nya lincah banget! 🏃‍♂️💨",
    "Snoopy lagi ngeliatin kamu lho... 👀🐶",
    "Tuh liat, tombol YES makin besar dan bersinar! ✨",
    "Masa tega nolak ajakan lucu ini? 🥺",
    "Udah deh, tombol YES udah nungguin kamu! ❤️"
  ];

  // ==========================================================
  // 1. WEB AUDIO API SYNTHESIZER (No external audio files required)
  // ==========================================================
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

  // Cute Pop / Boing Sound
  function playPopSound() {
    if (!isSoundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Whoosh / Dodge Sound
  function playDodgeSound() {
    if (!isSoundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';

      const now = audioCtx.currentTime;
      const startFreq = 400 + Math.random() * 200;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Cartoon Poof / Vanish Sound
  function playPoofSound() {
    if (!isSoundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';

      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Woodstock Chirp Sound
  function playChirpSound() {
    if (!isSoundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const notes = [1200, 1600, 1400, 1800];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        const noteTime = now + idx * 0.05;
        osc.frequency.setValueAtTime(freq, noteTime);
        gain.gain.setValueAtTime(0.18, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.05);
      });
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Cheerful Victory Fanfare
  function playVictoryFanfare() {
    if (!isSoundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const notes = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.12 }, // G5
        { f: 1046.50, d: 0.45 } // C6
      ];

      let startTime = audioCtx.currentTime + 0.05;

      notes.forEach((note) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';

        osc.frequency.setValueAtTime(note.f, startTime);
        gain.gain.setValueAtTime(0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.d);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + note.d + 0.05);
        startTime += note.d;
      });
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Toggle Sound State
  soundToggle.addEventListener('click', () => {
    initAudio();
    isSoundEnabled = !isSoundEnabled;
    soundIcon.textContent = isSoundEnabled ? '🔊' : '🔇';
    soundToggle.setAttribute('title', isSoundEnabled ? 'Matikan Suara' : 'Nyalakan Suara');
  });

  // ==========================================================
  // 2. RUNAWAY "NO" BUTTON LOGIC (Hover & Touch Friendly)
  // ==========================================================
  function moveNoButton(e) {
    if (e) {
      // Prevent unintended standard click/zoom on mobile touch
      e.preventDefault();
      e.stopPropagation();
    }

    noAttempts++;
    playDodgeSound();

    // Ensure button is set to fixed position for free screen roaming
    btnNo.classList.add('is-fleeing');

    // Viewport dimensions
    const vpWidth = window.innerWidth;
    const vpHeight = window.innerHeight;

    // Button dimensions
    const btnRect = btnNo.getBoundingClientRect();
    const btnW = btnRect.width || 120;
    const btnH = btnRect.height || 50;

    // Safe padding margin from window boundaries
    const pad = 24;

    // Available boundary range
    const maxLeft = Math.max(pad, vpWidth - btnW - pad);
    const maxTop = Math.max(pad, vpHeight - btnH - pad);

    // Generate random coordinates inside safe boundaries
    let newLeft = Math.floor(Math.random() * (maxLeft - pad) + pad);
    let newTop = Math.floor(Math.random() * (maxTop - pad) + pad);

    // Keep it away from current mouse/touch position if available
    if (e && (e.clientX || (e.touches && e.touches[0]))) {
      const clientX = e.clientX || (e.touches ? e.touches[0].clientX : vpWidth / 2);
      const clientY = e.clientY || (e.touches ? e.touches[0].clientY : vpHeight / 2);

      // If the random spot is too close to cursor/touch (< 120px), shift it
      const dist = Math.hypot(newLeft + btnW / 2 - clientX, newTop + btnH / 2 - clientY);
      if (dist < 140) {
        newLeft = (newLeft + vpWidth / 2) % maxLeft + pad;
        newTop = (newTop + vpHeight / 2) % maxTop + pad;
      }
    }

    // Apply calculated positions
    btnNo.style.left = `${newLeft}px`;
    btnNo.style.top = `${newTop}px`;

    // Gradually shrink NO button
    const noScale = Math.max(0.35, 1 - noAttempts * 0.08);
    btnNo.style.transform = `scale(${noScale})`;

    // Gradually enlarge YES button (tempting the user!)
    const yesScale = Math.min(1.85, 1 + noAttempts * 0.09);
    btnYes.style.transform = `scale(${yesScale})`;

    // Update text on NO button
    const textIdx = Math.min(noAttempts, noButtonTexts.length - 1);
    const textSpan = btnNo.querySelector('.btn-text');
    if (textSpan) {
      textSpan.textContent = noButtonTexts[textIdx];
    }

    // Update playful teaser hint
    const hintIdx = noAttempts % hintTexts.length;
    attemptHint.textContent = hintTexts[hintIdx];
    attemptHint.classList.add('active-tease');
    setTimeout(() => attemptHint.classList.remove('active-tease'), 400);
  }

  // Desktop events: dodging on hover/approach
  btnNo.addEventListener('mouseenter', moveNoButton);
  btnNo.addEventListener('mouseover', moveNoButton);
  btnNo.addEventListener('mousedown', moveNoButton);

  // Mobile / Touch events: dodging on touch / tap
  btnNo.addEventListener('touchstart', moveNoButton, { passive: false });
  btnNo.addEventListener('pointerdown', moveNoButton);
  btnNo.addEventListener('pointerenter', moveNoButton);

  // Click event: dodging if clicked
  btnNo.addEventListener('click', moveNoButton);

  // ==========================================================
  // 3. YES BUTTON & CELEBRATION LOGIC
  // ==========================================================
  function celebrateYes() {
    initAudio();
    playPopSound();
    playVictoryFanfare();

    // Show celebration modal
    celebrationModal.classList.add('is-active');
    celebrationModal.setAttribute('aria-hidden', 'false');

    // Launch Confetti
    startConfetti();

    // Prepare customized WhatsApp URL
    const waText = encodeURIComponent("Hai! Aku mau banget video call sama kamu sekarang! 📞❤️ (Snoopy said YES!)");
    btnWhatsapp.href = `https://wa.me/?text=${waText}`;
  }

  btnYes.addEventListener('click', celebrateYes);

  // Modal Close handler
  btnCloseModal.addEventListener('click', () => {
    celebrationModal.classList.remove('is-active');
    celebrationModal.setAttribute('aria-hidden', 'true');
    stopConfetti();
  });

  // Close modal when clicking on overlay backdrop
  celebrationModal.addEventListener('click', (e) => {
    if (e.target === celebrationModal) {
      celebrationModal.classList.remove('is-active');
      celebrationModal.setAttribute('aria-hidden', 'true');
      stopConfetti();
    }
  });

  // Copy Message to Clipboard
  btnCopyMsg.addEventListener('click', async () => {
    playPopSound();
    const sweetMessage = "Hai! Mau video call sekarang? Aku udah siap nih! ❤️📞✨";
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(sweetMessage);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = sweetMessage;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      // Show toast
      copyToast.classList.add('show');
      setTimeout(() => {
        copyToast.classList.remove('show');
      }, 2500);
    } catch (err) {
      console.warn("Copy failed:", err);
    }
  });

  // Woodstock Easter Egg click
  if (woodstockWrapper) {
    woodstockWrapper.addEventListener('click', () => {
      playChirpSound();
      woodstockWrapper.style.transform = 'translateY(-20px) rotate(15deg) scale(1.3)';
      setTimeout(() => {
        woodstockWrapper.style.transform = '';
      }, 500);
    });
  }

  // ==========================================================
  // 4. CONFETTI & HEARTS CANVAS ENGINE
  // ==========================================================
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const confettiColors = [
    '#FED130', // Charlie Brown Yellow
    '#E53935', // Snoopy Red
    '#4CAF50', // Mint Green
    '#C6E2F7', // Pastel Sky Blue
    '#FF69B4', // Hot Pink
    '#FFD4DD', // Pastel Rose
    '#FFFFFF', // Comic White
    '#1E1E1E'  // Ink Outline Accent
  ];

  function createConfettiParticle() {
    const isHeart = Math.random() < 0.25;
    return {
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 50,
      size: isHeart ? 16 + Math.random() * 12 : 8 + Math.random() * 10,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedY: 2.5 + Math.random() * 4.5,
      speedX: -2 + Math.random() * 4,
      rotation: Math.random() * 360,
      rotationSpeed: -4 + Math.random() * 8,
      isHeart: isHeart,
      opacity: 1
    };
  }

  function startConfetti() {
    confettiParticles = [];
    isConfettiRunning = true;

    // Burst initial particles
    for (let i = 0; i < 90; i++) {
      const p = createConfettiParticle();
      p.y = Math.random() * (canvas.height * 0.6); // spread initially
      confettiParticles.push(p);
    }

    animateConfetti();
  }

  function stopConfetti() {
    isConfettiRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawHeart(cx, cy, size, color, rotation) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    // top left curve
    ctx.bezierCurveTo(-size / 2, -topCurveHeight, -size, topCurveHeight / 3, 0, size);
    // top right curve
    ctx.bezierCurveTo(size, topCurveHeight / 3, size / 2, -topCurveHeight, 0, topCurveHeight);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#1E1E1E';
    ctx.stroke();
    ctx.restore();
  }

  function animateConfetti() {
    if (!isConfettiRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Keep populating if active
    if (confettiParticles.length < 110) {
      confettiParticles.push(createConfettiParticle());
    }

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.02) + p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.isHeart) {
        drawHeart(p.x, p.y, p.size, p.color, p.rotation);
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.roundRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6, 2);
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = '#1E1E1E';
        ctx.stroke();
        ctx.restore();
      }

      // Remove particles falling off bottom
      if (p.y > canvas.height + 30) {
        confettiParticles.splice(i, 1);
      }
    }

    if (isConfettiRunning) {
      requestAnimationFrame(animateConfetti);
    }
  }
});
