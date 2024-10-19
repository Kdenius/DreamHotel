const mongoose = require("mongoose");

const RenterSchema = new mongoose.Schema(
    {
        firstName : {
            type: String,
            required: true,
        },
        lastName : {
            type: String,
            required: true,
        },
        email : {
            type: String,
            required : true,
            unique: [true, "Email id already present"],

        },
        password: {
            type: String,
            required :true,
        },
        profilePath: {
            type: String,
            default: "",
        },
        phone: {
            type: Number,
            default: 0,
        },
        tripList :[{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
        wishList :[{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
       

    },
    {timestamps: true}
);

const Renter = mongoose.model("Renter", RenterSchema);
module.exports = Renter;