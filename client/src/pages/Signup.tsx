import { useNavigate, Link } from "react-router-dom";
import {useState} from "react";
import { useGlobal } from "../hooks/useGlobal";
import {validEmail, validPassword} from "../utils/validate.ts";
import { postRequest } from "../utils/fetch.ts";

const roles: string[] = ["Customer", "Vendor"];

const Signup = () => {
  const navigate = useNavigate();
  const { showLoading, showMessage } = useGlobal();

  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [pwdErr, setPwdErr] = useState('');

  const createAccount = async () => {
    setEmailErr('');
    setPwdErr('');

    if (!validEmail(email) || !validPassword(password)) {
      if (!validEmail(email)) setEmailErr('Invalid Email Input');
      if (!validPassword(password)) setPwdErr('Invalid Password Input');
      return;
    }

    showLoading(true);
    const params = {
      username: 'test',
      email: email,
      password: password,
      role: selectedRole
    };

    try {
      await postRequest('/auth/register', params);
      showLoading(false);
      showMessage('Sign Up successfully, you can login right now', 'success');
      navigate("/signin");
    } catch (e) {
      const err: string = String(e);
      showLoading(false);
      showMessage(err);
    }
  };

  return (
    <div className="bg-white shadow rounded w-11/12 max-w-lg max-h-9/10 overflow-y-auto flex flex-col items-center justify-center px-9">
      <h2 className="text-black-common text-2xl md:text-3xl font-bold pt-10 pb-7 text-center">Sign up an account</h2>
      <div className="flex flex-col w-full">
        <label className="text-base font-normal text-gray">Email</label>
        <input className="h-12 border border-solid border-gray-border rounded px-1.5 outline-0"
               value={email} onChange={(e) => {setEmail(e.target.value)}}/>
        <span className="text-sm font-normal text-red text-right">{emailErr}</span>
      </div>
      <div className="flex flex-col w-full mt-2">
        <label className="text-base font-normal text-gray">Password</label>
        <div className="relative w-full">
          <input type={showPwd ? "text" : "password"}
                 className="w-full h-12 border border-solid border-gray-border rounded pl-2.5 pr-12 outline-0"
                 value={password} onChange={(e) => {setPassword(e.target.value)}}/>
          <span className="absolute right-3 inset-y-1/4 text-sm font-normal text-gray underline cursor-pointer"
                onClick={() => {setShowPwd(!showPwd)}}>Show</span>
        </div>
        <span className="text-sm font-normal text-red text-right">{pwdErr}</span>
      </div>
      <div className="w-full mt-2">
        <label className="text-base font-normal text-gray">Role</label>
        {
          roles.map((item) => (
            <label key={item} className="ml-4 cursor-pointer text-base">
              <input type="radio" checked={item === selectedRole} onChange={() => {setSelectedRole(item)}}/>
              {item}
            </label>
          ))
        }
      </div>
      <button className="bg-blue text-white rounded w-full text-base font-semibold py-3 my-4" onClick={createAccount}>Create account</button>
      <p className="text-sm font-normal text-gray md:text-left text-center w-full pb-10">
        Already have an account?
        <Link className="font-medium text-sm text-blue underline" to="/signin">Sign in</Link>
      </p>
    </div>
  )
}

export default Signup;
