// Avatar data
const avatars = {
  boy: [
    '/frontend/assets/images/select-avt/boy1.png',
    '/frontend/assets/images/select-avt/boy2.png',
    '/frontend/assets/images/select-avt/boy3.png',
    '/frontend/assets/images/select-avt/boy4.png',
    '/frontend/assets/images/select-avt/boy5.png',
    '/frontend/assets/images/select-avt/boy6.png',
  ],
  girl: [
    '/frontend/assets/images/select-avt/girl1.png',
    '/frontend/assets/images/select-avt/girl2.png',
    '/frontend/assets/images/select-avt/girl3.png',
    '/frontend/assets/images/select-avt/girl4.png',
    '/frontend/assets/images/select-avt/girl5.png',
    '/frontend/assets/images/select-avt/girl6.png',
  ],
  animals: [
    '/frontend/assets/images/select-avt/animal1.png',
    '/frontend/assets/images/select-avt/animal2.png',
    '/frontend/assets/images/select-avt/animal3.png',
    '/frontend/assets/images/select-avt/animal4.png',
    '/frontend/assets/images/select-avt/animal5.png',
    '/frontend/assets/images/select-avt/animal6.png',
  ]
};

// Render avatars with skeleton loading
function renderAvatars(tab) {
  const grid = document.querySelector(`#${tab} .avatar-grid`);
  grid.innerHTML = '';
  // Show skeletons
  for (let i = 0; i < 6; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'avatar-skeleton';
    grid.appendChild(skeleton);
  }
  setTimeout(() => {
    grid.innerHTML = '';
    avatars[tab].forEach((src, idx) => {
      const item = document.createElement('div');
      item.className = 'avatar-item';
      // Skeleton cho từng ảnh
      const skeleton = document.createElement('div');
      skeleton.className = 'avatar-skeleton';
      item.appendChild(skeleton);
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Avatar';
      img.style.display = 'none';
      img.onload = () => {
        skeleton.remove();
        img.style.display = '';
      };
      item.appendChild(img);
      grid.appendChild(item);
    });
  }, 800 + Math.random()*400); // Skeleton loading time
}

// Tab switching
const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');
let currentTab = 'boy';
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(btn => btn.classList.remove('active'));
    tab.classList.add('active');
    contents.forEach(content => content.classList.remove('active'));
    document.getElementById(tab.dataset.target).classList.add('active');
    currentTab = tab.dataset.target;
    renderAvatars(currentTab);
  });
});

// Initial render
window.addEventListener('DOMContentLoaded', () => {
  renderAvatars('boy');
  // Dark mode init
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }
});

// Avatar select
let selectedAvatar = null;
const submitBtn = document.querySelector('.submit-btn');
document.addEventListener('click', function(e) {
  if (e.target.closest('.avatar-item')) {
    document.querySelectorAll('.avatar-item').forEach(item => item.classList.remove('selected'));
    const item = e.target.closest('.avatar-item');
    item.classList.add('selected');
    selectedAvatar = item.querySelector('img').src;
    submitBtn.disabled = false;
    // Heart burst at avatar position
    const rect = item.getBoundingClientRect();
    burstHearts(rect.left+rect.width/2, rect.top+rect.height/2, '#f35980');
  }
});

// Submit
submitBtn.addEventListener('click', function(e) {
  e.preventDefault();
  if (selectedAvatar) {
    document.getElementById('successPopup').classList.add('show');
  }
});

// Sửa popup: đóng khi click ra ngoài hoặc click nút Get Started
const popup = document.getElementById('successPopup');
const popupBtn = document.querySelector('.success-btn');
function closePopup() {
  popup.classList.remove('show');
}
popupBtn.onclick = closePopup;
popup.addEventListener('click', function(e) {
  if (e.target === popup) closePopup();
});


// Confetti background effect (replace old particle)
const canvas = document.getElementById('particle-bg');
const ctx = canvas.getContext('2d');
let confetti = [];
const confettiColors = [
  '#fcb7d4', '#ffe6f2', '#f7c6e0', '#f35980', '#f5e9e2', '#b388ff', '#81ecec'
];
const confettiShapes = ['circle', 'rect', 'heart'];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}
function createConfetti() {
  const shape = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
  return {
    x: randomBetween(0, canvas.width),
    y: randomBetween(-40, canvas.height * 0.7),
    r: randomBetween(6, 16),
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    speed: randomBetween(0.5, 1.2),
    drift: randomBetween(-0.5, 0.5),
    alpha: randomBetween(0.7, 1),
    shape,
    t: Math.random() * Math.PI * 2,
    rot: Math.random() * Math.PI * 2
  };
}
function drawConfettiPiece(c) {
  ctx.save();
  ctx.globalAlpha = c.alpha;
  ctx.translate(c.x, c.y);
  ctx.rotate(c.rot);
  if (c.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();
  } else if (c.shape === 'rect') {
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.r/2, -c.r/2, c.r, c.r);
  } else if (c.shape === 'heart') {
    ctx.beginPath();
    ctx.moveTo(0, c.r/4);
    ctx.bezierCurveTo(0, 0, -c.r/2, 0, -c.r/2, c.r/4);
    ctx.bezierCurveTo(-c.r/2, c.r/2, 0, c.r*0.8, 0, c.r);
    ctx.bezierCurveTo(0, c.r*0.8, c.r/2, c.r/2, c.r/2, c.r/4);
    ctx.bezierCurveTo(c.r/2, 0, 0, 0, 0, c.r/4);
    ctx.closePath();
    ctx.fillStyle = c.color;
    ctx.fill();
  }
  ctx.restore();
}
function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let c of confetti) {
    drawConfettiPiece(c);
    c.y += c.speed;
    c.x += Math.sin(c.t) * c.drift;
    c.t += 0.01 + Math.random()*0.01;
    c.rot += 0.01 * (Math.random() - 0.5);
    if (c.y - c.r > canvas.height) {
      Object.assign(c, createConfetti(), {y: -c.r});
    }
  }
  requestAnimationFrame(animateConfetti);
}
function initConfetti() {
  confetti = [];
  const count = Math.floor(window.innerWidth / 32) + 18;
  for (let i = 0; i < count; i++) {
    confetti.push(createConfetti());
  }
}
window.addEventListener('resize', initConfetti);
initConfetti();
animateConfetti();

