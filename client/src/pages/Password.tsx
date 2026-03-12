import { useNavigate } from "react-router-dom";
import {useState} from "react";
import { validEmail } from "../utils/validate.ts";

const Password = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const updatePwd = () => {
    if (validEmail(email)) {
      setErrorMsg('');
      navigate("/email");
    } else {
      setErrorMsg('Invalid Email Input');
    }
  };

  return (
    <div className="bg-white shadow rounded w-11/12 max-w-lg max-h-9/10 overflow-y-auto flex flex-col items-center justify-center px-9">
      <h2 className="text-black-common text-2xl md:text-3xl font-bold pt-10 pb-8 text-center">Update your password</h2>
      <p className="text-xs md:text-sm font-normal text-gray text-center mb-6">Enter your email link, we will send you the recovery link</p>
      <div className="flex flex-col w-full">
        <label className="text-base font-normal text-gray">Email</label>
        <input className="h-12 border border-solid border-gray-border rounded px-1.5 outline-0"
               value={email}
               onChange={(e) => {setEmail(e.target.value)}}/>
        <span className="text-sm font-normal text-red text-right">{errorMsg}</span>
      </div>
      <button className="bg-blue text-white rounded w-full text-base font-semibold py-3 mt-4 mb-10" onClick={updatePwd}>Update password</button>
    </div>
  )
}

export default Password;
