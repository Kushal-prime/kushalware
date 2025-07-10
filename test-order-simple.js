const mongoose = require('mongoose');
const Order = require('./backend/src/models/Order');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/kushalwear', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

async function testOrderCreation() {
    try {
        console.log('Testing order creation...');
        
        const orderData = {
            user: new mongoose.Types.ObjectId(), // Create a dummy user ID
            items: [
                {
                    id: 1,
                    name: "Test Product",
                    price: 99.99,
                    image: "test-image.jpg",
                    quantity: 2
                }
            ],
            shipping: {
                name: "Test User",
                email: "test@example.com",
                phone: "1234567890",
                address: "123 Test St",
                city: "Test City",
                state: "Test State",
                zipCode: "12345",
                country: "Test Country"
            },
            payment: {
                method: "card",
                cardNumber: "1234567890123456",
                cardExpiry: "12/25",
                cardName: "Test User"
            },
            backing: {
                newsletter: true,
                reviews: false,
                updates: true,
                special: false
            },
            subtotal: 199.98,
            tax: 16.00,
            shippingCost: 10.00,
            total: 225.98
        };

        console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
        
        const order = new Order(orderData);
        console.log('Order instance created');
        
        const savedOrder = await order.save();
        console.log('Order saved successfully!');
        console.log('Order Number:', savedOrder.orderNumber);
        console.log('Order ID:', savedOrder._id);
        
    } catch (error) {
        console.error('Error creating order:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        
        if (error.errors) {
            console.error('Validation errors:');
            Object.keys(error.errors).forEach(key => {
                console.error(`  ${key}:`, error.errors[key].message);
            });
        }
    } finally {
        mongoose.connection.close();
    }
}

testOrderCreation(); 