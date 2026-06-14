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
      <div class="a-wrap">
        <div class="a-left">
          <span class="a-eyebrow">Commences une partie !!!!</span>
          <h1 class="a-logo">
            <span class="a-logo-solid">VROUM</span>
            <span class="a-logo-outline">VROUM</span>
          </h1>
        </div>

        <div class="a-right">
          <div class="a-form-wrap">
            <div class="a-tabs">
              <button class="a-tab active" id="loginTab">Connexion</button>
              <button class="a-tab" id="registerTab">Inscription</button>
            </div>

            <div id="loginForm" class="a-form">
              <div class="a-field">
                <label>Email</label>
                <input type="email" id="loginEmail" placeholder="ton@email.fr" />
              </div>
              <div class="a-field">
                <label>Mot de passe</label>
                <input type="password" id="loginPassword" placeholder="••••••••" />
              </div>
              <button class="a-btn a-btn--main" id="loginBtn">Se connecter</button>
              <button class="a-btn a-btn--ghost" id="guestBtn">Jouer en invité</button>
            </div>

            <div id="registerForm" class="a-form" style="display:none">
              <div class="a-field">
                <label>Pseudo</label>
                <input type="text" id="regUsername" placeholder="MonPseudo" />
              </div>
              <div class="a-field">
                <label>Email</label>
                <input type="email" id="regEmail" placeholder="ton@email.fr" />
              </div>
              <div class="a-field">
                <label>Mot de passe</label>
                <input type="password" id="regPassword" placeholder="••••••••" />
              </div>
              <button class="a-btn a-btn--main" id="registerBtn">Créer mon compte</button>
            </div>

            <p id="authError" class="a-error"></p>
            <button class="a-mute" id="authMuteBtn">Son ON</button>
          </div>
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
      await this.login(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value)
    })

    document.getElementById('registerBtn').addEventListener('click', async () => {
      await this.register(document.getElementById('regUsername').value, document.getElementById('regEmail').value, document.getElementById('regPassword').value)
    })

    document.getElementById('guestBtn').addEventListener('click', () => {
      this.currentUser = { username: 'Invité', token: null }
      this.hide()
      this.onLogin(this.currentUser)
    })

    document.getElementById('authMuteBtn').addEventListener('click', () => {
      if (window.gameInstance) {
        const muted = window.gameInstance.soundManager.toggleMute()
        document.getElementById('authMuteBtn').textContent = muted ? 'Son OFF' : 'Son ON'
      }
    })
  }

  async login(email, password) {
    const btn = document.getElementById('loginBtn')
    btn.textContent = 'Connexion...'
    btn.disabled = true
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
        this.showError('Email ou mot de passe incorrect')
        btn.textContent = 'Se connecter'
        btn.disabled = false
      }
    } catch {
      this.showError('Serveur indisponible')
      btn.textContent = 'Se connecter'
      btn.disabled = false
    }
  }

  async register(username, email, password) {
    const btn = document.getElementById('registerBtn')
    btn.textContent = 'Création...'
    btn.disabled = true
    try {
      const res = await fetch('http://localhost:8000/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/ld+json' },
        body: JSON.stringify({ username, email, plainPassword: password })
      })
      if (res.ok) {
        this.showError('Compte créé ! Connecte-toi.', true)
        document.getElementById('loginTab').click()
      } else {
        this.showError('Erreur lors de l\'inscription')
        btn.textContent = 'Créer mon compte'
        btn.disabled = false
      }
    } catch {
      this.showError('Serveur indisponible')
      btn.textContent = 'Créer mon compte'
      btn.disabled = false
    }
  }

  showError(msg, success = false) {
    const el = document.getElementById('authError')
    if (el) {
      el.textContent = msg
      el.style.color = success ? '#22c55e' : '#ef4444'
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

      #auth { 
      position: fixed; 
      inset: 0; 
      z-index: 300; 
      font-family: 'Inter', sans-serif; 
      }

      .a-wrap { 
      width: 100%; 
      height: 100%; 
      display: flex; 
      }

      .a-left {
        flex: 1;
        background: var(--dark);
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 60px 50px;
        position: relative;
        overflow: hidden;
      }

      .a-left::before {
        content: '';
        position: absolute; inset: 0;
        background:
          radial-gradient(ellipse at 0% 0%, rgba(255,77,141,0.2) 0%, transparent 50%),
          radial-gradient(ellipse at 100% 100%, rgba(255,217,61,0.08) 0%, transparent 50%);
        pointer-events: none;
      }

      .a-eyebrow {
        display: block;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 5px;
        text-transform: uppercase;
        color: var(--pink);
        margin-bottom: 14px;
        position: relative; z-index: 1;
      }

      .a-logo {
        display: flex;
        flex-direction: column;
        margin-bottom: 24px;
        position: relative; z-index: 1;
      }

      .a-logo-solid {
        font-family: 'Bebas Neue', cursive;
        font-size: 110px;
        line-height: 0.85;
        color: var(--pink);
        letter-spacing: 6px;
        display: block;
        text-shadow: 0 0 60px rgba(255,77,141,0.3);
      }

      .a-logo-outline {
        font-family: 'Bebas Neue', cursive;
        font-size: 110px;
        line-height: 0.85;
        color: transparent;
        -webkit-text-stroke: 2px rgba(255,255,255,0.15);
        letter-spacing: 6px;
        display: block;
      }

      .a-right {
        width: 420px;
        background: var(--gray-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 50px 44px;
        overflow-y: auto;
      }

      .a-form-wrap { 
      width: 100%; 
      display: flex; 
      flex-direction: column; 
      gap: 20px; 
      }

      .a-tabs { 
      display: flex; 
      border-bottom: 2px solid #e5e5e5; 
      }

      .a-tab {
        flex: 1;
        padding: 12px;
        font-weight: 700;
        font-size: 14px;
        background: transparent;
        color: var(--gray-text);
        border: none;
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
        cursor: pointer;
        transition: all 0.15s;
        font-family: 'Inter', sans-serif;
      }

      .a-tab.active { 
      color: var(--pink); 7
      border-bottom-color: var(--pink); 
      }

      .a-form { 
      display: flex; 
      flex-direction: column; 
      gap: 14px; 
      }

      .a-field { 
      display: flex; 
      flex-direction: column; 
      gap: 6px; 
      }

      .a-field label {
        font-size: 12px;
        font-weight: 700;
        color: #555;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .a-field input {
        padding: 13px 14px;
        font-size: 14px;
        font-family: 'Inter', sans-serif;
        background: #fff;
        border: 2px solid var(--gray-border);
        color: #111;
        outline: none;
        border-radius: 10px;
        transition: all 0.15s;
      }

      .a-field input:focus {
        border-color: var(--pink);
        box-shadow: 0 0 0 3px rgba(255,77,141,0.1);
      }

      .a-field input::placeholder { 
      color: #ccc; 
      }

      .a-btn {
        padding: 15px;
        font-weight: 700;
        font-size: 14px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.15s;
        width: 100%;
        border: 2px solid transparent;
        font-family: 'Inter', sans-serif;
      }

      .a-btn--main {
        background: var(--pink);
        color: #fff;
        border-color: var(--pink);
        box-shadow: 0 4px 0 var(--pink-dark);
      }

      .a-btn--main:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 0 var(--pink-dark);
      }

      .a-btn--main:active { 
      transform: translateY(2px); 
      box-shadow: 0 2px 0 var(--pink-dark); 
      }
      .a-btn--main:disabled { 
      opacity: 0.6; 
      transform: none; 
      }

      .a-btn--ghost {
        background: transparent;
        color: #aaa;
        border-color: var(--gray-border);
        font-size: 13px;
      }

      .a-btn--ghost:hover { 
      border-color: #ccc; 
      color: #666; 
      }

      .a-error {
        font-size: 13px;
        font-weight: 600;
        min-height: 18px;
        text-align: center;
      }

      .a-mute {
        font-weight: 600;
        font-size: 12px;
        background: transparent;
        border: 1.5px solid var(--gray-border);
        color: var(--gray-text);
        padding: 9px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.15s;
        width: 100%;
        font-family: 'Inter', sans-serif;
      }

      .a-mute:hover { 
      border-color: var(--pink); 
      color: var(--pink); 
      }

      @media (max-width: 768px) {
        .a-left { display: none; }
        .a-right { width: 100%; }
      }
    `
    document.head.appendChild(style)
  }
}