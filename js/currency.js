const Cur={rate:16.6,ts:0,live:false,
 load(){try{const c=JSON.parse(localStorage.getItem('fx'));if(c&&c.r>5&&c.r<40){this.rate=c.r;this.ts=c.t;this.live=true}}catch{}},
 async refresh(){if(this.ts&&Date.now()-this.ts<864e5)return;
  try{const r=await fetch('https://open.er-api.com/v6/latest/AED',{cache:'no-store'});const j=await r.json();const p=j&&j.rates&&j.rates.PHP;
   if(p>5&&p<40){this.rate=p;this.ts=Date.now();this.live=true;localStorage.setItem('fx',JSON.stringify({r:p,t:this.ts}))}}catch{}},
 note(){return this.live?'Rate: '+new Date(this.ts).toLocaleDateString()+' (mid-market, nag-a-update araw-araw kapag online)':'Offline default rate (estimate). Kumonekta sa internet para sa live rate.'},
 a2p(a,fee=0){return Math.max(0,a-fee)*this.rate},p2a(p){return p/this.rate},
 PROVIDERS:[['Al Ansari (est.)',15],['LuLu Exchange (est.)',15],['Western Union (est.)',22],['Iba pa / manual',0]]};
Cur.load();
