const mongoose = require("mongoose");

mongoose.connect(process.env.ATLAS_URL).then(() => {
    console.log("database connection is successful");
}).catch((e) =>{
    console.error("Error : issue in db connection");
})