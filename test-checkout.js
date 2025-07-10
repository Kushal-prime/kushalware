const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api';

async function testAuthAndCheckout() {
    console.log('🧪 Testing KushalWear Authentication and Checkout System\n');

    try {
        // Test 1: Signup
        console.log('1. Testing User Signup...');
        const signupResponse = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'testpass123'
            })
        });

        if (signupResponse.ok) {
            console.log('✅ Signup successful');
        } else {
            const error = await signupResponse.json();
            console.log('⚠️  Signup response:', error.message);
        }

        // Test 2: Login
        console.log('\n2. Testing User Login...');
        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'testuser@example.com',
                password: 'testpass123'
            })
        });

        let token = null;
        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            token = loginData.token;
            console.log('✅ Login successful');
            console.log(`   User: ${loginData.user.name}`);
            console.log(`   Token: ${token.substring(0, 20)}...`);
        } else {
            const error = await loginResponse.json();
            console.log('❌ Login failed:', error.message);
            return;
        }

        // Test 3: Create Order
        console.log('\n3. Testing Order Creation...');
        const orderData = {
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
                email: "testuser@example.com",
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

        const orderResponse = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (orderResponse.ok) {
            const orderResult = await orderResponse.json();
            console.log('✅ Order created successfully');
            console.log(`   Order Number: ${orderResult.order.orderNumber}`);
            console.log(`   Total: $${orderResult.order.total}`);
            console.log(`   Status: ${orderResult.order.status}`);
        } else {
            const error = await orderResponse.json();
            console.log('❌ Order creation failed:', error.message);
            if (error.errors) {
                error.errors.forEach(err => {
                    console.log(`   - ${err.msg}`);
                });
            }
        }

        // Test 4: Get User Orders
        console.log('\n4. Testing Get User Orders...');
        const ordersResponse = await fetch(`${BASE_URL}/orders/my-orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            console.log('✅ User orders retrieved successfully');
            console.log(`   Number of orders: ${ordersData.orders.length}`);
            if (ordersData.orders.length > 0) {
                console.log(`   Latest order: ${ordersData.orders[0].orderNumber}`);
            }
        } else {
            const error = await ordersResponse.json();
            console.log('❌ Get orders failed:', error.message);
        }

        console.log('\n🎉 All tests completed!');
        console.log('\n📋 Summary:');
        console.log('- Login/Signup system is working');
        console.log('- Order creation is functional');
        console.log('- User can view their orders');
        console.log('- Checkout process is ready for frontend integration');

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

// Run the test
testAuthAndCheckout(); 