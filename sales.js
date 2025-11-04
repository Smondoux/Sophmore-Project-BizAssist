let sales = JSON.parse(localStorage.getItem("sales")) || [];

function saveSales() {
    localStorage.setItem("sales", JSON.stringify(sales));
}

function renderSales() {
    const table = document.getElementById("salesTable");
    table.innerHTML = `
        <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Date</th>
        </tr>
    `;
    sales.forEach(sale => {
        const row = table.insertRow();
        row.insertCell(0).innerText = sale.product;
        row.insertCell(1).innerText = sale.quantity;
        row.insertCell(2).innerText = `$${sale.amount.toFixed(2)}`;
        row.insertCell(3).innerText = new Date(sale.date).toLocaleString();
    });
}

document.getElementById("logSaleBtn").addEventListener("click", () => {
    const product = document.getElementById("product").value;
    const quantity = parseInt(document.getElementById("quantity").value, 10);
    const amount = parseFloat(document.getElementById("amount").value);

    if (!product || isNaN(quantity) || isNaN(amount) || quantity <= 0 || amount <= 0) {
        alert("Please enter valid data!");
        return;
    }

    sales.push({ product, quantity, amount, date: new Date() });
    saveSales();
    renderSales();

    document.getElementById("product").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("amount").value = "";
});

renderSales();
