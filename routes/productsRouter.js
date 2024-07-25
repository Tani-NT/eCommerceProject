const express = require("express");
const router = express.Router();

router.get("/",function(req,res){
    res.send("owners route working!");
})

module.exports = router;