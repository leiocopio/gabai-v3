import React, { useState} from "react";
import Popup from "reactjs-popup";
/* import ProfileSettings from "../ProfileSettings"; */
import { Link } from "react-router-dom";

//AuthContext provider
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom"


import UserProfile from "./user/UserProfile.js";
import { IoMdArrowDropdownCircle } from "react-icons/io";



const ProfileDropdown = () => {

const navigate = useNavigate()

const handleLogout = () => {
    // Remove user from local storage
    localStorage.removeItem("user");
    localStorage.setItem("hasShownToast", "false");
    // Dispatch logout action
    dispatch({ type: "LOGOUT" });
    navigate('/')
  };

const { user, dispatch } = useAuthContext();

  const email = user ? user.email : null;
  const firstname = user ? user.firstname : null;
  const lastname = user ? user.lastname : null;
  const themes = "Themes";
  
  const options = "flex flex-row justify-between w-full p-1 px-4 hover:bg-azure-50 hover:bg-opacity-20 cursor-pointer"
  const icon = "text-xl";
  const button = "flex h-10 w-full px-3 py-2 bg-azure text-white rounded-md justify-center items-center text-sm"

  return (
    <>
      <Popup
        trigger={
          <button className="bg-gray-300 rounded-full h-[2rem] w-[2rem] flex items-center justify-center">
          </button>
        }
        modal
        nested
        
      >
        {(close) => (
          <div className="fixed z-50 top-0 right-0 flex translate-y-[3.3rem] translate-x-[-1rem]">
            <div className="modal relative h-auto w-64 border rounded-2xl bg-white flex flex-col py-3 shadow-lg">

                <div className="w-full h-full flex flex-col text-sm font-normal">
                    <div className="flex w-full p-1 px-4 text-base">
                      { firstname } { lastname }
                    </div>

                    <div className="flex w-full p-1 px-4 font-medium">
                        { email }
                    </div>
                    <div className="w-full p-[0.5rem] px-4">
                        <div className="border-t-2"></div>
                    </div>
                    <div className={options}>
                        {themes}
                        <IoMdArrowDropdownCircle className={icon}/>
                    </div>
                    <div className="w-full p-[0.5rem] px-4">
                        <div className="border-t-2"></div>
                    </div>
                    <div>
                        <UserProfile />
                        
                    </div>
                    <div className="w-full p-[0.5rem] px-4">
                        <div className="border-t-2"></div>
                    </div >
                    <div className={options}>
                        <button className={button} onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div> {/*  main modal */}
          </div>

        )}
      </Popup>
    </>
  );
};

export default ProfileDropdown;
