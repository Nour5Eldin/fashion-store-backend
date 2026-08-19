const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/fashion-store').then(async () => {
    const products = mongoose.connection.collection('products');
    const categories = mongoose.connection.collection('categories');
    
    console.log("Products count:", await products.countDocuments());
    console.log("Categories count:", await categories.countDocuments());

    const firstProduct = await products.findOne();
    console.log("Sample product:", firstProduct);

    mongoose.connection.close();
});
