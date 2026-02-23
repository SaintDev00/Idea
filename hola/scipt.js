const products = [
    {id:1,name:'Double XP Boost',price:1000,cat:'boost',img:'./shared/doble.png',stock:10},
    {id:3,name:'Xova Boost',price:750,cat:'boost',img:'images/xova.jpg',stock:15},
    {id:4,name:'Enive Boost',price:750,cat:'boost',img:'images/enive.jpg',stock:12},
    {id:5,name:'JOKER',price:750,cat:'special',img:'images/joker.jpg',stock:5},
    {id:6,name:'Erisin Boost',price:700,cat:'boost',img:'images/erisin.jpg',stock:15},
    {id:7,name:'Territory Shield',price:500,cat:'shield',img:'images/shield1.jpg',stock:5},
    {id:8,name:'Territory Shield',price:500,cat:'shield',img:'images/shield2.jpg',stock:5},
    {id:9,name:'Germany Shield',price:500,cat:'shield',img:'images/germany.jpg',stock:3},
    {id:10,name:'Sabotage',price:750,cat:'sabotage',img:'images/sabotage1.jpg',stock:6},
    {id:11,name:'Sabotage',price:750,cat:'sabotage',img:'images/sabotage2.jpg',stock:6},
    {id:12,name:'Gitatage',price:750,cat:'sabotage',img:'images/gitatage.jpg',stock:4},
    {id:13,name:'Warfare Boost',price:750,cat:'sabotage',img:'images/warfare.jpg',stock:8},
    {id:14,name:'Removal Tool',price:500,cat:'special',img:'images/removal.jpg',stock:3},
    {id:15,name:'Disable XP Boost',price:750,cat:'special',img:'images/disable.jpg',stock:4},
    {id:16,name:'Tentor Syield',price:750,cat:'special',img:'images/tentor.jpg',stock:2}
];

let points = 2606, cart = [], filter = 'all', search = '';

const grid = document.getElementById('productsGrid');
const totalSpan = document.getElementById('totalPoints');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const cartBtn = document.getElementById('cartBtn');
const cartDiv = document.getElementById('cart');
const closeCart = document.getElementById('closeCart');
const checkout = document.getElementById('checkout');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const searchInput = document.getElementById('search');

function render() {
    let filtered = products.filter(p => (filter=='all'||p.cat==filter) && 
        p.name.toLowerCase().includes(search));
    
    grid.innerHTML = filtered.map(p => {
        let inCart = cart.find(i=>i.id==p.id);
        let avail = p.stock - (inCart?.qty||0);
        return `<div class="card ${avail<=0?'out':''}">
            <img src="${p.img}" alt="${p.name}" class="card-image" onerror="this.src='https://via.placeholder.com/250x140?text=Image+Not+Found'">
            <h3>${p.name}</h3>
            <p>${p.cat}</p>
            <div class="card-footer">
                <span class="price">$${p.price}</span>
                <button class="add-btn" ${avail<=0||points<p.price?'disabled':''} onclick="add(${p.id})">
                    ${avail<=0?'SOLD OUT':points<p.price?'NO POINTS':'ADD'}
                </button>
            </div>
        </div>`;
    }).join('');
}

function add(id) {
    let p = products.find(p=>p.id==id);
    let inCart = cart.find(i=>i.id==id);
    if((inCart?.qty||0) >= p.stock) return;
    if((inCart?.qty+1||1)*p.price > points) return;
    
    if(inCart) inCart.qty++;
    else cart.push({...p,qty:1});
    
    updateCart();
    render();
}

function updateCart() {
    let total = cart.reduce((s,i)=>s+i.price*i.qty,0);
    cartTotal.textContent = total;
    cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
    checkout.disabled = !cart.length || total > points;
    
    cartItems.innerHTML = cart.length ? cart.map(i=>`
        <div class="cart-item">
            <div>${i.name} x${i.qty}</div>
            <div class="item-controls">
                <button onclick="qty(${i.id},-1)">-</button>
                <span>${i.qty}</span>
                <button onclick="qty(${i.id},1)">+</button>
                <span class="remove" onclick="remove(${i.id})">✕</span>
            </div>
        </div>
    `).join('') : '<div style="text-align:center;padding:20px">Empty cart</div>';
}

window.qty = (id,ch) => {
    let i = cart.find(i=>i.id==id);
    if(!i) return;
    let newQ = i.qty+ch;
    if(newQ<=0) return cart = cart.filter(x=>x.id!=id);
    let p = products.find(p=>p.id==id);
    if(newQ>p.stock) return;
    let total = cart.reduce((s,item)=>s+(item.id==id?item.price*newQ:item.price*item.qty),0);
    if(total>points) return;
    i.qty = newQ;
    updateCart();
    render();
}

window.remove = (id) => {
    cart = cart.filter(i=>i.id!=id);
    updateCart();
    render();
}

checkout.onclick = () => {
    let total = cart.reduce((s,i)=>s+i.price*i.qty,0);
    points -= total;
    cart.forEach(i => products.find(p=>p.id==i.id).stock -= i.qty);
    cart = [];
    totalSpan.textContent = points;
    updateCart();
    render();
    cartDiv.classList.remove('open');
    modal.classList.add('show');
};

cartBtn.onclick = () => cartDiv.classList.add('open');
closeCart.onclick = () => cartDiv.classList.remove('open');
closeModal.onclick = () => modal.classList.remove('show');

document.querySelectorAll('.filters button').forEach(b => b.onclick = (e) => {
    document.querySelector('.filters .active')?.classList.remove('active');
    e.target.classList.add('active');
    filter = e.target.dataset.filter;
    render();
});

searchInput.oninput = (e) => {
    search = e.target.value.toLowerCase();
    render();
};

totalSpan.textContent = points;
render();
updateCart();