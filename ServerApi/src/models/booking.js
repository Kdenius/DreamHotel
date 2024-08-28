const { default: mongoose } = require("mongoose");

const BookingSchema = new mongoose.Schema(
    {
        renter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Renter",
        },  
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        totalRoom :{
            type: Number,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        }
    }
);

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;

