    const { Categories, Products } = require('../db/addTable').defineModel(require('../db/init_db').sequelize);

    const getCategories = async (req, res) => {
    try {
        const categories = await Categories.findAll({ 
        include: [{ model: Products }] 
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    const getCategoryById = async (req, res) => {
    try {
        const category = await Categories.findByPk(req.params.id, { 
        include: [{ model: Products }] 
        });
        if (!category) return res.status(404).json({ message: 'Категория не найдена' });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    const createCategory = async (req, res) => {
    try {
        const newCategory = await Categories.create(req.body);
        res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    const updateCategory = async (req, res) => {
    try {
        const category = await Categories.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Категория не найдена' });
        await category.update(req.body);
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    const deleteCategory = async (req, res) => {
    try {
        const category = await Categories.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Категория не найдена' });
        

        const products = await Products.count({ where: { category_id: req.params.id } });
        if (products > 0) {
        return res.status(400).json({ message: 'Невозможно удалить категорию: в ней есть товары' });
        }
        
        await category.destroy();
        res.json({ success: true, message: 'Категория удалена' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };