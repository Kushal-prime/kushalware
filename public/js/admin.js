// Admin Dashboard JavaScript

let currentPage = 1;
let currentTab = 'dashboard';

// Check if user is admin
function checkAdminAccess() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
        alert('Please login to access admin panel');
        window.location.href = 'index.html';
        return;
    }
    
    if (user.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('admin-name').textContent = user.name;
}

// Tab navigation
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAccess();
    loadDashboard();
    
    // Tab navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = e.target.getAttribute('data-tab');
            switchTab(tab);
        });
    });
});

function switchTab(tab) {
    // Update active tab
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Show tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tab).classList.add('active');
    
    currentTab = tab;
    
    // Load tab data
    switch(tab) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
        case 'products':
            loadProducts();
            break;
    }
}

// Dashboard functions
async function loadDashboard() {
    try {
        const token = localStorage.getItem('token');
        
        // Load order stats
        const statsResponse = await fetch('http://localhost:3000/api/orders/stats/summary', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            const summary = statsData.summary;
            
            document.getElementById('total-orders').textContent = summary.totalOrders;
            document.getElementById('total-revenue').textContent = `$${summary.totalRevenue.toFixed(2)}`;
            document.getElementById('pending-orders').textContent = summary.ordersByStatus.pending || 0;
            
            // Load user count
            const usersResponse = await fetch('http://localhost:3000/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (usersResponse.ok) {
                const usersData = await usersResponse.json();
                document.getElementById('total-users').textContent = usersData.users.length;
            }
            
            // Load recent orders
            const recentOrdersDiv = document.getElementById('recent-orders');
            recentOrdersDiv.innerHTML = '';
            
            summary.recentOrders.forEach(order => {
                const orderElement = document.createElement('div');
                orderElement.className = 'order-item';
                orderElement.innerHTML = `
                    <div class="order-info">
                        <h4>${order.orderNumber}</h4>
                        <p>${order.user} - $${order.total.toFixed(2)}</p>
                    </div>
                    <span class="order-status status-${order.status}">${order.status}</span>
                `;
                recentOrdersDiv.appendChild(orderElement);
            });
        }
    } catch (error) {
        console.error('Load dashboard error:', error);
    }
}

