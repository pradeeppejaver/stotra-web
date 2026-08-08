/**
 * Stotra Sangraha - Application Logic
 * Dynamic Font Scaling, Theme Toggles, Screen Wake Lock, Search & Copying
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initFontScaler();
  initWakeLock();
  initSearchAndFilter();
  initScriptToggles();
});

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('stotra-theme') || 'dark';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('stotra-theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
  }
}

/* ==========================================================================
   2. Dynamic Font Scaling
   ========================================================================== */
let fontScale = parseFloat(localStorage.getItem('stotra-font-scale')) || 1.0;

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
  fontScale = 1.0;
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
        // Release wake lock
        await wakeLock.release();
        wakeLock = null;
        updateWakeLockUI(false);
      } else {
        // Request wake lock
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
   5. Script View Toggles (Reader Page)
   ========================================================================== */
function initScriptToggles() {
  const toggleKn = document.getElementById('toggle-kn');
  const toggleIast = document.getElementById('toggle-iast');
  const toggleTrans = document.getElementById('toggle-trans');

  if (toggleKn) {
    toggleKn.addEventListener('click', () => {
      document.body.classList.toggle('hide-kannada');
      toggleKn.classList.toggle('btn-active', !document.body.classList.contains('hide-kannada'));
    });
  }

  if (toggleIast) {
    toggleIast.addEventListener('click', () => {
      document.body.classList.toggle('hide-iast');
      toggleIast.classList.toggle('btn-active', !document.body.classList.contains('hide-iast'));
    });
  }

  if (toggleTrans) {
    toggleTrans.addEventListener('click', () => {
      document.body.classList.toggle('hide-translation');
      toggleTrans.classList.toggle('btn-active', !document.body.classList.contains('hide-translation'));
    });
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
