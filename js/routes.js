// Checklist, Routes & Nol Card Logic
document.addEventListener('DOMContentLoaded', () => {
  const stepsList = [
    { title: 'eTravel / Arrival QR Code', desc: 'I-fill out sa etravel.gov.ph bago ang boarding sa NAIA.' },
    { title: 'OEC / OFW Clearance & Contract', desc: 'Ihanda ang kopya para sa Philippine Immigration inspection sa NAIA.' },
    { title: 'DXB Immigration & Free SIM', desc: 'Kuhanin ang libreng tourist/resident SIM (du o e&) sa passport control counter.' },
    { title: 'Bili ng Silver Nol Card', desc: 'Sa DXB Terminal 1 o 3 Metro station ticket office. Mag-load ng kahit AED 50.' },
    { title: 'Sakay ng Metro Red Line', desc: 'Diretsong tren papuntang UAE Exchange. Walang lipat ng linya.' },
    { title: 'Bumaba sa Danube Station (Station 41)', desc: 'Dito ang pinakamalapit na babaan papuntang Jebel Ali Industrial Area 1.' },
    { title: 'Sakay ng Feeder Bus F49 o Taxi', desc: 'Bus F49 papuntang Refco Road / Plot 39 (AGAC) o mag-flag ng taxi (~AED 15).' },
    { title: 'Report sa AGAC Reception', desc: 'Al Gurg Automation & Controls LLC, Plot 39, Jebel Ali Industrial Area 1.' }
  ];

  const stepsContainer = document.getElementById('steps');
  const nextStepEl = document.getElementById('nextStep');
  const sStepEl = document.getElementById('sStep');
  const progEl = document.getElementById('prog');

  let savedChecklist = [];
  try {
    savedChecklist = JSON.parse(localStorage.getItem('kdxb_checklist') || '[]');
  } catch(e) {}

  if (stepsContainer) {
    stepsList.forEach((s, idx) => {
      const isChecked = savedChecklist.includes(idx);
      const row = document.createElement('div');
      row.className = 'card';
      row.style.display = 'flex';
      row.style.gap = '12px';
      row.style.alignItems = 'flex-start';
      row.innerHTML = `
        <input type="checkbox" id="chk_${idx}" ${isChecked ? 'checked' : ''} style="margin-top:5px; width:20px; height:20px;">
        <label for="chk_${idx}" style="cursor:pointer;">
          <b style="display:block; font-size:1rem;">${idx + 1}. ${s.title}</b>
          <small style="color:var(--text-muted); font-size:0.85rem;">${s.desc}</small>
        </label>
      `;
      stepsContainer.appendChild(row);

      row.querySelector('input').addEventListener('change', (e) => {
        if (e.target.checked) {
          if (!savedChecklist.includes(idx)) savedChecklist.push(idx);
        } else {
          savedChecklist = savedChecklist.filter(x => x !== idx);
        }
        try {
          localStorage.setItem('kdxb_checklist', JSON.stringify(savedChecklist));
        } catch(err) {}
        updateProgress();
      });
    });
  }

  function updateProgress() {
    const firstUnchecked = stepsList.findIndex((_, idx) => !savedChecklist.includes(idx));
    const activeIdx = firstUnchecked === -1 ? stepsList.length - 1 : firstUnchecked;
    const txt = stepsList[activeIdx].title;
    
    if (nextStepEl) nextStepEl.textContent = txt;
    if (sStepEl) sStepEl.textContent = txt;
    if (progEl) progEl.textContent = `${savedChecklist.length} ng ${stepsList.length} tapos na`;
  }
  updateProgress();

  // Nol Card Estimator
  const nFrom = document.getElementById('nFrom');
  const nTo = document.getElementById('nTo');
  const tripsInput = document.getElementById('trips');
  const daysInput = document.getElementById('days');
  const nolOut = document.getElementById('nolOut');

  function computeNol() {
    if (!nFrom || !nTo || !nolOut) return;
    const z1 = parseInt(nFrom.value);
    const z2 = parseInt(nTo.value);
    const trips = parseInt(tripsInput.value) || 2;
    const days = parseInt(daysInput.value) || 26;

    let farePerTrip = 7.50; // default 3+ zones
    if (z1 === z2) {
      farePerTrip = 3.00;
    } else if (Math.abs(z1 - z2) === 1) {
      farePerTrip = 5.00;
    } else {
      farePerTrip = 7.50;
    }

    const monthlyTotal = farePerTrip * trips * days;
    nolOut.textContent = `~AED ${monthlyTotal.toFixed(2)} / buwan (AED ${farePerTrip.toFixed(2)} bawat biyahe)`;
  }

  [nFrom, nTo, tripsInput, daysInput].forEach(el => {
    if (el) el.addEventListener('change', computeNol);
  });
  computeNol();

  // Places Directory Data
  const placesList = [
    { name: 'West Zone Supermarket (Discovery Gardens)', cat: 'Food', desc: 'Kumpletong Pinoy canned goods, toyo, suka, snacks.', map: 'https://maps.google.com/?q=West+Zone+Fresh+Supermarket+Discovery+Gardens' },
    { name: 'Hot Palayok Restaurant (Karama)', cat: 'Food', desc: 'Pinoy buffet at carinderia favorites.', map: 'https://maps.google.com/?q=Hot+Palayok+Restaurant+Dubai' },
    { name: 'Max’s Restaurant / Dampa Seafood Grill (Deira)', cat: 'Food', desc: 'Classic Filipino dishes at seafood feast.', map: 'https://maps.google.com/?q=Dampa+Seafood+Grill+Dubai' },
    { name: 'Ibn Battuta Mall Free Wi-Fi', cat: 'Wi-Fi', desc: 'Malapit na mall sa Jebel Ali na may mabilis na public Wi-Fi.', map: 'https://maps.google.com/?q=Ibn+Battuta+Mall' },
    { name: 'Danube Metro Station Wi-Fi', cat: 'Wi-Fi', desc: 'Libreng RTA public Wi-Fi sa loob ng station.', map: 'https://maps.google.com/?q=Danube+Metro+Station+Dubai' }
  ];

  const placesContainer = document.getElementById('places');
  if (placesContainer) {
    placesList.forEach(p => {
      const c = document.createElement('div');
      c.className = 'card';
      c.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <b>${p.name}</b>
          <span style="font-size:0.75rem; background:var(--surface-alt); padding:2px 8px; border-radius:999px;">${p.cat}</span>
        </div>
        <p style="font-size:0.9rem; color:var(--text-muted); margin:4px 0 8px;">${p.desc}</p>
        <a href="${p.map}" target="_blank" rel="noopener" class="lnk" style="font-size:0.85rem;">Buksan sa Google Maps ↗</a>
      `;
      placesContainer.appendChild(c);
    });
  }
});
