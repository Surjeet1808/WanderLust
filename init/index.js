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

initdata.data=initdata.data.map((obj)=>({...obj,owner:'660087983757b1c74e1357ec'}));

async function initdb(){
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data initialised");
};

initdb();
