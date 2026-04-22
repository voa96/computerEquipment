    const { Products, Categories, Order_items } = require('../db/addTable').defineModel(require('../db/init_db').sequelize);

    const getProducts = async (req, res) => {
    try {
        const products = await Products.findAll({ 
        include: [{ model: Categories }] 
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    const getProductById = async (req, res) => {
    try {
        const product = await Products.findByPk(req.params.id, { 
        include: [
            { model: Categories },
            { model: Order_items }
        ] 
        });
        if (!product) return res.status(404).json({ message: 'Продукт не найден' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    const createProduct = async (req, res) => {
    try {
        const newProduct = await Products.create(req.body);
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    const updateProduct = async (req, res) => {
    try {
        const product = await Products.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Продукт не найден' });
        await product.update(req.body);
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    const deleteProduct = async (req, res) => {
    try {
        const product = await Products.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Продукт не найден' });
        
        // Проверяем, есть ли товар в заказах
        const orderItems = await Order_items.count({ where: { product_id: req.params.id } });
        if (orderItems > 0) {
        return res.status(400).json({ message: 'Невозможно удалить продукт: он есть в заказах' });
        }
        
        await product.destroy();
        res.json({ success: true, message: 'Продукт удален' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };