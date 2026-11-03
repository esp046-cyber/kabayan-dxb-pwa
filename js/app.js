const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const ls={g:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const MODES=[['light','☀ Light'],['dark','☾ Dark'],['sun','☼ Sun'],['power','🔋 Power']];let mi=ls.g('mode',0);
const buzz=()=>{if(document.documentElement.dataset.theme!=='power'&&navigator.vibrate)navigator.vibrate(10)};
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1800)}
function setMode(){document.documentElement.dataset.theme=MODES[mi][0];$('#modeBtn').textContent=MODES[mi][1];ls.s('mode',mi)}
$('#modeBtn').onclick=()=>{mi=(mi+1)%4;setMode();buzz()};setMode();
// tabs
function go(n){$$('section[data-tab]').forEach(s=>s.classList.toggle('active',s.dataset.tab===n));$$('.dock button').forEach(b=>b.classList.toggle('on',b.dataset.go===n));$('#results').hidden=true;scrollTo(0,0);buzz()}
$$('.dock button').forEach(b=>b.onclick=()=>go(b.dataset.go));
// clocks
const f=tz=>new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:tz}).format(new Date());
function tick(){const d=f('Asia/Dubai'),m=f('Asia/Manila');$('#tDxb').textContent=$('#sDxb').textContent=d;$('#tMnl').textContent=$('#sMnl').textContent=m;
 const dow=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Dubai'})).getDay();
 $('#weekNote').innerHTML=dow===5?'<b>Biyernes:</b> Jummah ~12:45–1:30pm; maaaring mabagal ang serbisyo sa tanghali.':'Dubai work week: Lunes–Biyernes (Sab–Linggo weekend, depende sa kumpanya).'}
tick();setInterval(tick,30000);
// steps
const done=ls.g('steps',[]);
function renderSteps(){$('#steps').innerHTML='<div class="card">'+STEPS.map((t,i)=>`<label class="step ${done.includes(i)?'done':''}"><input type="checkbox" data-i="${i}" ${done.includes(i)?'checked':''}><span>${t}</span></label>`).join('')+'</div>';
 $$('#steps input').forEach(c=>c.onchange=()=>{const i=+c.dataset.i;c.checked?done.push(i):done.splice(done.indexOf(i),1);ls.s('steps',done);renderSteps();buzz()});
 const n=STEPS.findIndex((_,i)=>!done.includes(i));$('#nextStep').textContent=n<0?'Tapos na lahat! 🎉':STEPS[n];$('#sStep').textContent=n<0?'Tapos na':STEPS[n];$('#prog').textContent=done.length+'/'+STEPS.length}
renderSteps();
// selectors
$('#prov').innerHTML=Cur.PROVIDERS.map((p,i)=>`<option value="${i}">${p[0]}</option>`).join('');
$('#prov').onchange=()=>{const f=Cur.PROVIDERS[+$('#prov').value][1];if(f)$('#fee').value=f;money()};
const so=Object.keys(NOLST).map(k=>`<option>${k}</option>`).join('');$('#nFrom').innerHTML=so;$('#nTo').innerHTML=so;$('#nTo').value='Danube (Jebel Ali Ind.)';
$('#sim').innerHTML=SIM.map(s=>`<li><b>${s[0]}</b>: ${s[1]}</li>`).join('');
// currency
const rate=$('#rate');rate.value=Cur.rate.toFixed(2);Cur.refresh().then(()=>{rate.value=Cur.rate.toFixed(2);money()});
function money(){Cur.rate=+rate.value||Cur.rate;const a=+$('#amt').value||0,fee=+$('#fee').value||0,p2a=$('#dir').value==='p2a';
 $('#convOut').textContent=p2a?`AED ${Cur.p2a(a).toFixed(2)}`:`PHP ${Cur.a2p(a,fee).toLocaleString('en',{maximumFractionDigits:2})}`;
 $('#convSub').textContent=p2a?'':`Pagkatapos ng fee na AED ${fee}`;
 $('#homeRate').textContent=$('#sRate').textContent='₱'+Cur.rate.toFixed(2);
 const inc=+$('#bSal').value,sp=['#bRent','#bFood','#bNol','#bUtil'].reduce((s,i)=>s+(+$(i).value||0),0),left=inc-sp;
 $('#bOut').textContent=`Matitira: AED ${left}`;$('#bSub').textContent=`≈ ₱${Math.round(Math.max(0,left)*Cur.rate).toLocaleString()} na pwedeng ipadala`;
 const nf=nolFare($('#nFrom').value,$('#nTo').value);$('#zones').value=nf.f;$('#nolZ').textContent=nf.z+' zone(s): AED '+nf.f+' bawat biyahe (estimate)';$('#rateSrc').textContent=Cur.note();$('#groc').innerHTML=GROC.map(g=>`<li>${g[0]}: AED ${g[1]} ≈ ₱${Math.round(g[1]*Cur.rate)}</li>`).join('');
 $('#nolOut').textContent='≈ AED '+(+$('#zones').value*(+$('#trips').value)*(+$('#days').value)).toFixed(0)+' / buwan'}
