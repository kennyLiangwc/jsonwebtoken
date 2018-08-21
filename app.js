const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const index = require('./router/index')
const uuid = require('uuid/v1')

app.set('jwtSecret','hahahah')
	.use(cookieParser())
	.use((req, res, next) => {
		console.log(req.cookies)
		if(!req.cookies._token) {
			res.cookie('_token',uuid(),{
				domain: req.hostname,
				expires: new Date().getTime() + 1000 * 60 * 5,
				httpOnly: false,
				maxAge: 1000 * 60 * 5
			})
		}
		next()
	})
	.use(express.static('static'))
	.use('/',require('./router/index'))
	.use((err, req, res, next) => {
		res.status(500).send('服务器异常')
	})
	.listen(3000)