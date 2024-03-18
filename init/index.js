const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listings.js");

main()
.then(()=>{
    console.log("DB is connected");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

async function initdb(){
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data initialised");
};

initdb();
