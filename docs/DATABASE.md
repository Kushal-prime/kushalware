# KushalWear Database Management Guide

## Overview
This guide covers MongoDB database setup, management, and troubleshooting for the KushalWear e-commerce platform.

## Database Information
- **Database Name**: `kushalwear`
- **Connection String**: `mongodb://localhost:27017/kushalwear`
- **Collections**: `users`, `products`, `carts`

## Quick Start

### 1. Start MongoDB Server
```bash
# Start MongoDB daemon
mongod --dbpath ./data/db

# Or if MongoDB is installed as a service
# MongoDB should start automatically on Windows
```

### 2. Setup Database
```bash
# Install dependencies
npm install

# Setup database with sample data
npm run setup-db
```

### 3. Check Database Status
```bash
# Check database connection and statistics
npm run check-db
```

### 4. Start Backend Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## Database Collections

### Users Collection
- **Purpose**: Store user accounts and authentication data
- **Fields**: name, email, password (hashed), role, isActive, createdAt, updatedAt
- **Indexes**: email (unique)

### Products Collection
- **Purpose**: Store product catalog information
- **Fields**: name, description, price, category, images, sizes, colors, stock, etc.
- **Indexes**: category, isActive, isFeatured

### Carts Collection
- **Purpose**: Store user shopping carts
- **Fields**: userId, items[], total, createdAt, updatedAt
- **Indexes**: userId

## Sample Data

### Admin User
- **Email**: admin@kushalwear.com
- **Password**: Admin123!
- **Role**: admin

### Sample Products
The database includes 6 sample products:
1. Men's Jacket ($99.99)
2. Women's Dress ($129.99)
3. Casual Shirt ($59.99)
4. Elegant Dress ($149.99)
5. Classic Suit ($299.99)
6. Formal Gown ($249.99)

## Database Management Commands

### Setup Database
```bash
npm run setup-db
```
- Creates database and collections
- Inserts sample products
- Creates admin user
- Clears existing data

### Check Database Status
```bash
npm run check-db
```
- Tests MongoDB connection
- Shows collection statistics
- Displays sample data
- Verifies admin user

### Reset Database
```bash
npm run reset-db
```
- Same as setup-db (clears and recreates data)

## Troubleshooting

### MongoDB Connection Issues

#### Error: "MongoNetworkError: connect ECONNREFUSED"
**Solution**: Start MongoDB server
```bash
mongod --dbpath ./data/db
```

#### Error: "MongoServerSelectionError"
**Solution**: Check if MongoDB is running on correct port
```bash
# Check if port 27017 is in use
netstat -an | grep 27017
```

#### Error: "Authentication failed"
**Solution**: Check connection string and credentials
```javascript
// Verify connection string in server.js
const MONGODB_URI = 'mongodb://localhost:27017/kushalwear';
```

### Database Performance

#### Slow Queries
- Add indexes for frequently queried fields
- Use pagination for large datasets
- Optimize query patterns

#### Memory Issues
- Monitor MongoDB memory usage
- Consider connection pooling
- Implement proper error handling

## API Endpoints

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Products
```bash
# Get all products
curl http://localhost:3000/api/products

# Get products by category
curl http://localhost:3000/api/products?category=men

# Get featured products
curl http://localhost:3000/api/products?featured=true
```

### Authentication
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kushalwear.com","password":"Admin123!"}'
```

## Environment Variables

Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/kushalwear
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Backup and Restore

### Backup Database
```bash
# Create backup directory
mkdir -p backups

# Backup database
mongodump --db kushalwear --out ./backups/$(date +%Y%m%d_%H%M%S)
```

### Restore Database
```bash
# Restore from backup
mongorestore --db kushalwear ./backups/backup_folder/
```

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **JWT Authentication**: Secure token-based authentication
3. **Input Validation**: All inputs are validated using express-validator
4. **Rate Limiting**: API endpoints are rate-limited
5. **CORS**: Configured for security
6. **Helmet**: Security headers enabled

## Monitoring

### Database Statistics
```bash
npm run check-db
```

### Server Health
```bash
curl http://localhost:3000/api/health
```

### Logs
Check server logs for errors and performance issues:
```bash
# View server logs
tail -f logs/server.log
```

## Support

For database issues:
1. Check MongoDB server status
2. Verify connection string
3. Run database check: `npm run check-db`
4. Check server logs for errors
5. Ensure all dependencies are installed

## Next Steps

1. **Production Setup**: Configure MongoDB Atlas or production MongoDB instance
2. **Backup Strategy**: Implement automated backups
3. **Monitoring**: Add database monitoring tools
4. **Scaling**: Consider database sharding for large datasets
5. **Caching**: Implement Redis for improved performance 