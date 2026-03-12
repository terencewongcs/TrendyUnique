import Cart, { CMethods } from './Cart';
import { useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import Search from './Search';

const Header = () => {
  const user = useAppSelector((state) => state.user);
  const cartCount = useAppSelector((state) => state.cart.totalProducts);
  const cartPrice = useAppSelector((state) => state.cart.carts.totalPrice);
  const cartRef = useRef<CMethods>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCart = () => {
    if (!user.token) {
      navigate('/signin');
    } else if (cartRef.current) {
      cartRef.current.toggle();
    }
  };

  const doSignOut = () => {
    localStorage.clear();
    window.location.href = '/signin';
  };

  return (
    <>
      <header className="bg-black-common pb-2.5 lg:pb-0">
        <nav className="flex justify-between items-center w-full lg:px-12 px-6 py-2">
          <div className="flex items-center">
            <h1 className="text-3xl text-white font-bold cursor-pointer" onClick={() => { navigate('/'); }}>
              TrendyUnique
            </h1>
            {location.pathname === '/' && <Search className="hidden lg:block" />}
          </div>
          <div className="flex items-center gap-4">
            {user.token && (
              <Link to="/orders" className="text-white text-sm font-medium hover:underline">My Orders</Link>
            )}
            <span className="text-white cursor-pointer text-base font-semibold"
              onClick={() => { user.token ? doSignOut() : navigate('/signin'); }}>
              {user.token ? 'Sign Out' : 'Sign In'}
            </span>
            <div className="relative cursor-pointer" onClick={toggleCart}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                className="w-8 h-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              <div className="absolute -top-1 -right-1 bg-red text-white text-xs font-medium size-4 rounded-circle text-center leading-4">
                {cartCount}
              </div>
            </div>
            <span className="text-white text-base font-semibold">${cartPrice.toFixed(2)}</span>
          </div>
        </nav>
        {location.pathname === '/' && <Search className="lg:hidden" />}
      </header>
      <Cart ref={cartRef} />
    </>
  );
};

export default Header;
