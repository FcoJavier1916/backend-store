const Order = require('.././../models/orderModel');

const getOrdersAdm = async(req, res) =>{
    try{
        const events = await Order.find();
        res.status(200).json(events);
    }catch(error){
        res.status(500).json({message:'❌ error al obtener respuesta', error});
    }
}

module.exports = getOrdersAdm