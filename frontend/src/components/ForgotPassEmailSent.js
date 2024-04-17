import Popup from "reactjs-popup";

const EmailSent = (props) => {
  // Add props as an argument here
  return (
    <Popup
      trigger={
        <button
          className="w-[20%] bg-azure-500 text-white font-bold rounded-xl p-2"
          onClick={props.onClick} // Now props is defined and can be used
        >
          Send
        </button>
      }
      modal
      nested
    >
      {(close) => (
        <>
          <h1>Email Sent to your email address. Check your email.</h1>

          <button
            className="w-[20%] bg-azure-500 text-white font-bold rounded-xl p-2"
            onClick={() => close()}
          >
            Okay
          </button>
        </>
      )}
    </Popup>
  );
};

export default EmailSent;
