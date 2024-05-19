import path from "path";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import Handlebars from "handlebars";
import dotenv from "dotenv";
dotenv.config();

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve("./views"),
    defaultLayout: false,
    helpers: {
      psplit: function (plaintext) {
        var i,
          output = "",
          lines = plaintext.split(/\r\n|\r|\n/g);
        for (i = 0; i < lines.length; i++) {
          if (lines[i]) {
            output += "<p>" + lines[i] + "</p>";
          }
        }
        return new Handlebars.SafeString(output);
      },
    },
  },
  viewPath: path.resolve("./views"),
  extName: ".handlebars",
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

transporter.use("compile", hbs(handlebarOptions));

export const sendOtpEmail = async ({ name, email, otp }) => {
  const info = await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Login Request - SC portal",
    template: "otpTemplate",
    context: {
      name,
      otp,
      link:
        process.env.DEPLOYMENT === "LOCAL"
          ? "http://localhost:3000"
          : "www.google.com",
    },
    attachments: [
      {
        filename: "MITLogo.jpg",
        path: __dirname + "/images/MITLogo.jpg",
        cid: "MIT",
      },
      {
        filename: "SCLogo.png",
        path: __dirname + "/images/SCLogo.png",
        cid: "SC",
      },
    ],
  });
};

export const sendNotificationMail = async ({
  email,
  requestId,
  clubName,
  room,
  building,
  name,
}) => {
  const info = await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Room Request - Requires Approval ",
    template: "notification",
    context: {
      name,
      link: `http://localhost:3000/room-request/${requestId}`,
      clubName,
      room,
      building,
    },
    attachments: [
      {
        filename: "MITLogo.jpg",
        path: __dirname + "/images/MITLogo.jpg",
        cid: "MIT",
      },
      {
        filename: "SCLogo.png",
        path: __dirname + "/images/SCLogo.png",
        cid: "SC",
      },
    ],
  });
};

export const roomApprovedMail = async ({
  email,
  requestId,
  room,
  building,
  name,
}) => {
  console.log(room);
  const info = await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Room Request - Approved ",
    template: "approval",
    context: {
      clubName: name,
      link: `http://localhost:3000/room-request/${requestId}`,
      room,
      building,
    },
    attachments: [
      {
        filename: "MITLogo.jpg",
        path: __dirname + "/images/MITLogo.jpg",
        cid: "MIT",
      },
      {
        filename: "SCLogo.png",
        path: __dirname + "/images/SCLogo.png",
        cid: "SC",
      },
    ],
  });
};

export const roomDeclinedMail = async ({
  email,
  requestId,
  room,
  building,
  name,
}) => {
  const info = await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Room Request - Declined",
    template: "decline",
    context: {
      clubName: name,
      link: `http://localhost:3000/room-request/${requestId}`,
      room,
      building,
    },
    attachments: [
      {
        filename: "MITLogo.jpg",
        path: __dirname + "/images/MITLogo.jpg",
        cid: "MIT",
      },
      {
        filename: "SCLogo.png",
        path: __dirname + "/images/SCLogo.png",
        cid: "SC",
      },
    ],
  });
};
