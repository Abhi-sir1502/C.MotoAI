import jwt from "jsonwebtoken";

export const genToken = async (userId, res) => {
  try {
    // 1. Token generate karo
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // 2. Token ko response cookie mein set karo
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din miliseconds mein
      sameSite: "none",                // 🚀 Cross-origin aur mobile ke liye
      secure: true,                    // 🔒 HTTPS (Render) par compulsory hai
    });

    return token;
  } catch (error) {
    console.log(error);
  }
};