let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];

function saveSales() {
    localStorage.setItem("sales", JSON.stringify(sales));
}

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
        option.value = item.productName;
        option.innerText = item.productName;
        select.appendChild(option);
    });
}

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
        row.insertCell(0).innerText = sale.productName;
        row.insertCell(1).innerText = sale.quantity;
        row.insertCell(2).innerText = `$${sale.amount.toFixed(2)}`;
        row.insertCell(3).innerText = new Date(sale.date).toLocaleString();

        const deleteCell = row.insertCell(4);
        const delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        delBtn.addEventListener("click", () => deleteSale(index));
        deleteCell.appendChild(delBtn);
    });

    calculateProfit();
}

function deleteSale(index) {
    const sale = sales[index];
    const item = inventory.find(i => i.productName === sale.productName);

    if (item) {
        item.quantity += sale.quantity;
        localStorage.setItem("inventory", JSON.stringify(inventory));
    }

    sales.splice(index, 1);
    saveSales();
    renderSales();
    populateProductDropdown();
}

function calculateProfit() {
    let totalRevenue = 0;
    let totalCost = 0;

    sales.forEach(sale => {
        totalRevenue += sale.amount;

        const item = inventory.find(i => i.productName === sale.productName);
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

const productSelect = document.getElementById("product");
const quantityInput = document.getElementById("quantity");
const amountInput = document.getElementById("amount");

function updateSaleAmount() {
    const productName = productSelect.value;
    const quantity = parseInt(quantityInput.value, 10) || 0;
    const item = inventory.find(i => i.productName === productName);
    if (item && quantity > 0) {
        amountInput.value = (item.price * quantity).toFixed(2);
    } else {
        amountInput.value = "";
    }
}

productSelect.addEventListener("change", updateSaleAmount);
quantityInput.addEventListener("input", updateSaleAmount);

document.getElementById("logSaleBtn").addEventListener("click", () => {
    const productName = productSelect.value;
    const quantity = parseInt(quantityInput.value, 10);

    if (!productName || isNaN(quantity) || quantity <= 0) {
        alert("Please enter valid data!");
        return;
    }

    const invItem = inventory.find(i => i.productName === productName);
    if (!invItem) {
        alert("Product not found in inventory.");
        return;
    }

    if (quantity > invItem.quantity) {
        alert(`Not enough stock. Only ${invItem.quantity} available.`);
        return;
    }

    const amount = invItem.price * quantity;
    invItem.quantity -= quantity;
    localStorage.setItem("inventory", JSON.stringify(inventory));

    sales.push({ productName, quantity, amount, date: new Date() });
    saveSales();
    renderSales();
    populateProductDropdown();

    quantityInput.value = "";
    amountInput.value = "";
});

window.addEventListener("focus", () => {
    inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    populateProductDropdown();
});

document.addEventListener("DOMContentLoaded", () => {
    inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    populateProductDropdown();
    renderSales();
});
