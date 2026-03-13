import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { doLogin } from '../app/slice/user';
import { useState, useEffect } from 'react';
import { validEmail, validPassword } from '../utils/validate';
import { useGlobal } from '../hooks/useGlobal';

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const { showLoading, showMessage } = useGlobal();

  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [pwdErr, setPwdErr] = useState('');

  useEffect(() => {
    if (user.token && user.role === 'Admin') navigate('/products', { replace: true });
  }, []);

  const login = async () => {
    setEmailErr('');
    setPwdErr('');
    if (!validEmail(email)) setEmailErr('Invalid Email Input');
    if (!validPassword(password)) setPwdErr('Invalid Password Input');
    if (!validEmail(email) || !validPassword(password)) return;

    showLoading(true);
    try {
      const info = await dispatch(doLogin({ email, password }));
      showLoading(false);
      if (info.role !== 'Admin') {
        localStorage.clear();
        showMessage('This portal is for admins only');
        return;
      }
      navigate('/products');
    } catch (e) {
      showLoading(false);
      showMessage(String(e));
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-bg/20">
      <div className="bg-white shadow rounded w-11/12 max-w-md flex flex-col items-center px-9 py-10">
        <h2 className="text-black-common text-2xl md:text-3xl font-bold pb-8 text-center">Admin Sign In</h2>
        <div className="flex flex-col w-full">
          <label className="text-base font-normal text-gray">Email</label>
          <input className="h-12 border border-solid border-gray-border rounded px-1.5 outline-0"
            value={email} onChange={(e) => { setEmail(e.target.value); }} />
          <span className="text-sm font-normal text-red text-right">{emailErr}</span>
        </div>
        <div className="flex flex-col w-full mt-2.5">
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
        <button className="bg-blue text-white rounded w-full text-base font-semibold py-3 my-4" onClick={login}>
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Signin;
