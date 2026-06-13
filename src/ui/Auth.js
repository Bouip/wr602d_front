export default class Auth {
  constructor(onLogin) {
    this.onLogin = onLogin
    this.container = null
    this.currentUser = null
  }

  show() {
    const saved = localStorage.getItem('taxi_user')
    if (saved) {
      this.currentUser = JSON.parse(saved)
      this.onLogin(this.currentUser)
      return
    }

    this.container = document.createElement('div')
    this.container.id = 'auth'
    this.container.innerHTML = `
      <div class="af-bg">
        <button class="af-mute-floating" id="authMuteBtn">🔊</button>
        <div class="af-header">
          <div class="af-title-wrap">
            <h1 class="af-title">VROUM</h1>
            <h1 class="af-title accent">VROUM</h1>
          </div>
          <p class="af-tagline">// ENDLESS TAXI RUNNER //</p>
        </div>

        <div class="af-card">
          <div class="af-tabs">
            <button class="af-tab active" id="loginTab">CONNEXION</button>
            <button class="af-tab" id="registerTab">INSCRIPTION</button>
          </div>

          <div id="loginForm" class="af-form">
            <input class="af-input" type="email" id="loginEmail" placeholder="EMAIL" />
            <input class="af-input" type="password" id="loginPassword" placeholder="MOT DE PASSE" />
            <button class="af-btn green" id="loginBtn">SE CONNECTER →</button>
            <button class="af-btn ghost" id="guestBtn">👻 JOUER EN INVITÉ</button>
          </div>

          <div id="registerForm" class="af-form" style="display:none">
            <input class="af-input" type="text" id="regUsername" placeholder="PSEUDO" />
            <input class="af-input" type="email" id="regEmail" placeholder="EMAIL" />
            <input class="af-input" type="password" id="regPassword" placeholder="MOT DE PASSE" />
            <button class="af-btn green" id="registerBtn">CRÉER MON COMPTE →</button>
          </div>

          <p id="authError" class="af-error"></p>
        </div>
      </div>
    `
    document.body.appendChild(this.container)
    this.addStyles()
    this.bindEvents()
  }

  bindEvents() {

    const startMenuMusic = () => {
      if (window.gameInstance) {
        window.gameInstance.soundManager.init()
        window.gameInstance.soundManager.playMenuMusic()
      }
      document.removeEventListener('click', startMenuMusic)
    }
    document.addEventListener('click', startMenuMusic)

    document.getElementById('loginTab').addEventListener('click', () => {
      document.getElementById('loginForm').style.display = 'flex'
      document.getElementById('registerForm').style.display = 'none'
      document.getElementById('loginTab').classList.add('active')
      document.getElementById('registerTab').classList.remove('active')
    })

    document.getElementById('registerTab').addEventListener('click', () => {
      document.getElementById('registerForm').style.display = 'flex'
      document.getElementById('loginForm').style.display = 'none'
      document.getElementById('registerTab').classList.add('active')
      document.getElementById('loginTab').classList.remove('active')
    })

    document.getElementById('loginBtn').addEventListener('click', async () => {
      await this.login(
        document.getElementById('loginEmail').value,
        document.getElementById('loginPassword').value
      )
    })

    document.getElementById('registerBtn').addEventListener('click', async () => {
      await this.register(
        document.getElementById('regUsername').value,
        document.getElementById('regEmail').value,
        document.getElementById('regPassword').value
      )
    })

    document.getElementById('guestBtn').addEventListener('click', () => {
      this.currentUser = { username: 'Invité', token: null }
      this.hide()
      this.onLogin(this.currentUser)
    })

    document.getElementById('authMuteBtn').addEventListener('click', () => {
      if (window.gameInstance) {
        const muted = window.gameInstance.soundManager.toggleMute()
        document.getElementById('authMuteBtn').textContent = muted ? '🔇' : '🔊'
      }
    })
  }

  async login(email, password) {
    const btn = document.getElementById('loginBtn')
    btn.textContent = '⏳ CONNEXION...'
    try {
      const res = await fetch('http://localhost:8000/api/login_check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.token) {
        const payload = JSON.parse(atob(data.token.split('.')[1]))
        const isAdmin = payload.roles && payload.roles.includes('ROLE_ADMIN')
        this.currentUser = { username: email.split('@')[0], token: data.token, isAdmin }
        localStorage.setItem('taxi_user', JSON.stringify(this.currentUser))
        this.hide()
        this.onLogin(this.currentUser)
      } else {
        this.showError('❌ EMAIL OU MOT DE PASSE INCORRECT')
        btn.textContent = 'SE CONNECTER →'
      }
    } catch {
      this.showError('❌ SERVEUR INDISPONIBLE')
      btn.textContent = 'SE CONNECTER →'
    }
  }

  async register(username, email, password) {
    const btn = document.getElementById('registerBtn')
    btn.textContent = '⏳ CRÉATION...'
    try {
      const res = await fetch('http://localhost:8000/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/ld+json' },
        body: JSON.stringify({ username, email, plainPassword: password })
      })
      if (res.ok) {
        this.showError('✅ COMPTE CRÉÉ ! CONNECTE-TOI.')
        document.getElementById('loginTab').click()
      } else {
        this.showError('❌ ERREUR LORS DE L\'INSCRIPTION')
        btn.textContent = 'CRÉER MON COMPTE →'
      }
    } catch {
      this.showError('❌ SERVEUR INDISPONIBLE')
      btn.textContent = 'CRÉER MON COMPTE →'
    }
  }

  showError(msg) {
    const el = document.getElementById('authError')
    if (el) {
      el.textContent = msg
      el.style.color = msg.startsWith('✅') ? '#00ff88' : '#ff4444'
    }
  }

  hide() {
    if (this.container) {
      this.container.remove()
      this.container = null
    }
  }

  addStyles() {
    if (document.getElementById('auth-style')) return
    const style = document.createElement('style')
    style.id = 'auth-style'
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@700;900&display=swap');

      #auth {
        position: fixed;
        inset: 0;
        z-index: 300;
      }

      .af-bg {
        width: 100%;
        height: 100%;
        background: #0d0d0d;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
        background-image:
          repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px),
          repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px);
      }

      .af-header { text-align: center; }

      .af-title-wrap {
        position: relative;
        display: inline-block;
      }

      .af-title {
        font-family: 'Bebas Neue', cursive;
        font-size: 90px;
        line-height: 0.9;
        color: #fff;
        letter-spacing: 8px;
        display: block;
        transform: skewX(-5deg);
      }

      .af-title.accent {
        color: #FFD700;
        position: absolute;
        top: 3px;
        left: 3px;
        z-index: -1;
      }

      .af-tagline {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 13px;
        letter-spacing: 5px;
        color: rgba(255,255,255,0.3);
        margin-top: 8px;
      }

      .af-card {
        background: #1a1a1a;
        border: 3px solid #FFD700;
        border-radius: 4px;
        padding: 28px;
        width: 360px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .af-tabs {
        display: flex;
        gap: 0;
        border: 2px solid #333;
        border-radius: 2px;
        overflow: hidden;
      }

      .af-tab {
        flex: 1;
        padding: 10px;
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 900;
        font-size: 14px;
        letter-spacing: 2px;
        background: transparent;
        color: rgba(255,255,255,0.3);
        border: none;
        cursor: pointer;
        transition: all 0.15s;
      }

      .af-tab.active {
        background: #FFD700;
        color: #000;
      }

      .af-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .af-input {
        padding: 13px 15px;
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700;
        font-size: 15px;
        letter-spacing: 2px;
        background: #111;
        border: 2px solid #333;
        color: #fff;
        outline: none;
        border-radius: 2px;
        transition: border-color 0.15s;
      }

      .af-input::placeholder { color: #444; }

      .af-input:focus { border-color: #FFD700; }

      .af-btn {
        padding: 14px;
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 900;
        font-size: 16px;
        letter-spacing: 2px;
        border: none;
        cursor: pointer;
        border-radius: 2px;
        transition: all 0.15s;
      }

      .af-btn.green {
        background: #FFD700;
        color: #000;
      }

      .af-btn.green:hover {
        background: #ffe44d;
        transform: translateY(-1px);
      }

      .af-btn.ghost {
        background: transparent;
        color: rgba(255,255,255,0.4);
        border: 2px solid #333;
        font-size: 14px;
      }

      .af-btn.ghost:hover {
        border-color: #555;
        color: rgba(255,255,255,0.7);
      }

      .af-error {
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700;
        font-size: 13px;
        letter-spacing: 1px;
        min-height: 18px;
        text-align: center;
      }

      .af-mute-floating {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.5);
        border: 2px solid #FFD700;
        color: #FFD700;
        font-size: 20px;
        width: 42px;
        height: 42px;
        border-radius: 2px;
        cursor: pointer;
      }
    `
    document.head.appendChild(style)
  }
}