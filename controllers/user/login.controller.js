import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";
import { User } from "../../models/userModel/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

export const loginController = async (req, res) => {
    try {
      const { userId, password } = req.body;
      if (!userId || !password) {
        return res
          .status(e.BAD_REQUEST.code)
          .json({ message: "Empty fields are not allowed!", success: false });
      }
      const user = await User.findOne({ userId });
      if (!user) {
        console.log(res)
        return res.status(e.BAD_REQUEST.code).json({
          message: "No user found with this userId.",
          success: false,
        });
      }
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return res.status(e.BAD_REQUEST.code).json({
          message: "Incorrect password!",
          success: false,
        });
      }
      const token = jwt.sign(
        { userId: user._id, userName: user.userName },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );
      return res.status(e.OK.code).json({
        message: "Login success!",
        token,
        success: true,
      });
    } catch (error) {
      console.log(error);
    }
  };
  