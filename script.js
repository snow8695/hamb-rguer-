
const WHATSAPP = "5551999999999";

// Produtos de exemplo: personalize nomes, preços e imagens.
const products = [
  {
    id: 1,
    name: "Classic Burger",
    category: "Burgers",
    price: 24.90,
    description: "Pão brioche, carne 150g, cheddar e molho da casa.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Double Bacon",
    category: "Burgers",
    price: 32.90,
    description: "Dois hambúrgueres, cheddar, bacon e maionese especial.",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Smash Burger",
    category: "Burgers",
    price: 22.90,
    description: "Carne smash, queijo e cebola caramelizada.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Combo Brasa",
    category: "Combos",
    price: 39.90,
    description: "Burger, batata frita e refrigerante.",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Combo Duplo",
    category: "Combos",
    price: 54.90,
    description: "Dois burgers, batata grande e duas bebidas.",
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Refrigerante",
    category: "Bebidas",
    price: 6.00,
    description: "Lata de refrigerante geladinha.",
    image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "Milk-shake",
    category: "Bebidas",
    price: 14.90,
    description: "Milk-shake cremoso de chocolate.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "Brownie",
    category: "Sobremesas",
    price: 10.00,
    description: "Brownie de chocolate.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80"
  }
];

let cart = [];
let currentCategory = "Todos";

const money = value =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

// Mostra os produtos e aplica os filtros.
function renderProducts() {
  const filtered = currentCategory === "Todos"
    ? products
    : products.filter(p => p.category === currentCategory);

  document.getElementById("products").innerHTML =
    filtered.map(p => `
      <article class="product">
        <img src="${p.image}" alt="${p.name}" loading="lazy">

        <div class="product-info">
          <h3>${p.name}</h3>
          <p class="description">${p.description}</p>

          <div class="product-bottom">
            <span class="price">${money(p.price)}</span>
            <button class="add" data-add="${p.id}">
              + Adicionar
            </button>
          </div>
        </div>
      </article>
    `).join("");
}

// Adiciona produtos ao carrinho.
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const item = cart.find(i => i.id === id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
}

// Aumenta ou diminui a quantidade.
function changeQuantity(id, amount) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  renderCart();
}

// Atualiza a lista e o valor total.
function renderCart() {
  const list = document.getElementById("cart-items");

  const count = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  document.getElementById("cart-count").textContent = count;
  document.getElementById("total").textContent = money(total);
  document.getElementById("empty-message").hidden = cart.length > 0;

  list.innerHTML = cart.map(item => `
    <li>
      <span>
        ${item.name} × ${item.quantity}<br>
        <small>${money(item.price * item.quantity)}</small>
      </span>

      <span>
        <button class="remove"
          data-change="${item.id}" data-amount="-1"
          aria-label="Diminuir ${item.name}">−</button>

        <button class="remove"
          data-change="${item.id}" data-amount="1"
          aria-label="Aumentar ${item.name}">+</button>
      </span>
    </li>
  `).join("");
}

// Filtros de categoria.
document.querySelector(".categories").addEventListener("click", event => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;

  currentCategory = button.dataset.category;

  document.querySelectorAll(".categories button").forEach(b => {
    b.classList.toggle("active", b === button);
  });

  renderProducts();
});

// Botões para adicionar produtos.
document.getElementById("products").addEventListener("click", event => {
  const button = event.target.closest("button[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

// Botões de quantidade do carrinho.
document.getElementById("cart-items").addEventListener("click", event => {
  const button = event.target.closest("button[data-change]");
  if (!button) return;

  changeQuantity(
    Number(button.dataset.change),
    Number(button.dataset.amount)
  );
});

// Finaliza o pedido pelo WhatsApp.
document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Adicione pelo menos um produto ao carrinho!");
    return;
  }

  if (!/^\d{12,13}$/.test(WHATSAPP)) {
    alert("Configure o número do WhatsApp no script.js.");
    return;
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const lines = cart.map(item =>
    `• ${item.name} x${item.quantity} — ${money(item.price * item.quantity)}`
  );

  const message = [
    "Olá! Quero fazer um pedido 🍔",
    "",
    ...lines,
    "",
    `Total: ${money(total)}`,
    "",
    "Como posso informar meus dados de entrega?"
  ].join("\n");

  const url =
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
});

// Inicializa o site.
renderProducts();
renderCart();
