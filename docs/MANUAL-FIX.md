# 🔧 Manual Fix for Login Issues

## **Problem**: "Invalid credentials" when trying to login

### **Root Causes**:
1. MongoDB data directory missing
2. Port 3000 already in use
3. Database not properly initialized

---

## **🔄 Quick Fix (Recommended)**

### **Step 1: Run the Fix Script**
```bash
# Double-click or run:
fix-login.bat
```

This will automatically:
- Stop all Node processes
- Create MongoDB directories
- Setup database with admin user
- Start MongoDB and backend server

---

## **🛠️ Manual Fix Steps**

### **Step 1: Stop All Processes**
```bash
# In Command Prompt (Run as Administrator):
taskkill /f /im node.exe
```

### **Step 2: Create MongoDB Directory**
```bash
# In your project folder:
mkdir data
mkdir data\db
```

### **Step 3: Setup Database**
```bash
npm run setup-db
```

### **Step 4: Start MongoDB**
```bash
# In a new terminal window:
mongod --dbpath ./data/db
```

### **Step 5: Start Backend Server**
```bash
# In another new terminal window:
npm run dev
```

---

## **🧪 Test Your Login**

### **Method 1: Test Page**
1. Open `html/test-auth.html` in browser
2. Click "Test Server Health"
3. Click "Test Admin Login"
4. Should show "✅ Admin Login Successful!"

### **Method 2: Main Site**
1. Open `html/index.html` in browser
2. Click "Login" button
3. Enter credentials:
   - **Email**: `admin@kushalwear.com`
   - **Password**: `Admin123!`
4. Click "Login"

---

## **🔑 Your Login Credentials**

### **Admin Account**
- **Email**: `admin@kushalwear.com`
- **Password**: `Admin123!`
- **Role**: Administrator

### **Create New Account**
1. Click "Sign Up" button
2. Fill in your details
3. Password must have: uppercase, lowercase, number (min 6 chars)

---

## **❌ If Still Not Working**

### **Check Server Status**
```bash
curl http://localhost:3000/api/health
```

### **Check Database**
```bash
npm run check-db
```

### **Common Issues**:
1. **CORS Error**: Use Live Server to serve HTML files
2. **Port Busy**: Kill all Node processes first
3. **Database Error**: Run `npm run setup-db` again

---

## **✅ Success Indicators**

Your login should work when:
- ✅ MongoDB shows "Connected to MongoDB"
- ✅ Backend shows "Server running on port 3000"
- ✅ `curl http://localhost:3000/api/health` returns JSON
- ✅ Test page shows "✅ Success!" messages

---

## **🚀 Quick Start Commands**

```bash
# 1. Fix everything automatically
fix-login.bat

# 2. Or manually:
taskkill /f /im node.exe
mkdir data\db
npm run setup-db
mongod --dbpath ./data/db
npm run dev
```

**Try the fix script first - it handles everything automatically!** 🎉 