// Animated gradient background (under particle)
const bgGradient = document.createElement('div');
bgGradient.className = 'bg-gradient-class';
bgGradient.style.position = 'fixed';
bgGradient.style.top = 0;
bgGradient.style.left = 0;
bgGradient.style.width = '100vw';
bgGradient.style.height = '100vh';
bgGradient.style.zIndex = '-2';
bgGradient.style.pointerEvents = 'none';
bgGradient.style.background = 'linear-gradient(120deg, #ffe6f2 0%, #fcb7d4 50%, #f7c6e0 100%)';
bgGradient.style.transition = 'background 1s';
document.body.prepend(bgGradient);
let gradAngle = 120;
function animateBgGradient() {
  gradAngle += 0.03;
  const a = Math.sin(gradAngle/40)*30+120;
  const b = Math.cos(gradAngle/60)*30+240;
  bgGradient.style.background = `linear-gradient(${a}deg, #ffe6f2 0%, #fcb7d4 50%, #f7c6e0 100%, #ffe6f2 100%)`;
  requestAnimationFrame(animateBgGradient);
}
animateBgGradient();

// Heart burst effect when select avatar
function burstHearts(x, y, color) {
  const burst = document.createElement('canvas');
  burst.width = 120;
  burst.height = 120;
  burst.style.position = 'fixed';
  burst.style.left = (x-60) + 'px';
  burst.style.top = (y-60) + 'px';
  burst.style.pointerEvents = 'none';
  burst.style.zIndex = 100;
  document.body.appendChild(burst);
  const bctx = burst.getContext('2d');
  const hearts = [];
  for (let i=0; i<12; i++) {
    hearts.push({
      x: 60, y: 60,
      r: 12+Math.random()*6,
      angle: (Math.PI*2/12)*i + Math.random()*0.2,
      dist: 0,
      speed: 2.5+Math.random()*1.5,
      alpha: 1
    });
  }
  let frame = 0;
  function drawBurst() {
    bctx.clearRect(0,0,120,120);
    for (let h of hearts) {
      const hx = h.x + Math.cos(h.angle)*h.dist;
      const hy = h.y + Math.sin(h.angle)*h.dist;
      bctx.save();
      bctx.globalAlpha = h.alpha;
      bctx.beginPath();
      bctx.moveTo(hx, hy + h.r/4);
      bctx.bezierCurveTo(hx, hy, hx-h.r/2, hy, hx-h.r/2, hy+h.r/4);
      bctx.bezierCurveTo(hx-h.r/2, hy+h.r/2, hx, hy+h.r*0.8, hx, hy+h.r);
      bctx.bezierCurveTo(hx, hy+h.r*0.8, hx+h.r/2, hy+h.r/2, hx+h.r/2, hy+h.r/4);
      bctx.bezierCurveTo(hx+h.r/2, hy, hx, hy, hx, hy+h.r/4);
      bctx.closePath();
      bctx.fillStyle = color;
      bctx.shadowColor = color;
      bctx.shadowBlur = 8;
      bctx.fill();
      bctx.restore();
      h.dist += h.speed;
      h.alpha -= 0.025+Math.random()*0.01;
    }
    frame++;
    if (frame < 32) {
      requestAnimationFrame(drawBurst);
    } else {
      burst.remove();
    }
  }
  drawBurst();
}

// Hiệu ứng nền động Bokeh (chấm tròn pastel mờ, di chuyển nhẹ nhàng)
const bokehColors = [
  'rgba(252,183,212,0.18)', 'rgba(255,230,242,0.16)', 'rgba(247,198,224,0.15)', 'rgba(243,89,128,0.13)', 'rgba(179,136,255,0.13)', 'rgba(129,236,236,0.13)'
];
let bokehs = [];
function createBokeh() {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 60 + Math.random() * 80,
    color: bokehColors[Math.floor(Math.random() * bokehColors.length)],
    speed: 0.1 + Math.random() * 0.15,
    dx: (Math.random() - 0.5) * 0.2,
    dy: (Math.random() - 0.5) * 0.2,
    alpha: 0.12 + Math.random() * 0.08
  };
}
function drawBokeh(b) {
  ctx.save();
  ctx.globalAlpha = b.alpha;
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.fillStyle = b.color;
  ctx.fill();
  ctx.restore();
}
function animateBokeh() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let b of bokehs) {
    drawBokeh(b);
    b.x += b.dx;
    b.y += b.dy + b.speed;
    if (b.x < -b.r) b.x = window.innerWidth + b.r;
    if (b.x > window.innerWidth + b.r) b.x = -b.r;
    if (b.y > window.innerHeight + b.r) {
      b.y = -b.r;
      b.x = Math.random() * window.innerWidth;
    }
  }
  requestAnimationFrame(animateBokeh);
}
function initBokeh() {
  bokehs = [];
  const count = Math.floor(window.innerWidth / 120) + 10;
  for (let i = 0; i < count; i++) {
    bokehs.push(createBokeh());
  }
}
window.addEventListener('resize', initBokeh);
initBokeh();
animateBokeh(); 