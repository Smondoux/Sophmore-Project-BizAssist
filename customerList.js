let customers = sessionStorage.getItem("customers")
  ? JSON.parse(sessionStorage.getItem("customers"))
  : [
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

function saveCustomers() {
  sessionStorage.setItem("customers", JSON.stringify(customers));
}

function loadCustomers(){
    const listDiv=document.getElementById("customerList");
    listDiv.innerHTML="";

    customers.forEach((cust) => {
        const card= document.createElement("div");
        card.classList.add("customer-card");

        card.innerHTML=`
          <h3>${cust.name}</h3>
          <p><strong>Email:</strong> ${cust.email}</p>
          <p><strong>Phone:</strong> ${cust.phone}</p>
          <p><strong>Loyalty Points:</strong> ${cust.loyaltyPoints}</p>
          <p><strong>Purchase History:</strong> ${cust.purchaseHistory.join(", ")}</p>
          <button onclick="window.open('https://gmail.com')">Contact</button>
      `;

      listDiv.appendChild(card);
    })
}

function contactCus(index){
    const customer=customers[index];
    document.getElementById("customerName").value=customer.name;
    alert(`You have selected ${customer.name} to contact.`);
}

function addCustomer() {
 
  const name=document.getElementById("name").value.trim();
  const email=document.getElementById("email").value.trim();
  const phone=document.getElementById("phone").value.trim();
  const loyaltyPoints=parseInt(document.getElementById("points").value.trim()) || 0;
  const purchaseHistory=document.getElementById("hist").value
    .split(",")
    .map(item => item.trim())
    .filter(item => item !== "");

  
  if (!name || !email || !phone) {
    alert("Please fill out at least the name, email, AND phone number.");
    return;
  }

  
  const newCustomer={
    name,
    email,
    phone,
    loyaltyPoints,
    purchaseHistory
  };

  
  customers.push(newCustomer);
  saveCustomers();
  
  loadCustomers();

}

document.addEventListener("DOMContentLoaded", loadCustomers);