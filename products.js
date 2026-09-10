
const D=window.RIZU_DATA;
document.querySelector("#productGrid").innerHTML=D.products.map(p=>`
  <article class="product-card">
    <div class="product-cover ${p.theme}"><small>${p.group.toUpperCase()}</small><span class="symbol">${p.symbol}</span><small>ARIEFANOISME × RIZU SENSEI</small></div>
    <div class="product-info">
      <span class="badge">${p.badge}</span>
      <h2>${p.title}</h2>
      <div class="tagline">${p.tagline}</div>
      <p class="desc">${p.desc}</p>
      <div class="product-price"><div><strong>${p.price}</strong>${p.oldPrice?`<del>${p.oldPrice}</del>`:""}</div><a href="${p.url}" target="_blank" rel="noopener">${p.cta} ↗</a></div>
    </div>
  </article>`).join("");
