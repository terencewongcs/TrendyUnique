import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import { useAppSelector } from '../app/hooks';

const App = () => {
  const navigate = useNavigate();
  const showLoading = useAppSelector((state) => state.global.isLoading);
  const showToast = useAppSelector((state) => state.global.showMessage);
  const msg = useAppSelector((state) => state.global.messageText);
  const msgType = useAppSelector((state) => state.global.messageType);

  const doSignOut = () => {
    localStorage.clear();
    window.location.href = '/signin';
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium px-3 py-1.5 rounded transition ${isActive ? 'bg-white text-blue' : 'text-white hover:bg-white/20'}`;

  return (
    <>
      <div className="w-full h-full flex flex-col overflow-hidden">
        <header className="bg-black-common px-6 py-3 flex justify-between items-center shrink-0">
          <h1 className="text-white text-xl font-bold cursor-pointer" onClick={() => { navigate('/products'); }}>
            Vendor Admin
          </h1>
          <nav className="flex items-center gap-2">
            <NavLink to="/products" className={navClass}>Products</NavLink>
            <NavLink to="/orders" className={navClass}>Orders</NavLink>
            <button onClick={doSignOut}
              className="text-sm font-medium text-white ml-4 underline cursor-pointer">
              Sign Out
            </button>
          </nav>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      {showLoading && <Loading />}
      {showToast && <Toast msg={msg} type={msgType} />}
    </>
  );
};

export default App;
