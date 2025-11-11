const customers = [
{
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "555-1234",
    loyaltyPoints: 120,
    purchaseHistory: ["Widget A", "Widget B"]
},
{
    name: "Acme Corp",
    email: "sales@acme.com",
    phone: "555-5678",
    loyaltyPoints: 400,
    purchaseHistory: ["Bulk Order X", "Service Plan Y"] 
}
];

function loadCustomers(){
    const listDiv = document.getElementById("customerList");
    listDiv.innerHTML = "";

    customers.forEach((cust,index) => {
        const card= document.createElement("div");
        card.classList.add("customer-card");

        card.innerHTML = `
        <h3>${cust.name}</h3>
        <p><strong>Email:</strong> ${cust.email}</p>
        <p><strong>Phone:</strong> ${cust.phone}</p>
        <p><strong>Loyalty Points:</strong> ${cust.loyaltyPoints}</p>
        <p><strong>Purchase History:</strong> ${cust.purchaseHistory.join(", ")}</p>
        <button onclick="alert('Unfinished')">Contact</button>
      `;

      listDiv.appendChild(card);
    })
}

function contactCus(index){
    const customer=customers[index];
    document.getElementById("customerName").value = customer.name;
    alert(`You have selected ${customer.name} to contact.`);
}

function addCustomer() {
  // Grab values from the form
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const loyaltyPoints = parseInt(document.getElementById("points").value.trim()) || 0;
  const purchaseHistory = document.getElementById("hist").value
    .split(",")
    .map(item => item.trim())
    .filter(item => item !== "");

  // Basic validation
  if (!name || !email || !phone) {
    alert("Please fill out at least the name, email, and phone number.");
    return;
  }

  // Create new customer object
  const newCustomer = {
    name,
    email,
    phone,
    loyaltyPoints,
    purchaseHistory
  };

  // Add to customers array
  customers.push(newCustomer);

  // Refresh the display
  loadCustomers();

  // Clear the form fields
  document.getElementById("custName").value = "";
  document.getElementById("custEmail").value = "";
  document.getElementById("custPhone").value = "";
  document.getElementById("custPoints").value = "";
  document.getElementById("custHistory").value = "";

  alert(`${name} added successfully!`);
}

document.addEventListener("DOMContentLoaded", loadCustomers);