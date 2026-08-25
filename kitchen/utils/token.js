import jwt from "jsonwebtoken";

export const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { id: userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    );

    const refreshToken = jwt.sign(
        { id: userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "365d" }
    );

    return { accessToken, refreshToken };
};

export const setRefreshTokenCookie = (res, refreshToken) => {
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: oneYear
    });
};

export const clearRefreshTokenCookie = (res) => {
    res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0)
    });
};
