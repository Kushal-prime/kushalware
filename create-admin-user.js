const mongoose = require('mongoose');
const User = require('./backend/src/models/User');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/kushalwear', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

async function createAdminUser() {
    try {
        console.log('👤 Creating admin user...');
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@kushalwear.com' });
        
        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            console.log(`   Name: ${existingAdmin.name}`);
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   Role: ${existingAdmin.role}`);
            return;
        }
        
        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@kushalwear.com',
            password: hashedPassword,
            role: 'admin',
            phone: '1234567890',
            address: {
                street: 'Admin Street',
                city: 'Admin City',
                state: 'Admin State',
                zipCode: '12345',
                country: 'Admin Country'
            }
        });
        
        await adminUser.save();
        
        console.log('✅ Admin user created successfully!');
        console.log(`   Name: ${adminUser.name}`);
        console.log(`   Email: ${adminUser.email}`);
        console.log(`   Role: ${adminUser.role}`);
        console.log(`   Password: admin123`);
        
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

createAdminUser(); 