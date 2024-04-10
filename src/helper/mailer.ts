import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "@/models/userModels";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    //Todo: Configure mail for usage
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      const updatedUser = await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    } else if (emailType === "RESET") {
      await User.findOneAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "afbdf3a9e8bd7c",
        pass: "b654c307c76084",
      },
    });

    const mailOptions = {
      from: "arwayush.ai", // sender address
      to: email, // receiver
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your Password",
      // Subject line
      text: "Hello world?", // plain text body
      html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail ? token=${hashedToken}"> here</a> to $ {emailType === "VERIFY" ? "verify your email" : "reset your password"} or  copy paste the below ink below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`, // html body
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
