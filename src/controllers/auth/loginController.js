import { User } from "../../models/userModel.js";
import { RefreshToken } from "../../models/refreshToken.js";
import JwtService from "../../services/JWTService.js";
import bcrypt from "bcrypt";

const loginController = {
  async login(req, res, next) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        res.status(401).json({ success: false, message: "Wrong Credentials" });
      }
      // compare the password
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        res.status(401).json({ success: false, message: "Wrong Credentials" });
      }

      // Token
      const access_token = JwtService.sign({ _id: user._id,});
      const refresh_token = JwtService.sign(
        { _id: user._id, },
        "1y",
        process.env.REFRESH_SECRET
      );
      // database whitelist
      await RefreshToken.create({ token: refresh_token });
      res.json({ access_token, refresh_token });
    } catch (err) {
      return next(err);
    }
  },
  async logout(req, res, next) {
    try {
      await RefreshToken.deleteOne({ token: req.body.refresh_token });
    } catch (err) {
      return next(new Error("Something went wrong in the database"));
    }
    res.json({ status: 1 });
  },
};

export default loginController;
