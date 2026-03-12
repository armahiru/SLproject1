import jwt from "jsonwebtoken";

// Unified authentication middleware
const authMiddleware = async (req, res, next) => {
    const token = req.headers?.token;
    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login Again" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        // Ensure req.body exists for GET requests
        if (!req.body) {
            req.body = {};
        }
        req.body.userId = token_decode.id;
        req.body.userRole = token_decode.role;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authMiddleware;