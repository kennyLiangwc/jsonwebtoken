const express = require('express')
const router = express.Router()

router.use('/login', require('./login'))
    .use('/api', require('./api'))



module.exports = router