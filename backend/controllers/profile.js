const User = require('../models/users');

//FETCHING USER PROFILE
const getProfile =async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findOne(id).select("-password");

        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json({message:"Profile Fetched successfully", user})
    } catch (error) {
        res.status(500).json({message:"Error while fetching User Profile", error:error.message})
    }
}

//UPDATING USER PROFILE
const updateProfile = async (req, res) => {
    const id = req.params.id;
    try {
        console.log("BODY:", req.body);

    console.log("USER:", req.params);

        const { email, name, bio, course, graduationYear, company, position } = req.body;

         const user = await User.findOneAndUpdate({email:email},
             
                {
        name: req.body.name,
        email: req.body.email,
        bio: req.body.bio,
        course: req.body.course,
        graduationYear: req.body.graduationYear,
        company: req.body.company,
        position: req.body.position
      },
      {
         new: true,
        runValidators: true
      }
         );
         if(!user){
            return res.status(404).json({message:"User not found"})
         }
         res.status(200).json({message:"Profile Updated successfully", result: user})
         
    } catch (error) {
        res.status(500).json({
            message:"Error while updating User Profile", error:error.message
        })
    }
}
module.exports = {getProfile, updateProfile};