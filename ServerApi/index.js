const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
require("./src/db/connection");
app.use(express.json());

const owner = require("./src/routes/ownerRoute");
const property = require("./src/routes/propertyRoute");
const renter = require("./src/routes/renterRoute");
const booking = require("./src/routes/bookingRoute");


app.use("/owner", owner);
app.use("/property", property);
app.use("/renter", renter);
app.use("/booking", booking);

app.use((req, res, next) => {
    return res.status(404).send(`can't found path ${req.method} ${req.originalUrl}`);
  });



// const Owner = require("./src/models/owner");

// app.get("/owner", (req,res) =>{
//     res.send("hello");
// })
// app.post("/owner",async (req,res) =>{
//     console.log(req.body);
//     try{
//         const owner = new Owner(req.body);
//         const tem = await owner.save();
//         res.status(201).send(tem);
//     }catch(e){
//         res.status(404).send(e);
//     }
    
// })


// app.get("/owner",async(req, res) =>{
//     console.log("its working");
//     try{
//     await Owner.create({
//         firstName: 'Duryodhan',
//         lastName: 'Kaurab',
//         email: 'dkboos@gamil.com',
//         password: '1234',
//     });
// }
// catch(e){
//     console.log(e);
    
// }
// })

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
})