// Load inventory and sales data from localStorage
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];

// Save sales to localStorage
function saveSales() {
    localStorage.setItem("sales", JSON.stringify(sales));
}

// Populate dropdown with inventory items
function populateProductDropdown() {
    const select = document.getElementById("product");
    select.innerHTML = "";

    if (inventory.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.innerText = "No products in inventory";
        select.appendChild(option);
        return;
    }

    inventory.forEach(item => {
        const option = document.createElement("option");
        option.value = item.name;
        option.innerText = item.name;
        select.appendChild(option);
    });
}

// Render sales log table with Delete button
function renderSales() {
    const table = document.getElementById("salesTable");
    table.innerHTML = `
        <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Action</th>
        </tr>
    `;

    sales.forEach((sale, index) => {
        const row = table.insertRow();
        row.insertCell(0).innerText = sale.product;
        row.insertCell(1).innerText = sale.quantity;
        row.insertCell(2).innerText = `$${sale.amount.toFixed(2)}`;
        row.insertCell(3).innerText = new Date(sale.date).toLocaleString();

        // Delete button
        const deleteCell = row.insertCell(4);
        const delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        delBtn.addEventListener("click", () => deleteSale(index));
        deleteCell.appendChild(delBtn);
    });

    calculateProfit(); // Update totals whenever sales are rendered
}

// Delete sale by index
function deleteSale(index) {
    const sale = sales[index];
    const item = inventory.find(i => i.name === sale.product);

    // Restore inventory
    if (item) {
        item.quantity += sale.quantity;
        localStorage.setItem("inventory", JSON.stringify(inventory));
    }

    // Remove sale
    sales.splice(index, 1);
    saveSales();
    renderSales();
    populateProductDropdown();
}

// Calculate total revenue and profit
function calculateProfit() {
    let totalRevenue = 0;
    let totalCost = 0;

    sales.forEach(sale => {
        totalRevenue += sale.amount;

        const item = inventory.find(i => i.name === sale.product);
        if (item) {
            const costPerUnit = item.cost || 0;
            totalCost += costPerUnit * sale.quantity;
        }
    });

    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    document.getElementById("totalRevenue").innerText = totalRevenue.toFixed(2);
    document.getElementById("totalProfit").innerText = totalProfit.toFixed(2);
    document.getElementById("profitMargin").innerText = profitMargin.toFixed(2);
}

// Auto-calculate sale amount based on product price and quantity
const productSelect = document.getElementById("product");
const quantityInput = document.getElementById("quantity");
const amountInput = document.getElementById("amount");

function updateSaleAmount() {
    const productName = productSelect.value;
    const quantity = parseInt(quantityInput.value, 10) || 0;
    const item = inventory.find(i => i.name === productName);
    if (item && quantity > 0) {
        amountInput.value = (item.price * quantity).toFixed(2);
    } else {
        amountInput.value = "";
    }
}

// Update amount when product or quantity changes
productSelect.addEventListener("change", updateSaleAmount);
quantityInput.addEventListener("input", updateSaleAmount);

// Handle logging a sale
document.getElementById("logSaleBtn").addEventListener("click", () => {
    const product = productSelect.value;
    const quantity = parseInt(quantityInput.value, 10);

    if (!product || isNaN(quantity) || quantity <= 0) {
        alert("Please enter valid data!");
        return;
    }

    const invItem = inventory.find(i => i.name === product);
    if (!invItem) {
        alert("Product not found in inventory.");
        return;
    }

    if (quantity > invItem.quantity) {
        alert(`Not enough stock. Only ${invItem.quantity} available.`);
        return;
    }

    const amount = invItem.price * quantity; // auto-calc amount

    // Reduce stock in inventory
    invItem.quantity -= quantity;
    localStorage.setItem("inventory", JSON.stringify(inventory));

    // Add sale record
    sales.push({ product, quantity, amount, date: new Date() });
    saveSales();
    renderSales();
    populateProductDropdown(); // refresh dropdown

    quantityInput.value = "";
    amountInput.value = "";
});

// Initialize page
populateProductDropdown();
renderSales();
