const Product = require('../models/productModel');
const upload = require('../middlewares/uploadMiddleware');
const fs = require('fs');

async function createProduct(req, res){
    try {
        const files = req.files;
        if (files) {
            req.body.images = files.map(file => `/uploads/${file.filename}`);
        }
        const {title, description, brand, category, price, discountPrice, stock, rating, isFeatured} = req.body;
        if (!title || !description || !brand || !category || !price || !discountPrice || !stock || !rating || isFeatured === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const product = new Product(
            {
                title,
                description,
                brand,          
                category,
                price,  
                discountPrice,
                stock,
                rating,
                isFeatured,
                images: req.files ? req.files.map(file => `/uploads/${file.filename}`) : []
            }
        );
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getProducts(req, res){
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getProductById(req, res){
    try{
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateProduct(req, res){
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const {
            title,
            description,
            brand,
            category,
            price,
            discountPrice,
            stock,
            rating,
            isFeatured
        } = req.body;

        if (title !== undefined) product.title = title;
        if (description !== undefined) product.description = description;
        if (brand !== undefined) product.brand = brand;
        if (category !== undefined) product.category = category;
        if (price !== undefined) product.price = price;
        if (discountPrice !== undefined) product.discountPrice = discountPrice;
        if (stock !== undefined) product.stock = stock;
        if (rating !== undefined) product.rating = rating;
        if (isFeatured !== undefined) product.isFeatured = isFeatured;

        if (req.files && req.files.length) {
            product.images = req.files.map(file => `/uploads/${file.filename}`);
        }

        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function deleteProduct(req, res){
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.images && product.images.length) {
            product.images.forEach((imagePath) => {
                // imagePath stored as "/uploads/<filename>", convert to filesystem path
                const fsPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
                fs.unlink(fsPath, (err) => {
                    if (err && err.code !== 'ENOENT') {
                        console.error('Failed to delete file:', fsPath, err.message);
                    }
                });
            });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { 
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
}