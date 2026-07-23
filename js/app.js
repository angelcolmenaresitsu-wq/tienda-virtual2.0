const productosFallback = [
  { id: 1, titulo: "Chaqueta Denim Urban", desc: "Algodón resistente con diseño vintage atemporal.", precio: 65.00, categoria: "ropa", rating: 4.8, reviews: 34, imagen: "https://picsum.photos/seed/denimjacket/400/280" },
  { id: 2, titulo: "Zapatos Runner Pro 3D", desc: "Suela de fibra de carbono amortiguada.", precio: 120.00, categoria: "calzado", rating: 4.9, reviews: 88, imagen: "https://picsum.photos/seed/runnerpro/400/280" },
  { id: 3, titulo: "Camiseta Minimalist", desc: "100% algodón orgánico de tacto ultra suave.", precio: 32.00, categoria: "ropa", rating: 4.5, reviews: 12, imagen: "https://picsum.photos/seed/tshirt/400/280" },
  { id: 4, titulo: "Reloj Chrono Steel", desc: "Caja de acero inoxidable con cristal de zafiro.", precio: 185.00, categoria: "accesorios", rating: 5.0, reviews: 45, imagen: "https://picsum.photos/seed/watchsteel/400/280" },
  { id: 5, titulo: "Mochila Impermeable 25L", desc: "Compartimento acolchado para laptop de hasta 16\".", precio: 58.00, categoria: "accesorios", rating: 4.6, reviews: 29, imagen: "https://picsum.photos/seed/backpack/400/280" },
  { id: 6, titulo: "Audífonos Studio Wireless", desc: "Cancelación de ruido activa y sonido 3D.", precio: 140.00, categoria: "tecnologia", rating: 4.9, reviews: 110, imagen: "https://picsum.photos/seed/headphones3d/400/280" },
  { id: 7, titulo: "Smartwatch Fit Pulse", desc: "GPS integrado y monitoreo cardíaco.", precio: 115.00, categoria: "tecnologia", rating: 4.7, reviews: 56, imagen: "https://picsum.photos/seed/smartwatch/400/280" },
  { id: 8, titulo: "Gorra Pro UV Shield", desc: "Protección solar con tejido transpirable.", precio: 24.00, categoria: "deporte", rating: 4.3, reviews: 18, imagen: "https://picsum.photos/seed/sportcap/400/280" }
];

const categoriasFallback = [
  { id: "todas", nombre: "Todas", icono: "✨" },
  { id: "ropa", nombre: "Ropa", icono: "👕" },
  { id: "calzado", nombre: "Calzado", icono: "👟" },
  { id: "accesorios", nombre: "Accesorios", icono: "🎒" },
  { id: "tecnologia", nombre: "Tecnología", icono: "🎧" },
  { id: "deporte", nombre: "Deporte", icono: "🧢" }
];

let productos = productosFallback;
let categorias = categoriasFallback;
let carrito = JSON.parse(localStorage.getItem('aura_cart')) || [];
let favoritos = JSON.parse(localStorage.getItem('aura_favs')) || [];
let categoriaActual = 'todas';
let descuentoActivo = 0;

function init() {
  renderCategorias();
  renderProductos(productos);
  actualizarCarrito();
}

function renderCategorias() {
  const container = document.getElementById('categories');
  container.innerHTML = '';
  categorias.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${cat.id === 'todas' ? 'active' : ''}`;
    btn.innerHTML = `${cat.icono} ${cat.nombre}`;
    btn.onclick = () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      categoriaActual = cat.id;
      aplicarFiltros();
    };
    container.appendChild(btn);
  });
}

function renderProductos(lista) {
  const app = document.getElementById('app');
  app.innerHTML = '';

  if (lista.length === 0) {
    app.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No se encontraron productos.</p>';
    return;
  }

  lista.forEach(p => {
    const esFav = favoritos.includes(p.id);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-img-wrapper">
        <button class="fav-btn ${esFav ? 'active' : ''}" onclick="toggleFav(${p.id})">♥</button>
        <span class="badge-cat">${p.categoria}</span>
        <img src="${p.imagen}" alt="${p.titulo}">
      </div>
      <div class="card-body">
        <div class="rating">⭐ ${p.rating} <span style="color:var(--text-muted)">(${p.reviews})</span></div>
        <h3>${p.titulo}</h3>
        <p>${p.desc}</p>
        <div class="card-footer">
          <span class="price">$${p.precio.toFixed(2)}</span>
          <div class="action-btns">
            <button class="btn-quick" onclick="verDetalles(${p.id})">👁️</button>
            <button class="add-btn" onclick="agregarAlCarrito(${p.id})">+ Agregar</button>
          </div>
        </div>
      </div>
    `;
    app.appendChild(card);
  });
}

function aplicarFiltros() {
  const query = document.getElementById('search').value.toLowerCase();
  const sort = document.getElementById('sort-select').value;
  const maxPrice = parseFloat(document.getElementById('price-slider').value);

  let res = productos.filter(p => {
    const matchText = p.titulo.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
    const matchCat = categoriaActual === 'todas' || p.categoria === categoriaActual;
    const matchPrice = p.precio <= maxPrice;
    return matchText && matchCat && matchPrice;
  });

  if (sort === 'price-asc') res.sort((a,b) => a.precio - b.precio);
  if (sort === 'price-desc') res.sort((a,b) => b.precio - a.precio);
  if (sort === 'rating') res.sort((a,b) => b.rating - a.rating);

  renderProductos(res);
}

function actualizarRangoPrecio() {
  const val = document.getElementById('price-slider').value;
  document.getElementById('price-val').textContent = val;
  aplicarFiltros();
}

