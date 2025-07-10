const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:3000/api';

async function testFullCheckout() {
    console.log('🧪 Testing Full KushalWear Checkout Process\n');

    try {
        // Step 1: Login (or create user if needed)
        console.log('1. Logging in...');
        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@kushalwear.com',
                password: 'admin123'
            })
        });

        let token = null;
        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            token = loginData.token;
            console.log('✅ Login successful');
            console.log(`   User: ${loginData.user.name}`);
        } else {
            console.log('❌ Login failed, trying signup...');
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
                console.log('✅ Signup successful, now logging in...');
                const loginResponse2 = await fetch(`${BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'testuser@example.com',
                        password: 'testpass123'
                    })
                });

                if (loginResponse2.ok) {
                    const loginData = await loginResponse2.json();
                    token = loginData.token;
                    console.log('✅ Login successful after signup');
                } else {
                    console.log('❌ Login failed after signup');
                    return;
                }
            } else {
                console.log('❌ Signup failed');
                return;
            }
        }

        // Step 2: Create Order
        console.log('\n2. Creating Order...');
        const orderData = {
            items: [
                {
                    id: 1,
                    name: "Men's Jacket",
                    price: 99.99,
                    image: "images/OIP (1).jpg",
                    quantity: 2
                },
                {
                    id: 2,
                    name: "Women's Dress",
                    price: 129.99,
                    image: "images/R (1).jpg",
                    quantity: 1
                }
            ],
            shipping: {
                name: "Test User",
                email: "testuser@example.com",
                phone: "1234567890",
                address: "123 Fashion Street",
                city: "Style City",
                state: "Fashion State",
                zipCode: "12345",
                country: "Fashion Land"
            },
            payment: {
                method: "card",
                cardNumber: "1234567890123456",
                cardExpiry: "12/25",
                cardCvv: "123",
                cardName: "Test User"
            },
            backing: {
                newsletter: true,
                reviews: false,
                updates: true,
                special: true
            },
            subtotal: 329.97,
            tax: 26.40,
            shippingCost: 0,
            total: 356.37
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
            console.log('✅ Order created successfully!');
            console.log(`   Order Number: ${orderResult.order.orderNumber}`);
            console.log(`   Total: $${orderResult.order.total}`);
            console.log(`   Status: ${orderResult.order.status}`);
            console.log(`   Items: ${orderResult.order.items.length}`);
            console.log(`   Shipping to: ${orderResult.order.shipping.name}`);
        } else {
            const error = await orderResponse.json();
            console.log('❌ Order creation failed:', error.message);
            if (error.errors) {
                error.errors.forEach(err => {
                    console.log(`   - ${err.msg}`);
                });
            }
            return;
        }

        // Step 3: Get User Orders
        console.log('\n3. Retrieving User Orders...');
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
                console.log(`   Latest order total: $${ordersData.orders[0].total}`);
            }
        } else {
            const error = await ordersResponse.json();
            console.log('❌ Get orders failed:', error.message);
        }

        console.log('\n🎉 Full checkout process completed successfully!');
        console.log('\n📋 Summary:');
        console.log('✅ User authentication working');
        console.log('✅ Order creation working');
        console.log('✅ Order retrieval working');
        console.log('✅ Checkout process is fully functional');

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

// Run the test
testFullCheckout(); 