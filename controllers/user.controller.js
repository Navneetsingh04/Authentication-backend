import ErrorHandler from "../middleware/error.middleware.js";
import { catchAsyncError } from "../middleware/catchAsyncError.middleware.js";
import { Users } from "../models/user.model.js";
import { generateEmailTemplate } from "../utils/emailTemplate.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendOtpSms } from "../utils/sendSMS.js";

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
      const message = generateEmailTemplate(verificationCode,name);
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
