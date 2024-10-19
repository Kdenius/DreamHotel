const express  = require("express");
const Booking = require("../models/booking");
const Property = require("../models/property");
const Owner = require("../models/owner");
const Renter = require("../models/renter");


exports.add = async(req, res, next) =>{
    try{
        const {renter, property, startDate, endDate, totalRoom} = req.body;
        const pdata = await Property.findById(property);

        if (totalRoom <= 0) {
            return res.status(400).send({ error: "Number of rooms must be greater than zero." });
        }

        const d = new Date(startDate);
        const e = new Date(endDate);  
        if (d >= e) {
            return res.status(400).send({ error: "Start date must be before the end date." });
        }      
        let  day = Math.round((e.getTime()-d.getTime())/(1000 * 60 * 60 * 24));
        const totalPrice = totalRoom*day*(pdata.price); 
        const booking = new Booking({renter, property, startDate:d, endDate:e, totalRoom, totalPrice});
        const ret = await booking.save();

        const rdata = await Renter.findById(renter);
        rdata.tripList.push(ret._id);
        let y=await rdata.save();

        res.status(201).send(ret);

    }catch(e){
        res.status(400).send(e);
    }
}

exports.all = async(req, res, next) =>{
    try{
        const bookings = await Booking.find();
        res.status(201).send(bookings);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.oallbooking = async(req, res, next) =>{
    try{
        const obj = await Owner.findById(req.params.id,'-_id propertyList');
        if(obj.propertyList.length === 0)
            return res.send("not found any property !");
        let ret = await Booking.find({property: {$in: obj.propertyList}}).populate('property renter');
        res.status(201).send(ret);

    }catch(e){
        res.status(400).send(e);
    }
}

exports.bookingOnProperty = async(req, res, next) =>{
    try{
        const ret = await Booking.find({property: req.params.pid, status: 'current'}).populate('renter', '-_id firstName lastName email phone');
        res.status(201).send(ret);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.del = async(req, res, next) =>{
    try{
        const booking = await Booking.findById(req.params.bid);
        const renter = await Renter.findById(booking.renter);
        renter.tripList.pull(booking._id);
        const t = await renter.save();
        const ret = await Booking.findOneAndDelete({_id: req.params.bid});
        res.status(201).send(ret);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.changeStatus = async (req, res, next) => {
    try {
        const bookingId = req.params.id; // Booking ID from request parameters
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).send("Booking not found");
        }

        // Change status to "completed"
        booking.status = req.params.status;

        // Process refund logic here
        // For example, deduct the totalPrice from the renter's account
        // (You need to implement this logic based on your application's requirements)

        await booking.save(); // Save the updated booking

        // Send response with updated booking details
        res.status(200).send(booking);
    } catch (e) {
        res.status(400).send(e.message || "An error occurred");
    }
};


