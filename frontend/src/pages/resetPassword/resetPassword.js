const passwordReset = () => {
  <>
    <div className="h-screen w-full flex justify-center items-center">
      <form action="">
        <label htmlFor="">Type new Password</label>
        <input type="password" id="newPassword" />
        <label htmlFor="">Confirm new Password</label>
        <input type="password" id="confirmPassword" />
        <button>Reset Password</button>
      </form>
    </div>
  </>;
};

export default passwordReset;
