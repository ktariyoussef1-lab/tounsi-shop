
const produits = [
  { nom: "Écouteurs", prix: 25 },
  { nom: "Support téléphone", prix: 18 },
  { nom: "Câble USB-C", prix: 12 }
];

const panier = {};

function ajouter(index) {
  panier[index] = (panier[index] || 0) + 1;
  afficherPanier();
}

function afficherPanier() {
  const liste = document.getElementById("liste-panier");
  const totalElement = document.getElementById("total");

  liste.innerHTML = "";
  let total = 0;
  let nombreArticles = 0;

  for (const index in panier) {
    const quantite = panier[index];
    const produit = produits[index];
    const sousTotal = produit.prix * quantite;

    total += sousTotal;
    nombreArticles += quantite;

    const li = document.createElement("li");
    li.textContent =
      `${produit.nom} x ${quantite} = ${sousTotal} DT`;

    liste.appendChild(li);
  }

  if (nombreArticles === 0) {
    liste.innerHTML = "<li>Votre panier est vide.</li>";
  }

  totalElement.textContent = total;
}

function commanderWhatsApp() {
  const articles = Object.keys(panier);

  if (articles.length === 0) {
    alert("Ajoutez au moins un produit au panier !");
    return;
  }

  const numeroWhatsApp = "21624603312";

  let message = "Bonjour, je souhaite commander :\n\n";
  let total = 0;

  for (const index of articles) {
    const produit = produits[index];
    const quantite = panier[index];
    const sousTotal = produit.prix * quantite;

    message += `${produit.nom} x ${quantite} = ${sousTotal} DT\n`;
    total += sousTotal;
  }

  message += `\nTotal : ${total} DT`;
  message += "\n\nNom : ";
  message += "\nAdresse : ";
  message += "\nTéléphone : ";

  const url =
    "https://wa.me/" + numeroWhatsApp +
    "?text=" + encodeURIComponent(message);

  window.open(url, "_blank");
}
