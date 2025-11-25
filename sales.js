document.addEventListener("DOMContentLoaded", () => {
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    let sales = JSON.parse(localStorage.getItem("sales")) || [];

    const productSelect = document.getElementById("product");
    const quantityInput = document.getElementById("quantity");
    const amountInput = document.getElementById("amount");

    function saveSales() {
        localStorage.setItem("sales", JSON.stringify(sales));
    }

    function populateProductDropdown() {
        inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        productSelect.innerHTML = '<option value="">Select a product</option>';
        if (inventory.length === 0) {
            const option = document.createElement("option");
            option.value = "";
            option.innerText = "No products in inventory";
            productSelect.appendChild(option);
            return;
        }
        inventory.forEach(item => {
            const option = document.createElement("option");
            option.value = item.name;
            option.innerText = item.name;
            productSelect.appendChild(option);
        });
    }

    function updateSaleAmount() {
        const productName = productSelect.value;
        const quantity = parseInt(quantityInput.value, 10) || 0;
        const item = inventory.find(i => i.name.toLowerCase() === productName.toLowerCase());
        if (item && quantity > 0) {
            amountInput.value = (item.price * quantity).toFixed(2);
        } else {
            amountInput.value = "";
        }
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
        const item = inventory.find(i => i.name.toLowerCase() === sale.product.toLowerCase());
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
            const item = inventory.find(i => i.name.toLowerCase() === sale.product.toLowerCase());
            if (item) totalCost += (item.cost || 0) * sale.quantity;
        });
        const totalProfit = totalRevenue - totalCost;
        const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
        document.getElementById("totalRevenue").innerText = totalRevenue.toFixed(2);
        document.getElementById("totalProfit").innerText = totalProfit.toFixed(2);
        document.getElementById("profitMargin").innerText = profitMargin.toFixed(2);
    }

    productSelect.addEventListener("change", updateSaleAmount);
    quantityInput.addEventListener("input", updateSaleAmount);

    document.getElementById("logSaleBtn").addEventListener("click", () => {
        const product = productSelect.value;
        const quantity = parseInt(quantityInput.value, 10);
        if (!product || isNaN(quantity) || quantity <= 0) {
            alert("Please enter valid data!");
            return;
        }
        const invItem = inventory.find(i => i.name.toLowerCase() === product.toLowerCase());
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

    populateProductDropdown();
    renderSales();

    window.addEventListener("focus", () => {
        populateProductDropdown();
        renderSales();
    });

    function getSalesInRange(start, end) {
        return sales.filter(sale => {
            const d = new Date(sale.date);
            return d >= start && d <= end;
        });
    }

    function getPresetRange(rangeType) {
        const now = new Date();
        let start, end;
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        if (rangeType === "today") {
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (rangeType === "week") {
            const day = now.getDay();
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
        } else if (rangeType === "month") {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        return { start, end };
    }

    function calculateRangeTotals(rangeSales) {
        let revenue = 0;
        let cost = 0;
        rangeSales.forEach(sale => {
            revenue += sale.amount;
            const item = inventory.find(i => i.name.toLowerCase() === sale.product.toLowerCase());
            if (item) cost += (item.cost || 0) * sale.quantity;
        });
        const profit = revenue - cost;
        const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
        return {
            revenue: revenue.toFixed(2),
            profit: profit.toFixed(2),
            margin: margin.toFixed(2)
        };
    }

    document.getElementById("reportRange").addEventListener("change", () => {
        const range = document.getElementById("reportRange").value;
        document.getElementById("customRange").style.display = range === "custom" ? "block" : "none";
    });

    document.getElementById("runReportBtn").addEventListener("click", () => {
        const range = document.getElementById("reportRange").value;
        let start, end;
        if (range === "custom") {
            start = new Date(document.getElementById("startDate").value);
            end = new Date(document.getElementById("endDate").value);
            if (!start || !end || start > end) {
                alert("Please enter a valid date range.");
                return;
            }
        } else {
            ({ start, end } = getPresetRange(range));
        }
        const filteredSales = getSalesInRange(start, end);
        const totals = calculateRangeTotals(filteredSales);
        document.getElementById("reportRevenue").innerText = totals.revenue;
        document.getElementById("reportProfit").innerText = totals.profit;
        document.getElementById("reportMargin").innerText = totals.margin;
    });
});
