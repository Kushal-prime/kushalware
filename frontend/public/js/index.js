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

    // Add to Cart functionality
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.addEventListener("click", () => {
            const id = parseInt(button.getAttribute('data-id'));
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const image = button.getAttribute('data-image');
            addToCart(id, name, price, image);
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

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        const loginModal = document.getElementById('loginModal');
        const signupModal = document.getElementById('signupModal');
        const profileModal = document.getElementById('profileModal');
        const checkoutModal = document.getElementById('checkoutModal');
        
        if (event.target === loginModal) {
            closeLoginModal();
        }
        if (event.target === signupModal) {
            closeSignupModal();
        }
        if (event.target === profileModal) {
            closeProfileModal();
        }
        if (event.target === checkoutModal) {
            closeCheckoutModal();
        }
    });

    // Profile and checkout event listeners
    const saveProfileBtn = document.getElementById('save-profile-btn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveUserProfile);
    }

    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }

    const backToCartBtn = document.getElementById('back-to-cart-btn');
    if (backToCartBtn) {
        backToCartBtn.addEventListener('click', closeCheckoutModal);
    }

    // Fade-in animation for about and contact sections
    const about = document.querySelector(".about-section");
    const contact = document.querySelector(".contact-section");
    if (about) setTimeout(() => about.classList.add("show"), 200);
    if (contact) setTimeout(() => contact.classList.add("show"), 200);
    
    // Add real-time validation for signup form
    const signupPassword = document.getElementById('signupPassword');
    if (signupPassword) {
        signupPassword.addEventListener('input', (e) => {
            updatePasswordStrength(e.target.value);
            clearSignupErrors();
        });
    }
    
    // Add real-time validation for login form
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    
    if (loginEmail) {
        loginEmail.addEventListener('input', () => {
            clearLoginErrors();
        });
    }
    
    if (loginPassword) {
        loginPassword.addEventListener('input', () => {
            clearLoginErrors();
        });
    }
    
    // Add real-time validation for signup form fields
    const signupInputs = ['signupName', 'signupEmail', 'signupConfirmPassword'];
    signupInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                clearSignupErrors();
            });
        }
    });
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

// Profile Modal Functions
function openProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    loadUserProfile();
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

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

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    // Get form elements
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const submitBtn = document.getElementById('loginSubmitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Clear previous errors
    clearLoginErrors();
    
    // Validate inputs
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (!email) {
        showFieldError('loginEmailError', 'Email is required');
        emailInput.classList.add('error');
        return;
    }
    
    if (!password) {
        showFieldError('loginPasswordError', 'Password is required');
        passwordInput.classList.add('error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showFieldError('loginEmailError', 'Please enter a valid email address');
        emailInput.classList.add('error');
        return;
    }
    
    // Show loading state
    setLoadingState(submitBtn, btnText, btnLoader, true);
    
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store authentication data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Remember me functionality
            const rememberMe = document.getElementById('rememberMe');
            if (rememberMe && rememberMe.checked) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            // Success feedback
            showNotification('Welcome back! Login successful.', 'success');
            closeLoginModal();
            updateAuthUI();
            
            // Reset form
            e.target.reset();
            
        } else {
            // Handle specific error cases
            let errorMessage = 'Login failed. Please try again.';
            
            if (data.message) {
                errorMessage = data.message;
            } else if (response.status === 401) {
                errorMessage = 'Invalid email or password.';
            } else if (response.status === 404) {
                errorMessage = 'User not found.';
            } else if (response.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            }
            
            showNotification(errorMessage, 'error');
            
            // Show field-specific errors if available
            if (data.errors) {
                data.errors.forEach(error => {
                    if (error.path === 'email') {
                        showFieldError('loginEmailError', error.msg);
                        emailInput.classList.add('error');
                    } else if (error.path === 'password') {
                        showFieldError('loginPasswordError', error.msg);
                        passwordInput.classList.add('error');
                    }
                });
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Hide loading state
        setLoadingState(submitBtn, btnText, btnLoader, false);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    // Get form elements
    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('signupConfirmPassword');
    const submitBtn = document.getElementById('signupSubmitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Clear previous errors
    clearSignupErrors();
    
    // Validate inputs
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Basic validation
    if (!name) {
        showFieldError('signupNameError', 'Name is required');
        nameInput.classList.add('error');
        return;
    }
    
    if (!email) {
        showFieldError('signupEmailError', 'Email is required');
        emailInput.classList.add('error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showFieldError('signupEmailError', 'Please enter a valid email address');
        emailInput.classList.add('error');
        return;
    }
    
    if (!password) {
        showFieldError('signupPasswordError', 'Password is required');
        passwordInput.classList.add('error');
        return;
    }
    
    if (password.length < 6) {
        showFieldError('signupPasswordError', 'Password must be at least 6 characters long');
        passwordInput.classList.add('error');
        return;
    }
    
    if (password !== confirmPassword) {
        showFieldError('signupConfirmPasswordError', 'Passwords do not match');
        confirmPasswordInput.classList.add('error');
        return;
    }
    
    // Check terms agreement
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms.checked) {
        showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
        return;
    }
    
    // Show loading state
    setLoadingState(submitBtn, btnText, btnLoader, true);
    
    try {
        const response = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Success feedback
            showNotification('Account created successfully! You can now login.', 'success');
            closeSignupModal();
            
            // Reset form
            e.target.reset();
            
            // Switch to login modal after a short delay
            setTimeout(() => {
                openLoginModal();
                // Pre-fill email
                const loginEmailInput = document.getElementById('loginEmail');
                if (loginEmailInput) {
                    loginEmailInput.value = email;
                }
            }, 1500);
            
        } else {
            // Handle specific error cases
            let errorMessage = 'Signup failed. Please try again.';
            
            if (data.message) {
                errorMessage = data.message;
            } else if (response.status === 400) {
                errorMessage = 'Please check your input and try again.';
            } else if (response.status === 409) {
                errorMessage = 'An account with this email already exists.';
            } else if (response.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            }
            
            showNotification(errorMessage, 'error');
            
            // Show field-specific errors if available
            if (data.errors) {
                data.errors.forEach(error => {
                    if (error.path === 'name') {
                        showFieldError('signupNameError', error.msg);
                        nameInput.classList.add('error');
                    } else if (error.path === 'email') {
                        showFieldError('signupEmailError', error.msg);
                        emailInput.classList.add('error');
                    } else if (error.path === 'password') {
                        showFieldError('signupPasswordError', error.msg);
                        passwordInput.classList.add('error');
                    }
                });
            }
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Hide loading state
        setLoadingState(submitBtn, btnText, btnLoader, false);
    }
}

// Cart Functions
function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Save to backend if available
    saveToBackend({ id, name, price, image, quantity: 1 });
    
    showNotification(`${name} added to cart!`, 'success');
    updateCartCount();
}

async function saveToBackend(item) {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        await fetch('http://localhost:3000/api/cart', {
            method: 'POST',
            headers,
            body: JSON.stringify(item)
        });
    } catch (error) {
        console.error('Error saving to backend:', error);
    }
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartLink = document.querySelector('a[href="cart.html"]');
    
    if (cartLink) {
        // Remove existing cart count if any
        const existingCount = cartLink.querySelector('.cart-count');
        if (existingCount) {
            existingCount.remove();
        }
        
        if (cartCount > 0) {
            const countElement = document.createElement('span');
            countElement.className = 'cart-count';
            countElement.textContent = cartCount;
            countElement.style.cssText = `
                background: #ff6b6b;
                color: white;
                border-radius: 50%;
                padding: 2px 6px;
                font-size: 12px;
                position: absolute;
                top: -8px;
                right: -8px;
                min-width: 18px;
                text-align: center;
            `;
            cartLink.style.position = 'relative';
            cartLink.appendChild(countElement);
        }
    }
}

function updateAuthUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authButtons = document.querySelector('.auth-buttons');
    const adminLink = document.getElementById('admin-link');
    
    if (user && authButtons) {
        authButtons.innerHTML = `
            <span class="user-name">Welcome, ${user.name}</span>
            <button class="profile-btn" onclick="openProfileModal()">Profile</button>
            <button class="logout-btn" onclick="logout()">Logout</button>
        `;
        
        // Show admin link if user is admin
        if (user.role === 'admin' && adminLink) {
            adminLink.style.display = 'inline-block';
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showNotification('Logged out successfully!', 'success');
    updateAuthUI();
    location.reload();
}

// Profile Functions
async function loadUserProfile() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please login to view profile', 'error');
            return;
        }

        const response = await fetch('http://localhost:3000/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const user = data.user;
            
            // Populate profile fields
            document.getElementById('profile-name').value = user.name || '';
            document.getElementById('profile-email').value = user.email || '';
            document.getElementById('profile-phone').value = user.phone || '';
            document.getElementById('profile-street').value = user.address?.street || '';
            document.getElementById('profile-city').value = user.address?.city || '';
            document.getElementById('profile-state').value = user.address?.state || '';
            document.getElementById('profile-zipcode').value = user.address?.zipCode || '';
            document.getElementById('profile-country').value = user.address?.country || '';
            
            if (user.avatar) {
                document.getElementById('profile-avatar').src = user.avatar;
            }
        } else {
            showNotification('Failed to load profile', 'error');
        }
    } catch (error) {
        console.error('Load profile error:', error);
        showNotification('Failed to load profile', 'error');
    }
}

async function saveUserProfile() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please login to save profile', 'error');
            return;
        }

        const profileData = {
            name: document.getElementById('profile-name').value,
            phone: document.getElementById('profile-phone').value,
            address: {
                street: document.getElementById('profile-street').value,
                city: document.getElementById('profile-city').value,
                state: document.getElementById('profile-state').value,
                zipCode: document.getElementById('profile-zipcode').value,
                country: document.getElementById('profile-country').value
            }
        };

        const response = await fetch('http://localhost:3000/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });

        if (response.ok) {
            const data = await response.json();
            // Update local storage with new user data
            localStorage.setItem('user', JSON.stringify(data.user));
            showNotification('Profile updated successfully!', 'success');
            updateAuthUI();
        } else {
            const error = await response.json();
            showNotification(error.message || 'Failed to update profile', 'error');
        }
    } catch (error) {
        console.error('Save profile error:', error);
        showNotification('Failed to update profile', 'error');
    }
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
        updateCartCount();
        
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

// Helper Functions for Authentication
function clearLoginErrors() {
    const errorElements = ['loginEmailError', 'loginPasswordError'];
    errorElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = '';
            element.classList.remove('show');
        }
    });
    
    // Remove error styling from inputs
    const inputs = ['loginEmail', 'loginPassword'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.classList.remove('error');
        }
    });
}

function clearSignupErrors() {
    const errorElements = ['signupNameError', 'signupEmailError', 'signupPasswordError', 'signupConfirmPasswordError'];
    errorElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = '';
            element.classList.remove('show');
        }
    });
    
    // Remove error styling from inputs
    const inputs = ['signupName', 'signupEmail', 'signupPassword', 'signupConfirmPassword'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.classList.remove('error');
        }
    });
}

function showFieldError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.add('show');
    }
}

function setLoadingState(button, textElement, loaderElement, isLoading) {
    if (isLoading) {
        button.disabled = true;
        textElement.style.display = 'none';
        loaderElement.style.display = 'inline-flex';
    } else {
        button.disabled = false;
        textElement.style.display = 'inline-flex';
        loaderElement.style.display = 'none';
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (password.length < 6) feedback.push('Too short');
    if (!/[a-z]/.test(password)) feedback.push('Needs lowercase letter');
    if (!/[A-Z]/.test(password)) feedback.push('Needs uppercase letter');
    if (!/[0-9]/.test(password)) feedback.push('Needs number');
    
    return { strength, feedback };
}

function updatePasswordStrength(password) {
    const strengthElement = document.getElementById('passwordStrength');
    if (!strengthElement) return;
    
    const { strength, feedback } = checkPasswordStrength(password);
    
    strengthElement.className = 'password-strength';
    
    if (password.length === 0) {
        strengthElement.className = 'password-strength';
        return;
    }
    
    if (strength <= 2) {
        strengthElement.classList.add('weak');
    } else if (strength <= 3) {
        strengthElement.classList.add('medium');
    } else if (strength <= 4) {
        strengthElement.classList.add('strong');
    } else {
        strengthElement.classList.add('very-strong');
    }
}

// Modal switching functions
function switchToSignup() {
    closeLoginModal();
    setTimeout(() => {
        openSignupModal();
    }, 300);
}

function switchToLogin() {
    closeSignupModal();
    setTimeout(() => {
        openLoginModal();
    }, 300);
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
    updateCartCount();
    updateAuthUI();
});

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