import ErrorHandler from "../middleware/error.middleware.js";
import { catchAsyncError } from "../middleware/catchAsyncError.middleware.js";
import { Users } from "../models/user.model.js";
import {
  forgotPasswordEmail,
  generateEmailTemplate,
} from "../utils/emailTemplate.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendOtpSms } from "../utils/sendSMS.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";

export const register = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, phone, password, verificationMethod } = req.body;
    if (!name || !email || !phone || !password || !verificationMethod) {
      return next(new ErrorHandler("All fields are reuired", 400));
    }
    function validatePhoneNumber(phone) {
      const phoneRegex = /^(?:\+91[\-\s]?)?[6-9]\d{9}$/;
      return phoneRegex.test(phone);
    }
    if (!validatePhoneNumber(phone)) {
      return next(new ErrorHandler("Invalid Phone Number", 400));
    }
    if (!["email", "phone"].includes(verificationMethod)) {
      return next(new ErrorHandler("Invalid verification method", 400));
    }
    const existingUser = await Users.findOne({
      $or: [
        {
          email,
          accountVerifed: true,
        },
        {
          email,
          accountVerifed: true,
        },
      ],
    });

    if (existingUser) {
      return next(new ErrorHandler("phone or Error already Used.", 400));
    }

    const registerationAttempt = await Users.find({
      $or: [
        { phone, accountVerifed: false },
        { email, accountVerifed: false },
      ],
    });

    if (registerationAttempt.length > 3) {
      return next(
        new ErrorHandler(
          "You have exceeded request limit. please try again after an Hour.",
          400
        )
      );
    }

    const userData = {
      name,
      email,
      password,
      phone,
    };

    const user = await Users.create(userData);
    const verificationCode = await user.generateVerificationCode();
    await user.save();
    sendVerificationCode(
      verificationMethod,
      verificationCode,
      name,
      email,
      phone,
      res
    );
  } catch (error) {
    next(error);
  }
});

async function sendVerificationCode(
  verificationMethod,
  verificationCode,
  name,
  email,
  phone,
  res
) {
  try {
    if (verificationMethod === "email") {
      const message = generateEmailTemplate(verificationCode, name);
      sendEmail({ email, subject: "Your verification Code", message });
      res.status(200).json({
        success: true,
        message: `Verification email successfully sent to ${name}`,
      });
    } else if (verificationMethod === "phone") {
      await sendOtpSms(phone, verificationCode);
      res.status(200).json({
        success: true,
        message: `OTP sent successfully to ${phone}`,
      });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Invalid verification method" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: " Verification code failed to send." });
  }
}

export const verifyOtp = catchAsyncError(async (req, res, next) => {
  const { email, phone, otp } = req.body;
  function validatePhoneNumber(phone) {
    const phoneRegex = /^(?:\+91[\-\s]?)?[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  }
  if (!validatePhoneNumber(phone)) {
    return next(new ErrorHandler("Invalid Phone Number", 400));
  }
  try {
    const userEntries = await Users.find({
      $or: [
        {
          email,
          accountVerifed: false,
        },
        {
          phone,
          accountVerifed: false,
        },
      ],
    }).sort({ createdAt: -1 });

    if (!userEntries) {
      return next(new ErrorHandler("User not Found", 400));
    }

    let user;
    if (userEntries.length > 1) {
      user = userEntries[0];

      await Users.deleteMany({
        _id: { $ne: user._id },
        $or: [
          { phone, accountVerifed: false },
          { email, accountVerifed: false },
        ],
      });
    } else {
      user = userEntries[0];
    }

    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP", 400));
    }

    const currentTime = Date.now();
    const verificationCodeExpire = new Date(
      user.verificationCodeExpire
    ).getTime();

    console.log(currentTime);
    console.log(verificationCodeExpire);

    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP Expired", 400));
    }

    user.accountVerifed = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });

    sendToken(user, 202, "Account verified successfully", res);
  } catch (error) {
    return next(new ErrorHandler("Internal server error", 500));
  }
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("All Fields are required", 400));
  }

  const user = await Users.findOne({ email, accountVerifed: true }).select(
    "+password"
  );
  if (!user) {
    return next(new ErrorHandler("Invalid email or password"), 400);
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  sendToken(user, 202, "user logged in successfully", res);
});

export const logout = catchAsyncError(async (req, res, next) => {
  const cookieOptions = {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res
    .status(200)
    .cookie("token", "", cookieOptions)
    .json({
      success: true,
      message: "user logout successfully",
    });
});

export const getuser = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({ success: true, user: user });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await Users.findOne({
    email: req.body.email,
    accountVerifed: true,
  });
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = forgotPasswordEmail(resetPasswordUrl, user.name);

  try {
    sendEmail({
      email: user.email,
      subject: "MERN Authentication App reset password",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new ErrorHandler(
        error.message ? error.message : "cannot send reset password token.",
        500
      )
    );
  }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await Users.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password is not Matched", 400)
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user,200,"Reset password successfully",res);
});

