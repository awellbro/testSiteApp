const express = require("express");
const router = express.Router();
const path = require("path");

//test page
router.get("/", function(req, res){
    res.send("TEST PAGE");
});

router.get("/anne", function(req, res){
    const filePath = path.join(__dirname, '..', 'public', 'images', 'anne.jpeg')
    res.sendFile(filePath);
});

router.get("/routeParam/:userName", (req, res) => {
    res.send(`${req.params.userName} is a bitch`);
});


module.exports = router;