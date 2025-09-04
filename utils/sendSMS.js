import client from "../config/twilio.js";

export const sendOtpSms = async (phone, code) => {
  try {
    const verificationNumber = code.toString().split("").join(" ");

    const message = await client.messages.create({
      body: `Your verification code from Navneet is: ${verificationNumber}`,
      from: process.env.TWILIO_PHONE_NUMBER, 
      to: phone, 
    });

    console.log("SMS sent:", message.sid);
    return message.sid;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
};
