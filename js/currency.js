// Currency & Budget Engine
document.addEventListener('DOMContentLoaded', () => {
  const amtInput = document.getElementById('amt');
  const dirSelect = document.getElementById('dir');
  const rateInput = document.getElementById('rate');
  const provSelect = document.getElementById('prov');
  const feeInput = document.getElementById('fee');
  const rateSrc = document.getElementById('rateSrc');
  const convOut = document.getElementById('convOut');
  const homeRate = document.getElementById('homeRate');
  const sRate = document.getElementById('sRate');

  // Fetch live exchange rate with fallback
  async function fetchRate() {
    let fallbackRate = 16.60;
    try {
      const cached = localStorage.getItem('kdxb_rate_cache');
      const cachedTime = localStorage.getItem('kdxb_rate_time');
      const now = Date.now();

      if (cached && cachedTime && (now - parseInt(cachedTime)) < 86400000) {
        setRate(parseFloat(cached), 'Live API (Cached)');
        return;
      }

      const res = await fetch('https://open.er-api.com/v6/latest/AED');
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates && data.rates.PHP) {
          const liveRate = parseFloat(data.rates.PHP.toFixed(2));
          localStorage.setItem('kdxb_rate_cache', liveRate);
          localStorage.setItem('kdxb_rate_time', now);
          setRate(liveRate, 'Live API (open.er-api.com)');
          return;
        }
      }
    } catch(e) {}

    // Fallback if network or API fails
    setRate(fallbackRate, 'Offline Fallback (Tantiya)');
  }

  function setRate(val, src) {
    if (rateInput) rateInput.value = val;
    if (homeRate) homeRate.textContent = `₱${val.toFixed(2)}`;
    if (sRate) sRate.textContent = `₱${val.toFixed(2)}`;
    if (rateSrc) rateSrc.textContent = `Source: ${src}`;
    computeConversion();
  }

  function computeConversion() {
    if (!amtInput || !rateInput || !convOut) return;
    const amt = parseFloat(amtInput.value) || 0;
    const rate = parseFloat(rateInput.value) || 16.60;
    const fee = parseFloat(feeInput ? feeInput.value : 0) || 0;
    const dir = dirSelect ? dirSelect.value : 'a2p';

    if (dir === 'a2p') {
      const netAed = Math.max(0, amt - fee);
      const totalPhp = netAed * rate;
      convOut.textContent = `₱${totalPhp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      const totalAed = amt / rate;
      convOut.textContent = `AED ${totalAed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  if (provSelect && feeInput) {
    provSelect.addEventListener('change', () => {
      feeInput.value = provSelect.value;
      computeConversion();
    });
  }

  if (amtInput) amtInput.addEventListener('input', computeConversion);
  if (dirSelect) dirSelect.addEventListener('change', computeConversion);
  if (rateInput) rateInput.addEventListener('input', computeConversion);
  if (feeInput) feeInput.addEventListener('input', computeConversion);

  // Monthly Budget Calculation
  const bSal = document.getElementById('bSal');
  const bRent = document.getElementById('bRent');
  const bFood = document.getElementById('bFood');
  const bNol = document.getElementById('bNol');
  const bUtil = document.getElementById('bUtil');
  const bOut = document.getElementById('bOut');

  function computeBudget() {
    if (!bSal || !bOut) return;
    const sal = parseFloat(bSal.value) || 0;
    const rent = parseFloat(bRent.value) || 0;
    const food = parseFloat(bFood.value) || 0;
    const nol = parseFloat(bNol.value) || 0;
    const util = parseFloat(bUtil.value) || 0;

    const remaining = sal - (rent + food + nol + util);
    bOut.textContent = `Natitira: AED ${remaining.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
  }

  [bSal, bRent, bFood, bNol, bUtil].forEach(el => {
    if (el) el.addEventListener('input', computeBudget);
  });

  fetchRate();
  computeBudget();
});