function toggleFav(id) {
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(fId => fId !== id);
    mostrarToast("Eliminado de Favoritos");
  } else {
    favoritos.push(id);
    mostrarToast("Añadido a Favoritos ❤️");
  }
  localStorage.setItem('aura_favs', JSON.stringify(favoritos));
  aplicarFiltros();
}

function agregarAlCarrito(id) {
  const prod = productos.find(p => p.id === id);
  const item = carrito.find(i => i.id === id);
  if (item) item.cantidad++;
  else carrito.push({ ...prod, cantidad: 1 });

  mostrarToast(`Agregado: ${prod.titulo}`);
  actualizarCarrito();
}

function actualizarCarrito() {
  localStorage.setItem('aura_cart', JSON.stringify(carrito));
  const count = carrito.reduce((acc, i) => acc + i.cantidad, 0);
  document.getElementById('cart-count').textContent = count;

  const container = document.getElementById('cart-items');
  const checkoutArea = document.getElementById('checkout-area');
  const btnFinalizar = document.getElementById('btn-finalizar');

  if (carrito.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:var(--text-muted)">El carrito está vacío.</p>';
    checkoutArea.style.display = 'none';
    btnFinalizar.style.display = 'none';
    document.getElementById('cart-total').textContent = '0.00';
    return;
  }

  container.innerHTML = '';
  let total = 0;
  carrito.forEach(i => {
    const sub = i.precio * i.cantidad;
    total += sub;
    container.innerHTML += `
      <div style="display:flex; justify-content:space-between; margin-bottom:0.8rem; align-items:center;">
        <div><strong>${i.titulo}</strong><br><small>$${i.precio} x ${i.cantidad}</small></div>
        <div><strong>$${sub.toFixed(2)}</strong></div>
      </div>
    `;
  });

  if (descuentoActivo > 0) total *= (1 - descuentoActivo);

  document.getElementById('cart-total').textContent = total.toFixed(2);
  checkoutArea.style.display = 'block';
  btnFinalizar.style.display = 'block';
}

function aplicarCupon() {
  const code = document.getElementById('coupon-input').value.trim().toUpperCase();
  if (code === 'AURA2026') {
    descuentoActivo = 0.15;
    mostrarToast("¡Cupón aplicado: 15% OFF! 🎉");
    actualizarCarrito();
  } else {
    mostrarToast("Cupón inválido ❌");
  }
}

/* --- LÓGICA DE PAGO FUTURISTA 3D --- */
function setPayMethod(method) {
  document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${method}`).classList.add('active');

  document.getElementById('pay-view-card').style.display = method === 'card' ? 'block' : 'none';
  document.getElementById('pay-view-crypto').style.display = method === 'crypto' ? 'block' : 'none';
  document.getElementById('pay-view-bio').style.display = method === 'bio' ? 'block' : 'none';
}

function rotateCard(event, container) {
  const card = document.getElementById('card-element');
  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width/2;
  const y = event.clientY - rect.top - rect.height/2;

  card.style.transform = `rotateY(${x / 8}deg) rotateX(${-y / 8}deg)`;
}

function resetCard(container) {
  const card = document.getElementById('card-element');
  card.style.transform = 'rotateY(0deg) rotateX(0deg)';
}

function verDetalles(id) {
  const p = productos.find(item => item.id === id);
  document.getElementById('quick-title').textContent = p.titulo;
  document.getElementById('quick-content').innerHTML = `
    <img src="${p.imagen}" style="width:100%; border-radius:12px; margin-bottom:1rem;">
    <p><strong>Categoría:</strong> ${p.categoria.toUpperCase()}</p>
    <p style="margin: 0.5rem 0;">${p.desc}</p>
    <p><strong>Puntuación:</strong> ⭐ ${p.rating} / 5.0</p>
    <h2 style="color:var(--primary); margin-top:1rem;">$${p.precio.toFixed(2)}</h2>
    <button class="add-btn" style="width:100%; margin-top:1rem; padding:0.8rem;" onclick="agregarAlCarrito(${p.id}); toggleQuickModal();">Agregar al Carrito</button>
  `;
  toggleQuickModal();
}

function toggleTheme() {
  const body = document.body;
  const isLight = body.getAttribute('data-theme') === 'light';
  body.setAttribute('data-theme', isLight ? 'dark' : 'light');
}

function toggleCartModal() { document.getElementById('cart-modal').classList.toggle('open'); }
function toggleQuickModal() { document.getElementById('quick-modal').classList.toggle('open'); }
function toggleFavModal() {
  const container = document.getElementById('fav-items');
  const favProds = productos.filter(p => favoritos.includes(p.id));
  if (favProds.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:var(--text-muted)">No tienes favoritos guardados.</p>';
  } else {
    container.innerHTML = favProds.map(p => `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
        <span>${p.titulo} - <strong>$${p.precio}</strong></span>
        <button class="add-btn" onclick="agregarAlCarrito(${p.id})">+ Carrito</button>
      </div>
    `).join('');
  }
  document.getElementById('fav-modal').classList.toggle('open');
}

function mostrarToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 2000);
}

function procesarCompra() {
  const activeTab = document.querySelector('.pay-tab.active').id;
  let msg = "💳 Transacción completada con éxito.";
  
  if (activeTab === 'tab-crypto') msg = "🌐 Transacción confirmada en la Blockchain.";
  if (activeTab === 'tab-bio') msg = "👁️ Autenticación biométrica aprobada.";

  alert(`🎉 ¡Gracias por tu compra en AuraStore Pro!\n${msg}`);
  carrito = [];
  actualizarCarrito();
  toggleCartModal();
}

init();
