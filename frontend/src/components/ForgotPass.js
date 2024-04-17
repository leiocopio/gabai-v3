import { useState, useRef } from "react";
import Popup from "reactjs-popup";
import { IoIosCloseCircleOutline } from "react-icons/io";
import emailjs from "@emailjs/browser";
import EmailSent from "./ForgotPassEmailSent";
const ForgotPass = () => {
  const serviceID = "service_idpyyi8";
  const templateID = "template_gi60vrx";
  const publicKey = "S0zwmDAzJA5qLK22e";
  const [email, setEmail] = useState("");

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(serviceID, templateID, form.current, {
        publicKey: publicKey,
      })
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    <Popup
      trigger={<button onClick={() => close()}> Forgot Password</button>}
      modal
      nested
    >
      {(close) => (
        <div className="modal h-[23rem] w-[31.00rem] rounded-2xl bg-white flex flex-col mx-10 self-center justify-center">
          <div className="flex flex-row align-center justify-end p-1">
            <IoIosCloseCircleOutline
              className="text-3xl cursor-pointer"
              onClick={close}
            />
          </div>
          <span className="items-center justify-center font-normal text-xs underline">
            <h1>Forgot Password</h1>
          </span>
          <br />
          <form
            ref={form}
            onSubmit={sendEmail}
            className="flex flex-col mx-2 gap-2"
          >
            <div className="flex flex-row gap-2 ">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[25rem] border-2 border-black rounded-xl p-2"
                required
              />
              <EmailSent onClick={sendEmail} />
            </div>
          </form>
        </div>
      )}
    </Popup>
  );
};

export default ForgotPass;
