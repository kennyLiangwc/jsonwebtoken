const express = require('express');
const router = express.Router();
const uuid = require('uuid/v1');
const jwt = require('jsonwebtoken');
const tool = require('../util/tool')

router.use('/home_login', async (req, res, next) => {
	try{
		// const query = req.query;
		// const password = query.password;
		// const name = query.name;
		const exp = Date.now() + 5 * 60 * 1000;
		const uid = uuid();
		const loginToken = jwt.sign({
			exp,
			data: {
				uid
			}
		},tool.getPasswordKey())
		res.cookie('_mis_token', loginToken, {

		})
	}catch(e) {

	}
	// console.log("req",req)
	res.send(`home_login`)
}).use('/detail_home', async (req, res, next) => {
	res.send(`detail_home`)
})

module.exports = router