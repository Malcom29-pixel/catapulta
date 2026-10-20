// ========================================================
// JUEGO: ¡LANZA Y ENCESTA! - Coordinación Óculo-Manual
// Estilo Montessori: Fotografía Realista 4K & Simulador 3D
// ========================================================

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playWhoosh() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.28);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      // Audio fallback
    }
  }

  playThud() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.14);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  playBasket() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpegio mayor brillante

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const noteTime = now + idx * 0.07;
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.01, noteTime);
        gain.gain.linearRampToValueAtTime(0.25, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.29);
      });
    } catch (e) {}
  }

  playFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      chord.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.65);
      });
    } catch (e) {}
  }
}

// Configuración de pelotas plásticas sensoriales
const BALL_TYPES = {
  blue: {
    name: 'Pelota Azul',
    color1: '#70d6ff',
    color2: '#0081AF',
    color3: '#004e64',
    weight: 1.0,
    bounce: 0.65,
    tag: 'Clásica'
  },
  purple: {
    name: 'Pelota Morada',
    color1: '#ff70a6',
    color2: '#7209B7',
    color3: '#3a0ca3',
    weight: 0.88,
    bounce: 0.75,
    tag: 'Flotante'
  },
  green: {
    name: 'Pelota Verde',
    color1: '#9ef01a',
    color2: '#2a9d8f',
    color3: '#1b4332',
    weight: 1.15,
    bounce: 0.58,
    tag: 'Firme'
  },
  yellow: {
    name: 'Pelota Amarilla',
    color1: '#fff3b0',
    color2: '#ffd13b',
    color3: '#e09f3e',
    weight: 0.95,
    bounce: 0.85,
    tag: 'Rebotadora'
  },
  red: {
    name: 'Pelota Roja',
    color1: '#ff758f',
    color2: '#e63946',
    color3: '#9b2226',
    weight: 1.05,
    bounce: 0.62,
    tag: 'Veloz'
  }
};

class ConfettiParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 10 + 6;
    this.color = ['#FFD13B', '#0081AF', '#E63946', '#2A9D8F', '#7209B7', '#F77F00', '#FF70A6'][
      Math.floor(Math.random() * 7)
    ];
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 14 + 5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 7;
    this.gravity = 0.38;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 16;
    this.life = 1.0;
    this.decay = Math.random() * 0.018 + 0.012;
    this.isStar = Math.random() > 0.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.97;
    this.rotation += this.rotationSpeed;
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;

    if (this.isStar) {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * this.size, -Math.sin(((18 + i * 72) * Math.PI) / 180) * this.size);
        ctx.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (this.size / 2), -Math.sin(((54 + i * 72) * Math.PI) / 180) * (this.size / 2));
      }
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.65);
    }
    ctx.restore();
  }
}

class FloatingMessage {
  constructor(text, x, y, color = '#FFD13B') {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.life = 1.0;
    this.vy = -2.4;
    this.scale = 0.6;
  }

  update() {
    this.y += this.vy;
    this.life -= 0.022;
    if (this.scale < 1.15) this.scale += 0.09;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);
    ctx.font = '900 32px "Fredoka", sans-serif';
    ctx.textAlign = 'center';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#2C1810';
    ctx.strokeText(this.text, 0, 0);
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, 0, 0);
    ctx.restore();
  }
}

class GameEngine {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.sound = new SoundManager();

    // Modo actual: 'photo' (con imagen realista 4K) o 'vector' (simulador procedural)
    this.mode = 'photo';

    // Estado del juego
    this.score = 0;
    this.streak = 0;
    this.totalThrows = 0;
    this.totalBaskets = 0;
    this.activeColor = 'blue';

    // Imagen fotográfica de fondo
    this.photoBg = new Image();
    this.photoBgLoaded = false;
    this.photoBg.src = 'scene.jpg';
    this.photoBg.onload = () => {
      this.photoBgLoaded = true;
    };

    // Pelotas acumuladas dentro de la caja
    this.boxBalls = [
      { color: 'purple', xRatio: -0.25, yRatio: 0.16, radius: 18 },
      { color: 'blue', xRatio: 0.20, yRatio: 0.20, radius: 17 },
      { color: 'green', xRatio: -0.04, yRatio: 0.26, radius: 19 },
      { color: 'yellow', xRatio: 0.12, yRatio: 0.05, radius: 18 }
    ];

