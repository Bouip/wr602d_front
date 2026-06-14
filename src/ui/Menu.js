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
      <a href="http://localhost:8000/admin/jwt-login?token=${user.token}" target="_blank" class="m-admin">Dashboard Admin</a>
    ` : ''

    const bestScore = (() => {
      const scores = JSON.parse(localStorage.getItem('taxi_scores') || '[]')
      return scores.length > 0 ? scores[0].score : null
    })()

    const bestScoreBadge = bestScore ? `
      <div class="m-best-score">
        <span class="m-best-label">Meilleur score du jeu</span>
        <span class="m-best-num">${bestScore} pts</span>
      </div>
    ` : ''

    this.container.innerHTML = `
      <div class="m-wrap">
        <div class="m-hero">

          <div class="m-particles">
            ${Array.from({length: 20}, () => `<div class="m-particle" style="--x:${Math.random()*100}%;--d:${(Math.random()*3+1).toFixed(1)}s;--s:${(Math.random()*4+2).toFixed(1)}px;--delay:${(Math.random()*3).toFixed(1)}s"></div>`).join('')}
          </div>

          <div class="m-cityscape">
            <svg viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <rect x="0" y="80" width="60" height="120" fill="rgba(255,255,255,0.04)"/>
              <rect x="10" y="50" width="40" height="30" fill="rgba(255,255,255,0.04)"/>
              <rect x="20" y="30" width="20" height="20" fill="rgba(255,255,255,0.04)"/>
              <rect x="70" y="100" width="80" height="100" fill="rgba(255,255,255,0.05)"/>
              <rect x="90" y="70" width="40" height="30" fill="rgba(255,255,255,0.05)"/>
              <rect x="160" y="60" width="50" height="140" fill="rgba(255,255,255,0.04)"/>
              <rect x="170" y="40" width="30" height="20" fill="rgba(255,255,255,0.04)"/>
              <rect x="220" y="90" width="70" height="110" fill="rgba(255,255,255,0.03)"/>
              <rect x="300" y="50" width="45" height="150" fill="rgba(255,255,255,0.05)"/>
              <rect x="310" y="20" width="25" height="30" fill="rgba(255,255,255,0.05)"/>
              <rect x="355" y="80" width="90" height="120" fill="rgba(255,255,255,0.04)"/>
              <rect x="455" y="40" width="55" height="160" fill="rgba(255,255,255,0.06)"/>
              <rect x="465" y="10" width="35" height="30" fill="rgba(255,255,255,0.06)"/>
              <rect x="520" y="70" width="70" height="130" fill="rgba(255,255,255,0.04)"/>
              <rect x="600" y="30" width="50" height="170" fill="rgba(255,255,255,0.05)"/>
              <rect x="610" y="5" width="30" height="25" fill="rgba(255,255,255,0.05)"/>
              <rect x="660" y="90" width="80" height="110" fill="rgba(255,255,255,0.03)"/>
              <rect x="750" y="55" width="60" height="145" fill="rgba(255,255,255,0.05)"/>
              <rect x="820" y="80" width="90" height="120" fill="rgba(255,255,255,0.04)"/>
              <rect x="920" y="40" width="55" height="160" fill="rgba(255,255,255,0.05)"/>
              <rect x="985" y="70" width="70" height="130" fill="rgba(255,255,255,0.04)"/>
              <rect x="1065" y="30" width="50" height="170" fill="rgba(255,255,255,0.06)"/>
              <rect x="1075" y="5" width="30" height="25" fill="rgba(255,255,255,0.06)"/>
              <rect x="1125" y="60" width="80" height="140" fill="rgba(255,255,255,0.04)"/>
              <rect x="1215" y="45" width="60" height="155" fill="rgba(255,255,255,0.05)"/>
              <rect x="1285" y="80" width="90" height="120" fill="rgba(255,255,255,0.03)"/>
              <rect x="1385" y="50" width="55" height="150" fill="rgba(255,255,255,0.05)"/>
              <!-- fenêtres -->
              ${Array.from({length: 40}, () => `<rect x="${Math.random()*1400}" y="${Math.random()*160+20}" width="6" height="8" fill="rgba(255,217,61,${(Math.random()*0.3+0.1).toFixed(2)})"/>`).join('')}
            </svg>
          </div>

          <div class="m-road">
            <div class="m-road-dash"></div>
            <div class="m-road-dash m-road-dash--2"></div>
            <div class="m-road-dash m-road-dash--3"></div>
            <div class="m-car m-car--1">
              <svg viewBox="0 0 100 45" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="16" width="90" height="22" rx="5" fill="#FFD93D"/>
                <rect x="18" y="6" width="50" height="18" rx="4" fill="#FFD93D"/>
                <rect x="21" y="8" width="18" height="12" rx="2" fill="#a8d8ff" opacity="0.85"/>
                <rect x="44" y="8" width="18" height="12" rx="2" fill="#a8d8ff" opacity="0.85"/>
                <circle cx="24" cy="38" r="7" fill="var(--dark)"/><circle cx="24" cy="38" r="3.5" fill="#444"/>
                <circle cx="76" cy="38" r="7" fill="var(--dark)"/><circle cx="76" cy="38" r="3.5" fill="#444"/>
                <rect x="5" y="20" width="7" height="6" rx="1" fill="#ff6b6b"/>
                <rect x="88" y="20" width="7" height="6" rx="1" fill="#FFD93D" opacity="0.5"/>
                <text x="32" y="30" font-size="7" font-family="Arial Black" fill="var(--dark)" font-weight="900">TAXI</text>
                <ellipse cx="92" cy="23" rx="4" ry="3" fill="rgba(255,255,200,0.6)"/>
              </svg>
            </div>
            <div class="m-car m-car--2">
              <svg viewBox="0 0 90 42" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="15" width="80" height="20" rx="4" fill="#ff6b6b"/>
                <rect x="18" y="6" width="44" height="16" rx="3" fill="#ff6b6b"/>
                <rect x="20" y="8" width="16" height="10" rx="2" fill="#a8d8ff" opacity="0.7"/>
                <rect x="40" y="8" width="16" height="10" rx="2" fill="#a8d8ff" opacity="0.7"/>
                <circle cx="22" cy="35" r="6" fill="var(--dark)"/><circle cx="22" cy="35" r="3" fill="#444"/>
                <circle cx="68" cy="35" r="6" fill="var(--dark)"/><circle cx="68" cy="35" r="3" fill="#444"/>
                <ellipse cx="85" cy="20" rx="3" ry="2.5" fill="rgba(255,255,200,0.5)"/>
              </svg>
            </div>
            <div class="m-car m-car--3">
              <svg viewBox="0 0 90 42" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="15" width="80" height="20" rx="4" fill="#4d96ff"/>
                <rect x="18" y="6" width="44" height="16" rx="3" fill="#4d96ff"/>
                <rect x="20" y="8" width="16" height="10" rx="2" fill="#a8d8ff" opacity="0.7"/>
                <rect x="40" y="8" width="16" height="10" rx="2" fill="#a8d8ff" opacity="0.7"/>
                <circle cx="22" cy="35" r="6" fill="var(--dark)"/><circle cx="22" cy="35" r="3" fill="#444"/>
                <circle cx="68" cy="35" r="6" fill="var(--dark)"/><circle cx="68" cy="35" r="3" fill="#444"/>
                <ellipse cx="85" cy="20" rx="3" ry="2.5" fill="rgba(255,255,200,0.5)"/>
              </svg>
            </div>
          </div>

          <div class="m-hero-text">
            <h1 class="m-logo">
              <span class="m-logo-line m-logo-anim-1">VROUM</span>
              <span class="m-logo-line m-logo-line--outline m-logo-anim-2">VROUM</span>
            </h1>
            <p class="m-tagline m-tagline-anim">Évite les obstacles et bats ton record !!!!</p>
          </div>

        </div>

        <div class="m-body m-body-anim">
          ${bestScoreBadge}
          ${adminBtn}

          <div class="m-section">
            <p class="m-section-label">Difficulté</p>
            <div class="m-levels">
              <button class="m-lvl active" data-level="1">
                <span class="m-lvl-indicator"></span>
                <span class="m-lvl-name">Facile</span>
              </button>
              <button class="m-lvl" data-level="2">
                <span class="m-lvl-indicator"></span>
                <span class="m-lvl-name">Moyen</span>
              </button>
              <button class="m-lvl" data-level="3">
                <span class="m-lvl-indicator"></span>
                <span class="m-lvl-name">Difficile</span>
              </button>
            </div>
          </div>

          <button class="m-play" id="startBtn">Jouer</button>

          <div class="m-actions">
            <button class="m-action" id="menuMuteBtn">Son ON</button>
            <button class="m-action m-action--danger" id="menuLogoutBtn">Déconnexion</button>
          </div>

          <p class="m-hint">Changer de voie avec les flèches &nbsp;·&nbsp; Espace pour pause</p>
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
    document.getElementById('menuMuteBtn').addEventListener('click', () => {
      if (window.gameInstance) {
        const muted = window.gameInstance.soundManager.toggleMute()
        document.getElementById('menuMuteBtn').textContent = muted ? 'Son OFF' : 'Son ON'
      }
    })
    document.getElementById('menuLogoutBtn').addEventListener('click', () => {
      localStorage.removeItem('taxi_user')
      location.reload()
    })
  }

  showGameOver(score, user = null) {
    this.container = document.createElement('div')
    this.container.id = 'menu'
    this.container.innerHTML = `
      <div class="m-wrap">
        <div class="m-hero m-hero--dark">
          <div class="m-particles">
            ${Array.from({length: 15}, () => `<div class="m-particle m-particle--red" style="--x:${Math.random()*100}%;--d:${(Math.random()*3+1).toFixed(1)}s;--s:${(Math.random()*4+2).toFixed(1)}px;--delay:${(Math.random()*3).toFixed(1)}s"></div>`).join('')}
          </div>

          <div class="m-cityscape">
            <svg viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <rect x="0" y="80" width="60" height="120" fill="rgba(255,77,141,0.04)"/>
              <rect x="70" y="40" width="80" height="160" fill="rgba(255,77,141,0.05)"/>
              <rect x="160" y="60" width="50" height="140" fill="rgba(255,77,141,0.04)"/>
              <rect x="300" y="30" width="45" height="170" fill="rgba(255,77,141,0.05)"/>
              <rect x="455" y="20" width="55" height="180" fill="rgba(255,77,141,0.06)"/>
              <rect x="600" y="10" width="50" height="190" fill="rgba(255,77,141,0.05)"/>
              <rect x="750" y="35" width="60" height="165" fill="rgba(255,77,141,0.05)"/>
              <rect x="920" y="20" width="55" height="180" fill="rgba(255,77,141,0.05)"/>
              <rect x="1065" y="10" width="50" height="190" fill="rgba(255,77,141,0.06)"/>
              <rect x="1215" y="25" width="60" height="175" fill="rgba(255,77,141,0.05)"/>
              ${Array.from({length: 30}, () => `<rect x="${Math.random()*1400}" y="${Math.random()*160+20}" width="5" height="7" fill="rgba(255,77,141,${(Math.random()*0.3+0.1).toFixed(2)})"/>`).join('')}
            </svg>
          </div>

          <div class="m-road">
            <div class="m-road-dash"></div>
            <div class="m-road-dash m-road-dash--2"></div>
          </div>

=          <div class="m-crash-scene">
            <!-- obstacle (camion) -->
            <div class="m-crash-truck">
              <svg viewBox="0 0 120 55" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="10" width="110" height="35" rx="4" fill="#444"/>
                <rect x="10" y="5" width="60" height="22" rx="3" fill="#555"/>
                <rect x="12" y="7" width="25" height="14" rx="2" fill="#a8d8ff" opacity="0.5"/>
                <rect x="40" y="7" width="25" height="14" rx="2" fill="#a8d8ff" opacity="0.5"/>
                <circle cx="25" cy="45" r="8" fill="#222"/><circle cx="25" cy="45" r="4" fill="#333"/>
                <circle cx="95" cy="45" r="8" fill="#222"/><circle cx="95" cy="45" r="4" fill="#333"/>
                <rect x="5" y="18" width="8" height="6" rx="1" fill="#ff4444"/>
              </svg>
            </div>

            <div class="m-crash-taxi">
              <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
                <g transform="rotate(-15, 50, 25)">
                  <rect x="5" y="16" width="90" height="22" rx="5" fill="#FFD93D"/>
                  <rect x="18" y="6" width="50" height="18" rx="4" fill="#FFD93D"/>
                  <!-- vitre cassée -->
                  <rect x="21" y="8" width="18" height="12" rx="2" fill="#a8d8ff" opacity="0.3"/>
                  <line x1="21" y1="8" x2="39" y2="20" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
                  <line x1="30" y1="8" x2="21" y2="20" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
                  <rect x="44" y="8" width="18" height="12" rx="2" fill="#a8d8ff" opacity="0.4"/>
                  <circle cx="24" cy="38" r="7" fill="var(--dark)"/><circle cx="24" cy="38" r="3.5" fill="#444"/>
                  <circle cx="76" cy="38" r="7" fill="var(--dark)"/><circle cx="76" cy="38" r="3.5" fill="#444"/>
                  <rect x="5" y="20" width="7" height="6" rx="1" fill="#ff6b6b"/>
                  <text x="32" y="30" font-size="7" font-family="Arial Black" fill="var(--dark)" font-weight="900">TAXI</text>
                </g>
              </svg>
            </div>

            <div class="m-crash-stars">
              <svg class="m-crash-star cs1" viewBox="0 0 30 30"><polygon points="15,0 18,11 30,11 20,18 24,29 15,22 6,29 10,18 0,11 12,11" fill="#FFD93D"/></svg>
              <svg class="m-crash-star cs2" viewBox="0 0 24 24"><polygon points="12,0 14,9 24,9 16,14 19,23 12,18 5,23 8,14 0,9 10,9" fill="var(--pink)"/></svg>
              <svg class="m-crash-star cs3" viewBox="0 0 20 20"><polygon points="10,0 12,7 20,7 14,11 16,19 10,15 4,19 6,11 0,7 8,7" fill="#fff"/></svg>
              <svg class="m-crash-star cs4" viewBox="0 0 26 26"><polygon points="13,0 16,10 26,10 18,16 21,25 13,19 5,25 8,16 0,10 10,10" fill="#FFD93D"/></svg>
            </div>

            <div class="m-crash-lines">
              <div class="m-crash-line cl1"></div>
              <div class="m-crash-line cl2"></div>
              <div class="m-crash-line cl3"></div>
              <div class="m-crash-line cl4"></div>
              <div class="m-crash-line cl5"></div>
            </div>
          </div>

          <div class="m-hero-text">
            <h1 class="m-logo m-logo-anim-1">
              <span class="m-logo-line" style="color:var(--pink);text-shadow:0 0 40px rgba(255,77,141,0.8)">GAME</span>
              <span class="m-logo-line m-logo-line--outline" style="-webkit-text-stroke-color:var(--pink);opacity:0.5">OVER</span>
            </h1>
            <div class="m-score-wrap m-tagline-anim">
              <span class="m-score-num">${score}</span>
              <span class="m-score-unit">pts</span>
            </div>
          </div>
        </div>

        <div class="m-body m-body-anim">
          <div class="m-lb-card">
            <div id="leaderboard">
              <p class="m-loading">Chargement...</p>
            </div>
          </div>
          <button class="m-play" id="startBtn">Rejouer</button>
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

    const localScores = JSON.parse(localStorage.getItem('taxi_scores') || '[]')
    localScores.push({ score, date: new Date().toLocaleDateString() })
    localScores.sort((a, b) => b.score - a.score)
    const top5 = localScores.slice(0, 5)
    localStorage.setItem('taxi_scores', JSON.stringify(top5))

    if (user && user.token) {
      try {
        const res = await fetch('http://localhost:8000/api/scores/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/ld+json', 'Authorization': `Bearer ${user.token}` },
          body: JSON.stringify({ points: score, duration: window.gameInstance?.scoreManager?.getDuration() || 1 })
        })
        const data = await res.json()
        if (data.shareToken) shareLink = `http://localhost:8000/score/share/${data.shareToken}`
      } catch (e) {
        console.error('Erreur envoi score:', e)
      }

      try {
        const res = await fetch('http://localhost:8000/api/scores', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        })
        const data = await res.json()
        const apiScores = (data['hydra:member'] || []).slice(0, 5)

        if (apiScores.length > 0) {
          const lb = document.getElementById('leaderboard')
          if (!lb) return
          lb.innerHTML = `
            <p class="m-lb-title">Meilleurs scores</p>
            ${apiScores.map((s, i) => `
              <div class="m-lb-row ${i === 0 ? 'first' : ''}">
                <span class="m-lb-rank">${i + 1}</span>
                <span class="m-lb-score">${s.points} pts</span>
                <span class="m-lb-date">${new Date(s.createdAt).toLocaleDateString()}</span>
              </div>
            `).join('')}
            ${shareLink ? `<a href="${shareLink}" target="_blank" class="m-share">Partager mon score</a>` : ''}
          `
          return
        }
      } catch (e) {
        console.error('Erreur chargement scores:', e)}
    }

    const lb = document.getElementById('leaderboard')
    if (!lb) return
    lb.innerHTML = `
      <p class="m-lb-title">Meilleurs scores</p>
      ${top5.map((s, i) => `
        <div class="m-lb-row ${i === 0 ? 'first' : ''}">
          <span class="m-lb-rank">${i + 1}</span>
          <span class="m-lb-score">${s.score} pts</span>
          <span class="m-lb-date">${s.date}</span>
        </div>
      `).join('')}
      ${shareLink ? `<a href="${shareLink}" target="_blank" class="m-share">Partager mon score</a>` : ''}
    `
  }

  bindLevelButtons() {
    document.querySelectorAll('.m-lvl').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.m-lvl').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        this.selectedLevel = parseInt(btn.dataset.level)
      })
    })
  }

  addStyles() {
    if (document.getElementById('menu-style')) return
    const style = document.createElement('style')
    style.id = 'menu-style'
    style.textContent = `

      #menu { 
      position: fixed; 
      inset: 0; 
      z-index: 200; 
      font-family: 'Inter', sans-serif; 
      overflow-y: auto; 
      }

      .m-wrap { 
      min-height: 100vh; 
      background: var(--gray-bg); 
      display: flex; 
      flex-direction: column; 
      }

      .m-hero {
        background: var(--dark);
        position: relative;
        overflow: hidden;
        min-height: 380px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }

      .m-hero--dark { 
      background: #0d0d18; 
      }

      .m-hero::before {
        content: '';
        position: absolute; inset: 0;
        background:
          radial-gradient(ellipse at 20% 50%, rgba(255,77,141,0.18) 0%, transparent 45%),
          radial-gradient(ellipse at 85% 30%, rgba(255,217,61,0.1) 0%, transparent 40%),
          radial-gradient(ellipse at 50% 10%, rgba(77,150,255,0.08) 0%, transparent 50%);
        pointer-events: none;
        z-index: 0;
      }

      .m-hero::after {
        content: '';
        position: absolute; inset: 0;
        background-image:
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
        background-size: 40px 40px;
        pointer-events: none;
        z-index: 0;
      }

      .m-particles { 
      position: absolute; 
      inset: 0; 
      pointer-events: none; 
      z-index: 1; 
      overflow: hidden; 
      }

      .m-particle {
        position: absolute;
        left: var(--x);
        bottom: -10px;
        width: var(--s);
        height: var(--s);
        border-radius: 50%;
        background: rgba(255,217,61,0.6);
        animation: particle-rise var(--d) ease-in infinite var(--delay);
      }

      .m-particle--red { 
      background: rgba(255,77,141,0.6); 
      }

      @keyframes particle-rise {
        0% { 
        bottom: -10px; 
        opacity: 1; 
        transform: translateX(0) scale(1); 
        }
        100% { 
        bottom: 110%; 
        opacity: 0; 
        transform: translateX(${Math.random()>0.5?'':'-'}30px) scale(0.3); 
        }
      }

      .m-cityscape {
        position: absolute;
        bottom: 70px; left: 0; right: 0;
        z-index: 1;
        pointer-events: none;
      }

      .m-cityscape svg { 
      display: block; 
      width: 100%; 
      height: 200px; 
      }

      .m-road {
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 70px;
        background: #1e1e1e;
        z-index: 2;
        overflow: hidden;
      }

      .m-road::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 3px;
        background: var(--pink);
        box-shadow: 0 0 12px rgba(255,77,141,0.8);
      }

      .m-road-dash {
        position: absolute;
        top: 50%; left: -150px;
        height: 3px; width: 80px;
        background: rgba(255,255,255,0.35);
        transform: translateY(-50%);
        animation: dash-scroll 1s linear infinite;
        border-radius: 2px;
      }

      .m-road-dash--2 { 
      animation-delay: -0.5s; 
      }
      .m-road-dash--3 { 
      animation-delay: -0.25s; 
      top: 70%; 
      }

      @keyframes dash-scroll {
        from { left: -150px; }
        to { left: 110%; }
      }

      .m-car {
        position: absolute;
        z-index: 3;
        animation: car-drive linear infinite;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
      }

      .m-car--1 { 
      width: 100px; 
      bottom: 10px; 
      animation-duration: 5s; 
      }
      .m-car--2 { 
      width: 80px; 
      bottom: 8px; 
      animation-duration: 3.5s; animation-delay: -1.5s; }
      .m-car--3 { 
      width: 80px; 
      bottom: 14px; 
      animation-duration: 7s; 
      animation-delay: -3s; }

      @keyframes car-drive {
        from { right: -120px; }
        to { right: 105%; }
      }

      .m-hero-text {
        position: relative;
        z-index: 4;
        padding: 50px 48px 90px;
      }

      .m-logo { 
      display: flex; 
      flex-direction: 
      column; gap: 0; 
      }

      .m-logo-line {
        font-family: 'Bebas Neue', cursive;
        font-size: 130px;
        line-height: 0.85;
        color: #fff;
        letter-spacing: 8px;
        display: block;
        text-shadow: 0 0 60px rgba(255,77,141,0.3);
      }

      .m-logo-line--outline {
        color: transparent;
        -webkit-text-stroke: 2px rgba(255,255,255,0.25);
        text-shadow: none;
      }

      .m-logo-anim-1 {
        opacity: 0;
        animation: slide-right 0.6s cubic-bezier(0.22,1,0.36,1) forwards 0.2s;
      }

      .m-logo-anim-2 {
        opacity: 0;
        animation: slide-right 0.6s cubic-bezier(0.22,1,0.36,1) forwards 0.35s;
      }

      .m-tagline {
        font-size: 14px;
        font-weight: 500;
        color: rgba(255,255,255,0.35);
        margin-top: 16px;
        letter-spacing: 0.5px;
      }

      .m-tagline-anim {
        opacity: 0;
        animation: fade-up 0.5s ease forwards 0.5s;
      }

      @keyframes slide-right {
        from { opacity: 0; transform: translateX(-40px); }
        to { opacity: 1; transform: translateX(0); }
      }

      @keyframes fade-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .m-score-wrap {
        display: flex;
        align-items: baseline;
        gap: 10px;
        margin-top: 8px;
      }

      .m-score-num {
        font-family: 'Bebas Neue', cursive;
        font-size: 90px;
        line-height: 1;
        color: #FFD93D;
        letter-spacing: 4px;
        text-shadow: 0 0 40px rgba(255,217,61,0.5), 3px 3px 0 rgba(0,0,0,0.3);
      }

      .m-score-unit {
        font-family: 'Bebas Neue', cursive;
        font-size: 36px;
        color: rgba(255,217,61,0.4);
        letter-spacing: 2px;
      }

      .m-body {
        flex: 1;
        max-width: 500px;
        margin: 0 auto;
        width: 100%;
        padding: 32px 24px 40px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .m-body-anim {
        opacity: 0;
        animation: fade-up 0.5s ease forwards 0.6s;
      }

      .m-best-score {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: linear-gradient(135deg, var(--dark), #2d2d4e);
        border-radius: 10px;
        border: 1px solid rgba(255,77,141,0.3);
        box-shadow: 0 2px 12px rgba(255,77,141,0.1);
      }

      .m-best-label {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: rgba(255,255,255,0.4);
      }

      .m-best-num {
        font-family: 'Bebas Neue', cursive;
        font-size: 22px;
        color: #FFD93D;
        letter-spacing: 2px;
      }

      .m-admin {
        display: block;
        padding: 11px;
        font-size: 13px;
        font-weight: 600;
        color: var(--pink);
        border: 1.5px solid var(--pink);
        border-radius: 8px;
        text-decoration: none;
        text-align: center;
        transition: all 0.15s;
        background: #fff;
      }
      .m-admin:hover { 
      background: var(--pink); 
      color: #fff; 
      }

      .m-section { 
      display: flex; 
      flex-direction: column; 
      gap: 10px; 
      }

      .m-section-label {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--gray-text);
      }

      .m-levels { 
      display: flex; 
      gap: 10px; 
      }

      .m-lvl {
        flex: 1;
        padding: 16px 8px 14px;
        background: #fff;
        color: #aaa;
        border: 2px solid #e8e8e8;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      }

      .m-lvl-indicator {
        width: 8px; height: 8px;
        border-radius: 50%;
        background: #e8e8e8;
        transition: all 0.2s;
      }

      .m-lvl-name {
        font-family: 'Bebas Neue', cursive;
        font-size: 22px;
        letter-spacing: 1px;
        line-height: 1;
      }

      .m-lvl:hover {
        border-color: var(--pink);
        color: var(--pink);
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(255,77,141,0.15);
      }

      .m-lvl:hover .m-lvl-indicator { 
      background: var(--pink); 
      }

      .m-lvl.active {
        background: var(--pink);
        border-color: var(--pink);
        color: #fff;
        transform: translateY(-3px);
        box-shadow: 0 10px 24px rgba(255,77,141,0.4);
      }

      .m-lvl.active .m-lvl-indicator { 
      background: rgba(255,255,255,0.7); 
      }

      .m-play {
        width: 100%;
        padding: 20px;
        font-family: 'Bebas Neue', cursive;
        font-size: 32px;
        letter-spacing: 5px;
        background: var(--dark);
        color: #fff;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 0 var(--pink), 0 8px 24px rgba(26,26,46,0.3);
        position: relative;
        overflow: hidden;
      }

      .m-play::before {
        content: '';
        position: absolute;
        top: 0; left: -100%;
        width: 60%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
        transition: left 0.5s ease;
      }

      .m-play:hover::before { 
      left: 150%; 
      }

      .m-play:hover {
        transform: translateY(-3px);
        box-shadow: 0 7px 0 var(--pink), 0 14px 32px rgba(26,26,46,0.4);
      }

      .m-play:active {
        transform: translateY(2px);
        box-shadow: 0 2px 0 var(--pink);
      }

      .m-actions { 
      display: flex; 
      gap: 10px; 
      }

      .m-action {
        flex: 1;
        padding: 13px;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 13px;
        background: #fff;
        color: #666;
        border: 2px solid #e8e8e8;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.15s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      }

      .m-action:hover { 
      border-color: #ccc; 
      color: #333; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.08); 
      }
      .m-action--danger { 
      color: #ef4444; 
      border-color: #fecaca; 
      }
      .m-action--danger:hover { 
      background: #fef2f2; 
      border-color: #ef4444; 
      }

      .m-hint { 
      font-size: 12px; 
      color: #333; 
      text-align: center; 
      font-weight: 500; 
      }

      .m-lb-card {
        background: #fff;
        border-radius: 14px;
        padding: 22px;
        border: 2px solid #e8e8e8;
        box-shadow: 0 2px 12px rgba(0,0,0,0.05);
      }

      .m-lb-title {
        font-family: 'Bebas Neue', cursive;
        font-size: 22px;
        letter-spacing: 2px;
        color: var(--dark);
        margin-bottom: 14px;
        padding-bottom: 10px;
        border-bottom: 2px solid #f0f0f0;
      }

      .m-lb-row {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 11px 14px;
        background: #fafafa;
        border: 2px solid #f0f0f0;
        border-radius: 10px;
        margin-bottom: 8px;
        transition: all 0.15s;
      }

      .m-lb-row:hover { 
      border-color: #e0e0e0; 
      background: var(--gray-bg); 
      }

      .m-lb-row.first {
        border-color: var(--pink);
        background: var(--pink-bg);
        box-shadow: 0 2px 8px rgba(255,77,141,0.1);
      }

      .m-lb-rank {
        font-family: 'Bebas Neue', cursive;
        font-size: 22px;
        color: #ddd;
        width: 22px;
        text-align: center;
      }

      .m-lb-row.first .m-lb-rank { 
      color: var(--pink); 
      }

      .m-lb-score {
        font-family: 'Bebas Neue', cursive;
        font-size: 22px;
        color: var(--dark);
        flex: 1;
        letter-spacing: 1px;
      }

      .m-lb-date { 
      font-size: 12px; 
      color: var(--gray-text); 
      font-weight: 500; 
      }

      .m-share {
        display: block;
        margin-top: 12px;
        padding: 13px;
        font-weight: 700;
        font-size: 13px;
        color: var(--pink);
        border: 2px solid var(--pink);
        border-radius: 10px;
        text-align: center;
        text-decoration: none;
        transition: all 0.15s;
        letter-spacing: 0.5px;
      }

      .m-share:hover {
        background: var(--pink);
        color: #fff;
        box-shadow: 0 4px 12px rgba(255,77,141,0.3);
      }

      .m-loading { 
      font-size: 13px; 
      color: #ccc; 
      text-align: center; 
      padding: 24px 0; 
      }

      .m-crash-scene {
        position: absolute;
        right: 60px;
        bottom: 70px;
        width: 280px;
        height: 120px;
        z-index: 3;
      }

      .m-crash-truck {
        position: absolute;
        right: 0; bottom: 0;
        width: 130px;
        animation: truck-shake 0.3s ease-in-out infinite;
      }

      @keyframes truck-shake {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        25% { transform: translateX(-2px) rotate(-1deg); }
        75% { transform: translateX(2px) rotate(1deg); }
      }

      .m-crash-taxi {
        position: absolute;
        right: 100px; bottom: 0;
        width: 110px;
        animation: taxi-crash 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
      }

      @keyframes taxi-crash {
        0% { transform: translateX(80px); }
        60% { transform: translateX(0px); }
        75% { transform: translateX(8px) rotate(2deg); }
        90% { transform: translateX(-3px) rotate(-1deg); }
        100% { transform: translateX(0px) rotate(-15deg); }
      }

      .m-crash-stars { 
      position: absolute; 
      inset: 0; 
      pointer-events: none; 
      }

      .m-crash-star {
        position: absolute;
        animation: star-pop 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both, star-spin 1.5s linear infinite;
      }

      .cs1 { 
      width: 36px; 
      top: 10px; 
      right: 90px; 
      animation-delay: 0.3s, 0.3s; 
      }
      .cs2 { 
      width: 28px; 
      top: 0px; 
      right: 110px; 
      animation-delay: 0.4s, 0.4s; 
      }
      .cs3 { 
      width: 22px; 
      top: 20px; 
      right: 70px; 
      animation-delay: 0.35s, 0.35s; }
      .cs4 { 
      width: 32px; 
      top: 5px; 
      right: 130px; 
      animation-delay: 0.45s, 0.45s; }

      @keyframes star-pop {
        0% { transform: scale(0); opacity: 0; }
        60% { transform: scale(1.3); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }

      @keyframes star-spin {
        from { transform: rotate(0deg) scale(1); }
        to { transform: rotate(360deg) scale(1); }
      }

      .m-crash-lines { position: absolute; inset: 0; pointer-events: none; }

      .m-crash-line {
        position: absolute;
        height: 2px;
        background: linear-gradient(90deg, rgba(255,217,61,0.8), transparent);
        border-radius: 2px;
        transform-origin: left center;
        animation: line-shoot 0.3s ease-out both;
      }

      .cl1 { width: 50px; top: 30px; right: 95px; transform: rotate(-30deg); animation-delay: 0.3s; }
      .cl2 { width: 40px; top: 50px; right: 90px; transform: rotate(10deg); animation-delay: 0.35s; }
      .cl3 { width: 35px; top: 20px; right: 115px; transform: rotate(-60deg); animation-delay: 0.32s; }
      .cl4 { width: 45px; top: 60px; right: 100px; transform: rotate(40deg); animation-delay: 0.38s; }
      .cl5 { width: 30px; top: 40px; right: 80px; transform: rotate(-10deg); animation-delay: 0.28s; }

      @keyframes line-shoot {
        0% { width: 0; opacity: 1; }
        100% { opacity: 0.8; }
      }
    `
    document.head.appendChild(style)
  }

  hide() {
    if (this.container) { this.container.remove(); this.container = null }
    const s = document.getElementById('menu-style')
    if (s) s.remove()
  }
}