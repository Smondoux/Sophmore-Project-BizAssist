let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

function saveInventory() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

function renderInventory() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = "";

  if (inventory.length === 0) {
    grid.innerHTML = "<p>No items in inventory.</p>";
    return;
  }

  const categories = {};
  inventory.forEach(item => {
    const cat = item.category || "Other";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  });

  const sortedCategories = Object.keys(categories).sort();

  sortedCategories.forEach(catName => {
    const section = document.createElement("div");
    section.classList.add("category-section");

    const title = document.createElement("h2");
    title.textContent = catName;
    section.appendChild(title);

    const itemsContainer = document.createElement("div");
    itemsContainer.classList.add("category-items");

    categories[catName].forEach(item => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      let catClass = "other";
      const category = (item.category || "").toLowerCase();
      if (category === "produce") catClass = "produce";
      else if (category === "dairy") catClass = "dairy";
      else if (category === "meat") catClass = "meat";
      else if (category === "bakery") catClass = "bakery";
      else if (category === "pantry") catClass = "pantry";
      else if (category === "beverages") catClass = "beverages";

      card.classList.add(catClass);

      card.innerHTML = `
        <h3>${item.name}</h3>
        <p>Quantity: ${item.quantity}</p>
        <button onclick="increaseItem('${item.name}')">+ Add Stock</button>
        <button onclick="reduceItem('${item.name}')">- Remove Stock</button>
      `;

      itemsContainer.appendChild(card);
    });

    section.appendChild(itemsContainer);
    grid.appendChild(section);
  });
}

function addItem() {
  const name = prompt("Enter product name:");
  const category = prompt("Enter category (Produce, Dairy, Meat, Bakery, Pantry, Beverages):") || "Other";
  const quantity = parseInt(prompt("Enter quantity:"), 10);

  if (!name || isNaN(quantity) || quantity <= 0) return alert("Invalid input!");

  const existing = inventory.find(i => i.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    existing.quantity += quantity;
    if (!existing.category) existing.category = category;
  } else {
    inventory.push({ name, category, quantity });
  }

  saveInventory();
  renderInventory();
}

function increaseItem(name) {
  const item = inventory.find(i => i.name.toLowerCase() === name.toLowerCase());
  if (!item) return;
  const amount = parseInt(prompt(`Add how many to ${item.name}?`), 10);
  if (isNaN(amount) || amount <= 0) return alert("Invalid amount");
  item.quantity += amount;
  saveInventory();
  renderInventory();
}

function reduceItem(name) {
  const item = inventory.find(i => i.name.toLowerCase() === name.toLowerCase());
  if (!item) return;
  const amount = parseInt(prompt(`Remove how many from ${item.name}?`), 10);
  if (isNaN(amount) || amount <= 0 || amount > item.quantity) return alert("Invalid amount");
  item.quantity -= amount;
  saveInventory();
  renderInventory();
}

function decreaseInventory(productName, amountSold) {
  const item = inventory.find(i => i.name.toLowerCase() === productName.toLowerCase());
  if (!item) return;
  if (amountSold > item.quantity) amountSold = item.quantity;
  item.quantity -= amountSold;
  saveInventory();
  renderInventory();
}

if (document.getElementById("addItemBtn")) {
  document.getElementById("addItemBtn").addEventListener("click", addItem);
}
if (document.getElementById("resetBtn")) {
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (confirm("Clear all inventory?")) {
      inventory = [];
      saveInventory();
      renderInventory();
    }
  });
}

renderInventory();

window.decreaseInventory = decreaseInventory;

window.addEventListener("focus", () => {
  inventory = JSON.parse(localStorage.getItem("inventory")) || [];
  renderInventory();
});
