const { request } = require('express');
const healthModel = require('../schemas/health');

const getMeHealth =     async (req, res) => {
    const userId = req.principal;
    const myHealths = await healthModel.find({ userId:userId}).sort({"createdAt":"desc"});

    res.status(200).json(myHealths);

};

const addMeHealth = async(req, res) => {
    try {
        const userId = req.principal;
        req.body.userId = userId;
        const saveMeHealth = await healthModel.create(req.body);
    
        return res.status(200).json({saveMeHealth});
    } catch (error) {
        return res.status(500).json({error});
        
    }
};

const updateMeHealth = async(req, res) => {
    try {
        const healthId = req.params.healthId;
        const existHealth = await healthModel.findByIdAndUpdate(healthId, req.body , { returnDocument:"after" } );
        if(!existHealth) {
            return res.status(404).json({"message": "ไม่พบรายการที่ต้องแก้ไข"});
        };
    
        return res.status(200).json(existHealth);
    } catch (error) {
        return res.status(500).json(error);
        
    }
};

const deleteMeHealth = async(req, res) => {
    try {
        const healthId = req.params.healthId;
        const existHealth = await healthModel.findByIdAndDelete(healthId);
        if(!existHealth) {
            return res.status(404).json({"message": "ไม่พบรายการที่ต้องแก้ไข"});
        };
    
        return res.status(204).end();
    } catch (error) {
        return res.status(501).json(error);
        
    }
};

module.exports = {
    getMeHealth,
    addMeHealth,
    updateMeHealth,
    deleteMeHealth,
}