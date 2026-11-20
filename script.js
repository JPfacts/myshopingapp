
const products = [
    {
        id: 1,
        name: "Smart Watch",
        price: 1999,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        description: "Premium smart watch with fitness tracking."
    },
    {
        id: 2,
        name: "Headphones",
        price: 1499,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        description: "Wireless headphones with amazing sound."
    },
    {
        id: 3,
        name: "Shoes",
        price: 2499,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        description: "Comfortable sports shoes."
    },
    {
        id: 4,
        name: "Backpack",
        price: 999,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        description: "Stylish backpack for everyday use."
    },
    {
        id: 5,
        name: "Camera",
        price: 12999,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
        description: "Capture beautiful moments."
    },
    {
        id: 6,
        name: "Sunglasses",
        price: 799,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
        description: "Trendy sunglasses."
    }
];

let cart = [];
let currentUser = null;
let orders = [];

// Display Products
function displayProducts() {
    const search = document.getElementById("search").value.toLowerCase();

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(search)
    );

    document.getElementById("productList").innerHTML =
        filtered.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>₹${product.price}</p>
                <button onclick="showDetails(${product.id})">
                    View Details
                </button>
                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `).join("");
}

// Product Details
function showDetails(id) {
    const product = products.find(p => p.id === id);

    document.getElementById("productDetails").innerHTML = `
        <img src="${product.image}" width="100%" height="200"
             style="object-fit:contain">
        <h2>${product.name}</h2>
        <h3>₹${product.price}</h3>
        <p>${product.description}</p>
        <button onclick="addToCart(${product.id})">
            Add to Cart
        </button>
    `;

    openModal("productModal");
}

// Add to Cart
function addToCart(id) {
    const item = cart.find(p => p.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            ...products.find(p => p.id === id),
            quantity: 1
        });
    }

    updateCart();
    closeModal("productModal");
    alert("Product added to cart!");
}

// Update Cart
function updateCart() {
    const count = cart.reduce((sum, item) =>
        sum + item.quantity, 0);

    document.getElementById("cartCount").innerText = count;

    document.getElementById("cartItems").innerHTML =
        cart.length ? cart.map(item => `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <p>₹${item.price} × ${item.quantity}</p>
                </div>
                <div>
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join("") : "<p>Your cart is empty.</p>";

    const total = getTotal();
    document.getElementById("cartTotal").innerText = total;
}

// Calculate Total
function getTotal() {
    return cart.reduce((sum, item) =>
        sum + item.price * item.quantity, 0);
}

// Change Quantity
function changeQuantity(id, amount) {
    const item = cart.find(p => p.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }

    updateCart();
}

// Show Cart
function showCart() {
    updateCart();
    openModal("cartModal");
}

// Login
function showLogin() {
    openModal("loginModal");
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        document.getElementById("loginMessage").innerText =
            "Please enter email and password.";
        return;
    }

    currentUser = email;

    document.getElementById("loginMessage").innerText =
        "Login successful! Welcome " + email;

    setTimeout(() => closeModal("loginModal"), 1200);
}

// Checkout
function checkout() {
    if (!cart.length) {
        alert("Your cart is empty!");
        return;
    }

    if (!currentUser) {
        alert("Please login before checkout.");
        closeModal("cartModal");
        showLogin();
        return;
    }

    document.getElementById("paymentTotal").innerText = getTotal();

    closeModal("cartModal");
    openModal("paymentModal");
}

// Place Order
function placeOrder() {
    const name = document.getElementById("customerName").value;
    const address = document.getElementById("address").value;
    const method = document.getElementById("paymentMethod").value;

    if (!name || !address) {
        alert("Please enter your name and address.");
        return;
    }

    const orderId = "ORD" + Date.now().toString().slice(-6);

    const order = {
        id: orderId,
        customer: name,
        address: address,
        method: method,
        total: getTotal(),
        status: "Order Confirmed"
    };

    orders.push(order);

    cart = [];
    updateCart();

    closeModal("paymentModal");

    alert("Order placed successfully!\nOrder ID: " + orderId);

    document.getElementById("orderId").value = orderId;
    trackOrder();
}

// Track Order
function trackOrder() {
    const id = document.getElementById("orderId").value.trim();

    const order = orders.find(o => o.id === id);

    const result = document.getElementById("trackingResult");

    if (!order) {
        result.innerHTML = "<p>Order not found. Please check your Order ID.</p>";
        return;
    }

    result.innerHTML = `
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Customer:</strong> ${order.customer}</p>
        <p><strong>Amount:</strong> ₹${order.total}</p>
        <p><strong>Payment:</strong> ${order.method}</p>
        <h3 style="color:green;margin-top:15px">
            ✓ ${order.status}
        </h3>
    `;
}

// Modal Functions
function openModal(id) {
    document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

function scrollProducts() {
    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}

// Initialize App
displayProducts();
updateCart();
