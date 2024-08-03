const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const userModel = require("../models/user-model");
const productModel = require("../models/product-model");

router.get("/",(req,res)=>{
    let error = req.flash("error");
    res.render("index",{error, loggedin: false});
})
router.get("/login",(req,res)=>{
    let error = req.flash("error");
    res.render("index",{error, loggedin: false});
})

router.get('/shop', async (req, res) => {
    let products = await productModel.find();
    let success = req.flash("success","added to cart");
    res.render('shop',{products,success});
});

router.get("/cart",isLoggedIn,async (req,res)=>{
    let user = await userModel
        .findOne({ email: req.user.email})
        .populate("cart");

    const bill = Number(user.cart[0].price)+20 - Number(user.cart[0].discount);
    console.log(user.cart);
    res.render("cart",{user,bill});
})

router.get("/addtocart/:productid", isLoggedIn, async (req, res) => {
    if (!req.user) {
        req.flash("error", "User is not authenticated.");
        return res.redirect("/login");
    }

    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/shop");
    }

    user.cart.push(req.params.productid);
    await user.save();

    let success = req.flash("success", "Added to cart!");
    let products = await productModel.find();
    res.render("shop",{products,success});
});


router.get("/logout",isLoggedIn,(req,res)=>{
    res.render("index");
})

module.exports = router;