import React, { useEffect, useState } from "react";
import MITLogo from "../assets/MITLogo.jpg";
import SCLogo from "../assets/SCLogo.png";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { sendOTP, otpSent, otpLoading, user, login } = useAppContext();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(""); // Storing OTP as a single string
  const [time, setTime] = useState(0);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  useEffect(() => {
    if (time !== undefined && time > 0) {
      const intervalId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(intervalId);
            return undefined;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [time]);

  const handleSendOtp = async () => {
    if (otpLoading) return;
    await sendOTP(email);
    setTime(120);
  };

  const handleResendOtp = async () => {
    if (otpLoading) return;
    await sendOTP(email);
    setTime(120);
  };

  const handleLogin = () => {
    login(email, otp);
  };

  const handleOtpChange = async (e) => {
    const i1 = e.target.value;
    const i2 = i1.replace(/\D/g, "");
    if (e.nativeEvent.inputType === "deleteContentBackward") {
      console.log("backspace");
    }
    setOtp((prevOtp) => {
      let newOtp = prevOtp + i2;
      newOtp = newOtp.slice(0, 4);
      return newOtp;
    });
  };

  useEffect(() => {
    const signInButton = document.getElementById("sign-in-btn");
    if (signInButton) {
      if (otp.length === 4) {
        signInButton.focus();
      } else {
        const otpElement = document.getElementById(`otp-${otp.length}`);
        if (otpElement) {
          otpElement.focus();
        }
      }
    }
  }, [otp]);

  if (user) {
    if (user.role === "admin") {
      navigate("/admin");
    }
    if (user.role === "swo") {
      navigate("/swo");
    }
    if (user.role === "club" || !user.role) {
      navigate("/club");
    }
    if (user.role === "fa") {
      navigate("/fa");
    }
    if (user.role === "sc") {
      navigate("/sc");
    }
    if (user.role === "security") {
      navigate("/security");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-grey px-10">
      <div className="shadow-md bg-white rounded-md">
        <div className="w-full p-8 bg-secondary-dark">
          <center>
            <div className="flex items-center justify-center">
              <h1 className="text-2xl font-bold mb-2 inline mr-2">Login</h1>
              <img
                className="h-10 w-auto inline mb-3"
                alt="sc logo"
                src={SCLogo}
              />
            </div>
            <hr className="border-secondary border-2 w-20 mb-3 rounded-md"></hr>
          </center>
          <div className="flex justify-center mb-8">
            <img
              className="h-16 w-auto fill-current text-white"
              src={MITLogo}
              alt="MIT Logo"
            />
          </div>

          {!otpSent ? (
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-dark"
                >
                  Email address
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-3 pr-3 py-2 border-0 rounded-md text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary bg-primary-dark"
                  />
                </div>
              </div>

              <div>
                <button
                  disabled={otpLoading}
                  type="button"
                  onClick={handleSendOtp}
                  className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold leading-6 text-dark shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Send OTP
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="flex justify-center">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    className="w-12 h-12 text-3xl border-solid border border-primary-dark rounded mx-1 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary bg-primary-light"
                    value={otp[index] || ""}
                    onChange={(e) => {
                      handleOtpChange(e);
                    }}
                    onKeyDown={(e) => {
                      if (e.code === "Backspace") {
                        setOtp((prevOtp) => {
                          const newOtp = prevOtp.slice(0, -1);
                          return newOtp;
                        });
                      }
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  id="sign-in-btn"
                  type="submit"
                  onClick={handleLogin}
                  className={`flex w-full justify-center rounded-md bg-primary mr-10 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm ${
                    otp.length !== 4
                      ? "cursor-not-allowed"
                      : "hover:bg-primaryLight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  }`}
                  disabled={otp.length !== 4 || otpLoading}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={time !== 0 || otpLoading}
                  className={`flex w-full justify-center rounded-md bg-dark px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm ${
                    time !== 0
                      ? "cursor-not-allowed"
                      : "hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
                  }`}
                >
                  Resend OTP {time !== 0 && `in ${formatTime(time)}`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
