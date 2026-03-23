/* =====================================================
   Windows 95 Portfolio — script.js
   ===================================================== */

// ── Project Data ── (edit this to add your own projects)
const PROJECTS = [
  {
    id: 'p1',
    icon: '🌐',
    name: 'Web Portfolio',
    desc: 'A Windows 95–style portfolio built with vanilla HTML, CSS and JavaScript. Features draggable windows, animated boot screen, taskbar, and Start menu.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    links: { GitHub: '#', 'Live Demo': '#' },
  },
  {
    id: 'p2',
    icon: '🎮',
    name: 'Retro Game',
    desc: 'A 2-D platformer built on the Canvas API with pixel-art graphics and chiptune audio. Playable in the browser with keyboard or touch controls.',
    tech: ['JavaScript', 'Canvas API', 'Web Audio'],
    links: { GitHub: '#', 'Live Demo': '#' },
  },
  {
    id: 'p3',
    icon: '📱',
    name: 'Mobile App',
    desc: 'A cross-platform task-management app built with React Native and Firebase. Supports offline sync and push notifications.',
    tech: ['React Native', 'TypeScript', 'Firebase'],
    links: { GitHub: '#' },
  },
  {
    id: 'p4',
    icon: '🤖',
    name: 'AI Chatbot',
    desc: 'A conversational assistant powered by an LLM API. Built with a FastAPI backend and a React front-end. Streams responses in real time.',
    tech: ['Python', 'FastAPI', 'React', 'OpenAI API'],
    links: { GitHub: '#' },
  },
];

// ── State ──
let topZ = 10;
const winState = {};   // 'open' | 'minimized' | 'closed'

// ─────────────────────────────────────────────────────
// WINDOW MANAGEMENT
// ─────────────────────────────────────────────────────

function openWin(id) {
  const el = document.getElementById(`win-${id}`);
  if (!el) return;
  el.style.display = 'block';
  winState[id] = 'open';
  addToTaskbar(id);
  bringToFront(id);
  closeStart();
}

function closeWin(id) {
  const el = document.getElementById(`win-${id}`);
  if (!el) return;
  el.style.display = 'none';
  winState[id] = 'closed';
  removeFromTaskbar(id);
}

function minimizeWin(id) {
  const el = document.getElementById(`win-${id}`);
  if (!el) return;
  el.style.display = 'none';
  winState[id] = 'minimized';
  // Keep taskbar button but deactivate it
  const btn = document.getElementById(`tb-${id}`);
  if (btn) btn.classList.remove('active');
}

function maximizeWin(id) {
  const el = document.getElementById(`win-${id}`);
  if (!el) return;
  if (el.dataset.maxed === '1') {
    // Restore
    el.style.left   = el.dataset.rl;
    el.style.top    = el.dataset.rt;
    el.style.width  = el.dataset.rw;
    el.style.height = el.dataset.rh;
    el.dataset.maxed = '';
  } else {
    // Save current geometry
    el.dataset.rl = el.style.left;
    el.dataset.rt = el.style.top;
    el.dataset.rw = el.style.width;
    el.dataset.rh = el.style.height;
    // Maximize
    el.style.left   = '0';
    el.style.top    = '0';
    el.style.width  = '100vw';
    el.style.height = `calc(100vh - 28px)`;
    el.dataset.maxed = '1';
  }
}

function bringToFront(id) {
  // Deactivate all title bars
  document.querySelectorAll('.win-tb').forEach(tb => tb.classList.add('inactive'));
  // Deactivate all taskbar items
  document.querySelectorAll('.tb-item').forEach(b => b.classList.remove('active'));

  const el = document.getElementById(`win-${id}`);
  if (!el) return;
  el.style.zIndex = ++topZ;
  el.querySelector('.win-tb').classList.remove('inactive');

  const tbBtn = document.getElementById(`tb-${id}`);
  if (tbBtn) tbBtn.classList.add('active');
}

// Click on any window → bring to front
document.addEventListener('mousedown', e => {
  const win = e.target.closest('.win');
  if (win && win.id.startsWith('win-')) {
    const id = win.id.slice(4); // strip 'win-'
    if (winState[id] !== 'closed') bringToFront(id);
  }
});

