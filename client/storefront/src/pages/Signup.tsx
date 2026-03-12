import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useGlobal } from '../hooks/useGlobal';
import { validEmail, validPassword } from '../utils/validate';
import { postRequest } from '../utils/fetch';

const Signup = () => {
  const navigate = useNavigate();
  const { showLoading, showMessage } = useGlobal();

  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [pwdErr, setPwdErr] = useState('');

  const createAccount = async () => {
    setEmailErr('');
    setPwdErr('');
    if (!validEmail(email)) setEmailErr('Invalid Email Input');
    if (!validPassword(password)) setPwdErr('Invalid Password Input');
    if (!validEmail(email) || !validPassword(password)) return;

    showLoading(true);
    try {
      await postRequest('/auth/register', { username: email.split('@')[0], email, password, role: 'Customer' });
      showLoading(false);
      showMessage('Account created! You can sign in now.', 'success');
      navigate('/signin');
    } catch (e) {
      showLoading(false);
      showMessage(String(e));
    }
  };

  return (
    <div className="bg-white shadow rounded w-11/12 max-w-lg max-h-9/10 overflow-y-auto flex flex-col items-center justify-center px-9">
      <h2 className="text-black-common text-2xl md:text-3xl font-bold pt-10 pb-7 text-center">Create a customer account</h2>
      <div className="flex flex-col w-full">
        <label className="text-base font-normal text-gray">Email</label>
        <input className="h-12 border border-solid border-gray-border rounded px-1.5 outline-0"
          value={email} onChange={(e) => { setEmail(e.target.value); }} />
        <span className="text-sm font-normal text-red text-right">{emailErr}</span>
      </div>
      <div className="flex flex-col w-full mt-2">
        <label className="text-base font-normal text-gray">Password</label>
        <div className="relative w-full">
          <input type={showPwd ? 'text' : 'password'}
            className="w-full h-12 border border-solid border-gray-border rounded pl-2.5 pr-12 outline-0"
            value={password} onChange={(e) => { setPassword(e.target.value); }} />
          <span className="absolute right-3 inset-y-1/4 text-sm font-normal text-gray underline cursor-pointer"
            onClick={() => { setShowPwd(!showPwd); }}>Show</span>
        </div>
        <span className="text-sm font-normal text-red text-right">{pwdErr}</span>
      </div>
      <button className="bg-blue text-white rounded w-full text-base font-semibold py-3 my-4" onClick={createAccount}>
        Create account
      </button>
      <p className="text-sm font-normal text-gray md:text-left text-center w-full pb-10">
        Already have an account?{' '}
        <Link className="font-medium text-sm text-blue underline" to="/signin">Sign in</Link>
      </p>
    </div>
  );
};

export default Signup;
