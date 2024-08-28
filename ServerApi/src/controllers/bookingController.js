const express  = require("express");
const Booking = require("../models/booking");
const Property = require("../models/property");
const Owner = require("../models/owner");
const Renter = require("../models/renter");


exports.add = async(req, res, next) =>{
    try{
        const {renter, property, startDate, endDate, totalRoom} = req.body;
        const pdata = await Property.findById(property);

        const d = new Date(startDate);
        const e = new Date(endDate);        
        let  day = Math.round((e.getTime()-d.getTime())/(1000 * 60 * 60 * 24));
        const totalPrice = totalRoom*day*(pdata.price); 
        const booking = new Booking({renter, property, startDate:d, endDate:e, totalRoom, totalPrice});
        const ret = await booking.save();

        const odata = await Owner.findById(pdata.owner);
        const rdata = await Renter.findById(renter);
        odata.reservationList.push(ret._id);
        rdata.tripList.push(ret._id);
        let x= await odata.save();
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

exports.bookingOnProperty = async(req, res, next) =>{
    try{
        const ret = await Booking.find({property: req.params.pid});
        res.status(201).send(ret);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.del = async(req, res, next) =>{
    try{
        const ret = await Booking.findByIdAndDelete({_id: req.params.bid});
        res.status(201).send(ret);
    }catch(e){
        res.status(400).send(e);
    }
}

