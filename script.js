
"use strict";

// ========================================
// 1. PRODUITS
// ========================================

const products = [
  { id: 1, name: "Ordinateur portable", category: "Informatique", price: 1450, emoji: "💻" },
  { id: 2, name: "Souris sans fil", category: "Informatique", price: 35, emoji: "🖱️" },
  { id: 3, name: "Clavier gaming", category: "Informatique", price: 89, emoji: "⌨️" },
  { id: 4, name: "Smartphone", category: "Téléphones", price: 799, emoji: "📱" },
  { id: 5, name: "Écouteurs Bluetooth", category: "Téléphones", price: 59, emoji: "🎧" },
  { id: 6, name: "Télévision LED", category: "Électronique", price: 950, emoji: "📺" },
  { id: 7, name: "Enceinte Bluetooth", category: "Électronique", price: 120, emoji: "🔊" },
  { id: 8, name: "Lampe de bureau", category: "Maison", price: 45, emoji: "💡" },
  { id: 9, name: "Mixeur électrique", category: "Cuisine", price: 110, emoji: "🥤" },
  { id: 10, name: "Machine à café", category: "Cuisine", price: 230, emoji: "☕" },
  { id: 11, name: "Aspirateur", category: "Ménage", price: 280, emoji: "🧹" },
  { id: 12, name: "Fer à repasser", category: "Ménage", price: 95, emoji: "♨️" },
  { id: 13, name: "Chargeur USB", category: "Accessoires", price: 25, emoji: "🔌" },
  { id: 14, name: "Câble USB-C", category: "Accessoires", price: 15, emoji: "🔗" },
  { id: 15, name: "Sac à dos", category: "Accessoires", price: 65, emoji: "🎒" },
  { id: 16, name: "Ventilateur", category: "Maison", price: 140, emoji: "🌀" }
];

let cart = [];
let selectedCategory = "Tous";

// ========================================
// 2. ELEMENTS HTML
// ========================================

const productList = document.getElementById("productList");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");

// Vérifier que les éléments essentiels existent
if (
  !productList ||
  !cartItems ||
  !cartCount ||
  !cartTotal ||
  !searchInput ||
  !emptyMessage
) {
  console.error(
    "Erreur : certains éléments HTML sont introuvables. Vérifiez index.html."
  );
} else {

// ========================================
// 3. AFFICHER LES PRODUITS
// ========================================

function renderProducts() {
  const search = searchInput.value.trim().toLowerCase();

  const filtered = products.filter(product => {
    const matchesCategory =
      selectedCategory === "Tous" ||
      product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  productList.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image">${product.emoji}</div>
      <span class="product-category">${product.category}</span>
      <h3>${product.name}</h3>
      <p class="product-price">${product.price.toFixed(2)} DT</p>
      <button class="add-button" data-add="${product.id}">
        Ajouter au panier
      </button>
    </article>
  `).join("");

  const productCount = document.getElementById("productCount");

  if (productCount) {
    productCount.textContent =
      `${filtered.length} produit(s)`;
  }

  emptyMessage.classList.toggle("hidden", filtered.length > 0);
}

// ========================================
// 4. AFFICHER LE PANIER
// ========================================

function renderCart() {
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <strong>${item.emoji} ${item.name}</strong>
        <span>${item.price.toFixed(2)} DT / unité</span>
      </div>

      <div class="quantity">
        <button data-minus="${item.id}" aria-label="Diminuer">
          −
        </button>

        <span>${item.quantity}</span>

        <button data-plus="${item.id}" aria-label="Augmenter">
          +
        </button>
      </div>

      <strong>
        ${(item.price * item.quantity).toFixed(2)} DT
      </strong>

      <button class="remove-button" data-remove="${item.id}">
        Supprimer
      </button>
    </div>
  `).join("");

  const quantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCount.textContent = quantity;
  cartTotal.textContent = total.toFixed(2);

  const cartEmpty = document.getElementById("cartEmpty");

  if (cartEmpty) {
    cartEmpty.classList.toggle("hidden", cart.length > 0);
  }
}

// ========================================
// 5. AJOUTER UN PRODUIT AU PANIER
// ========================================

productList.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (!button) return;

  const id = Number(button.dataset.add);
  const product = products.find(item => item.id === id);

  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  renderCart();

  button.textContent = "Ajouté ✓";
  button.disabled = true;

  setTimeout(() => {
    if (button.isConnected) {
      button.textContent = "Ajouter au panier";
      button.disabled = false;
    }
  }, 900);
});

// ========================================
// 6. AUGMENTER, DIMINUER, SUPPRIMER
// ========================================

cartItems.addEventListener("click", event => {
  const button = event.target.closest("button");

  if (!button) return;

  if (button.dataset.plus !== undefined) {
    const item = cart.find(
      product => product.id === Number(button.dataset.plus)
    );

    if (item) {
      item.quantity++;
    }

  } else if (button.dataset.minus !== undefined) {
    const item = cart.find(
      product => product.id === Number(button.dataset.minus)
    );

    if (item) {
      item.quantity--;

      if (item.quantity <= 0) {
        cart = cart.filter(
          product => product.id !== item.id
        );
      }
    }

  } else if (button.dataset.remove !== undefined) {
    cart = cart.filter(
      product => product.id !== Number(button.dataset.remove)
    );
  }

  renderCart();
});

// ========================================
// 7. CATEGORIES
// ========================================

const categories = document.getElementById("categories");

if (categories) {
  categories.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");

    if (!button) return;

    selectedCategory = button.dataset.category;

    document.querySelectorAll(".category").forEach(category => {
      category.classList.toggle(
        "active",
        category === button
      );
    });

    renderProducts();
  });
}

// ========================================
// 8. RECHERCHE
// ========================================

searchInput.addEventListener("input", renderProducts);

const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {
  searchBtn.addEventListener("click", renderProducts);
}

// ========================================
// 9. OUVRIR LE PANIER
// ========================================

const cartButton = document.getElementById("cartButton");

if (cartButton) {
  cartButton.addEventListener("click", () => {
    const panier = document.getElementById("panier");

    if (panier) {
      panier.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
}

// ========================================
// 10. COMMANDE WHATSAPP
// ========================================

const orderButton = document.getElementById("orderButton");

if (orderButton) {
  orderButton.addEventListener("click", () => {
    if (cart.length === 0) {
      alert(
        "Votre panier est vide. Ajoutez d'abord un produit."
      );
      return;
    }

    const lines = cart.map(item =>
      `- ${item.name} x${item.quantity} = ${
        (item.price * item.quantity).toFixed(2)
      } DT`
    );

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const message = [
      "Bonjour, je souhaite commander chez Tounsi Shop :",
      "",
      ...lines,
      "",
      `Total estimé : ${total.toFixed(2)} DT`,
      "",
      "Nom :",
      "Adresse de livraison :",
      "Téléphone :",
      "",
      "Merci de confirmer la disponibilité et le prix."
    ].join("\n");

    // IMPORTANT :
    // Remplacez ce numéro par VOTRE numéro WhatsApp.
    // Format : indicatif pays + numéro, sans + ni espaces.
    const phone = "21624603312";

    if (!/^216\d{8}$/.test(phone)) {
      alert(
        "Ouvrez script.js et remplacez 21624603312 par votre numéro WhatsApp tunisien."
      );
      return;
    }

    const whatsappURL =
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
  });
}

// ========================================
// 11. ANNEE AUTOMATIQUE
// ========================================

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// ========================================
// 12. INITIALISATION
// ========================================

renderProducts();
renderCart();

}
