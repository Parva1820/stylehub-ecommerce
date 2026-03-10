// Products Database
const products = [
    { id: 1, name: "Classic T-Shirt", category: "men", price: 29.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 2, name: "Denim Jeans", category: "men", price: 79.99, image: "https://images.unsplash.com/photo-1542272604-787c62e4a92f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 3, name: "Casual Shirt", category: "men", price: 49.99, image: "https://images.unsplash.com/photo-1596399676397-3b6643bb8a4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 4, name: "Summer Dress", category: "women", price: 59.99, image: "https://images.unsplash.com/photo-1572804419446-2c9fe67b5e3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 5, name: "Floral Top", category: "women", price: 39.99, image: "https://images.unsplash.com/photo-1570902102209-7e9967626b1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 6, name: "Elegant Blouse", category: "women", price: 54.99, image: "https://images.unsplash.com/photo-1598947905339-b6ead53aad12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 7, name: "Kids T-Shirt", category: "kids", price: 19.99, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 8, name: "Kids Shorts", category: "kids", price: 24.99, image: "https://images.unsplash.com/photo-1519238263530-17061820f919?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 9, name: "Kids Dress", category: "kids", price: 34.99, image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
];

let cart = [];

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    attachCartListeners();
});

// Display Products
function displayProducts(productsToShow) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/250x200?text=${product.name}'">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-category">${product.category.toUpperCase()}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="btn btn-primary product-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Update Cart Count Badge
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Attach Cart Listeners
function attachCartListeners() {
    document.querySelector('.cart-link').addEventListener('click', openCart);
}

// Open Cart Modal
function openCart() {
    const cartModal = document.getElementById('cartModal');
    const cartItemsDiv = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cartItemsDiv.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <span>${item.name} x${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="btn" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `).join('');
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalPrice').textContent = total.toFixed(2);
    
    cartModal.style.display = 'block';
}

// Close Cart Modal
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    openCart();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    closeCart();
    document.getElementById('checkoutModal').style.display = 'block';
}

// Close Checkout Modal
function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// Process Order
function processOrder(event) {
    event.preventDefault();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Order placed successfully! Total: $${total.toFixed(2)}\n\nThank you for shopping at StyleHub!`);
    cart = [];
    updateCartCount();
    closeCheckout();
}

// Filter Products
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    
    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || product.category === category;
        return matchesSearch && matchesCategory;
    });
    
    displayProducts(filtered);
}

// Scroll to Shop
function scrollToShop() {
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        z-index: 300;
        animation: slideIn 0.3s ease-in;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

// Add animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Close modals when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target === checkoutModal) {
        checkoutModal.style.display = 'none';
    }
}
