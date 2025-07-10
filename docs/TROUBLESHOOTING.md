# KushalWear Authentication Troubleshooting Guide

## 🔍 **Common Authentication Issues & Solutions**

### 1. **"Cannot sign up or login" - General Issues**

#### **Check Server Status**
```bash
# Verify server is running
curl http://localhost:3000/api/health

# Expected response:
# {"status":"OK","message":"KushalWear API is running","timestamp":"..."}
```

#### **Check MongoDB Connection**
```bash
# Test database connection
npm run check-db

# Expected output should show:
# ✅ MongoDB connection successful!
# 📊 Connection state: Connected
```

### 2. **Frontend Authentication Issues**

#### **CORS Errors**
**Symptoms**: Browser console shows CORS errors
**Solution**: 
- Server CORS is configured for: `http://localhost:5500`, `http://127.0.0.1:5500`
- Use Live Server or similar to serve HTML files
- Don't open HTML files directly in browser

#### **Network Errors**
**Symptoms**: "Failed to fetch" errors
**Solution**:
- Ensure backend server is running: `npm run dev`
- Check if port 3000 is available
- Verify firewall settings

### 3. **Backend Authentication Issues**

#### **Password Validation**
**Symptoms**: "Password validation failed" errors
**Requirements**:
- Minimum 6 characters
- At least 1 uppercase letter
- At least 1 lowercase letter  
- At least 1 number

**Example Valid Passwords**:
- `Admin123!`
- `Test123!`
- `MyPass123`

#### **Email Validation**
**Symptoms**: "Invalid email" errors
**Requirements**:
- Valid email format
- Must be unique in database

### 4. **Database Issues**

#### **Admin User Not Found**
**Solution**: Recreate admin user
```bash
npm run setup-db
```

**Admin Credentials**:
- Email: `admin@kushalwear.com`
- Password: `Admin123!`

#### **Database Connection Failed**
**Symptoms**: "MongoNetworkError" or "ECONNREFUSED"
**Solutions**:
1. Start MongoDB: `mongod --dbpath ./data/db`
2. Check if MongoDB is installed: `mongod --version`
3. Verify port 27017 is not blocked

### 5. **Testing Authentication**

#### **Use the Test Page**
Open `html/test-auth.html` in your browser to test:
1. Server health
2. Admin login
3. User signup
4. User login
5. Current user status

#### **Manual API Testing**
```bash
# Test health
curl http://localhost:3000/api/health

# Test admin login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kushalwear.com","password":"Admin123!"}'

# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!"}'
```

### 6. **Browser Console Debugging**

#### **Check for Errors**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for red error messages
4. Check Network tab for failed requests

#### **Common Console Errors**
- `CORS error`: Server not running or wrong port
- `Failed to fetch`: Network connectivity issue
- `Validation failed`: Password/email format issue

### 7. **Step-by-Step Debugging**

#### **Step 1: Verify Server**
```bash
npm run dev
# Should show: "Server running on port 3000"
# Should show: "Connected to MongoDB"
```

#### **Step 2: Test API Endpoints**
```bash
curl http://localhost:3000/api/health
# Should return JSON response
```

#### **Step 3: Test Database**
```bash
npm run check-db
# Should show connected status and sample data
```

#### **Step 4: Test Frontend**
1. Open `html/test-auth.html` in browser
2. Click "Test Server Health"
3. Click "Test Admin Login"
4. Check for success/error messages

### 8. **Environment Setup**

#### **Required Software**
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git Bash or similar terminal

#### **Required Ports**
- Port 3000: Backend API
- Port 27017: MongoDB
- Port 5500: Frontend (Live Server)

#### **File Structure**
```
clothes site/
├── html/           # Frontend files
├── models/         # Database models
├── routes/         # API routes
├── middleware/     # Authentication middleware
├── server.js       # Main server file
└── package.json    # Dependencies
```

### 9. **Quick Fixes**

#### **Reset Everything**
```bash
# Stop all servers (Ctrl+C)
# Clear terminal

# Restart MongoDB
mongod --dbpath ./data/db

# In new terminal, restart backend
npm run dev

# In browser, open test page
# file:///path/to/html/test-auth.html
```

#### **Recreate Database**
```bash
npm run setup-db
```

#### **Check All Services**
```bash
# Terminal 1: MongoDB
mongod --dbpath ./data/db

# Terminal 2: Backend
npm run dev

# Terminal 3: Test
curl http://localhost:3000/api/health
```

### 10. **Contact Support**

If issues persist:
1. Check this troubleshooting guide
2. Run `npm run check-db` and share output
3. Check browser console for errors
4. Verify all services are running
5. Test with the provided test page

### 11. **Success Indicators**

✅ **Everything Working When**:
- `npm run check-db` shows "Connected to MongoDB"
- `curl http://localhost:3000/api/health` returns JSON
- Admin login works in test page
- User signup works in test page
- No CORS errors in browser console
- Frontend can communicate with backend

🎉 **Your KushalWear site is ready when all above tests pass!** 