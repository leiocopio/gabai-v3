/**
 * This code imports various dependencies and hooks used in the Login component of the application.
 * It includes imports for React, React Router, Popup, icons, custom hooks, and Google login functionality.
 * The code also imports utility functions like `jwtDecode` and `isEmpty`.
 */
import { useState, useEffect, React } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { isEmpty } from "lodash";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ForgotPass from "./ForgotPass";
import Popup from "reactjs-popup";
import Signup from "./Signup";
import { useLogin } from "../hooks/useLogin";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = ({ setLoginSuccess }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const { login, error, isLoading } = useLogin();
  const navigate = useNavigate();

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(identifier, password);
  };

  const handleGoogleLoginSuccess = async (response) => {
    const decode = jwtDecode(response.credential);
    const GoogleEmail = decode.email;

    if (identifier !== GoogleEmail) {
      alert("You need to Sign Up first");

      return <Signup />;
    } else {
      handleSubmit();
    }
  };

  const handleGoogleLoginError = (error) => {
    console.log(error);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      const inputs = Array.from(event.target.form.elements);
      const currentIndex = inputs.indexOf(event.target);
      const nextIndex = currentIndex + 1;

      if (nextIndex < inputs.length) {
        inputs[nextIndex].focus();
      }
    }
  };

  const label = "block font-normal text-sm";
  const warning = "block font-normal text-sm text-red-500 error mt-1";
  const input =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const button =
    "flex h-10 px-3 py-2 bg-azure text-white rounded-md justify-center items-center w-full text-sm";

  return (
    <Popup
      trigger={
        <button className="rounded-xl p-4 py-1.5 bg-azure-500 text-white hover:scale-[1.1] transition-all duration-100 ease-in-out relative z-10 after:absolute after:-z-20  after:h-1 after:w-1 after:bg-azure-300 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md after:hover:scale-[50] after:hover:transition-all after:hover:duration-650 after:transition-all after:duration-300">
          Log in
        </button>
      }
      modal
      nested
    >
      {(close) => (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 backdrop-filter backdrop-blur-lg bg-opacity-25 bg-black ">
          <div className="modal relative h-auto w-[70%] sm:w-[55%] md:w-[50%] lg:w-[45%] xl:w-[35%] rounded-2xl bg-white flex flex-col pt-7 py-10 p-3">
            <div className="absolute flex align-center p-1 inset-y-0 right-0">
              <IoIosCloseCircleOutline
                className="text-3xl cursor-pointer"
                onClick={() => close()}
              />
            </div>
            <div className="w-full h-full flex flex-col-1 justify-center px-4">
              <div className="w-full h-full grid grid-cols-1 gap-4">
                <div className="flex flex-col items-center justify-center">
                  <h1 className="font-bold text-3xl m-0">
                    Log in to <span className="text-azure">GabAi</span>
                  </h1>
                  <p className={label}>Empower your workplace today!</p>
                </div>

                <div className="w-full h-full flex flex-col-1">
                  <form
                    onSubmit={handleSubmit}
                    className="w-full h-full grid grid-cols-1 gap-3"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <input
                        type="text"
                        id="identifier"
                        name="identifier"
                        placeholder="Email or Username"
                        onChange={(e) => setIdentifier(e.target.value)}
                        value={identifier}
                        className={input}
                        onKeyDown={handleKeyDown}
                      />
                      <div className="relative w-full flex items-center">
                        <input
                          type={type}
                          id="password"
                          name="password"
                          placeholder="Password"
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                          value={password}
                          className={input}
                          onKeyDown={handleKeyDown}
                        />
                        <span
                          className="absolute inset-y-0 right-0 flex items-center justify-end mx-5"
                          onClick={handleToggle}
                        >
                          <Icon class="" icon={icon} size={15} />
                        </span>
                      </div>
                      {error && <span className={warning}>{error}</span>}
                    </div>

                    <div className="flex flex-col w-full items-center justify-center gap-3">
                      <div className="flex flex-col w-full">
                        <button
                          disabled={isLoading}
                          type="submit"
                          className={button}
                        >
                          Log In
                        </button>
                        <br />
                        <div className="w-full text-center">
                          <GoogleLogin
                            clientId={clientId}
                            onSuccess={handleGoogleLoginSuccess}
                            onFailure={handleGoogleLoginError}
                          />
                        </div>
                      </div>
                      <div className="items-center justify-center font-normal text-sm underline hover:text-azure">
                        <ForgotPass />
                      </div>
                      {/* Testing */}
                    </div>
                  </form>
                </div>
                <div className="flex items-center justify-center">
                  <p className={label}>
                    Don't have an account? <Signup />
                    {/* <SignupAdminAndLawyer /> */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default Login;
