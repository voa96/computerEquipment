    const { Order_items, Orders, Products } = require('../db/addTable').defineModel(require('../db/init_db').sequelize);

    const getOrderItems = async (req, res) => {
    try {
        const orderItems = await Order_items.findAll({ 
        include: [
            { model: Orders },
            { model: Products }
        ] 
        });
        res.json(orderItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    const getOrderItemById = async (req, res) => {
    try {
        const orderItem = await Order_items.findByPk(req.params.id, { 
        include: [
            { model: Orders },
            { model: Products }
        ] 
        });
        if (!orderItem) return res.status(404).json({ message: 'Позиция заказа не найдена' });
        res.json(orderItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    const createOrderItem = async (req, res) => {
    try {
        const newOrderItem = await Order_items.create(req.body);
        
        const order = await Orders.findByPk(req.body.order_id, {
        include: [{ model: Order_items }]
        });
        if (order) {
        const total = order.Order_items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        await order.update({ total_amount: total });
        }
        
        res.status(201).json({ success: true, data: newOrderItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    const updateOrderItem = async (req, res) => {
    try {
        const orderItem = await Order_items.findByPk(req.params.id);
        if (!orderItem) return res.status(404).json({ message: 'Позиция заказа не найдена' });
        
        await orderItem.update(req.body);
        
        const order = await Orders.findByPk(orderItem.order_id, {
        include: [{ model: Order_items }]
        });
        if (order) {
        const total = order.Order_items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        await order.update({ total_amount: total });
        }
        
        res.json({ success: true, data: orderItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    const deleteOrderItem = async (req, res) => {
    try {
        const orderItem = await Order_items.findByPk(req.params.id);
        if (!orderItem) return res.status(404).json({ message: 'Позиция заказа не найдена' });
        
        const orderId = orderItem.order_id;
        await orderItem.destroy();
        
        const order = await Orders.findByPk(orderId, {
        include: [{ model: Order_items }]
        });
        if (order) {
        const total = order.Order_items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        await order.update({ total_amount: total });
        }
        
        res.json({ success: true, message: 'Позиция заказа удалена' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

    module.exports = { getOrderItems, getOrderItemById, createOrderItem, updateOrderItem, deleteOrderItem };