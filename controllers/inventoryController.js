const userModel = require("../models/userModel")
const inventoryModel = require("../models/inventoryModel");
const mongoose = require("mongoose");
const createInventoryController = async (req, res) => {
    try {
        const { inventoryType } = req.body
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.send({
                success: false,
                message: 'User not found !'
            })
        }
        // if (inventoryType === 'in' && user.role !== 'donar') {
        //     return res.send({
        //         success: false,
        //         message: 'Not a donar account !'
        //     })
        // }
        // if (inventoryType === 'out' && user.role !== 'hospital') {
        //     return res.send({
        //         success: false,
        //         message: 'Not a hospital account !'
        //     })
        // }
        if (req.body.inventoryType == "out") {
            const requestedBloodGroup = req.body.bloodGroup;
            const requestedQuantityOfBlood = req.body.quantity;
            const organisation = new mongoose.Types.ObjectId(req.body.userId);
            //calculate Blood Quanitity
            const totalInOfRequestedBlood = await inventoryModel.aggregate([
                {
                    $match: {
                        organisation,
                        inventoryType: "in",
                        bloodGroup: requestedBloodGroup,
                    },
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" },
                    },
                },
            ]);
            // console.log("Total In", totalInOfRequestedBlood);
            const totalIn = totalInOfRequestedBlood[0]?.total || 0;
            //calculate OUT Blood Quanitity

            const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
                {
                    $match: {
                        organisation,
                        inventoryType: "out",
                        bloodGroup: requestedBloodGroup,
                    },
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" },
                    },
                },
            ]);
            const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

            //in & Out Calc
            const availableQuanityOfBloodGroup = totalIn - totalOut;
            //quantity validation
            if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
                return res.status(500).send({
                    success: false,
                    message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
                });
            }
            req.body.hospital = user?._id;
        } else {
            req.body.donar = user?._id;
        }

        // save record
        const inventory = await inventoryModel(req.body);
        await inventory.save();

        return res.send({
            success: true,
            message: 'Inventory Created SuccessFully !'
        })
    }

    catch (error) {
        return res.send({
            success: false,
            message: 'Error in inventory controller',
            error
        })
    }
}

// get all blood record 
const getInventoryController = async (req, res) => {
    try {
        const inventory = await inventoryModel.find({ organisation: req.body.userId })
            .populate('donar')
            .populate('hospital')
        return res.send({
            success: true,
            message: 'Successfully get all blood record',
            inventory
        })
    } catch (error) {
        return res.send({
            success: false,
            message: 'Error in get all blood record',
            error
        })
    }
}


// get donar record 
const getDonarsControllers = async (req, res) => {
    try {
        const organisation = req.body.userId;
        //find donars
        const donorId = await inventoryModel.distinct("donar", {
            organisation,
        });
        // console.log(donorId);
        const donars = await userModel.find({ _id: { $in: donorId } });

        return res.status(200).send({
            success: true,
            message: "Donar Record Fetched Successfully",
            donars,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Donar records",
            error,
        });
    }
}

const getHospitalController = async (req, res) => {
    try {
        const organisation = req.body.userId;
        // //GET HOSPITAL ID
        const hospitalId = await inventoryModel.distinct("hospital", {
            organisation,
        });
        //FIND HOSPITAL
        const hospitals = await userModel.find({
            _id: { $in: hospitalId },
        });
        return res.status(200).send({
            success: true,
            message: "Hospitals Data Fetched Successfully",
            hospitals,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In get Hospital API",
            error,
        });
    }
};
// GET ORG PROFILES
const getOrgnaisationController = async (req, res) => {
    try {
        const donar = req.body.userId;
        const orgId = await inventoryModel.distinct("organisation", { donar });
        //find org
        const organisations = await userModel.find({
            _id: { $in: orgId },
        });
        return res.status(200).send({
            success: true,
            message: "Org Data Fetched Successfully",
            organisations,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In ORG API",
            error,
        });
    }
};
// GET ORG for Hospital
const getOrgnaisationForHospitalController = async (req, res) => {
    try {
        const hospital = req.body.userId;
        const orgId = await inventoryModel.distinct("organisation", { hospital });
        //find org
        const organisations = await userModel.find({
            _id: { $in: orgId },
        });
        return res.status(200).send({
            success: true,
            message: "Hospital Org Data Fetched Successfully",
            organisations,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Hospital ORG API",
            error,
        });
    }
};

// GET Hospital BLOOD RECORS
const getInventoryHospitalController = async (req, res) => {
    try {
        const inventory = await inventoryModel
            .find(req.body.filters)
            .populate("donar")
            .populate("hospital")
            .populate("organisation")
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            messaage: "get hospital comsumer records successfully",
            inventory,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Get consumer Inventory",
            error,
        });
    }
};
module.exports = { createInventoryController, getInventoryController, getDonarsControllers, getHospitalController, getOrgnaisationController, getOrgnaisationForHospitalController,getInventoryHospitalController }