    // Pelota actual y física 3D
    this.currentBall = null;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.dragCurrent = { x: 0, y: 0 };

    this.confetti = [];
    this.messages = [];

    // Dimensiones
    this.width = 1000;
    this.height = 650;

    // Geometría del objetivo (caja y agujero ovalado)
    this.targetBox = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      holeX: 0,
      holeY: 0,
      holeRadiusX: 0,
      holeRadiusY: 0
    };

    this.initCanvas();
    this.initEvents();
    this.resetBall();
    this.setupUI();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width || 1000;
    this.height = rect.height || 650;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.resetTransform ? this.ctx.resetTransform() : this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    this.updateTargetGeometry();
  }

  updateTargetGeometry() {
    if (this.mode === 'photo') {
      // Coordenadas calibradas con respecto a la fotografía 1200x896:
      // Agujero azul reforzado: X = 59.5%, Y = 60.2%
      // Radio X ~ 8.7%, Radio Y ~ 8.4%
      // Ancho caja ~ 32%, Alto caja ~ 36%
      const holeX = this.width * 0.595;
      const holeY = this.height * 0.602;
      const holeRX = this.width * 0.088;
      const holeRY = this.height * 0.085;

      this.targetBox = {
        x: this.width * 0.46,
        y: this.height * 0.41,
        width: this.width * 0.32,
        height: this.height * 0.37,
        holeX: holeX,
        holeY: holeY,
        holeRadiusX: holeRX,
        holeRadiusY: holeRY
      };
    } else {
      // Coordenadas para el modo procedural (centro)
      const boxW = Math.min(this.width * 0.38, 300);
      const boxH = boxW * 0.78;
      const boxX = this.width * 0.5 - boxW * 0.5;
      const boxY = this.height * 0.52 - boxH * 0.5;

      this.targetBox = {
        x: boxX,
        y: boxY,
        width: boxW,
        height: boxH,
        holeX: boxX + boxW * 0.5,
        holeY: boxY + boxH * 0.34,
        holeRadiusX: boxW * 0.22,
        holeRadiusY: boxH * 0.24
      };
    }
  }

  resetBall() {
    let startX, startY;
    if (this.mode === 'photo') {
      // Posición de la mano / lanzamiento del niño en la fotografía
      startX = this.width * 0.49;
      startY = this.height * 0.48;
    } else {
      // Posición procedural
      startX = this.width * 0.42;
      startY = this.height * 0.76;
    }

    this.currentBall = {
      x: startX,
      y: startY,
      startX: startX,
      startY: startY,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      radius: Math.max(28, this.width * 0.038),
      color: this.activeColor,
      state: 'ready',
      alpha: 1,
      rotation: 0
    };
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.initCanvas();
      if (this.currentBall && this.currentBall.state === 'ready') {
        this.resetBall();
      }
    });

    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const handleStart = (e) => {
      this.sound.init();
      if (!this.currentBall || this.currentBall.state !== 'ready') return;
      const pos = getPos(e);

      // Verificamos si hizo clic cerca de la pelota o en la zona inferior
      const dx = pos.x - this.currentBall.x;
      const dy = pos.y - this.currentBall.y;
      const dist = Math.hypot(dx, dy);

      if (dist < this.currentBall.radius * 3.2 || pos.y > this.height * 0.45) {
        this.isDragging = true;
        this.dragStart = { x: pos.x, y: pos.y };
        this.dragCurrent = { x: pos.x, y: pos.y };
      }
    };

    const handleMove = (e) => {
      if (!this.isDragging) return;
      this.dragCurrent = getPos(e);
    };

    const handleEnd = () => {
      if (!this.isDragging) return;
      this.isDragging = false;

      // Calcular vector de lanzamiento:
      // Soporta tanto arrastre hacia atrás (resorte / catapulta)
      // como swipe hacia adelante (lanzamiento directo)
      const rawDx = this.dragCurrent.x - this.dragStart.x;
      const rawDy = this.dragCurrent.y - this.dragStart.y;
      const dragDist = Math.hypot(rawDx, rawDy);

      if (dragDist > 16) {
        let launchDx, launchDy;
        if (rawDy > 0) {
          // El usuario arrastró HACIA ABAJO (modo resorte/catapulta): disparar hacia arriba
          launchDx = -rawDx;
          launchDy = -rawDy;
        } else {
          // El usuario hizo swipe HACIA ARRIBA (lanzamiento directo)
          launchDx = rawDx;
          launchDy = rawDy;
        }
        this.launchBall(launchDx, launchDy);
      }
    };

    this.canvas.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    this.canvas.addEventListener('touchstart', handleStart, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', handleEnd);
  }

  launchBall(dx, dy) {
    if (!this.currentBall || this.currentBall.state !== 'ready') return;

    const ballConfig = BALL_TYPES[this.currentBall.color] || BALL_TYPES.blue;
    this.totalThrows++;
    this.updateHUD();

    const maxDrag = 180;
    const clampedDrag = Math.min(Math.hypot(dx, dy), maxDrag);
    const angle = Math.atan2(dy, dx);
    const power = (clampedDrag / maxDrag) * 20 + 4;

    this.currentBall.vx = Math.cos(angle) * power * 0.65;
    this.currentBall.vy = Math.sin(angle) * power * 0.85;
    this.currentBall.vz = 0.024 * (power / 12) / ballConfig.weight;
    this.currentBall.state = 'flying';

    this.sound.playWhoosh();
  }

  setupUI() {
    // Cambio de modo: Foto Real vs Simulador vs Póster
    const tabPhoto = document.getElementById('tabPhoto');
    const tabVector = document.getElementById('tabVector');
    const tabPoster = document.getElementById('tabPoster');
    const posterView = document.getElementById('posterView');

    const setMode = (mode) => {
      this.mode = mode;
      document.querySelectorAll('.btn-mode-tab').forEach((b) => b.classList.remove('active'));

      if (mode === 'poster') {
        if (tabPoster) tabPoster.classList.add('active');
        if (posterView) posterView.classList.add('active');
      } else {
        if (posterView) posterView.classList.remove('active');
        if (mode === 'photo' && tabPhoto) tabPhoto.classList.add('active');
        if (mode === 'vector' && tabVector) tabVector.classList.add('active');
        this.updateTargetGeometry();
        this.resetBall();
      }
      this.sound.playThud();
    };

    if (tabPhoto) tabPhoto.addEventListener('click', () => setMode('photo'));
    if (tabVector) tabVector.addEventListener('click', () => setMode('vector'));
    if (tabPoster) tabPoster.addEventListener('click', () => setMode('poster'));

    // Selector de pelotas en la bandeja naranja
    const ballItems = document.querySelectorAll('.tray-ball-item');
    ballItems.forEach((item) => {
      item.addEventListener('click', () => {
        const color = item.dataset.color;
        if (BALL_TYPES[color]) {
          this.activeColor = color;
          ballItems.forEach((b) => b.classList.remove('active'));
          item.classList.add('active');
          if (this.currentBall && this.currentBall.state === 'ready') {
            this.currentBall.color = color;
          }
          this.sound.playThud();
          this.messages.push(new FloatingMessage(`¡${BALL_TYPES[color].name}!`, this.currentBall.x, this.currentBall.y - 30, BALL_TYPES[color].color2));
        }
      });
    });

    // Botones del HUD
    const btnMute = document.getElementById('btnMute');
    if (btnMute) {
      btnMute.addEventListener('click', () => {
        this.sound.muted = !this.sound.muted;
        btnMute.textContent = this.sound.muted ? '🔇' : '🔊';
      });
    }

    const btnReset = document.getElementById('btnReset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.score = 0;
        this.streak = 0;
        this.totalThrows = 0;
        this.totalBaskets = 0;
        this.updateHUD();
        this.resetBall();
        this.messages.push(new FloatingMessage('¡Listo para encestar!', this.width * 0.5, this.height * 0.4, '#0081AF'));
      });
    }

    // Modal de Pedido
    const btnOrder = document.getElementById('btnOrder');
    const orderModal = document.getElementById('orderModal');
    const closeModal = document.getElementById('closeModal');
    const orderForm = document.getElementById('orderForm');

    if (btnOrder && orderModal) {
      btnOrder.addEventListener('click', () => {
        orderModal.classList.add('active');
        this.sound.playBasket();
      });
    }

    if (closeModal && orderModal) {
      closeModal.addEventListener('click', () => {
        orderModal.classList.remove('active');
      });
    }

    if (orderModal) {
      orderModal.addEventListener('click', (e) => {
        if (e.target === orderModal) {
          orderModal.classList.remove('active');
        }
      });
    }

    if (orderForm) {
      orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('🎉 ¡Pedido registrado con éxito! Nuestro asesor didáctico se contactará para coordinar la entrega gratuita de tu kit Montessori.');
        orderModal.classList.remove('active');
        this.triggerCelebration(this.width * 0.5, this.height * 0.5);
      });
    }

    // Badges pedagógicos
    const badgeCoord = document.getElementById('badgeCoord');
    const badgeColors = document.getElementById('badgeColors');
    const badgeFocus = document.getElementById('badgeFocus');

    if (badgeCoord) {
      badgeCoord.addEventListener('click', () => {
        this.showPedagogicalTip(
          '🎯 Coordinación Óculo-Manual',
          'Al calcular la trayectoria y soltar la pelota hacia el agujero ovalado, el niño activa las áreas parietal y motora de la corteza cerebral, perfeccionando el control motor fino y grueso fundamental para la autonomía y la futura escritura.',
          '#0081AF'
        );
      });
    }

    if (badgeColors) {
      badgeColors.addEventListener('click', () => {
        this.showPedagogicalTip(
          '🎨 Reconocimiento de Colores',
          'La selección sensorial activa entre pelotas plásticas de colores vivos (azul, morada, verde, amarilla y roja) promueve la discriminación visual y la toma de decisiones guiada por el interés espontáneo del infante.',
          '#7209B7'
        );
      });
    }

    if (badgeFocus) {
      badgeFocus.addEventListener('click', () => {
        this.showPedagogicalTip(
          '🧠 Concentración y Paciencia',
          'La autocorrección inherente al juego Montessori permite que el niño experimente causa y efecto sin juicio externo, desarrollando autorregulación emocional, perseverancia y enfoque prolongado.',
          '#2A9D8F'
        );
      });
    }
  }

  showPedagogicalTip(title, text, color) {
    const tipModal = document.getElementById('tipModal');
    const tipTitle = document.getElementById('tipTitle');
    const tipText = document.getElementById('tipText');
    const closeTipModal = document.getElementById('closeTipModal');

    if (tipModal && tipTitle && tipText) {
      tipTitle.textContent = title;
      tipTitle.style.color = color;
      tipText.textContent = text;
      tipModal.classList.add('active');
      this.sound.playThud();
    }

    if (closeTipModal) {
      closeTipModal.onclick = () => tipModal.classList.remove('active');
    }
  }

  updateHUD() {
    const scoreEl = document.getElementById('scoreDisplay');
    const streakEl = document.getElementById('streakDisplay');
    if (scoreEl) scoreEl.textContent = this.score;
    if (streakEl) streakEl.textContent = this.streak;
  }

  triggerCelebration(x, y) {
    for (let i = 0; i < 50; i++) {
      this.confetti.push(new ConfettiParticle(x, y));
    }
  }

  // ==========================================
  // RENDERIZADO DEL ENTORNO
  // ==========================================
  drawBackground() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    if (this.mode === 'photo' && this.photoBgLoaded) {
      // Dibuja la fotografía realista 4K con cover proporcional
      const img = this.photoBg;
      const imgRatio = img.width / img.height;
      const canvasRatio = w / h;
      let drawW, drawH, drawX, drawY;

      if (canvasRatio > imgRatio) {
        drawW = w;
        drawH = w / imgRatio;
        drawX = 0;
        drawY = (h - drawH) / 2;
      } else {
        drawH = h;
        drawW = h * imgRatio;
        drawX = (w - drawW) / 2;
        drawY = 0;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // Resaltado visual sutil sobre el orificio de la caja para guiar al jugador
      const box = this.targetBox;
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 209, 59, 0.45)';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.ellipse(box.holeX, box.holeY, box.holeRadiusX, box.holeRadiusY, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

    } else {
      // MODO PROCEDURAL VECTORIAL
      this.drawProceduralRoom();
      this.drawProceduralCardboardBox();
      this.drawProceduralOrangeTray();
      this.drawProceduralChild();
    }
  }

  drawProceduralRoom() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Pared luminosa
    const wallGrad = ctx.createLinearGradient(0, 0, 0, h * 0.58);
    wallGrad.addColorStop(0, '#FFFDF8');
    wallGrad.addColorStop(1, '#F3EFE6');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, h * 0.58);

    // Suelo de madera clara natural
    const floorGrad = ctx.createLinearGradient(0, h * 0.58, 0, h);
    floorGrad.addColorStop(0, '#E5D6C0');
    floorGrad.addColorStop(1, '#CEB592');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, h * 0.58, w, h * 0.42);

    // Líneas de tablones
    ctx.strokeStyle = 'rgba(180, 150, 120, 0.25)';
    ctx.lineWidth = 1.5;
    for (let i = 1; i <= 6; i++) {
      const y = h * 0.58 + (h * 0.42 / 6) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Estantería Montessori
    this.drawShelf(w * 0.05, h * 0.28, w * 0.32, h * 0.3);
  }

  drawShelf(x, y, w, h) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E0D8CB';
    ctx.lineWidth = 3;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 8);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
    }

    const shelfY = y + h * 0.52;
    ctx.beginPath();
    ctx.moveTo(x, shelfY);
    ctx.lineTo(x + w, shelfY);
    ctx.stroke();

    // Libros
    const bookColors = ['#E63946', '#0081AF', '#2A9D8F', '#FFD13B', '#7209B7'];
    let bx = x + 16;
    bookColors.forEach((color, i) => {
      const bw = 10 + (i % 3) * 4;
      const bh = h * 0.35 - (i % 2) * 8;
      ctx.fillStyle = color;
      ctx.fillRect(bx, shelfY - bh, bw, bh);
      bx += bw + 5;
    });

    // Cajas amarillas
    const boxW = (w - 36) / 2;
    const boxH = h * 0.36;
    for (let i = 0; i < 2; i++) {
      const cx = x + 12 + i * (boxW + 12);
      const cy = y + h - boxH - 6;
      ctx.fillStyle = '#FFD13B';
      ctx.fillRect(cx, cy, boxW, boxH);
    }
    ctx.restore();
  }

  drawProceduralCardboardBox() {
    const ctx = this.ctx;
    const box = this.targetBox;
    ctx.save();

    // Sombra
    ctx.fillStyle = 'rgba(70, 50, 30, 0.22)';
    ctx.beginPath();
    ctx.ellipse(box.x + box.width * 0.5, box.y + box.height * 0.98, box.width * 0.58, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pared trasera
    ctx.fillStyle = '#B38758';
    ctx.fillRect(box.x, box.y, box.width, box.height);

    // Agujero ovalado reforzado
    ctx.fillStyle = '#1D3557'; // Refuerzo azul como en la foto
    ctx.beginPath();
    ctx.ellipse(box.holeX, box.holeY, box.holeRadiusX + 8, box.holeRadiusY + 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1A1412';
    ctx.beginPath();
    ctx.ellipse(box.holeX, box.holeY, box.holeRadiusX, box.holeRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pelotas acumuladas
    this.boxBalls.forEach((b) => {
      const bx = box.x + box.width * 0.5 + b.xRatio * box.width;
      const by = box.y + box.height * 0.72 + b.yRatio * box.height;
      this.drawPlasticSphere(bx, by, b.radius, b.color);
    });

    // Pared frontal
    const frontWallH = box.height * 0.38;
    const frontWallY = box.y + box.height - frontWallH;
    ctx.fillStyle = '#C99D6A';
    ctx.fillRect(box.x - 8, frontWallY, box.width + 16, frontWallH + 6);
    ctx.strokeStyle = '#85592E';
    ctx.lineWidth = 3;
    ctx.strokeRect(box.x - 8, frontWallY, box.width + 16, frontWallH + 6);

    ctx.restore();
  }

  drawProceduralOrangeTray() {
    const ctx = this.ctx;
    const trayW = Math.min(this.width * 0.22, 190);
    const trayH = 50;
    const trayX = this.width - trayW - 20;
    const trayY = this.height * 0.68;

    ctx.save();
    ctx.fillStyle = '#FF9E00';
    ctx.fillRect(trayX, trayY, trayW, trayH);
    ctx.strokeStyle = '#D00000';
    ctx.lineWidth = 3;
    ctx.strokeRect(trayX, trayY, trayW, trayH);

    const trayColors = ['blue', 'purple', 'green', 'yellow', 'red'];
    const ballR = 15;
    const step = (trayW - 28) / (trayColors.length - 1);
    trayColors.forEach((col, idx) => {
      const px = trayX + 14 + idx * step;
      const py = trayY + 12;
      this.drawPlasticSphere(px, py, ballR, col);
    });
    ctx.restore();
  }

  drawProceduralChild() {
    const ctx = this.ctx;
    const cx = this.width * 0.28;
    const cy = this.height * 0.88;

    ctx.save();
    // Torso con suéter rojo
    ctx.fillStyle = '#D90429';
    ctx.beginPath();
    ctx.moveTo(cx - 130, this.height);
    ctx.quadraticCurveTo(cx - 100, cy - 30, cx - 40, cy - 65);
    ctx.quadraticCurveTo(cx, cy - 75, cx + 45, cy - 65);
    ctx.quadraticCurveTo(cx + 105, cy - 30, cx + 135, this.height);
    ctx.closePath();
    ctx.fill();

    // Cabeza con cabello oscuro
    ctx.fillStyle = '#24140E';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 112, 54, 58, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ==========================================
  // ESFERA PLÁSTICA TRIDIMENSIONAL
  // ==========================================
  drawPlasticSphere(x, y, radius, colorKey, alpha = 1) {
    const ctx = this.ctx;
    const cfg = BALL_TYPES[colorKey] || BALL_TYPES.blue;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Sombra suave en el suelo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(x, y + radius * 0.85, radius * 0.85, radius * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gradiente esférico
    const grad = ctx.createRadialGradient(
      x - radius * 0.35,
      y - radius * 0.35,
      radius * 0.1,
      x,
      y,
      radius
    );
    grad.addColorStop(0, cfg.color1);
    grad.addColorStop(0.55, cfg.color2);
    grad.addColorStop(1, cfg.color3);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Brillo especular plástico realista
    const specGrad = ctx.createRadialGradient(
      x - radius * 0.38,
      y - radius * 0.38,
      0,
      x - radius * 0.38,
      y - radius * 0.38,
      radius * 0.45
    );
    specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    specGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.45)');
    specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = specGrad;
    ctx.beginPath();
    ctx.arc(x - radius * 0.38, y - radius * 0.38, radius * 0.45, 0, Math.PI * 2);
    ctx.fill();

    // Reflejo secundario translúcido
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.beginPath();
    ctx.arc(x + radius * 0.25, y + radius * 0.28, radius * 0.24, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ==========================================
  // GUÍA DE APUNTADO Y TRAYECTORIA
  // ==========================================
  drawAimingTrajectory() {
    if (!this.isDragging || !this.currentBall || this.currentBall.state !== 'ready') return;
    const ctx = this.ctx;

    const rawDx = this.dragCurrent.x - this.dragStart.x;
    const rawDy = this.dragCurrent.y - this.dragStart.y;
    const dragDist = Math.hypot(rawDx, rawDy);

    if (dragDist < 10) return;

    ctx.save();

    // Dibuja la línea elástica de tiro
    ctx.strokeStyle = 'rgba(255, 209, 59, 0.9)';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(this.dragStart.x, this.dragStart.y);
    ctx.lineTo(this.dragCurrent.x, this.dragCurrent.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Vector de disparo adaptado
    let launchDx, launchDy;
    if (rawDy > 0) {
      launchDx = -rawDx;
      launchDy = -rawDy;
    } else {
      launchDx = rawDx;
      launchDy = rawDy;
    }

    const maxDrag = 180;
    const clampedDrag = Math.min(dragDist, maxDrag);
    const angle = Math.atan2(launchDy, launchDx);
    const power = (clampedDrag / maxDrag) * 20 + 4;

    const vx = Math.cos(angle) * power * 0.65;
    const vy = Math.sin(angle) * power * 0.85;
    const vz = 0.024 * (power / 12);

    let simX = this.currentBall.x;
    let simY = this.currentBall.y;
    let simZ = 0;
    let simVy = vy;

    // Dibuja puntos de la parábola
    for (let step = 0; step < 26; step++) {
      simX += vx;
      simY += simVy;
      simVy += 0.8;
      simZ += vz;

      const scale = 1 / (1 + simZ * 1.4);
      const dotRadius = Math.max(2.5, 7 * scale);

      ctx.fillStyle = step % 2 === 0 ? '#FFD13B' : '#0081AF';
      ctx.beginPath();
      ctx.arc(simX, simY, dotRadius, 0, Math.PI * 2);
      ctx.fill();

      if (simZ >= 0.88) {
        ctx.strokeStyle = '#E63946';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(simX, simY, 14, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
    }

    ctx.restore();
  }

  // ==========================================
  // FÍSICAS DE LA PELOTA EN VUELO
  // ==========================================
  updateBallPhysics() {
    const ball = this.currentBall;
    if (!ball || ball.state === 'ready') return;

    if (ball.state === 'flying') {
      const cfg = BALL_TYPES[ball.color] || BALL_TYPES.blue;

      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.vy += 0.78 * cfg.weight;
      ball.z += ball.vz;
      ball.rotation += 0.08;

      const currentRadius = ball.radius / (1 + ball.z * 1.4);

      // Comprobación de enceste en la profundidad de la caja
      const targetZ = 0.85;
      if (ball.z >= targetZ && ball.z <= targetZ + 0.22) {
        const box = this.targetBox;

        // Comprobación elíptica con el orificio ovalado
        const normX = (ball.x - box.holeX) / box.holeRadiusX;
        const normY = (ball.y - box.holeY) / box.holeRadiusY;
        const insideHole = normX * normX + normY * normY <= 0.96;

        if (insideHole) {
          // ¡¡ENCESTA PERFECTA!!
          ball.state = 'scored';
          this.score += 100 + this.streak * 25;
          this.streak++;
          this.totalBaskets++;
          this.updateHUD();

          this.sound.playBasket();
          this.triggerCelebration(box.holeX, box.holeY);

          const praiseTexts = ['¡ENCESTA!', '¡QUÉ PUNTERÍA!', '¡CANASTA PERFECTA!', '¡BRAVO!'];
          const chosenText = praiseTexts[Math.floor(Math.random() * praiseTexts.length)];
          this.messages.push(new FloatingMessage(chosenText, box.holeX, box.holeY - 20, '#FFD13B'));

          if (this.streak >= 3) {
            this.sound.playFanfare();
            this.messages.push(new FloatingMessage(`🔥 ¡RACHA X${this.streak}!`, box.holeX, box.holeY - 60, '#E63946'));
          }

          // Agregamos la pelota al interior de la caja
          this.boxBalls.push({
            color: ball.color,
            xRatio: (ball.x - box.x - box.width * 0.5) / (box.width || 1),
            yRatio: 0.22,
            radius: Math.max(15, currentRadius)
          });

          setTimeout(() => this.resetBall(), 950);
          return;
        }

        // Comprobar si golpeó el borde de la caja
        const hitBoxX = ball.x >= box.x && ball.x <= box.x + box.width;
        const hitBoxY = ball.y >= box.y && ball.y <= box.y + box.height;

        if (hitBoxX && hitBoxY) {
          ball.state = 'missed';
          this.streak = 0;
          this.updateHUD();
          this.sound.playThud();

          ball.vx = (Math.random() - 0.5) * 8;
          ball.vy = -Math.abs(ball.vy) * 0.45;
          ball.vz = -0.01;

          this.messages.push(new FloatingMessage('¡Casi! Intenta de nuevo', ball.x, ball.y - 15, '#F77F00'));
          setTimeout(() => this.resetBall(), 1100);
          return;
        }
      }

      // Si cayó fuera o al piso
      if (ball.y > this.height * 0.96 || ball.z > 1.35) {
        if (ball.state === 'flying') {
          ball.state = 'missed';
          this.streak = 0;
          this.updateHUD();
          this.sound.playThud();
          this.messages.push(new FloatingMessage('¡Sigue intentando!', ball.x, ball.y - 15, '#2A9D8F'));
          setTimeout(() => this.resetBall(), 950);
        }
      }
    }
  }

  // ==========================================
  // BUCLE DE ANIMACIÓN
  // ==========================================
  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Dibujar escenario según el modo activo
    this.drawBackground();

    // 2. Físicas de la pelota
    this.updateBallPhysics();

    // 3. Dibujar la pelota activa en pantalla
    if (this.currentBall && this.mode !== 'poster') {
      const currentRadius = this.currentBall.radius / (1 + this.currentBall.z * 1.4);
      this.drawPlasticSphere(
        this.currentBall.x,
        this.currentBall.y,
        currentRadius,
        this.currentBall.color,
        this.currentBall.alpha
      );
    }

    // 4. Guía de trayectoria
    if (this.mode !== 'poster') {
      this.drawAimingTrajectory();
    }

    // 5. Confeti
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const p = this.confetti[i];
      p.update();
      p.draw(this.ctx);
      if (p.life <= 0) {
        this.confetti.splice(i, 1);
      }
    }

    // 6. Mensajes de puntuación flotantes
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const msg = this.messages[i];
      msg.update();
      msg.draw(this.ctx);
      if (msg.life <= 0) {
        this.messages.splice(i, 1);
      }
    }

    requestAnimationFrame(this.animate);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.game = new GameEngine();
});
