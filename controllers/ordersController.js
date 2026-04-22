    const { Orders, User, Order_items, Products } = require('../db/addTable').defineModel(require('../db/init_db').sequelize);

    const getOrders = async (req, res) => {
    try {
        const orders = await Orders.findAll({ 
        include: [
            { model: User },
            { 
            model: Order_items,
            include: [{ model: Products }]
            }
        ] 
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    const getOrderById = async (req, res) => {
    try {
        const order = await Orders.findByPk(req.params.id, { 
        include: [
            { model: User },
            { 
            model: Order_items,
            include: [{ model: Products }]
            }
        ] 
        });
        if (!order) return res.status(404).json({ message: 'Заказ не найден' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    const createOrder = async (req, res) => {
    try {
        const newOrder = await Orders.create(req.body);
        res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    const updateOrder = async (req, res) => {
    try {
        const order = await Orders.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Заказ не найден' });
        await order.update(req.body);
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    const deleteOrder = async (req, res) => {
    try {
        const order = await Orders.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Заказ не найден' });
        
        // Сначала удаляем связанные позиции заказа
        await Order_items.destroy({ where: { order_id: req.params.id } });
        
        await order.destroy();
        res.json({ success: true, message: 'Заказ удален' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    module.exports = { getOrders, getOrderById, createOrder, updateOrder, deleteOrder };