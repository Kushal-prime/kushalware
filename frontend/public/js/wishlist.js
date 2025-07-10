// Wishlist Management System
class WishlistManager {
    constructor() {
        this.apiBase = 'http://localhost:3000/api';
        this.wishlistItems = new Set();
        this.isInitialized = false;
        this.init();
    }

    async init() {
        if (this.isAuthenticated()) {
            await this.loadWishlist();
            this.updateWishlistUI();
        }
        this.isInitialized = true;
    }

    isAuthenticated() {
        const token = localStorage.getItem('token');
        return token && token !== 'null';
    }

    async loadWishlist() {
        try {
            const response = await fetch(`${this.apiBase}/wishlist`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.wishlistItems.clear();
                data.wishlist.products.forEach(item => {
                    this.wishlistItems.add(item.product._id);
                });
            }
        } catch (error) {
            console.error('Error loading wishlist:', error);
        }
    }

    async addToWishlist(productId, size = null, color = null) {
        if (!this.isAuthenticated()) {
            this.showLoginPrompt();
            return false;
        }

        try {
            const response = await fetch(`${this.apiBase}/wishlist/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId,
                    size,
                    color
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.wishlistItems.add(productId);
                this.updateWishlistUI();
                this.showNotification('Product added to wishlist!', 'success');
                return true;
            } else {
                const errorData = await response.json();
                this.showNotification(errorData.message || 'Failed to add to wishlist', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            this.showNotification('Network error. Please try again.', 'error');
            return false;
        }
    }

    async removeFromWishlist(productId) {
        if (!this.isAuthenticated()) {
            return false;
        }

        try {
            const response = await fetch(`${this.apiBase}/wishlist/remove/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.wishlistItems.delete(productId);
                this.updateWishlistUI();
                this.showNotification('Product removed from wishlist!', 'success');
                return true;
            } else {
                const errorData = await response.json();
                this.showNotification(errorData.message || 'Failed to remove from wishlist', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            this.showNotification('Network error. Please try again.', 'error');
            return false;
        }
    }

    async checkWishlistStatus(productId) {
        if (!this.isAuthenticated()) {
            return false;
        }

        try {
            const response = await fetch(`${this.apiBase}/wishlist/check/${productId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.inWishlist;
            }
        } catch (error) {
            console.error('Error checking wishlist status:', error);
        }
        return false;
    }

    updateWishlistUI() {
        // Update wishlist buttons on all product cards
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const productId = btn.dataset.productId;
            if (productId) {
                this.updateWishlistButton(btn, this.wishlistItems.has(productId));
            }
        });

        // Update wishlist counter in header
        this.updateWishlistCounter();
    }

    updateWishlistButton(button, isInWishlist) {
        if (isInWishlist) {
            button.classList.add('in-wishlist');
            button.innerHTML = '<i class="fas fa-heart"></i>';
            button.title = 'Remove from wishlist';
        } else {
            button.classList.remove('in-wishlist');
            button.innerHTML = '<i class="far fa-heart"></i>';
            button.title = 'Add to wishlist';
        }
    }

    updateWishlistCounter() {
        const counter = document.getElementById('wishlist-counter');
        if (counter) {
            counter.textContent = this.wishlistItems.size;
            counter.style.display = this.wishlistItems.size > 0 ? 'block' : 'none';
        }
    }

    showLoginPrompt() {
        this.showNotification('Please login to add items to your wishlist', 'info');
        // Optionally open login modal
        if (typeof openLoginModal === 'function') {
            setTimeout(() => openLoginModal(), 1000);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Toggle wishlist status
    async toggleWishlist(productId, size = null, color = null) {
        if (this.wishlistItems.has(productId)) {
            return await this.removeFromWishlist(productId);
        } else {
            return await this.addToWishlist(productId, size, color);
        }
    }

    // Get wishlist count
    getWishlistCount() {
        return this.wishlistItems.size;
    }

    // Check if product is in wishlist
    isInWishlist(productId) {
        return this.wishlistItems.has(productId);
    }
}

// Initialize wishlist manager
const wishlistManager = new WishlistManager();

// Wishlist button click handler
function handleWishlistClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const button = event.currentTarget;
    const productId = button.dataset.productId;
    const size = button.dataset.size || null;
    const color = button.dataset.color ? JSON.parse(button.dataset.color) : null;

    if (productId) {
        wishlistManager.toggleWishlist(productId, size, color);
    }
}

// Add wishlist functionality to product cards
function addWishlistToProductCards() {
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = card.dataset.productId;
        if (productId && !card.querySelector('.wishlist-btn')) {
            // Create wishlist button
            const wishlistBtn = document.createElement('button');
            wishlistBtn.className = 'wishlist-btn';
            wishlistBtn.dataset.productId = productId;
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
            wishlistBtn.title = 'Add to wishlist';
            wishlistBtn.addEventListener('click', handleWishlistClick);

            // Add to product card
            const quickActions = card.querySelector('.quick-actions') || 
                               card.querySelector('.product-actions') ||
                               card;

            if (quickActions) {
                quickActions.appendChild(wishlistBtn);
            }
        }
    });
}

// Add wishlist counter to header
function addWishlistCounter() {
    const header = document.querySelector('header');
    if (header && !document.getElementById('wishlist-counter')) {
        const authButtons = header.querySelector('.auth-buttons');
        if (authButtons) {
            const wishlistLink = document.createElement('a');
            wishlistLink.href = '#';
            wishlistLink.className = 'wishlist-link';
            wishlistLink.innerHTML = `
                <i class="fas fa-heart"></i>
                <span id="wishlist-counter" class="wishlist-counter">0</span>
            `;
            wishlistLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (wishlistManager.isAuthenticated()) {
                    // Navigate to wishlist page or show wishlist modal
                    showWishlistModal();
                } else {
                    wishlistManager.showLoginPrompt();
                }
            });

            authButtons.appendChild(wishlistLink);
        }
    }
}

// Show wishlist modal
function showWishlistModal() {
    // Create wishlist modal
    const modal = document.createElement('div');
    modal.className = 'modal wishlist-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>My Wishlist</h2>
            <div id="wishlist-items" class="wishlist-items">
                <div class="loading">Loading wishlist...</div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Load wishlist items
    loadWishlistItems();

    // Close modal
    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Load wishlist items in modal
async function loadWishlistItems() {
    const container = document.getElementById('wishlist-items');
    if (!container) return;

    try {
        const response = await fetch(`${wishlistManager.apiBase}/wishlist`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.wishlist.products.length === 0) {
                container.innerHTML = '<p class="empty-wishlist">Your wishlist is empty</p>';
            } else {
                container.innerHTML = data.wishlist.products.map(item => `
                    <div class="wishlist-item" data-product-id="${item.product._id}">
                        <img src="${item.product.mainImage}" alt="${item.product.name}">
                        <div class="item-details">
                            <h3>${item.product.name}</h3>
                            <p class="price">$${item.product.price}</p>
                            ${item.selectedSize ? `<p class="size">Size: ${item.selectedSize}</p>` : ''}
                            ${item.selectedColor ? `<p class="color">Color: ${item.selectedColor.name}</p>` : ''}
                        </div>
                        <div class="item-actions">
                            <button class="btn btn-primary add-to-cart-btn" onclick="addToCartFromWishlist('${item.product._id}')">
                                Add to Cart
                            </button>
                            <button class="btn btn-secondary remove-wishlist-btn" onclick="removeFromWishlist('${item.product._id}')">
                                Remove
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        container.innerHTML = '<p class="error">Error loading wishlist</p>';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addWishlistToProductCards();
    addWishlistCounter();
    
    // Update wishlist UI after authentication
    if (wishlistManager.isInitialized) {
        wishlistManager.updateWishlistUI();
    }
});

// Export for global use
window.wishlistManager = wishlistManager;
window.handleWishlistClick = handleWishlistClick;
window.showWishlistModal = showWishlistModal; 