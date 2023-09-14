const jwt = require('jsonwebtoken');
const middleware = async(req,res,next) => {
    try {
        const token = req.headers['authorization'].split(" ")[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.send({
                    success: false,
                    message: "auth failed "
                })
            }
            else {
                req.body.userId = decode.userId
                next()
            }
        })
    } catch (error) {
        return res.send({
            success: false,
            message: "auth failed ",
            error
        })
    }
}
module.exports=middleware