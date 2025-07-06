# KushalWear - Luxury Fashion E-commerce Website

A modern, responsive e-commerce website for luxury fashion with a full-stack implementation including frontend and backend.

## Features

### Frontend Features
- 🎨 Modern, responsive design with purple/pink gradient theme
- 📱 Mobile-first responsive design
- 🔐 User authentication (Login/Signup)
- 🛒 Shopping cart functionality
- 📦 Product catalog with categories
- 🔍 Product search and filtering
- ⭐ Product reviews and ratings
- 💳 Checkout process
- 👤 User profile management
- 🎯 Featured products section

### Backend Features
- 🔐 JWT-based authentication
- 🗄️ MongoDB database with Mongoose ODM
- 📊 RESTful API endpoints
- 🔒 Input validation and sanitization
- 🛡️ Security middleware (Helmet, CORS, Rate limiting)
- 👥 User management system
- 🛒 Cart management
- 📦 Product management
- ⭐ Review system
- 🔍 Search functionality

## Tech Stack

### Frontend
- HTML5
- CSS3 (with modern features like Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- Responsive Design

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JWT Authentication
- bcryptjs for password hashing
- express-validator for input validation
- Helmet for security
- CORS for cross-origin requests

## Project Structure

```
clothes site/
├── html/                    # Frontend files
│   ├── index.html          # Home page
│   ├── index.css           # Main stylesheet
│   ├── index.js            # Main JavaScript
│   ├── cart.html           # Cart page
│   ├── cart.css            # Cart styles
│   ├── cart.js             # Cart functionality
│   ├── men.html            # Men's collection
│   ├── women.html          # Women's collection
│   ├── about.html          # About page
│   ├── contact.html        # Contact page
│   └── *.jpg/*.webp/*.avif # Product images
├── models/                 # Database models
│   ├── User.js            # User model
│   ├── Product.js         # Product model
│   └── Cart.js            # Cart model
├── routes/                 # API routes
│   ├── auth.js            # Authentication routes
│   ├── cart.js            # Cart routes
│   ├── products.js        # Product routes
│   └── users.js           # User routes
├── middleware/             # Custom middleware
│   └── auth.js            # Authentication middleware
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clothes-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/kushalwear

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # CORS Configuration
   CORS_ORIGIN=http://localhost:5500,http://127.0.0.1:5500

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # Security
   BCRYPT_ROUNDS=12
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env file
   ```

5. **Start the backend server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Serve the frontend files**
   You can use any static file server. Here are some options:

   **Using Live Server (VS Code extension):**
   - Install Live Server extension
   - Right-click on `html/index.html` and select "Open with Live Server"

   **Using Python:**
   ```bash
   cd html
   python -m http.server 5500
   ```

   **Using Node.js:**
   ```bash
   npm install -g live-server
   cd html
   live-server --port=5500
   ```

2. **Access the website**
   Open your browser and navigate to:
   - Frontend: `http://localhost:5500`
   - Backend API: `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products (with filtering/pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `GET /api/products/search` - Search products
- `GET /api/products/categories/:category` - Get products by category
- `POST /api/products/:id/review` - Add product review

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart
- `GET /api/cart/count` - Get cart item count
- `POST /api/cart/merge` - Merge guest cart with user cart

### Users (Admin)
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## Usage

### For Users
1. **Browse Products**: Visit the homepage to see featured products
2. **Register/Login**: Click the "Sign Up" or "Login" buttons
3. **Add to Cart**: Click "Add to Cart" on any product
4. **View Cart**: Click the cart icon to see your items
5. **Checkout**: Proceed to checkout (requires login)

### For Developers
1. **API Testing**: Use tools like Postman or Thunder Client
2. **Database**: MongoDB collections will be created automatically
3. **Logs**: Check console for server logs and errors

## Key Features Implemented

### ✅ Fixed Issues
- **Background Image**: Fixed hero section background image display
- **Purple/Pink Gradient**: Added beautiful gradient background
- **Navigation**: Fixed all navigation links to work properly
- **Cart Functionality**: Complete cart system with backend integration
- **Image Sizing**: Proper image sizing and responsive design
- **Login/Signup**: Full authentication system with modals
- **Backend**: Complete Node.js/Express backend with MongoDB

### 🎨 Design Improvements
- Modern gradient backgrounds
- Smooth animations and transitions
- Responsive design for all screen sizes
- Professional color scheme
- Improved typography and spacing
- Interactive hover effects
- Modal dialogs for authentication

### 🔧 Technical Improvements
- RESTful API architecture
- JWT authentication
- Input validation and sanitization
- Error handling and logging
- Security middleware
- Database models with relationships
- Cart persistence
- User session management

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- Helmet security headers
- MongoDB injection protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

**Note**: This is a fully functional e-commerce website with both frontend and backend implementation. The backend includes a complete API with authentication, cart management, and product management features. 