// Orders functions
async function loadOrders(page = 1) {
    try {
        const token = localStorage.getItem('token');
        const statusFilter = document.getElementById('status-filter').value;
        const searchFilter = document.getElementById('search-orders').value;
        
        let url = `http://localhost:3000/api/orders?page=${page}&limit=10`;
        if (statusFilter) url += `&status=${statusFilter}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayOrders(data.orders);
            displayPagination(data.pagination);
        }
    } catch (error) {
        console.error('Load orders error:', error);
    }
}

function displayOrders(orders) {
    const tbody = document.getElementById('orders-tbody');
    tbody.innerHTML = '';
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No orders found</td></tr>';
        return;
    }
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.orderNumber}</td>
            <td>${order.user.name}</td>
            <td>${order.items.length} items</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="order-status status-${order.status}">${order.status}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn-secondary" onclick="viewOrder('${order._id}')">View</button>
                <button class="btn-success" onclick="updateOrderStatus('${order._id}')">Update</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function displayPagination(pagination) {
    const paginationDiv = document.getElementById('orders-pagination');
    paginationDiv.innerHTML = '';
    
    if (pagination.totalPages <= 1) return;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = !pagination.hasPrevPage;
    prevBtn.onclick = () => loadOrders(pagination.currentPage - 1);
    paginationDiv.appendChild(prevBtn);
    
    // Page numbers
    for (let i = 1; i <= pagination.totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.onclick = () => loadOrders(i);
        if (i === pagination.currentPage) {
            pageBtn.style.background = '#ff5252';
        }
        paginationDiv.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = !pagination.hasNextPage;
    nextBtn.onclick = () => loadOrders(pagination.currentPage + 1);
    paginationDiv.appendChild(nextBtn);
}

async function viewOrder(orderId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayOrderDetails(data.order);
            document.getElementById('orderModal').style.display = 'block';
        }
    } catch (error) {
        console.error('View order error:', error);
    }
}

function displayOrderDetails(order) {
    const detailsDiv = document.getElementById('order-details');
    detailsDiv.innerHTML = `
        <div class="order-detail-section">
            <h3>Order Information</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Status:</strong> <span class="order-status status-${order.status}">${order.status}</span></p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        </div>
        
        <div class="order-detail-section">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${order.user.name}</p>
            <p><strong>Email:</strong> ${order.user.email}</p>
            <p><strong>Phone:</strong> ${order.user.phone || 'N/A'}</p>
        </div>
        
        <div class="order-detail-section">
            <h3>Shipping Information</h3>
            <p><strong>Name:</strong> ${order.shipping.name}</p>
            <p><strong>Address:</strong> ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}</p>
            <p><strong>Country:</strong> ${order.shipping.country}</p>
            <p><strong>Phone:</strong> ${order.shipping.phone}</p>
        </div>
        
        <div class="order-detail-section">
            <h3>Order Items</h3>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item-detail">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <h4>${item.name}</h4>
                            <p>Quantity: ${item.quantity} | Price: $${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="order-detail-section">
            <h3>Payment Information</h3>
            <p><strong>Method:</strong> ${order.payment.method}</p>
            ${order.payment.cardName ? `<p><strong>Card Name:</strong> ${order.payment.cardName}</p>` : ''}
        </div>
        
        <div class="order-detail-section">
            <h3>Order Summary</h3>
            <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
            <p><strong>Tax:</strong> $${order.tax.toFixed(2)}</p>
            <p><strong>Shipping:</strong> $${order.shippingCost.toFixed(2)}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        </div>
    `;
}

async function updateOrderStatus(orderId) {
    const newStatus = prompt('Enter new status (pending/processing/shipped/delivered/cancelled):');
    if (!newStatus) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            alert('Order status updated successfully');
            loadOrders(currentPage);
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to update order status');
        }
    } catch (error) {
        console.error('Update order status error:', error);
        alert('Failed to update order status');
    }
}

// Users functions
async function loadUsers() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayUsers(data.users);
        }
    } catch (error) {
        console.error('Load users error:', error);
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = '';
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No users found</td></tr>';
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'N/A'}</td>
            <td><span class="order-status status-${user.role}">${user.role}</span></td>
            <td><span class="order-status status-${user.isActive ? 'active' : 'inactive'}">${user.isActive ? 'Active' : 'Inactive'}</span></td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn-secondary" onclick="viewUser('${user._id}')">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function viewUser(userId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayUserDetails(data.user);
            document.getElementById('userModal').style.display = 'block';
        }
    } catch (error) {
        console.error('View user error:', error);
    }
}

function displayUserDetails(user) {
    const detailsDiv = document.getElementById('user-details');
    detailsDiv.innerHTML = `
        <div class="order-detail-section">
            <h3>User Information</h3>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>Status:</strong> ${user.isActive ? 'Active' : 'Inactive'}</p>
            <p><strong>Joined:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
        </div>
        
        ${user.address ? `
        <div class="order-detail-section">
            <h3>Address Information</h3>
            <p><strong>Street:</strong> ${user.address.street || 'N/A'}</p>
            <p><strong>City:</strong> ${user.address.city || 'N/A'}</p>
            <p><strong>State:</strong> ${user.address.state || 'N/A'}</p>
            <p><strong>Zip Code:</strong> ${user.address.zipCode || 'N/A'}</p>
            <p><strong>Country:</strong> ${user.address.country || 'N/A'}</p>
        </div>
        ` : ''}
    `;
}

// Products functions
async function loadProducts() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/products', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayProducts(data.products);
        }
    } catch (error) {
        console.error('Load products error:', error);
    }
}

function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.innerHTML = '<p>No products found</p>';
        return;
    }
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p>${product.description || 'No description available'}</p>
        `;
        grid.appendChild(productElement);
    });
}

function addProduct() {
    alert('Product management feature coming soon!');
}

// Modal functions
function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
}

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    const orderModal = document.getElementById('orderModal');
    const userModal = document.getElementById('userModal');
    
    if (event.target === orderModal) {
        closeOrderModal();
    }
    if (event.target === userModal) {
        closeUserModal();
    }
});

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
} 