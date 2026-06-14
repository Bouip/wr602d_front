export default class HUD {
  constructor(onPause, onRestart, onMenu, onMute) {
    this.container = null
    this.scoreEl = null
    this.livesEl = null
    this.levelEl = null
    this.onPause = onPause
    this.onRestart = onRestart
    this.onMenu = onMenu
    this.onMute = onMute
    this.pauseOverlay = null
    this.muteBtn = null
  }

  init() {
    this.addStyles()

    this.container = document.createElement('div')
    this.container.id = 'hud'
    this.container.innerHTML = `
      <div id="hud-left">
        <div class="hud-score-block">
          <span class="hud-label">Score</span>
          <span id="score">0</span>
        </div>
        <div id="username-display"></div>
      </div>

      <div id="hud-center">
        <div class="hud-level-block">
          <span class="hud-label">Niveau</span>
          <span id="level">1</span>
        </div>
      </div>

      <div id="hud-right">
        <div id="hud-lives-wrap">
          <span class="hud-label">Vies</span>
          <div id="lives">
            <svg class="life-icon" viewBox="0 0 24 24"><path d="M12 21.4L10.55 20.1C5.4 15.4 2 12.3 2 8.5C2 5.4 4.4 3 7.5 3C9.2 3 10.9 3.8 12 5C13.1 3.8 14.8 3 16.5 3C19.6 3 22 5.4 22 8.5C22 12.3 18.6 15.4 13.45 20.1L12 21.4Z"/></svg>
            <svg class="life-icon" viewBox="0 0 24 24"><path d="M12 21.4L10.55 20.1C5.4 15.4 2 12.3 2 8.5C2 5.4 4.4 3 7.5 3C9.2 3 10.9 3.8 12 5C13.1 3.8 14.8 3 16.5 3C19.6 3 22 5.4 22 8.5C22 12.3 18.6 15.4 13.45 20.1L12 21.4Z"/></svg>
            <svg class="life-icon" viewBox="0 0 24 24"><path d="M12 21.4L10.55 20.1C5.4 15.4 2 12.3 2 8.5C2 5.4 4.4 3 7.5 3C9.2 3 10.9 3.8 12 5C13.1 3.8 14.8 3 16.5 3C19.6 3 22 5.4 22 8.5C22 12.3 18.6 15.4 13.45 20.1L12 21.4Z"/></svg>
          </div>
        </div>
        <div id="hud-btns">
          <button class="hud-btn" id="muteBtn" title="Son">
            <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4z"/></svg>
          </button>
          <button class="hud-btn" id="pauseBtn" title="Pause">
            <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          </button>
          <button class="hud-btn" id="restartBtn" title="Recommencer">
            <svg viewBox="0 0 24 24"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
          </button>
          <button class="hud-btn" id="logoutBtn" title="Déconnexion">
            <svg viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
          </button>
        </div>
      </div>
    `
    document.body.appendChild(this.container)

    this.scoreEl = document.getElementById('score')
    this.livesEl = document.getElementById('lives')
    this.levelEl = document.getElementById('level')
    this.muteBtn = document.getElementById('muteBtn')

    this.muteBtn.addEventListener('click', () => {
      const muted = this.onMute()
      this.muteBtn.classList.toggle('muted', muted)
      this.muteBtn.querySelector('svg path').setAttribute('d',
        muted
          ? 'M16.5 12c0-1.8-1-3.3-2.5-4v2.2l2.45 2.45c.03-.2.05-.4.05-.65zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'
          : 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4z'
      )
    })

    document.getElementById('pauseBtn').addEventListener('click', () => this.onPause())
    document.getElementById('restartBtn').addEventListener('click', () => this.onRestart())
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('taxi_user')
      location.reload()
    })
  }

  showPause() {
    this.pauseOverlay = document.createElement('div')
    this.pauseOverlay.id = 'pause-overlay'
    this.pauseOverlay.innerHTML = `
      <div class="pause-card">
        <span class="pause-eyebrow">Jeu en pause</span>
        <h2 class="pause-title">PAUSE</h2>
        <div class="pause-actions">
          <button class="pause-btn pause-btn--main" id="resumeBtn">Reprendre</button>
          <button class="pause-btn pause-btn--secondary" id="restartPauseBtn">Recommencer</button>
          <button class="pause-btn pause-btn--ghost" id="menuBtn">Menu principal</button>
          <button class="pause-btn pause-btn--ghost" id="mutePauseBtn">Son ON</button>
        </div>
      </div>
    `
    document.body.appendChild(this.pauseOverlay)

    document.getElementById('resumeBtn').addEventListener('click', () => this.onPause())
    document.getElementById('restartPauseBtn').addEventListener('click', () => this.onRestart())
    document.getElementById('menuBtn').addEventListener('click', () => this.onMenu())
    document.getElementById('mutePauseBtn').addEventListener('click', () => {
      const muted = this.onMute()
      document.getElementById('mutePauseBtn').textContent = muted ? 'Son OFF' : 'Son ON'
    })
  }

  hidePause() {
    if (this.pauseOverlay) {
      this.pauseOverlay.remove()
      this.pauseOverlay = null
    }
  }

  setUser(user) {
    const el = document.getElementById('username-display')
    if (el && user) {
      el.innerHTML = `
        <div class="hud-user-badge">
          <div class="hud-user-dot"></div>
          <span class="hud-user-name">${user.username}</span>
        </div>
      `
    }
  }

  showPowerup(text, color) {
    this.hidePowerup()
    const el = document.createElement('div')
    el.id = 'powerup-notif'
    el.innerHTML = `
      <div class="powerup-inner" style="border-color:${color}">
        <span class="powerup-text" style="color:${color}">${text}</span>
      </div>
    `
    document.body.appendChild(el)
  }

  hidePowerup() {
    const el = document.getElementById('powerup-notif')
    if (el) el.remove()
  }

  update(score, lives, level) {
    this.scoreEl.textContent = score
    this.levelEl.textContent = level
    const icons = document.querySelectorAll('.life-icon')
    icons.forEach((icon, i) => {
      icon.classList.toggle('lost', i >= lives)
    })
  }

  addStyles() {
    if (document.getElementById('hud-style')) return
    const style = document.createElement('style')
    style.id = 'hud-style'
    style.textContent = `

      #hud {
        position: fixed;
        top: 0; left: 0;
        width: 100%;
        padding: 16px 24px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: start;
        z-index: 100;
        pointer-events: none;
        box-sizing: border-box;
        background: linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%);
      }

      #hud-left {
        display: flex;
        flex-direction: column;
        gap: 6px;
        align-items: flex-start;
      }

      #hud-center {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      #hud-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
      }

      .hud-label {
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        font-size: 10px;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: rgba(255,255,255,0.3);
        display: block;
      }

      .hud-score-block, .hud-level-block {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .hud-level-block { align-items: center; }

      #score {
        font-family: 'Bebas Neue', cursive;
        font-size: 54px;
        color: var(--pink);
        letter-spacing: 3px;
        line-height: 1;
        text-shadow: 0 0 20px rgba(255,77,141,0.4), 2px 2px 0 rgba(0,0,0,0.8);
      }

      #level {
        font-family: 'Bebas Neue', cursive;
        font-size: 54px;
        color: #fff;
        letter-spacing: 3px;
        line-height: 1;
        text-shadow: 2px 2px 0 rgba(0,0,0,0.8);
      }

      .hud-user-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(255,77,141,0.12);
        border: 1px solid rgba(255,77,141,0.25);
        border-radius: 20px;
        padding: 4px 10px 4px 8px;
      }

      .hud-user-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        background: var(--pink);
        box-shadow: 0 0 6px rgba(255,77,141,0.8);
        flex-shrink: 0;
      }

      .hud-user-name {
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        font-weight: 700;
        color: rgba(255,255,255,0.8);
        letter-spacing: 1px;
      }

      #hud-lives-wrap {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
      }

      #lives { 
      display: flex; 
      gap: 6px; 
      align-items: center; 
      }

      .life-icon {
        width: 26px; height: 26px;
        fill: var(--pink);
        filter: drop-shadow(0 0 4px rgba(255,77,141,0.5));
        transition: all 0.2s;
      }

      .life-icon.lost { 
      fill: rgba(255,77,141,0.12); 
      filter: none; 
      }

      #hud-btns { 
      display: flex; 
      gap: 6px; 
      pointer-events: all; 
      }

      .hud-btn {
        pointer-events: all;
        background: rgba(0,0,0,0.4);
        border: 1px solid rgba(255,255,255,0.08);
        color: rgba(255,255,255,0.35);
        width: 34px; height: 34px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.15s;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        backdrop-filter: blur(4px);
      }

      .hud-btn:hover {
        border-color: var(--pink);
        color: var(--pink);
        background: rgba(255,77,141,0.1);
      }

      .hud-btn svg { 
      width: 16px; 
      height: 16px; 
      fill: currentColor;
      }
      .hud-btn.muted { 
      border-color: rgba(255,77,141,0.3); 
      color: rgba(255,77,141,0.3); 
      }

      #powerup-notif {
        position: fixed;
        top: 90px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 110;
        animation: powerupAnim 0.3s ease;
      }

      .powerup-inner {
        background: rgba(0,0,0,0.6);
        border-left: 3px solid;
        border-radius: 4px;
        padding: 8px 20px;
        backdrop-filter: blur(4px);
      }

      .powerup-text {
        font-family: 'Bebas Neue', cursive;
        font-size: 26px;
        letter-spacing: 4px;
        text-shadow: 1px 1px 0 rgba(0,0,0,0.8);
      }

      @keyframes powerupAnim {
        from { 
        opacity: 0; 
        transform: translateX(-50%) translateY(-10px); 
        }
        to { 
        opacity: 1; 
        transform: translateX(-50%) translateY(0); 
        }
      }

      #pause-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 150;
        backdrop-filter: blur(6px);
      }

      .pause-card {
        background: #1a1a2e;
        border: 2px solid rgba(255,77,141,0.25);
        border-radius: 20px;
        padding: 44px 40px;
        width: 340px;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 60px rgba(255,77,141,0.08);
      }

      .pause-eyebrow {
        font-family: 'Inter', sans-serif;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 4px;
        text-transform: uppercase;
        color: var(--pink);
        margin-bottom: 8px;
      }

      .pause-title {
        font-family: 'Bebas Neue', cursive;
        font-size: 80px;
        color: #fff;
        letter-spacing: 8px;
        line-height: 1;
        margin: 0 0 32px;
        text-shadow: 0 0 40px rgba(255,77,141,0.25);
      }

      .pause-actions {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .pause-btn {
        width: 100%;
        padding: 15px;
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        font-size: 14px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.15s;
        border: 2px solid transparent;
      }

      .pause-btn--main {
        background: var(--pink);
        color: #fff;
        border-color: var(--pink);
        box-shadow: 0 4px 0 var(--pink-dark);
      }

      .pause-btn--main:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 0 var(--pink-dark);
      }

      .pause-btn--main:active {
        transform: translateY(2px);
        box-shadow: 0 2px 0 var(--pink-dark);
      }

      .pause-btn--secondary {
        background: rgba(255,255,255,0.05);
        color: rgba(255,255,255,0.7);
        border-color: rgba(255,255,255,0.1);
      }

      .pause-btn--secondary:hover {
        border-color: rgba(255,255,255,0.25);
        color: #fff;
      }

      .pause-btn--ghost {
        background: transparent;
        color: rgba(255,255,255,0.3);
        border-color: rgba(255,255,255,0.06);
        font-size: 13px;
      }

      .pause-btn--ghost:hover {
        color: rgba(255,255,255,0.6);
        border-color: rgba(255,255,255,0.12);
      }
    `
    document.head.appendChild(style)
  }
}