import jwt from "jsonwebtoken";

// lecturer authentication middleware
const AuthLecturer = async (req, res, next) => {
    // accept both ltoken (new) and dtoken (old) for backward compatibility
    const token = req.headers?.ltoken || req.headers?.dtoken;
    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login Again" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.lecturerId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default AuthLecturer;