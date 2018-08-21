/**
 * Created by Liang on 2018/8/21.
 */
const jwt = require('jsonwebtoken');


const tool = {
    getPasswordKey() {
        return 'token'
    },
    decodeJWT(jwtValue) {
        const pk = this.getPasswordKey();
        return new Promise((resolve) => {
            jwt.verify(jwtValue, pk, (err, result) => {
                if(err) {
                    resolve();
                    return
                }
                resolve(result)
            })
        })
    }
};

module.exports = tool