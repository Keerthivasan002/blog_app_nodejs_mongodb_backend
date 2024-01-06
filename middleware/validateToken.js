import jwt from "jsonwebtoken"

export const validateToken = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    if (err.message === "jwt expired") {

                        return res.send({ status: 0, response:  "Session Expired" })
                    }
                    return res.send({ status: 0, response: err.message })
                }
                req.user = decoded.User;
                next();
            })
        }
        else {
            return res.send({ status: 0, response: "Token not provided" })
        }
    } catch (error) {
        return res.send({ status: 0, response: error.message })

    }
}
