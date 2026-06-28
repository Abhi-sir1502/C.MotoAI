import { generateGeminiResponse } from "../Configs/gemini.js";
import { genToken } from "../Configs/token.js"
import User from "../Models/user.model.js"

// Google login: creates user if new, sets auth cookie
export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and Email are required" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email })
    }

    // 🚀 Token generate hoga aur cookie token.js ke andar hi set ho chuki hai
    await genToken(user._id, res);
    
    // 🔥 Purani res.cookie() block ko yahan se hata diya hai taaki options overwrite na ho

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: `Google auth error ${error}`})
  }
}

// Logout: clears the auth cookie
export const logout = async (req, res) => {
  try {
    // 🔒 Logout par bhi clearCookie ko production-ready kiya secure aur none ke saath
    await res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: true,      // Production HTTPS ke liye
      sameSite: "none"   // Cross-origin aur mobile support ke liye
    })
    return res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Logout Failed ${error}` })
  }
}

// Handles a voice/text question from the widget
export const askAssistant = async (req, res) => {
  try {
    const { message, userId, currentPath } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ message: "Message and UserId are required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }

    if (!user.geminiApiKey) {
      return res.status(400).json({ message: "Gemini API key is not added" });
    }

    if (user.plan === "free" && user.totalMessages >= user.requestLimit) {
      return res.status(400).json({ message: "Free limit reached" });
    }

    if (user.plan === "pro" && new Date(user.proExpiresAt) < new Date()) {
      user.plan = "free";
      await user.save();
      return res.status(400).json({ message: "Pro plan expired" });
    }

    const cleanMessage = message.toLowerCase();

    if (user.enableNavigation) {
      const navigationWords = ["open", "go", "start", "show", "navigate", "take me"];

      const wantsNavigation = navigationWords.some((word) =>
        cleanMessage.startsWith(word)
      );

      if (wantsNavigation) {
        const matchPage = user.pages.find((page) =>
          page.keywords.some((keyword) =>
            cleanMessage.includes(keyword.toLowerCase())
          )
        );

        if (matchPage) {
          if (currentPath === matchPage.path) {
            return res.json({
              success: true,
              response: `${matchPage.name} already open`
            });
          }

          return res.json({
            success: true,
            action: "navigate",
            path: matchPage.path,
            response: `Opening ${matchPage.name}`
          });
        }
      }
    }

    const prompt = `
You are ${user.assistantName}.

businessName:
${user.businessName}

businessType:
${user.businessType}

businessDescription:
${user.businessDescription}

Assistant Tone:
${user.tone}

Rules:
- keep replies under 15 words
- Give fast direct responses
- Talk naturally
- Behave like smart voice assistant
- Avoid long explanations
- keep response short for quick voice playback

User question:
${message}
`;

    const aiResponse = await generateGeminiResponse({
      prompt,
      apikey: user.geminiApiKey,
      user,
    });

    if (user.plan === "free") {
      user.totalMessages += 1;
      await user.save();
    }

    return res.json({
      success: true,
      response: aiResponse
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Assistant AI Error"
    });
  }
};