const express = require("express");
const mongoose = require("mongoose");
const Property = require("../models/property");
const Owner = require("../models/owner");
const Booking = require("../models/booking");
const multer = require('multer');
const path = require('path');
const Renter = require("../models/renter");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); 
    },
    filename: (req, file, cb) => {
        const propertyTitle = req.body.title.replace(/\s+/g, '').toLowerCase(); 
        const fileIndex = req.files.length; 
        const newFileName = `${propertyTitle}${fileIndex}${path.extname(file.originalname)}`; 
        cb(null, newFileName); 
    }
});

// File upload middleware
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/; // Allowed extensions
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!'); // Reject any file that is not an image
        }
    }
});

// Add property endpoint
exports.add = async (req, res, next) => {
    upload.array('photos', 3)(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ message: err });
        }

        try {
            // Map image paths
            const propertyTitle = req.body.title.replace(/\s+/g, '').toLowerCase(); // Normalize the title
            const imagePaths = req.files.map((file) => `${file.filename}`); // Use the filename from multer

            // Create the property object with image paths
            const property = new Property({
                ...req.body,
                photos: imagePaths,
            });

            const ret = await property.save();

            // Find owner and update their property list
            const own = await Owner.findById(ret.owner);
            own.propertyList.push(ret._id);
            await own.save();

            res.status(201).send(ret);
        } catch (e) {
            res.status(400).send({ message: 'Failed to add property', error: e.message });
        }
    });
};

exports.all = async(req, res, next) => {
    try{
        // console.log("no avvu joi");
        const propertys = await Property.find({status:'active'}).populate("owner");
        res.status(201).send(propertys);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.oall = async(req, res, next) => {
    try{
        // console.log("aveche");
        // const owner = await Owner.findById
        const owner = await Owner.findById(req.params.id).populate("propertyList");
        // console.log(owner);
        res.status(201).send(owner.propertyList);
        
    }catch(e){
        res.status(400).send(e);
    } 
}

exports.getByid = async(req, res, next) => {
    try{
        const property = await Property.findById(req.params.id);
        res.status(201).send(property);
    }catch(e){
        res.status(400).send(e);
    } 
}

exports.del = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).send({ message: "No property found" });
        }

        const cur = new Date();
        const bookings = await Booking.find({ property: req.params.id, endDate: { $gt: cur }, status: 'current' });
        if (bookings.length !== 0) {
            return res.status(404).send({ message: 'Cannot delete due to active bookings' });
        }
        console.log('step 1');
        const owner = await Owner.findById(property.owner);
        owner.propertyList.pull(property._id);
        await owner.save();
console.log('2');
        // Remove property from renters' wishlists
        await Renter.updateMany(
            { wishList: property._id },
            { $pull: { wishList: property._id } }
        );
console.log('3');
        await Booking.deleteMany({ property: req.params.id });
        const ret = await Property.findOneAndDelete({ _id: req.params.id });

        res.status(201).send({ message: 'Property deleted successfully' });
    } catch (e) {
        res.status(400).send(e);
    }
};


exports.update = async(req, res, next) => {
    try{
        const property = new Property(req.body);
        property._id = req.params.id;
        const ret =await Property.findByIdAndUpdate({_id: req.params.id},property,{new:true, upsert:true});
        res.status(201).send(ret);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.availableRoom = async(req, res, next) =>{
    try{
        const {startDate, endDate} = req.body;
        const pdata = await Property.findById(req.params.id);
        const s = new Date(startDate);
        const e = new Date(endDate);

        const bookings = await Booking.find({
            property: pdata._id,
            $nor: [
                {
                    $and : [
                        {startDate : {$lt: s}},
                        {endDate: {$lte: s}}
                    ]
                },
                {
                    $and : [
                        {startDate : {$gte: e}},
                        {endDate: {$gt: e}}
                    ]
                }
            ] //this query gives all booking which are during this given date...
            });

            let availableRoom = pdata.rooms;
            bookings.map((e) => availableRoom -= e.totalRoom);
        res.send({availableRoom});

    }catch(e){
        res.status(400).send(e);
    }
}

exports.changeStatus = async(req, res, next) => {
    try{
        const property = Property.findById(req.params.id);
        if(!property)  
            res.status(500).send("not found");
        const ret = await Property.findByIdAndUpdate(req.params.id, {status: req.params.status}, {new: true});
        res.status(200).send(ret);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.searchProperties = async (req, res) => {
    const searchTerm = req.query.q; // Get the search term from query parameters
    console.log(searchTerm);
    try {
        const properties = await Property.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { 
                    'address.streetAddress': { $regex: searchTerm, $options: 'i' } 
                },
                { 
                    'address.city': { $regex: searchTerm, $options: 'i' } 
                },
                { 
                    'address.state': { $regex: searchTerm, $options: 'i' } 
                }
            ]
        }).populate('owner');
        console.log(properties);
        res.status(200).json({ properties });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};