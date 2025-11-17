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
        option.value = item.name;
        option.innerText = item.name;
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
        row.insertCell(0).innerText = sale.product;
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
    const item = inventory.find(i => i.name === sale.product);

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

    const amount = invItem.price * quantity;

    invItem.quantity -= quantity;
    localStorage.setItem("inventory", JSON.stringify(inventory));

    sales.push({ product, quantity, amount, date: new Date() });
    saveSales();
    renderSales();
    populateProductDropdown();

    quantityInput.value = "";
    amountInput.value = "";
});

// --- Time-Based Reports ---
document.getElementById("reportRange").addEventListener("change", () => {
    const range = document.getElementById("reportRange").value;
    document.getElementById("customRange").style.display =
        range === "custom" ? "block" : "none";
});

document.getElementById("runReportBtn").addEventListener("click", () => {
    const range = document.getElementById("reportRange").value;
    let filtered = [];
    const now = new Date();

    if (range === "today") {
        filtered = sales.filter(s => new Date(s.date).toDateString() === now.toDateString());
    } else if (range === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        filtered = sales.filter(s => new Date(s.date) >= startOfWeek);
    } else if (range === "month") {
        const month = now.getMonth();
        const year = now.getFullYear();
        filtered = sales.filter(s => {
            const d = new Date(s.date);
            return d.getMonth() === month && d.getFullYear() === year;
        });
    } else if (range === "custom") {
        const start = new Date(document.getElementById("startDate").value);
        const end = new Date(document.getElementById("endDate").value);
        end.setHours(23,59,59);

        if (!start || !end) {
            alert("Please select both dates.");
            return;
        }

        filtered = sales.filter(s => {
            const d = new Date(s.date);
            return d >= start && d <= end;
        });
    }

    calculateTimeReport(filtered);
});

function calculateTimeReport(filteredSales) {
    let revenue = 0;
    let cost = 0;

    filteredSales.forEach(sale => {
        revenue += sale.amount;

        const item = inventory.find(i => i.name === sale.product);
        if (item) cost += (item.cost || 0) * sale.quantity;
    });

    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    document.getElementById("reportRevenue").innerText = revenue.toFixed(2);
    document.getElementById("reportProfit").innerText = profit.toFixed(2);
    document.getElementById("reportMargin").innerText = margin.toFixed(2);
}

populateProductDropdown();
renderSales();
