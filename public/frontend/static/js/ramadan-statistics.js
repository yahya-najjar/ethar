!function(){const{url:t}=document.body.dataset,a=async t=>{const a=await fetch(t);if(204===a.status)return null;return await a.json()},n=(t,a)=>{document.getElementById(t).innerHTML=a.toLocaleString()},o=(t,a,o)=>{const e=(new Date).getTime()+1e3,m=o-a,l=setInterval((()=>{const r=(new Date).getTime(),s=1-(e-r)/1e3,u=Math.floor(a+m*s);n(t,u),r>=e&&(clearInterval(l),n(t,o),localStorage.setItem(t,o))}),10)};function e(t){const a=String(t);let n="";for(let t=0;t<a.length;t++){const o=a[t],e="Ù Ù¡Ù¢Ù£Ù¤Ù¥Ù¦Ù§Ù¨Ù©".indexOf(o);n+=-1!==e?"0123456789"[e]:o}return parseFloat(n)}document.addEventListener("DOMContentLoaded",(async()=>{let n="",m=document.getElementById("totalEhsanAmount"),l=document.getElementById("totalRamadanAmount");if(l){n=await a(t);const m=Number(l.textContent.replace(/,/g,"")),r=Number(localStorage.getItem("totalRamadanAmount")),s=Math.max(r,n.totalRamadanCampaign);n.totalRamadanCampaign>m&&(o("totalRamadanAmount",e(m),e(s)),localStorage.setItem("totalRamadanAmount",e(s)))}if(m){n=await a(t);const l=Number(m.textContent.replace(/,/g,"")),r=Number(localStorage.getItem("totalEhsanAmount")),s=Math.max(r,n.totalMonetaryAmounts);n.totalMonetaryAmounts>l&&(o("totalEhsanAmount",e(l),e(s)),localStorage.setItem("totalEhsanAmount",e(s)))}(m||l)&&setInterval((async()=>{let e=n;try{e=await a(t)}catch{console.log("something went wrong!")}document.getElementById("totalRamadanAmount")&&e.totalRamadanCampaign>n.totalRamadanCampaign&&(o("totalRamadanAmount",n.totalRamadanCampaign,e.totalRamadanCampaign),n.totalRamadanCampaign=e.totalRamadanCampaign,localStorage.setItem("totalRamadanAmount",e.totalRamadanCampaign)),document.getElementById("totalEhsanAmount")&&e.totalMonetaryAmounts>n.totalMonetaryAmounts&&(o("totalEhsanAmount",n.totalMonetaryAmounts,e.totalMonetaryAmounts),n.totalMonetaryAmounts=e.totalMonetaryAmounts,localStorage.setItem("totalEhsanAmount",e.totalMonetaryAmounts))}),1e4)}))}();