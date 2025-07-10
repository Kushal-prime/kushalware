const mongoose = require('mongoose');
const Order = require('./backend/src/models/Order');
const User = require('./backend/src/models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/kushalwear', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

async function cleanupOrders() {
    try {
        console.log('🧹 Cleaning up orders with invalid user references...');
        
        // Get all valid user IDs
        const validUserIds = await User.find({}, '_id');
        const validUserIdStrings = validUserIds.map(user => user._id.toString());
        
        console.log(`Found ${validUserIdStrings.length} valid users`);
        
        // Find orders with invalid user references
        const allOrders = await Order.find({});
        console.log(`Found ${allOrders.length} total orders`);
        
        let invalidOrders = 0;
        let validOrders = 0;
        
        for (const order of allOrders) {
            if (!order.user || !validUserIdStrings.includes(order.user.toString())) {
                console.log(`❌ Invalid order found: ${order.orderNumber} - User: ${order.user}`);
                invalidOrders++;
                
                // Option 1: Delete the invalid order
                await Order.findByIdAndDelete(order._id);
                console.log(`   Deleted order: ${order.orderNumber}`);
                
                // Option 2: Or set user to null (uncomment if you want to keep orders)
                // await Order.findByIdAndUpdate(order._id, { user: null });
                // console.log(`   Set user to null for order: ${order.orderNumber}`);
            } else {
                validOrders++;
            }
        }
        
        console.log('\n📊 Cleanup Summary:');
        console.log(`✅ Valid orders: ${validOrders}`);
        console.log(`❌ Invalid orders removed: ${invalidOrders}`);
        console.log(`📦 Total orders after cleanup: ${validOrders}`);
        
        // Verify cleanup
        const remainingOrders = await Order.find({});
        console.log(`\n🔍 Verification: ${remainingOrders.length} orders remaining`);
        
        // Check for any remaining invalid orders
        const remainingInvalidOrders = remainingOrders.filter(order => 
            !order.user || !validUserIdStrings.includes(order.user.toString())
        );
        
        if (remainingInvalidOrders.length === 0) {
            console.log('✅ All invalid orders have been cleaned up!');
        } else {
            console.log(`⚠️  ${remainingInvalidOrders.length} invalid orders still remain`);
        }
        
    } catch (error) {
        console.error('❌ Cleanup error:', error);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

cleanupOrders(); 