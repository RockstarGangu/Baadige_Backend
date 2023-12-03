import { User } from "../../models/userModel.js";

const userController = {
    async me(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.user._id }).select('-password -updatedAt -__v');
            if (!user) {
                res.status(404).json({success:false,message:"User not found!"});
            }
            res.json(user);
        } catch(err) {
           return next(err);
        }
    }
};

export default userController;