// ─────────────────────────────────────────────────────
// TASKBAR
// ─────────────────────────────────────────────────────

function addToTaskbar(id) {
  if (document.getElementById(`tb-${id}`)) {
    document.getElementById(`tb-${id}`).classList.add('active');
    return;
  }
  const win = document.getElementById(`win-${id}`);
  const ico  = win.querySelector('.win-ico')?.textContent  || '';
  const ttl  = win.querySelector('.win-ttl')?.textContent  || id;

  const btn = document.createElement('button');
  btn.className = 'tb-item active';
  btn.id = `tb-${id}`;
  btn.innerHTML = `<span>${ico}</span>${ttl}`;
  btn.onclick = () => {
    if (winState[id] === 'minimized') {
      openWin(id);
    } else {
      bringToFront(id);
    }
  };
  document.getElementById('tb-wins').appendChild(btn);
}

function removeFromTaskbar(id) {
  document.getElementById(`tb-${id}`)?.remove();
}

// ─────────────────────────────────────────────────────
// DRAGGING
// ─────────────────────────────────────────────────────

let dragEl = null, dragOX = 0, dragOY = 0;

function startDrag(e, elId) {
  const el = document.getElementById(elId);
  if (!el || el.dataset.maxed === '1') return;
  dragEl  = el;
  dragOX  = e.clientX - el.getBoundingClientRect().left;
  dragOY  = e.clientY - el.getBoundingClientRect().top;
  e.preventDefault();
}

document.addEventListener('mousemove', e => {
  if (!dragEl) return;
  const maxY = window.innerHeight - 28 - 20; // stay above taskbar
  dragEl.style.left = `${e.clientX - dragOX}px`;
  dragEl.style.top  = `${Math.max(0, Math.min(e.clientY - dragOY, maxY))}px`;
});

document.addEventListener('mouseup', () => { dragEl = null; });

// ─────────────────────────────────────────────────────
// START MENU
// ─────────────────────────────────────────────────────

let startOpen = false;

function toggleStart(force) {
  startOpen = (force !== undefined) ? force : !startOpen;
  document.getElementById('start-menu').classList.toggle('open', startOpen);
  document.getElementById('start-btn').classList.toggle('pressed', startOpen);
}

function closeStart() { toggleStart(false); }

// Close start menu on outside click
document.addEventListener('click', e => {
  if (startOpen && !e.target.closest('#start-menu') && !e.target.closest('#start-btn')) {
    closeStart();
  }
});

// ─────────────────────────────────────────────────────
// CLOCK
// ─────────────────────────────────────────────────────

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('tray-clock').textContent = `${h}:${m}`;
}
setInterval(updateClock, 5000);
updateClock();

// ─────────────────────────────────────────────────────
// PROJECTS — populate grid
// ─────────────────────────────────────────────────────

function buildProjectGrid() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  grid.innerHTML = '';
  PROJECTS.forEach(p => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = `<div class="file-item-ico">${p.icon}</div><span>${p.name}</span>`;
    item.ondblclick = () => openProjectDetail(p.id);
    grid.appendChild(item);
  });
  const cnt = document.getElementById('proj-count');
  if (cnt) cnt.textContent = `${PROJECTS.length} objects`;
}

function openProjectDetail(id) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p) return;

  document.getElementById('pd-icon').textContent  = p.icon;
  document.getElementById('pd-title').textContent = p.name;

  const tags  = p.tech.map(t => `<span class="pd-tag">${t}</span>`).join('');
  const links = Object.entries(p.links)
    .map(([label, url]) => `<a href="${url}" class="win-link" target="_blank">${label}</a>`)
    .join('');

  document.getElementById('pd-body').innerHTML = `
    <div class="pd-body">
      <h3>${p.icon} ${p.name}</h3>
      <p>${p.desc}</p>
      <div class="pd-tags">${tags}</div>
      <div class="pd-links">${links}</div>
    </div>`;

  openWin('projdetail');
}

// ─────────────────────────────────────────────────────
// CONTACT FORM
// ─────────────────────────────────────────────────────

