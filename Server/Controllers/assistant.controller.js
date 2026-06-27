import User from "../Models/user.model.js";

// ================================================================
// GET ASSISTANT CONFIGURATION
// Description: Fetch assistant settings for a specific user
// ================================================================
export const getAssistantConfig = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Find user and select only needed fields
    const user = await User.findById(userId).select(
      "assistantName businessName businessType businessDescription theme tone geminiApiKey pages isSetupComplete geminiStatus enableVoice enableNavigation"
    );

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Assistant configuration fetched successfully",
      user: user
    });

  } catch (error) {
    console.error("❌ Get Assistant Config Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch assistant configuration",
      error: error.message
    });
  }
};

// ================================================================
// UPDATE ASSISTANT CONFIGURATION
// Description: Update assistant settings for a user
// ================================================================
export const updateAssistantConfig = async (req, res) => {
  try {
    const userId = req.userId;
    const updateData = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Allowed fields to update
    const allowedFields = [
      "assistantName",
      "businessName",
      "businessType",
      "businessDescription",
      "tone",
      "theme",
      "geminiApiKey",
      "pages",
      "enableVoice",
      "enableNavigation"
    ];

    // Update only allowed fields
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    // If geminiApiKey is updated, reset status to pending
    if (updateData.geminiApiKey) {
      user.geminiStatus = "pending";
    }

    // Mark setup as complete
    user.isSetupComplete = true;

    // Save user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Assistant configuration updated successfully",
      user: user
    });

  } catch (error) {
    console.error("❌ Update Assistant Config Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update assistant configuration",
      error: error.message
    });
  }
};

// ================================================================
// GET ASSISTANT STATUS
// Description: Get current status of assistant (active/inactive)
// ================================================================
export const getAssistantStatus = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const user = await User.findById(userId).select(
      "assistantName isSetupComplete geminiStatus plan totalMessages requestLimit"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const remainingMessages = Math.max(
      0,
      (user.requestLimit || 200) - (user.totalMessages || 0)
    );

    return res.status(200).json({
      success: true,
      status: {
        assistantName: user.assistantName,
        isSetupComplete: user.isSetupComplete,
        geminiStatus: user.geminiStatus,
        plan: user.plan,
        remainingMessages: remainingMessages,
        totalMessages: user.totalMessages || 0,
        requestLimit: user.requestLimit || 200,
        isActive: user.isSetupComplete && user.geminiStatus === "active"
      }
    });

  } catch (error) {
    console.error("❌ Get Assistant Status Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch assistant status",
      error: error.message
    });
  }
};

// ================================================================
// DELETE ASSISTANT (Reset Configuration)
// Description: Reset assistant configuration to default
// ================================================================
export const resetAssistant = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Reset to default values
    user.assistantName = "Moto AI";
    user.businessName = "";
    user.businessType = "";
    user.businessDescription = "";
    user.tone = "friendly";
    user.theme = "dark";
    user.pages = [];
    user.isSetupComplete = false;
    user.geminiStatus = "pending";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Assistant reset successfully",
      user: user
    });

  } catch (error) {
    console.error("❌ Reset Assistant Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to reset assistant",
      error: error.message
    });
  }
};