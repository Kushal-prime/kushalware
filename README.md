<<<<<<< HEAD
<<<<<<< HEAD
# 🛍️ KushalWear - Full Stack E-Commerce Platform

A modern, full-stack e-commerce platform with **frontend deployed on Netlify** and **backend deployed on Vercel**.

## 📁 Project Structure

```
kushalwear/
├── frontend/              # 🎨 Frontend (Netlify Deployment)
│   ├── public/            # Static files
│   │   ├── css/           # Stylesheets
│   │   ├── js/            # Client-side JavaScript
│   │   ├── images/        # Product images
│   │   └── *.html         # HTML pages
│   ├── docs/              # Frontend documentation
│   └── README.md          # Frontend setup guide
├── backend/               # 🔧 Backend (Vercel Deployment)
│   ├── src/               # Backend source code
│   │   ├── routes/        # API endpoints
│   │   ├── models/        # Database models
│   │   └── middleware/    # Custom middleware
│   ├── scripts/           # Utility scripts
│   ├── server.js          # Main server file
│   ├── package.json       # Dependencies
│   ├── vercel.json        # Vercel configuration
│   └── README.md          # Backend setup guide
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- GitHub account
- Netlify account
- Vercel account

### 1. Backend Setup (Vercel)

1. **Deploy to Vercel**:
   ```bash
   cd backend
   npm install -g vercel
   vercel
   ```

2. **Set Environment Variables** in Vercel dashboard:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kushalwear
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=production
   ```

3. **Initialize Database**:
   ```bash
   vercel env pull .env
   node scripts/setup-db.js
   node scripts/create-admin.js
   ```

### 2. Frontend Setup (Netlify)

1. **Deploy to Netlify**:
   - Connect GitHub repository
   - Set build settings:
     - **Build command**: Leave empty
     - **Publish directory**: `frontend/public`
     - **Base directory**: `frontend`

2. **Update API URL** in frontend files:
   ```javascript
   // In frontend/public/js/*.js files
   const API_BASE = 'https://your-backend-url.vercel.app/api';
   ```

## 🔗 Live Demo

- **Frontend**: https://your-frontend-domain.netlify.app
- **Backend API**: https://your-backend-url.vercel.app/api
- **Health Check**: https://your-backend-url.vercel.app/api/health

## 👤 Default Admin Credentials

- **Email**: admin@kushalwear.com
- **Password**: Admin123!

## 🛠️ Features

### Frontend Features (Netlify)
- ✅ Responsive design for all devices
- ✅ User authentication and registration
- ✅ Product browsing and search
- ✅ Shopping cart functionality
- ✅ Secure checkout process
- ✅ Admin dashboard
- ✅ Order tracking
- ✅ User profile management

### Backend Features (Vercel)
- ✅ RESTful API architecture
- ✅ JWT-based authentication
- ✅ MongoDB database integration
- ✅ User management
- ✅ Product management
- ✅ Order processing
- ✅ Cart management
- ✅ Admin functionality

## 📱 Pages

### Frontend Pages
- **Home** (`/`) - Landing page with featured products
- **Men's Collection** (`/men.html`) - Men's fashion items
- **Women's Collection** (`/women.html`) - Women's fashion items
- **Shopping Cart** (`/cart.html`) - Cart management and checkout
- **Admin Dashboard** (`/admin.html`) - Admin panel
- **About Us** (`/about.html`) - Company information
- **Contact** (`/contact.html`) - Contact form

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart & Orders
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

## 🗄️ Database

### MongoDB Atlas Setup
1. Create MongoDB Atlas account
2. Create cluster (free tier available)
3. Set up database access and network access
4. Get connection string
5. Add to Vercel environment variables

### Collections
- **users** - User accounts and profiles
- **products** - Product catalog
- **carts** - Shopping cart items
- **orders** - Order history and details

## 🔒 Security

### Frontend Security
- HTTPS enforcement (Netlify)
- Input validation
- XSS protection
- Secure API communication

### Backend Security
- JWT token validation
- Password hashing
- Rate limiting
- CORS configuration
- Helmet.js security headers

## 🚀 Deployment

### Backend (Vercel)
- **Framework**: Node.js
- **Database**: MongoDB Atlas
- **Environment**: Serverless functions
- **Scaling**: Automatic

### Frontend (Netlify)
- **Framework**: Static HTML/CSS/JS
- **CDN**: Global edge network
- **HTTPS**: Automatic
- **Forms**: Built-in handling

## 📊 Monitoring

### Vercel Analytics
- Function execution times
- Error rates
- Request volumes
- Performance metrics

### Netlify Analytics
- Page views
- Visitor statistics
- Performance metrics
- Form submissions

## 🔄 Development

### Local Development
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend/public
# Open index.html in browser or use live server
```

### Environment Variables
```env
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/kushalwear
JWT_SECRET=your-development-secret
NODE_ENV=development
PORT=3000

# Frontend (update in JS files)
API_BASE=http://localhost:3000/api
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Update CORS origin in backend
   - Check frontend domain configuration
   - Verify API URL in frontend

2. **Database Connection**
   - Check MongoDB URI format
   - Verify network access settings
   - Test connection with scripts

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token configuration
   - Verify admin user creation

### Debug Commands
```bash
# Backend
node scripts/check-db.js
node scripts/test-auth.js
node scripts/check-admin.js

# Frontend
# Check browser console for errors
# Test API endpoints directly
```

## 📈 Performance

### Backend Optimizations
- Serverless functions
- Connection pooling
- Query optimization
- Caching strategies

### Frontend Optimizations
- Image optimization (WebP)
- Minified assets
- Efficient loading
- Responsive design

## 🔄 Updates

### Deployment Process
1. **Backend**: Push to GitHub → Vercel auto-deploys
2. **Frontend**: Push to GitHub → Netlify auto-deploys
3. **Database**: Manual updates via scripts
4. **Content**: Update static files

### Maintenance
- Regular dependency updates
- Security patches
- Performance monitoring
- Database backups

## 📞 Support

### Documentation
- **Frontend**: See `frontend/README.md`
- **Backend**: See `backend/README.md`
- **Database**: See `frontend/docs/DATABASE.md`

### Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

---

**Built with ❤️ for KushalWear**

**Frontend**: Netlify | **Backend**: Vercel | **Database**: MongoDB Atlas 
=======
# kushalware.front
>>>>>>> 715cc4b8aa2bfb93a5da020cea2e10f4520ead01
=======
# kushalwear.back
>>>>>>> 69e53dd3deea0edfd72eb38cba74d38c2d319fe5
