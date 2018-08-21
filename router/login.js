const express = require('express');
const router = express.Router();

router.use('/home_login', async (req, res, next) => {
	// console.log("req",req)
	res.send(`home_login`)
}).use('/detail_home', async (req, res, next) => {
	res.send(`detail_home`)
})

module.exports = router