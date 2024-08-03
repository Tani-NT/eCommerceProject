const userModel = require("../models/user-model");
const productModel = require("../models/product-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;
        const user = await userModel.findOne({ email: email });
        if (user) {
            req.flash("error", "You already have an account! Please log in.");
            return res.redirect("/login");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            fullName,
            email,
            password: hash
        });

        const token = generateToken(newUser);
        res.cookie("token", token);

        req.flash("success", "Registration successful! You are now logged in.");
        res.redirect("/shop");
    } catch (err) {
        console.log(err.message);
        req.flash("error", "Something went wrong during registration.");
        res.redirect("/register");
    }
};


module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        if (!user) {
            req.flash("error", "Email or password is incorrect.");
            return res.redirect("/login");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = generateToken(user);
            res.cookie("token", token);

            req.flash("success", "Login successful!");
            res.redirect("/shop");
        } else {
            req.flash("error", "Email or password is incorrect.");
            res.redirect("/login");
        }
    } catch (err) {
        console.error(err.message);
        req.flash("error", "Something went wrong during login.");
        res.redirect("/login");
    }
};


module.exports.logoutUser = (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
};
