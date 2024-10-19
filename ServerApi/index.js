const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
require("./src/db/connection");
app.use(express.json());
const cors = require("cors");
const jwt = require('jsonwebtoken');

const owner = require("./src/routes/ownerRoute");
const property = require("./src/routes/propertyRoute");
const renter = require("./src/routes/renterRoute");
const booking = require("./src/routes/bookingRoute");


// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow requests from localhost:3000
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Specify allowed HTTP methods
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Specify allowed headers
//   next();
// });
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));

app.get("/verify", (req, res, next) => {
  const token = req.headers['authorization'];
  console.log(token);
  if(!token){
    return next();
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err){
      // console.log('cdlr');
        return next();
    }
    return res.json({
        data: decoded
    });
});
}); 

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