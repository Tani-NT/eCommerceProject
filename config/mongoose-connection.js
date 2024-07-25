const mongoose = require("mongoose");
const config = require("config");
const dbgr = require("debug")('development:mongoose');

mongoose
    .connect(`${config.get("MONGODB_URI")}/eComProject`)
    .then(() => {
        dbgr("Connected to MongoDB...");
    })
    // Catch errors that occur during connection
    .catch(function(err){
        dbgr(err);
        process.exit(1); // Exit the process with an error code 1
    })

module.exports = mongoose.connection;