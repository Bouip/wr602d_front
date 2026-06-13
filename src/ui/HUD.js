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
        <div id="hud-score-wrap">
          <span class="hud-label">SCORE</span>
          <span id="score">0</span>
        </div>
        <div id="username-display"></div>
      </div>

      <div id="hud-center">
        <div id="hud-level-wrap">
          <span class="hud-label">NIVEAU</span>
          <span id="level">1</span>
        </div>
      </div>

      <div id="hud-right">
        <div id="hud-lives-wrap">
          <span class="hud-label">VIES</span>
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
        <h2 class="pause-title">PAUSE</h2>
        <button class="af-pause-btn primary" id="resumeBtn">REPRENDRE →</button>
        <button class="af-pause-btn secondary" id="restartPauseBtn">RECOMMENCER</button>
        <button class="af-pause-btn ghost" id="menuBtn">MENU PRINCIPAL</button>
        <button class="af-pause-btn ghost" id="mutePauseBtn">${this.muteBtn.textContent === '🔇' ? '🔇 SON OFF' : '🔊 SON ON'}</button>
      </div>
    `
    document.body.appendChild(this.pauseOverlay)

    document.getElementById('resumeBtn').addEventListener('click', () => this.onPause())
    document.getElementById('restartPauseBtn').addEventListener('click', () => this.onRestart())
    document.getElementById('menuBtn').addEventListener('click', () => this.onMenu())
    document.getElementById('mutePauseBtn').addEventListener('click', () => {
      const muted = this.onMute()
      this.muteBtn.textContent = muted ? '🔇' : '🔊'
      document.getElementById('mutePauseBtn').textContent = muted ? '🔇 SON OFF' : '🔊 SON ON'
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
    if (el) el.textContent = user ? `// ${user.username.toUpperCase()} //` : ''
  }

  showPowerup(text, color) {
    this.hidePowerup()
    const el = document.createElement('div')
    el.id = 'powerup-notif'
    el.textContent = text
    el.style.cssText = `
      position: fixed;
      top: 90px;
      left: 50%;
      transform: translateX(-50%) skewX(-5deg);
      font-family: 'Bebas Neue', cursive;
      font-size: 36px;
      letter-spacing: 3px;
      color: ${color};
      text-shadow: 3px 3px 0 #000;
      z-index: 110;
      animation: powerupAnim 0.3s ease;
      border-left: 4px solid ${color};
      padding-left: 12px;
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
      if (i < lives) {
        icon.classList.remove('lost')
      } else {
        icon.classList.add('lost')
      }
    })
  }

  addStyles() {
    if (document.getElementById('hud-style')) return
    const style = document.createElement('style')
    style.id = 'hud-style'
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@700;900&display=swap');

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
        background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%);
      }

      #hud-left {
        display: flex;
        flex-direction: column;
        gap: 2px;
        align-items: flex-start;
      }

      #hud-center {
        display: flex;
        justify-content: center;
        align-items: flex-start;
      }

      #hud-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
      }

      .hud-label {
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 900;
        font-size: 10px;
        letter-spacing: 4px;
        color: rgba(255,255,255,0.35);
        display: block;
      }

      #score {
        font-family: 'Bebas Neue', cursive;
        font-size: 52px;
        color: #FFD700;
        letter-spacing: 3px;
        line-height: 1;
        text-shadow: 3px 3px 0 rgba(0,0,0,0.8);
      }

      #level {
        font-family: 'Bebas Neue', cursive;
        font-size: 52px;
        color: #00ff88;
        letter-spacing: 3px;
        line-height: 1;
        text-shadow: 3px 3px 0 rgba(0,0,0,0.8);
      }

      #hud-level-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      #username-display {
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700;
        font-size: 12px;
        letter-spacing: 2px;
        color: rgba(255,255,255,0.25);
        margin-top: 2px;
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
        width: 28px;
        height: 28px;
        fill: #ff4444;
        filter: drop-shadow(2px 2px 0 rgba(0,0,0,0.8));
        transition: all 0.2s;
      }

      .life-icon.lost {
        fill: rgba(255,68,68,0.15);
      }

      #hud-btns {
        display: flex;
        gap: 6px;
        pointer-events: all;
      }

      .hud-btn {
        pointer-events: all;
        background: rgba(0,0,0,0.5);
        border: 1px solid rgba(255,255,255,0.12);
        color: rgba(255,255,255,0.5);
        width: 34px;
        height: 34px;
        border-radius: 2px;
        cursor: pointer;
        transition: all 0.15s;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }

      .hud-btn:hover {
        border-color: #FFD700;
        color: #FFD700;
        background: rgba(255,215,0,0.1);
      }

      .hud-btn svg {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }

      .hud-btn.muted {
        border-color: #ff4444;
        color: #ff4444;
      }

      #pause-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 150;
      }

      .pause-card {
        background: #111;
        border: 3px solid #FFD700;
        border-radius: 2px;
        padding: 40px 36px;
        width: 300px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
      }

      .pause-title {
        font-family: 'Bebas Neue', cursive;
        font-size: 72px;
        color: #FFD700;
        letter-spacing: 8px;
        text-shadow: 4px 4px 0 #000;
        margin: 0 0 12px;
        transform: skewX(-4deg);
        display: block;
      }

      .af-pause-btn {
        width: 100%;
        padding: 14px;
        font-family: 'Bebas Neue', cursive;
        font-size: 22px;
        letter-spacing: 3px;
        border: none;
        cursor: pointer;
        border-radius: 2px;
        transition: all 0.15s;
      }

      .af-pause-btn.primary {
        background: #FFD700;
        color: #000;
      }

      .af-pause-btn.primary:hover {
        background: #ffe44d;
        transform: translateY(-1px);
      }

      .af-pause-btn.secondary {
        background: #222;
        color: #fff;
        border: 2px solid #444;
      }

      .af-pause-btn.secondary:hover { border-color: #fff; }

      .af-pause-btn.ghost {
        background: transparent;
        color: rgba(255,255,255,0.35);
        border: 1px solid #333;
        font-size: 16px;
        letter-spacing: 2px;
      }

      .af-pause-btn.ghost:hover {
        color: rgba(255,255,255,0.6);
        border-color: #555;
      }

      @keyframes powerupAnim {
        from { opacity: 0; transform: translateX(-50%) skewX(-5deg) translateY(-15px); }
        to { opacity: 1; transform: translateX(-50%) skewX(-5deg) translateY(0); }
      }
    `
    document.head.appendChild(style)
  }
}