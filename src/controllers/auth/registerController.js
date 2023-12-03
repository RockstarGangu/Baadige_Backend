import bcrypt from "bcrypt";
import { User } from "../../models/userModel.js";
import { RefreshToken } from "../../models/refreshToken.js";
import JwtService from "../../services/JWTService.js";

const registerController = {
  async register(req, res, next) {
    // check if user is in the database already
    try {
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        res
          .status(500)
          .json({ success: "fail", message: "User already exists" });
      }
    } catch (err) {
      return next(err);
    }
    const { firstName, lastName, email, password, avatar } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // prepare the model

    const user = new User({
      firstName,
      lastName,
      email,
      avatar,
      password: hashedPassword,
    });

    let access_token;
    let refresh_token;
    try {
      const result = await user.save();

      // Token
      access_token = JwtService.sign({ _id: result._id });
      refresh_token = JwtService.sign(
        { _id: result._id },
        "1y",
        process.env.REFRESH_SECRET
      );
      // database whitelist
      await RefreshToken.create({ token: refresh_token });
    } catch (err) {
      return next(err);
    }

    res.json({ access_token, refresh_token });
  },
};

export default registerController;
