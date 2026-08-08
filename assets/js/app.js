/**
 * Stotra Sangraha - Application Logic
 * Multi-Theme Selector, Dynamic Font Scaling, Screen Wake Lock, Search & Copying
 */

// ==========================================================================
// Central Site Configuration (Change default behavior here in 1 place!)
// ==========================================================================
const CONFIG = {
  defaultTheme: 'midnight',            // Options: 'midnight', 'saffron', 'sandalwood', 'kailasha', 'parchment'
  defaultShowKannada: true,            // Show Kannada script by default
  defaultShowEnglish: true,            // Show English transliteration (IAST) by default
  defaultShowTranslation: false,        // Show English Meaning/Translation by default (false = OFF)
  defaultFontScale: 1.0,               // Default font scale (1.0 = 100%)
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initFontScaler();
  initWakeLock();
  initSearchAndFilter();
  initScriptToggles();
});

/* ==========================================================================
   1. Multi-Theme Management
   ========================================================================== */
function initTheme() {
  const themeSelect = document.getElementById('theme-select');
  const savedTheme = localStorage.getItem('stotra-theme') || CONFIG.defaultTheme;
  
  applyTheme(savedTheme);

  if (themeSelect) {
    themeSelect.value = savedTheme;
    themeSelect.addEventListener('change', (e) => {
      applyTheme(e.target.value);
    });
  }
}

function applyTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  if (document.body) {
    document.body.setAttribute('data-theme', themeName);
  }
  localStorage.setItem('stotra-theme', themeName);
}

/* ==========================================================================
   2. Dynamic Font Scaling
   ========================================================================== */
let fontScale = parseFloat(localStorage.getItem('stotra-font-scale')) || CONFIG.defaultFontScale;

function initFontScaler() {
  applyFontScale(fontScale);

  const btnIncrease = document.getElementById('font-increase');
  const btnDecrease = document.getElementById('font-decrease');
  const btnReset = document.getElementById('font-reset');

  if (btnIncrease) btnIncrease.addEventListener('click', () => changeFontScale(0.1));
  if (btnDecrease) btnDecrease.addEventListener('click', () => changeFontScale(-0.1));
  if (btnReset) btnReset.addEventListener('click', () => resetFontScale());
}

function changeFontScale(delta) {
  fontScale = Math.min(1.6, Math.max(0.8, fontScale + delta));
  applyFontScale(fontScale);
}

function resetFontScale() {
  fontScale = CONFIG.defaultFontScale;
  applyFontScale(fontScale);
}

function applyFontScale(scale) {
  document.documentElement.style.setProperty('--verse-font-scale', scale.toFixed(2));
  localStorage.setItem('stotra-font-scale', scale.toFixed(2));
  const fontDisplay = document.getElementById('font-size-display');
  if (fontDisplay) {
    fontDisplay.textContent = Math.round(scale * 100) + '%';
  }
}

/* ==========================================================================
   3. Screen Wake Lock (Keeps screen awake during chanting)
   ========================================================================== */
let wakeLock = null;

function initWakeLock() {
  const wakeLockBtn = document.getElementById('wakelock-btn');
  if (!wakeLockBtn) return;

  if ('wakeLock' in navigator) {
    wakeLockBtn.addEventListener('click', async () => {
      if (wakeLock !== null) {
        await wakeLock.release();
        wakeLock = null;
        updateWakeLockUI(false);
      } else {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
          updateWakeLockUI(true);
          wakeLock.addEventListener('release', () => {
            wakeLock = null;
            updateWakeLockUI(false);
          });
        } catch (err) {
          console.warn('Wake Lock request failed:', err);
          alert('Screen Wake Lock is not supported or was blocked by your browser settings.');
        }
      }
    });
  } else {
    wakeLockBtn.style.display = 'none';
  }
}

function updateWakeLockUI(isActive) {
  const btn = document.getElementById('wakelock-btn');
  if (btn) {
    btn.classList.toggle('btn-active', isActive);
    btn.innerHTML = isActive ? '💡 Screen Awake: ON' : '🔒 Keep Screen Awake';
  }
}

/* ==========================================================================
   4. Search & Category Filters (Homepage)
   ========================================================================== */
