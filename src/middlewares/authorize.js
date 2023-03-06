import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        req.role = 'guest';
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
        req.username = decoded.username;
        req.role = decoded.isAdmin ? 'admin' : 'user';
        return next();
    } catch (error) {
        console.log(error);
        return res.render("error500");
    }
};

