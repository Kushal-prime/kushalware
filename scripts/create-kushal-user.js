const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('../src/models/User');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kushalwear';

async function createKushalUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Check if Kushal user already exists
        const existingUser = await User.findOne({ email: 'kushal@kushalwear.com' });
        if (existingUser) {
            console.log('Kushal user already exists!');
            console.log('Email:', existingUser.email);
            console.log('Name:', existingUser.name);
            console.log('Role:', existingUser.role);
            return;
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('Kushal123!', saltRounds);

        // Create Kushal user
        const kushalUser = new User({
            name: 'Kushal',
            email: 'kushal@kushalwear.com',
            password: hashedPassword,
            role: 'user', // or 'admin' if you want admin privileges
            phone: '',
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
            }
        });

        // Save user to database
        await kushalUser.save();
        console.log('✅ Kushal user created successfully!');
        console.log('Name: Kushal');
        console.log('Email: kushal@kushalwear.com');
        console.log('Password: Kushal123!');
        console.log('Role: user');

    } catch (error) {
        console.error('❌ Error creating Kushal user:', error.message);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the function
createKushalUser(); 