/**
 * Created by Liang on 2018/8/21.
 */
const express = require('express');
const Router = express.Router();
const tool = require('../util/tool')


/**
 * 校验token中间件
 */
const misMiddle = async function(req, res, next) {
    const token = req.cookies['_mis_token'];
    const jwtData = await tool.decodeJWT(token);
    if(jwtData) {
        req.jwtData = jwtData;
        req.uid = jwtData.data.uid
    }
    next()
}


Router.use('/mis', misMiddle, (req, res, next) => {
    res.send(`验证通过`)
});

module.exports = Router