$$('.form input,.form select').forEach(e=>e.addEventListener('input',money));money();
// places
let cat='all';const cats=['all','food','wifi'];
function places(){$('#chips').innerHTML=cats.map(c=>`<button class="${c===cat?'on':''}" data-c="${c}">${c}</button>`).join('');
 $$('#chips button').forEach(b=>b.onclick=()=>{cat=b.dataset.c;places()});
 const q=$('#q').value.toLowerCase();const l=PLACES.filter(p=>(cat==='all'||p[0]===cat)&&(p[1]+p[0]).toLowerCase().includes(q));
 $('#places').innerHTML=l.map(p=>`<div class="card place"><b>${p[1]}</b><small>${p[0]}</small><a target="_blank" rel="noopener" href="https://maps.google.com/?q=${encodeURIComponent(p[2])}">Open in Maps</a></div>`).join('');$('#emptyPlaces').hidden=l.length>0}
places();
// misc lists
$('#wa').innerHTML=WA.map(t=>`<p><a target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(t)}">${t}</a></p>`).join('');
$('#scam').innerHTML=SCAM.map(t=>`<li>${t}</li>`).join('');$('#tips').innerHTML=TIPS.map(t=>`<li>${t}</li>`).join('');
// SOS
function sos(){const co=localStorage.getItem('co');$('#sosList').innerHTML=SOS.map(s=>`<a class="tel" href="tel:${s[1]}"><span>${s[0]}</span><span>${s[1]}</span></a>`).join('')+(co?`<a class="tel" href="tel:${co.replace(/[^+\d]/g,'')}"><span>AGAC office</span><span>${co}</span></a>`:'')+``;$('#sheet').hidden=false;buzz()}
$$('[data-sos]').forEach(b=>b.onclick=sos);$('#sheetClose').onclick=()=>$('#sheet').hidden=true;
let y0=0;$('#sheet').addEventListener('touchstart',e=>y0=e.touches[0].clientY);$('#sheet').addEventListener('touchend',e=>{if(e.changedTouches[0].clientY-y0>80)$('#sheet').hidden=true});
// standby
$('#standbyBtn').onclick=()=>{$('#standby').hidden=false;navigator.wakeLock?.request('screen').catch(()=>{})};$('#standbyClose').onclick=()=>$('#standby').hidden=true;
// summer + standby cycle
const dn=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Dubai'})),md=(dn.getMonth()+1)*100+dn.getDate();
if(md>=615&&md<=915)$('#weekNote').innerHTML+='<br><b>Summer midday break ngayon:</b> bawal outdoor work 12:30–3:00 PM.';
let ci=0;setInterval(()=>{if($('#standby').hidden)return;const n=STEPS.findIndex((_,i)=>!done.includes(i));const L=[n<0?'Tapos na ang checklist':STEPS[n],'Rate: 1 AED = ₱'+Cur.rate.toFixed(2),'Midday break 12:30–3 PM (Hun 15–Set 15)','Emergency: 999 / 998'];$('#sStep').textContent=L[ci++%L.length]},5000);
// notes
$('#notes').value=localStorage.getItem('notes')||'';$('#notes').oninput=e=>localStorage.setItem('notes',e.target.value);
$('#coContact').value=localStorage.getItem('co')||'';$('#coContact').oninput=e=>localStorage.setItem('co',e.target.value);
// search
$('#q').oninput=()=>{const q=$('#q').value.toLowerCase().trim();places();const box=$('#results');if(!q){box.hidden=true;return}
 const pool=[...PLACES.map(p=>p[1]),...SOS.map(s=>s[0]+' '+s[1]),...STEPS,'AED PHP rate remit'];const hit=pool.filter(t=>t.toLowerCase().includes(q)).slice(0,8);
 $('#resList').innerHTML=hit.length?hit.map(t=>`<p>${t}</p>`).join(''):'<div class="empty">Walang nahanap, Kabayan.</div>';box.hidden=false}
// copy
document.addEventListener('click',e=>{const c=e.target.closest('[data-copy]');if(c){navigator.clipboard?.writeText(c.dataset.copy);toast('Na-copy na, Kabayan!')}});
// share
$('#shareBtn').onclick=async()=>{const d={title:'Kabayan DXB',text:'Kabayan DXB – gabay NAIA → Dubai',url:location.href.split('#')[0]};try{navigator.share?await navigator.share(d):(await navigator.clipboard.writeText(d.url),toast('Na-copy na, Kabayan!'))}catch{}};
// network
function net(){const on=navigator.onLine;$('#island').classList.toggle('off',!on);$('#netTxt').textContent=on?'Online':'Offline';$('#offBanner').classList.toggle('show',!on)}
addEventListener('online',net);addEventListener('offline',net);net();
// payday notification
$('#payDay').value=ls.g('payDay',25);$('#payDay').onchange=e=>ls.s('payDay',+e.target.value);
$('#notifBtn').onclick=async()=>{if(!('Notification' in window))return toast('Hindi supported');const p=await Notification.requestPermission();toast(p==='granted'?'Naka-on na':'Hindi pinayagan')};
if('Notification' in window&&Notification.permission==='granted'&&new Date().getDate()===ls.g('payDay',25)&&ls.g('paid',0)!==new Date().toDateString()){new Notification('Araw ng padala! Kumusta ang rate ngayon?');ls.s('paid',new Date().toDateString())}
// iOS A2HS
const ios=/iphone|ipad/i.test(navigator.userAgent),standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
if(ios&&!standalone&&!ls.g('a2hsX',0))$('#a2hs').hidden=false;$('#a2hsX').onclick=()=>{$('#a2hs').hidden=true;ls.s('a2hsX',1)};
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
