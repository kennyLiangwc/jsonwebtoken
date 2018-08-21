const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const uuid = require('uuid/v1')

app.set('jwtSecret','hahahah')
	.use(cookieParser())
	.use((req, res, next) => {
		let sessionId = req.cookies['_jwt_session'];
		if(!sessionId) {
			sessionId = uuid();
		}
        res.cookie('_jwt_session',sessionId,{
            domain: req.hostname,
            httpOnly: false,
            maxAge: 1000 * 60 * 5
        })
		next()
	})
	.use(express.static('static'))
	.use('/',require('./router/index'))
	.use((err, req, res, next) => {
		if(err.status != 404)
		res.status(err.status || 500).end('服务器异常')
	})
	.listen(3000)