function sendContact() {
  const name  = document.getElementById('cnt-name').value.trim();
  const email = document.getElementById('cnt-email').value.trim();
  const msg   = document.getElementById('cnt-msg').value.trim();

  if (!name || !email || !msg) {
    showMsgBox('⚠️', 'Error', 'Please fill in all fields before sending.');
    return;
  }

  closeWin('contact');
  // Clear fields
  document.getElementById('cnt-name').value  = '';
  document.getElementById('cnt-email').value = '';
  document.getElementById('cnt-msg').value   = '';

  showMsgBox('✉️', 'Message Sent!', `Thanks, ${name}! Your message has been received.`);
}

// ─────────────────────────────────────────────────────
// MESSAGE BOX
// ─────────────────────────────────────────────────────

function showMsgBox(icon, title, text) {
  const overlay = document.createElement('div');
  overlay.className = 'msgbox-overlay';
  overlay.innerHTML = `
    <div class="win msgbox">
      <div class="win-tb">
        <div class="win-tb-l">
          <span class="win-ico">${icon}</span>
          <span class="win-ttl">${title}</span>
        </div>
        <div class="win-tb-r">
          <button class="tbtn tbtn-x" onclick="this.closest('.msgbox-overlay').remove()">✕</button>
        </div>
      </div>
      <div class="msgbox-body">
        <div class="msgbox-ico">${icon}</div>
        <p>${text}</p>
      </div>
      <div class="msgbox-foot">
        <button class="win-btn" onclick="this.closest('.msgbox-overlay').remove()">OK</button>
      </div>
    </div>`;
  document.getElementById('desktop').appendChild(overlay);
}

// ─────────────────────────────────────────────────────
// SHUTDOWN
// ─────────────────────────────────────────────────────

function shutDown() {
  closeStart();
  document.getElementById('shutdown-overlay').classList.add('open');
}

function cancelShutdown() {
  document.getElementById('shutdown-overlay').classList.remove('open');
}

function doShutdown() {
  document.getElementById('shutdown-overlay').classList.remove('open');
  const desktop = document.getElementById('desktop');
  desktop.style.transition = 'opacity 0.6s';
  desktop.style.opacity = '0';
  setTimeout(() => {
    desktop.innerHTML = `
      <div style="
        width:100%; height:100%;
        background:#000;
        display:flex; align-items:center; justify-content:center;
      ">
        <p style="color:#fff;font-family:Arial,sans-serif;font-size:15px;">
          It is now safe to turn off your computer.
        </p>
      </div>`;
    desktop.style.opacity = '1';
  }, 600);
}

// Desktop click → deselect icons & close start menu
document.getElementById('desktop').addEventListener('click', e => {
  if (e.target === document.getElementById('desktop') ||
      e.target === document.getElementById('icon-area')) {
    closeStart();
    document.querySelectorAll('.d-icon').forEach(i => i.classList.remove('sel'));
  }
});

// Single-click on desktop icon → select it
document.querySelectorAll('.d-icon').forEach(icon => {
  icon.addEventListener('click', e => {
    e.stopPropagation();
    document.querySelectorAll('.d-icon').forEach(i => i.classList.remove('sel'));
    icon.classList.add('sel');
  });
});

// ─────────────────────────────────────────────────────
// BOOT SCREEN ANIMATION
// ─────────────────────────────────────────────────────

window.addEventListener('load', () => {
  buildProjectGrid();

  const fill   = document.getElementById('boot-fill');
  const screen = document.getElementById('boot-screen');
  const desk   = document.getElementById('desktop');

  let pct = 0;
  const tick = setInterval(() => {
    pct += Math.random() * 18 + 6;
    if (pct >= 100) {
      pct = 100;
      fill.style.width = '100%';
      clearInterval(tick);

      // Short pause then fade out boot screen
      setTimeout(() => {
        screen.style.transition = 'opacity 0.4s';
        screen.style.opacity = '0';
        setTimeout(() => {
          screen.style.display = 'none';
          desk.style.display = 'block';
          // Auto-open the About window after a brief moment
          setTimeout(() => openWin('about'), 250);
        }, 400);
      }, 500);
    } else {
      fill.style.width = `${pct}%`;
    }
  }, 140);
});
