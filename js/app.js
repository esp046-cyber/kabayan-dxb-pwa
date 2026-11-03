document.addEventListener('DOMContentLoaded', () => {
  // Navigation Tabs
  const navBtns = document.querySelectorAll('.dock button');
  const sections = document.querySelectorAll('main > section[data-tab]');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-go');
      navBtns.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');

      sections.forEach(sec => {
        if (sec.getAttribute('data-tab') === target) {
          sec.removeAttribute('hidden');
          sec.classList.add('active');
        } else {
          sec.setAttribute('hidden', '');
          sec.classList.remove('active');
        }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Clocks
  function updateClocks() {
    const now = new Date();
    const dxbStr = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Dubai', hour12: false, hour: '2-digit', minute: '2-digit' });
    const mnlStr = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Manila', hour12: false, hour: '2-digit', minute: '2-digit' });

    const tDxb = document.getElementById('tDxb');
    const tMnl = document.getElementById('tMnl');
    const sDxb = document.getElementById('sDxb');
    const sMnl = document.getElementById('sMnl');

    if (tDxb) tDxb.textContent = dxbStr;
    if (tMnl) tMnl.textContent = mnlStr;
    if (sDxb) sDxb.textContent = dxbStr;
    if (sMnl) sMnl.textContent = mnlStr;
  }
  setInterval(updateClocks, 1000);
  updateClocks();

  // Standby Modal
  const standbyEl = document.getElementById('standby');
  const standbyBtn = document.getElementById('standbyBtn');
  const standbyClose = document.getElementById('standbyClose');
  const standbySosBtn = document.getElementById('standbySosBtn');

  if (standbyBtn && standbyEl) {
    standbyBtn.addEventListener('click', () => {
      standbyEl.removeAttribute('hidden');
    });
  }

  if (standbyClose && standbyEl) {
    const closeStandby = () => {
      standbyEl.setAttribute('hidden', '');
    };
    standbyClose.addEventListener('click', closeStandby);
    standbyClose.addEventListener('touchend', (e) => {
      e.preventDefault();
      closeStandby();
    });
  }

  // SOS Sheet
  const sheet = document.getElementById('sheet');
  const sheetClose = document.getElementById('sheetClose');
  const sosTriggers = document.querySelectorAll('[data-sos]');

  sosTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      if (sheet) sheet.removeAttribute('hidden');
    });
  });

  if (standbySosBtn && sheet) {
    standbySosBtn.addEventListener('click', () => {
      if (standbyEl) standbyEl.setAttribute('hidden', '');
      sheet.removeAttribute('hidden');
    });
  }

  if (sheetClose && sheet) {
    sheetClose.addEventListener('click', () => {
      sheet.setAttribute('hidden', '');
    });
  }

  // Display Modes
  const modes = ['light', 'dark', 'sun', 'power'];
  let curModeIdx = 0;
  const modeBtn = document.getElementById('modeBtn');

  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      curModeIdx = (curModeIdx + 1) % modes.length;
      const nextMode = modes[curModeIdx];
      document.documentElement.setAttribute('data-theme', nextMode);
      const labels = { light: '☀ Light', dark: '🌙 Dark', sun: '🏜 Sun (High Contrast)', power: '🔋 Power Saver' };
      modeBtn.textContent = labels[nextMode];
      showToast(`Mode: ${labels[nextMode]}`);
    });
  }

  // Network Detection
  const island = document.getElementById('island');
  const netTxt = document.getElementById('netTxt');
  const offBanner = document.getElementById('offBanner');

  function updateNetStatus() {
    if (navigator.onLine) {
      if (island) island.classList.remove('off');
      if (netTxt) netTxt.textContent = 'Online';
      if (offBanner) offBanner.setAttribute('hidden', '');
    } else {
      if (island) island.classList.add('off');
      if (netTxt) netTxt.textContent = 'Offline';
      if (offBanner) offBanner.removeAttribute('hidden');
    }
  }
  window.addEventListener('online', updateNetStatus);
  window.addEventListener('offline', updateNetStatus);
  updateNetStatus();

  // Toast Utility
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // Share
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Kabayan DXB Companion',
          text: 'PWA Guide para sa Kabayan papuntang Dubai at Jebel Ali.',
          url: window.location.href
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Na-copy na ang link sa clipboard, Kabayan!');
      }
    });
  }

  // Notes LocalStorage
  const notesArea = document.getElementById('notes');
  const coContact = document.getElementById('coContact');
  const saveNotesBtn = document.getElementById('saveNotesBtn');

  try {
    if (notesArea && localStorage.getItem('kdxb_notes')) {
      notesArea.value = localStorage.getItem('kdxb_notes');
    }
    if (coContact && localStorage.getItem('kdxb_cocontact')) {
      coContact.value = localStorage.getItem('kdxb_cocontact');
    }
  } catch(e) {}

  if (saveNotesBtn) {
    saveNotesBtn.addEventListener('click', () => {
      try {
        if (notesArea) localStorage.setItem('kdxb_notes', notesArea.value);
        if (coContact) localStorage.setItem('kdxb_cocontact', coContact.value);
        showToast('Nai-save na ang notes sa iyong device!');
      } catch(e) {
        showToast('Hindi mai-save: private browsing mode');
      }
    });
  }

  // WhatsApp Pre-filled Messages
  const waContainer = document.getElementById('wa');
  if (waContainer) {
    const templates = [
      { label: 'Nakalapag na sa DXB Airport', text: 'Hello po! Nakalapag na po ako nang ligtas dito sa Dubai International Airport.' },
      { label: 'Papunta na sa AGAC Office / Akomodasyon', text: 'Hello po, papunta na po ako ngayon sa Jebel Ali Industrial Area mula Danube Metro Station.' },
      { label: 'Update sa Pamilya sa Pilipinas', text: 'Nandito na po ako sa Dubai. Naka-connect na sa Wi-Fi at maayos ang lahat.' }
    ];
    templates.forEach(t => {
      const a = document.createElement('a');
      a.className = 'sos-item';
      a.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(t.text)}`;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = `<span>${t.label}</span><b>I-send 💬</b>`;
      waContainer.appendChild(a);
    });
  }
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
