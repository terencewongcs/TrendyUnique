import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import {useState, useImperativeHandle, forwardRef, useEffect} from 'react';
import {fetchCart, deleteOneFromCart} from "../app/slice/cart.ts";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import AddToCart from "./AddToCart.tsx";
import {useGlobal} from "../hooks/useGlobal.tsx";

const taxRate: number = 0.1;
const coupon: Map<string, number> = new Map();
coupon.set('20OFF', 20);
coupon.set('30OFF', 30);
coupon.set('100OFF', 100);

export interface CMethods {
  toggle: () => void
}

const Cart = forwardRef<CMethods>(function Cart(_props, ref) {
  const { showLoading, showMessage } = useGlobal();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const cartList = useAppSelector((state) => state.cart.carts);
  const totalProducts = useAppSelector((state) => state.cart.totalProducts);

  const [disCount, setDisCount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => {
    return {toggle};
  });

  useEffect(() => {
    if (user.token && (user.role === 'Customer' || user.role === 'Admin'))
      dispatch(fetchCart()).catch((e: unknown) => {console.log(e)})
  }, []);

  const toggle = (): void => {
    setIsOpen(val => !val);
  };

  const removeProduct = (productId: string) => {
    showLoading(true);
    dispatch(deleteOneFromCart(productId))
      .catch((e: unknown) => {showMessage(String(e))})
      .finally(() => {showLoading(false);});
  };

  const applyCoupon = () => {
    if (couponCode === '') {
      setDisCount(0);
      setCouponError('');
      return;
    }
    if (!coupon.has(couponCode)) {
      setCouponError('Coupon does not exist!');
      setDisCount(0);
      return;
    }
    setDisCount(coupon.get(couponCode) || 0);
    setCouponError('');
  };

  return (
    <Transition 
      show={isOpen}
      enter="duration-200 ease-out"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="duration-300 ease-out"
      leaveFrom="opacity-100"
      leaveTo="opacity-0">
      <Dialog open={isOpen} onClose={toggle} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>
        <div className="fixed inset-0 w-screen pt-1">
          <DialogPanel
              className="bg-white w-full absolute inset-x-0 top-24 bottom-32 md:top-0 md:right-0
              md:left-auto md:bottom-auto md:w-5/12 md:h-4/5 max-w-4xl flex flex-col">
            <header className="h-16 md:h-20 bg-blue flex justify-between items-center px-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Cart <span>({totalProducts})</span></h1>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                   stroke="currentColor" className="size-6 cursor-pointer text-white" onClick={toggle}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
              </svg>
            </header>
            <section className="flex-1 overflow-y-auto scroll-smooth">
              <ul className="px-5 pt-10">
                {
                  cartList.items.map((item) => (
                    <li className="flex mb-7" key={item.product._id}>
                      <img src={item.product.image} alt="" className="w-28 h-28"/>
                      <div className="ml-3 flex-1 flex flex-col justify-between">
                        <div className="md:flex md:justify-between">
                          <h2 className="text-xl font-bold text-black-common">{item.product.name}</h2>
                          <h2 className="text-xl font-semibold text-blue">${item.product.price.toFixed(2)}</h2>
                        </div>
                        <div className="flex justify-between">
                          <AddToCart count={item.quantity} productId={item.product._id} customClass={['border border-solid border-gray-border', 'text-black-common border-x border-solid border-gray-border']}/>
                          <a className="text-base font-medium text-gray cursor-pointer underline" onClick={() => {removeProduct(item.product._id)}}>Remove</a>
                        </div>
                      </div>
                    </li>
                  ))
                }
              </ul>
              <section className="px-5">
                <p className="text-sm font-semibold text-gray">Apply Discount Code</p>
                <div className="flex mt-2.5">
                  <input className="border border-solid border-gray-border rounded focus:outline-0 h-11 flex-1 px-3 text-gray-light"
                         value={couponCode}
                         onChange={(e) => {setCouponCode(e.target.value)}}/>
                  <button className="bg-blue text-white text-sm font-bold px-5 ml-4 rounded" onClick={applyCoupon}>Apply</button>
                </div>
                <p className="text-red-tip">{couponError}</p>
              </section>
              <div className="w-full h-px bg-gray-border mt-10"></div>
              <section className="p-5">
                <ul className="text-base font-semibold text-black-common">
                  <li className="flex mb-4 justify-between"><span>Subtotal</span><span>${cartList.totalPrice.toFixed(2)}</span></li>
                  <li className="flex mb-4 justify-between"><span>Tax</span><span>${(cartList.totalPrice * taxRate).toFixed(2)}</span></li>
                  <li className="flex mb-4 justify-between"><span>Discount</span><span>-${disCount.toFixed(2)}</span></li>
                  <li className="flex mb-4 justify-between"><span>Estimated total</span><span>${(cartList.totalPrice * (1 + taxRate) - disCount).toFixed(2)}</span></li>
                </ul>
                <button className="w-full bg-blue text-white text-sm font-bold rounded h-11">Continue to checkout</button>
              </section>
            </section>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  )
});

export default Cart;
