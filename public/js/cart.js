// Handle localStorage for Node.js environment
if (typeof localStorage === 'undefined') {
    global.localStorage = require('node-localstorage').LocalStorage;
    localStorage = new global.localStorage('./scratch');
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // Logo Resize on Scroll
    let lastScroll = 0;
    const logo = document.getElementById("logo");

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        if (currentScroll > lastScroll && currentScroll > 100) {
            logo.classList.add("logo-big");
        } else {
            logo.classList.remove("logo-big");
        }
        lastScroll = currentScroll;
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("active");
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Cart buttons
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        const loginModal = document.getElementById('loginModal');
        const signupModal = document.getElementById('signupModal');
        const checkoutModal = document.getElementById('checkoutModal');
        
        if (event.target === loginModal) {
            closeLoginModal();
        }
        if (event.target === signupModal) {
            closeSignupModal();
        }
        if (event.target === checkoutModal) {
            closeCheckoutModal();
        }
    });

    // Checkout event listeners
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }

    const backToCartBtn = document.getElementById('back-to-cart-btn');
    if (backToCartBtn) {
        backToCartBtn.addEventListener('click', closeCheckoutModal);
    }

    // Load cart on page load
    loadCart();
});

// Modal Functions
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openSignupModal() {
    const modal = document.getElementById('signupModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeSignupModal() {
    const modal = document.getElementById('signupModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            closeLoginModal();
            showNotification('Login successful!', 'success');
            updateAuthUI();
        } else {
            const error = await response.json();
            showNotification(error.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = e.target.querySelectorAll('input[type="password"]')[1].value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            const data = await response.json();
            closeSignupModal();
            showNotification('Account created successfully! Please login.', 'success');
        } else {
            const error = await response.json();
            showNotification(error.message || 'Signup failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Signup failed. Please try again.', 'error');
    }
}

// Cart Functions
function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    renderCart();
}

function renderCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const totalItemsElement = document.getElementById('total-items');
    
    if (!cartItemsDiv) return;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add some items to get started!</p>
                <a href="index.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        if (totalPriceElement) totalPriceElement.textContent = '0.00';
        if (totalItemsElement) totalItemsElement.textContent = '0';
        return;
    }

    cartItemsDiv.innerHTML = '';

    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div class="cart-item-total">
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div class="cart-item-actions">
                <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
            </div>
        `;
        cartItemsDiv.appendChild(cartItemDiv);
    });

    updateTotal();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(id);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    }
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Remove from backend if available
    removeFromBackend(id);
    
    renderCart();
    showNotification('Item removed from cart', 'success');
}

async function removeFromBackend(id) {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        await fetch(`http://localhost:3000/api/cart/${id}`, {
            method: 'DELETE',
            headers
        });
    } catch (error) {
        console.error('Error removing from backend:', error);
    }
}

function clearCart() {
    if (cart.length === 0) {
        showNotification('Cart is already empty', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        showNotification('Cart cleared successfully', 'success');
    }
}

function updateTotal() {
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const totalPriceElement = document.getElementById('total-price');
    const totalItemsElement = document.getElementById('total-items');
    
    if (totalPriceElement) totalPriceElement.textContent = totalPrice.toFixed(2);
    if (totalItemsElement) totalItemsElement.textContent = totalItems;
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showNotification('Please login to proceed with checkout', 'error');
        openLoginModal();
        return;
    }
    
    // Here you would typically redirect to a checkout page
    // For now, we'll show a success message
    showNotification('Proceeding to checkout...', 'success');
    // You can add actual checkout logic here
}

function updateAuthUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authButtons = document.querySelector('.auth-buttons');
    
    if (user && authButtons) {
        authButtons.innerHTML = `
            <span class="user-name">Welcome, ${user.name}</span>
            <button class="profile-btn" onclick="openProfileModal()">Profile</button>
            <button class="logout-btn" onclick="logout()">Logout</button>
        `;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showNotification('Logged out successfully!', 'success');
    updateAuthUI();
    location.reload();
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize on page load
window.addEventListener('load', () => {
    updateAuthUI();
});

// Checkout Modal Functions
function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    loadCheckoutData();
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Checkout Functions
function loadCheckoutData() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutItems = document.getElementById('checkout-items');
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Load cart items into checkout
    checkoutItems.innerHTML = '';
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.price.toFixed(2)}</p>
            </div>
            <div class="item-total">
                $${itemTotal.toFixed(2)}
            </div>
        `;
        checkoutItems.appendChild(itemElement);
    });
    
    // Calculate totals
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;
    
    document.getElementById('checkout-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('checkout-tax').textContent = tax.toFixed(2);
    document.getElementById('checkout-shipping').textContent = shipping.toFixed(2);
    document.getElementById('checkout-total').textContent = total.toFixed(2);
    
    // Pre-fill shipping info if user is logged in
    if (user) {
        document.getElementById('shipping-name').value = user.name || '';
        document.getElementById('shipping-email').value = user.email || '';
        document.getElementById('shipping-phone').value = user.phone || '';
        document.getElementById('shipping-address').value = user.address?.street || '';
        document.getElementById('shipping-city').value = user.address?.city || '';
        document.getElementById('shipping-state').value = user.address?.state || '';
        document.getElementById('shipping-zipcode').value = user.address?.zipCode || '';
        document.getElementById('shipping-country').value = user.address?.country || '';
    }
}

async function placeOrder() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please login to place an order', 'error');
            return;
        }

        // Validate shipping form
        const shippingForm = document.getElementById('shipping-form');
        if (!shippingForm.checkValidity()) {
            shippingForm.reportValidity();
            return;
        }

        // Get payment method
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        
        // Get backing options
        const backingOptions = {
            newsletter: document.getElementById('backing-newsletter').checked,
            reviews: document.getElementById('backing-reviews').checked,
            updates: document.getElementById('backing-updates').checked,
            special: document.getElementById('backing-special').checked
        };

        // Prepare order data
        const orderData = {
            items: JSON.parse(localStorage.getItem('cart')) || [],
            shipping: {
                name: document.getElementById('shipping-name').value,
                email: document.getElementById('shipping-email').value,
                phone: document.getElementById('shipping-phone').value,
                address: document.getElementById('shipping-address').value,
                city: document.getElementById('shipping-city').value,
                state: document.getElementById('shipping-state').value,
                zipCode: document.getElementById('shipping-zipcode').value,
                country: document.getElementById('shipping-country').value
            },
            payment: {
                method: paymentMethod,
                cardNumber: document.getElementById('card-number').value,
                cardExpiry: document.getElementById('card-expiry').value,
                cardCvv: document.getElementById('card-cvv').value,
                cardName: document.getElementById('card-name').value
            },
            backing: backingOptions,
            subtotal: parseFloat(document.getElementById('checkout-subtotal').textContent),
            tax: parseFloat(document.getElementById('checkout-tax').textContent),
            shipping: parseFloat(document.getElementById('checkout-shipping').textContent),
            total: parseFloat(document.getElementById('checkout-total').textContent)
        };

        // Send order to backend
        const orderResponse = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (orderResponse.ok) {
            const orderResult = await orderResponse.json();
            showNotification(`Order placed successfully! Order #${orderResult.order.orderNumber}`, 'success');
        } else {
            const error = await orderResponse.json();
            showNotification(error.message || 'Failed to place order', 'error');
            return;
        }
        
        // Clear cart
        localStorage.removeItem('cart');
        cart = [];
        renderCart();
        
        // Close checkout modal
        closeCheckoutModal();
        
        // Redirect to confirmation page or show order summary
        setTimeout(() => {
            alert('Order Summary:\n' + 
                  `Total Items: ${orderData.items.length}\n` +
                  `Total Amount: $${orderData.total.toFixed(2)}\n` +
                  `Order will be shipped to: ${orderData.shipping.name}\n` +
                  `Email confirmation sent to: ${orderData.shipping.email}`);
        }, 1000);

    } catch (error) {
        console.error('Place order error:', error);
        showNotification('Failed to place order. Please try again.', 'error');
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .user-name {
        color: white;
        margin-right: 10px;
        font-weight: 500;
    }
    
    .logout-btn {
        background: transparent;
        color: white;
        border: 2px solid #ff6b6b;
        padding: 8px 20px;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
    }
    
    .logout-btn:hover {
        background: #ff6b6b;
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);