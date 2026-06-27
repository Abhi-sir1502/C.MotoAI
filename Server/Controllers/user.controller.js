import User from "../Models/user.model.js";

export const getCurrentUser = async (req, res) => {
   try {
      // req.userId middleware se sahi salaamat aa raha hai
      const user = await User.findById(req.userId); 
      
      if (!user) {
        // CHANGE: 404 par clear message ki user DB me nahi mila
        return res.status(404).json({ message: "User not found in database" });
      }
      
      return res.status(200).json(user);
   } catch (error) {
      return res.status(500).json(`{ message: getCurrentUser error ${error.message} }`); 
   }
};

export const saveAssistant = async (req,res) => {
  try {
        const {
         assistantName ,
         businessName ,
         businessType ,
         businessDescription ,
         tone ,
         theme ,
         geminiApikey ,
         pages ,
        } = req.body 

         const user = await User.findById(req.userId) 
         if(!user) {
            return res.status(404).json({message:"Failed to get current user"})
         }
          
          user.assistantName = assistantName;
          user.businessName = businessName;
          user.businessType = businessType;
          user.businessDescription = businessDescription;
          user.tone = tone;
          user.theme = theme;

          if(geminiApikey) {
            user.geminiApiKey = geminiApikey;
          }

          user.geminiStatus = "active";
          user.pages = pages || [];

          user.isSetupComplete = true
          await user.save()

          return res.status(200).json({message:"Assistant saved successfully" , user ,})

  } catch (error) {
     return res.status(500).json(`{message: failed to save Assistant ${error}}`)
   
  }

}