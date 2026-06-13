export default class Menu {
  constructor(onStart) {
    this.onStart = onStart
    this.container = null
    this.selectedLevel = 1
  }

  showStart(user = null) {
    this.container = document.createElement('div')
    this.container.id = 'menu'

    const adminBtn = user && user.isAdmin ? `
      <a href="http://localhost:8000/admin/jwt-login?token=${user.token}" target="_blank" class="af-admin-btn">
        DASHBOARD ADMIN →
      </a>
    ` : ''

    this.container.innerHTML = `
      <div class="af-bg">
        <div class="af-menu-wrap">
          <div class="af-menu-title-wrap">
            <h1 class="af-menu-title">VROUM</h1>
            <h1 class="af-menu-title shadow">VROUM</h1>
            <p class="af-menu-sub">// ENDLESS TAXI RUNNER //</p>
          </div>
          <div class="af-menu-card">
            ${adminBtn}
            <div class="af-section-label">DIFFICULTÉ</div>
            <div class="af-levels">
              <button class="af-lvl active" data-level="1">
                <span class="af-lvl-icon">🌱</span>
                <span class="af-lvl-name">FACILE</span>
              </button>
              <button class="af-lvl" data-level="2">
                <span class="af-lvl-icon">🔥</span>
                <span class="af-lvl-name">MOYEN</span>
              </button>
              <button class="af-lvl" data-level="3">
                <span class="af-lvl-icon">💀</span>
                <span class="af-lvl-name">HARDCORE</span>
              </button>
            </div>
            <button class="af-play-btn" id="startBtn">JOUER →</button>
            <div class="af-menu-bottom">
              <button class="af-bottom-btn" id="menuMuteBtn">🔊 SON</button>
              <button class="af-bottom-btn red" id="menuLogoutBtn">⏏ DÉCONNEXION</button>
            </div>
            <div class="af-controls">
              <span>⬅️ ➡️ CHANGER DE VOIE</span>
              <span>•</span>
              <span>ESPACE PAUSE</span>
            </div>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(this.container)
    this.addStyles()
    this.bindLevelButtons()
    document.getElementById('startBtn').addEventListener('click', () => {
      this.hide()
      this.onStart(this.selectedLevel)
    })
  }

  showGameOver(score, user = null) {
    this.container = document.createElement('div')
    this.container.id = 'menu'
    this.container.innerHTML = `
      <div class="af-bg">
        <div class="af-menu-wrap">

          <div class="af-gameover-header">
            <p class="af-gameover-label">GAME OVER</p>
            <div class="af-gameover-score">${score}<span>PTS</span></div>
          </div>

          <div class="af-menu-card">
            <div id="leaderboard" class="af-leaderboard">
              <p class="af-loading">CHARGEMENT...</p>
            </div>
            <button class="af-play-btn" id="startBtn">REJOUER →</button>
          </div>

        </div>
      </div>
    `
    document.body.appendChild(this.container)
    this.addStyles()
    this.saveAndLoadScores(score, user)
    document.getElementById('startBtn').addEventListener('click', () => {
      this.hide()
      this.onStart(this.selectedLevel)
    })
  }

  async saveAndLoadScores(score, user) {
    let shareLink = null

    if (user && user.token) {
      try {
        const res = await fetch('http://localhost:8000/api/scores/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ points: score, duration: window.gameInstance?.scoreManager?.getDuration() || 1 })
        })
        const data = await res.json()
        if (data.shareToken) {
          shareLink = `http://localhost:8000/score/share/${data.shareToken}`
        }
      } catch {
        // erreur silencieuse
      }
    }

    const localScores = JSON.parse(localStorage.getItem('taxi_scores') || '[]')
    localScores.push({ score, date: new Date().toLocaleDateString() })
    localScores.sort((a, b) => b.score - a.score)
    const top5 = localScores.slice(0, 5)
    localStorage.setItem('taxi_scores', JSON.stringify(top5))

    const lb = document.getElementById('leaderboard')
    if (!lb) return
    lb.innerHTML = `
      <div class="af-lb-title">🏆 MEILLEURS SCORES</div>
      ${top5.map((s, i) => `
        <div class="af-lb-row ${i === 0 ? 'first' : ''}">
          <span class="af-lb-rank">${i + 1}</span>
          <span class="af-lb-score">${s.score} PTS</span>
          <span class="af-lb-date">${s.date}</span>
        </div>
      `).join('')}
      ${shareLink ? `
        <a href="${shareLink}" target="_blank" class="af-share-btn">
          🔗 PARTAGER MON SCORE →
        </a>
      ` : ''}
    `
  }

  bindLevelButtons() {
    document.querySelectorAll('.af-lvl').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.af-lvl').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        this.selectedLevel = parseInt(btn.dataset.level)
      })
    })

    document.getElementById('menuMuteBtn').addEventListener('click', () => {
      if (window.gameInstance) {
        const muted = window.gameInstance.soundManager.toggleMute()
        document.getElementById('menuMuteBtn').textContent = muted ? '🔇 SON OFF' : '🔊 SON'
      }
    })

    document.getElementById('menuLogoutBtn').addEventListener('click', () => {
      localStorage.removeItem('taxi_user')
      location.reload()
    })
  }

  addStyles() {
    if (document.getElementById('menu-style')) return
    const style = document.createElement('style')
    style.id = 'menu-style'
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@700;900&display=swap');

      #menu {
        position: fixed;
        inset: 0;
        z-index: 200;
      }

      .af-bg {
        width: 100%;
        height: 100%;
        background: #0d0d0d;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image:
          repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px),
          repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px);
      }

      .af-menu-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        width: 420px;
      }

      .af-menu-title-wrap {
        position: relative;
        text-align: center;
      }

      .af-menu-title {
        font-family: 'Bebas Neue', cursive;
        font-size: 110px;
        line-height: 0.9;
        color: #fff;
        letter-spacing: 10px;
        display: block;
        transform: skewX(-5deg);
      }

      .af-menu-title.shadow {
        color: #FFD700;
        position: absolute;
        top: 4px;
        left: 4px;
        z-index: -1;
      }

      .af-menu-sub {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 12px;
        letter-spacing: 6px;
        color: rgba(255,255,255,0.25);
        margin-top: 8px;
      }

      .af-menu-card {
        background: #1a1a1a;
        border: 3px solid #FFD700;
        border-radius: 4px;
        padding: 28px;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .af-section-label {
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 900;
        font-size: 11px;
        letter-spacing: 4px;
        color: rgba(255,255,255,0.25);
      }

      .af-levels {
        display: flex;
        gap: 8px;
      }

      .af-lvl {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 14px 8px;
        background: #111;
        border: 2px solid #333;
        border-radius: 2px;
        cursor: pointer;
        transition: all 0.15s;
        color: rgba(255,255,255,0.4);
      }

      .af-lvl:hover {
        border-color: #555;
        color: rgba(255,255,255,0.7);
      }

      .af-lvl.active {
        background: #FFD700;
        border-color: #FFD700;
        color: #000;
      }

      .af-lvl-icon { font-size: 22px; }

      .af-lvl-name {
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 900;
        font-size: 13px;
        letter-spacing: 1px;
      }

      .af-play-btn {
        padding: 18px;
        font-family: 'Bebas Neue', cursive;
        font-size: 32px;
        letter-spacing: 4px;
        background: #FFD700;
        color: #000;
        border: none;
        cursor: pointer;
        border-radius: 2px;
        transition: all 0.15s;
        width: 100%;
      }

      .af-play-btn:hover {
        background: #ffe44d;
        transform: translateY(-2px);
      }

      .af-controls {
        display: flex;
        justify-content: center;
        gap: 12px;
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 12px;
        letter-spacing: 1px;
        color: rgba(255,255,255,0.2);
      }

      .af-gameover-header {
        text-align: center;
      }

      .af-gameover-label {
        font-family: 'Bebas Neue', cursive;
        font-size: 72px;
        color: #ff4444;
        letter-spacing: 6px;
        line-height: 1;
        text-shadow: 4px 4px 0 #000;
      }

      .af-gameover-score {
        font-family: 'Bebas Neue', cursive;
        font-size: 80px;
        color: #FFD700;
        letter-spacing: 4px;
        line-height: 1;
      }

      .af-gameover-score span {
        font-size: 32px;
        color: rgba(255,215,0,0.5);
        margin-left: 8px;
      }

      .af-leaderboard {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .af-lb-title {
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 900;
        font-size: 12px;
        letter-spacing: 3px;
        color: rgba(255,255,255,0.3);
        margin-bottom: 8px;
      }

      .af-lb-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        background: #111;
        border: 2px solid #222;
        border-radius: 2px;
      }

      .af-lb-row.first {
        border-color: #FFD700;
        background: rgba(255,215,0,0.08);
      }

      .af-lb-rank {
        font-family: 'Bebas Neue', cursive;
        font-size: 22px;
        color: rgba(255,255,255,0.3);
        width: 24px;
      }

      .af-lb-row.first .af-lb-rank { color: #FFD700; }

      .af-lb-score {
        font-family: 'Bebas Neue', cursive;
        font-size: 24px;
        color: #fff;
        flex: 1;
        letter-spacing: 2px;
      }

      .af-lb-date {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 12px;
        color: rgba(255,255,255,0.25);
      }

      .af-loading {
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700;
        font-size: 14px;
        letter-spacing: 3px;
        color: rgba(255,255,255,0.2);
        text-align: center;
      }

      .af-admin-btn {
        display: block;
        width: 100%;
        padding: 12px;
        font-family: 'Bebas Neue', cursive;
        font-size: 18px;
        letter-spacing: 2px;
        background: rgba(255,215,0,0.08);
        color: #FFD700;
        border: 2px solid #FFD700;
        text-align: center;
        text-decoration: none;
        border-radius: 2px;
        transition: all 0.15s;
        box-sizing: border-box;
      }

      .af-admin-btn:hover {
        background: rgba(255,215,0,0.18);
        transform: translateY(-1px);
      }

      .af-menu-bottom {
        display: flex;
        gap: 8px;
      }

      .af-bottom-btn {
        flex: 1;
        padding: 12px;
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 900;
        font-size: 14px;
        letter-spacing: 2px;
        background: #111;
        color: rgba(255,255,255,0.4);
        border: 2px solid #333;
        cursor: pointer;
        border-radius: 2px;
        transition: all 0.15s;
      }

      .af-bottom-btn:hover {
        border-color: #555;
        color: rgba(255,255,255,0.7);
      }

      .af-bottom-btn.red {
        color: #ff4444;
        border-color: #ff4444;
        background: rgba(255,68,68,0.05);
      }

      .af-bottom-btn.red:hover {
        background: rgba(255,68,68,0.1);
      }

      .af-share-btn {
      display: block;
      margin-top: 12px;
      padding: 12px;
      font-family: 'Bebas Neue', cursive;
      font-size: 18px;
      letter-spacing: 2px;
      background: rgba(255,215,0,0.08);
      color: #FFD700;
      border: 2px solid #FFD700;
      text-align: center;
      text-decoration: none;
      border-radius: 2px;
      transition: all 0.15s;
    }

    .af-share-btn:hover {
      background: rgba(255,215,0,0.18);
    }
    `
    document.head.appendChild(style)
  }

  hide() {
    if (this.container) {
      this.container.remove()
      this.container = null
    }
  }
}