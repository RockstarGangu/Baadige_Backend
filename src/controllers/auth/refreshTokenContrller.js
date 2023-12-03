import JwtService from "../../services/JWTService.js";
import { User } from "../../models/userModel.js";
import { RefreshToken } from "../../models/refreshToken.js";

const refreshController = {
  async refresh(req, res, next) {
    // database
    let refreshtoken;
    try {
      refreshtoken = await RefreshToken.findOne({
        token: req.body.refresh_token,
      });
      if (!refreshtoken) {
        res.status(401).json({ success: false, message: "Invalid Token" });
      }

      let userId;
      try {
        const { _id } = await JwtService.verify(
          refreshtoken.token,
          REFRESH_SECRET
        );
        userId = _id;
      } catch (err) {
        res
          .status(401)
          .json({ success: false, message: "Invalid RefreshToken" });
      }

      const user = await User.findOne({ _id: userId });
      if (!user) {
        res.status(404).json({ success: false, message: "Invalid Token" });
      }

      // tokens
      // Toekn
      const access_token = JwtService.sign({ _id: user._id, role: user.role });
      const refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        process.env.REFRESH_SECRET
      );
      // database whitelist
      await RefreshToken.create({ token: refresh_token });
      res.json({ access_token, refresh_token });
    } catch (err) {
      return next(new Error("Something went wrong " + err.message));
    }
  },
};

export default refreshController;