function initSearchAndFilter() {
  const searchInput = document.getElementById('stotra-search');
  const filterPills = document.querySelectorAll('.pill');
  const cards = document.querySelectorAll('.stotra-card');

  if (!cards.length) return;

  let activeCategory = 'all';

  function filterCards() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    cards.forEach(card => {
      const titleKn = card.getAttribute('data-title-kn') || '';
      const titleEn = card.getAttribute('data-title-en') || '';
      const deity = card.getAttribute('data-deity') || '';
      const textContent = card.innerText.toLowerCase();

      const matchesSearch = !query || titleKn.includes(query) || titleEn.toLowerCase().includes(query) || textContent.includes(query);
      const matchesCategory = activeCategory === 'all' || deity.toLowerCase() === activeCategory.toLowerCase();

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category');
      filterCards();
    });
  });
}

/* ==========================================================================
   5. Script View Toggles (Centralized Config Engine)
   ========================================================================== */
function initScriptToggles() {
  const toggleKn = document.getElementById('toggle-kn');
  const toggleIast = document.getElementById('toggle-iast');
  const toggleTrans = document.getElementById('toggle-trans');

  // Load user saved settings or fallback to central CONFIG defaults
  const savedShowKn = localStorage.getItem('stotra-show-kn');
  const savedShowIast = localStorage.getItem('stotra-show-iast');
  const savedShowTrans = localStorage.getItem('stotra-show-trans');

  const showKn = savedShowKn !== null ? savedShowKn === 'true' : CONFIG.defaultShowKannada;
  const showIast = savedShowIast !== null ? savedShowIast === 'true' : CONFIG.defaultShowEnglish;
  const showTrans = savedShowTrans !== null ? savedShowTrans === 'true' : CONFIG.defaultShowTranslation;

  // Apply initial visibility & button highlight states dynamically
  setScriptState('kannada', showKn, toggleKn);
  setScriptState('iast', showIast, toggleIast);
  setScriptState('translation', showTrans, toggleTrans);

  if (toggleKn) {
    toggleKn.addEventListener('click', () => {
      const isVisible = !document.body.classList.contains('hide-kannada');
      setScriptState('kannada', !isVisible, toggleKn);
      localStorage.setItem('stotra-show-kn', !isVisible);
    });
  }

  if (toggleIast) {
    toggleIast.addEventListener('click', () => {
      const isVisible = !document.body.classList.contains('hide-iast');
      setScriptState('iast', !isVisible, toggleIast);
      localStorage.setItem('stotra-show-iast', !isVisible);
    });
  }

  if (toggleTrans) {
    toggleTrans.addEventListener('click', () => {
      const isVisible = !document.body.classList.contains('hide-translation');
      setScriptState('translation', !isVisible, toggleTrans);
      localStorage.setItem('stotra-show-trans', !isVisible);
    });
  }
}

function setScriptState(type, isVisible, buttonEl) {
  const classMap = {
    kannada: 'hide-kannada',
    iast: 'hide-iast',
    translation: 'hide-translation'
  };
  const className = classMap[type];
  if (!className) return;

  if (isVisible) {
    document.body.classList.remove(className);
    if (buttonEl) buttonEl.classList.add('btn-active');
  } else {
    document.body.classList.add(className);
    if (buttonEl) buttonEl.classList.remove('btn-active');
  }
}

/* ==========================================================================
   6. Copy Verse Utility
   ========================================================================== */
function copyVerse(buttonElement) {
  const verseCard = buttonElement.closest('.verse-card');
  if (!verseCard) return;

  const kannada = verseCard.querySelector('.verse-kannada')?.innerText || '';
  const iast = verseCard.querySelector('.verse-iast')?.innerText || '';
  const translation = verseCard.querySelector('.verse-translation')?.innerText || '';

  const fullText = `${kannada}\n\n${iast}\n\n${translation}`;

  navigator.clipboard.writeText(fullText).then(() => {
    const originalText = buttonElement.innerHTML;
    buttonElement.innerHTML = '✓ Copied!';
    setTimeout(() => {
      buttonElement.innerHTML = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy verse:', err);
  });
}
