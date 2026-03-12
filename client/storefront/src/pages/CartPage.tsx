import { useAppDispatch, useAppSelector } from '../app/hooks';
import { deleteOneFromCart } from '../app/slice/cart';
import { useGlobal } from '../hooks/useGlobal';
import { useNavigate } from 'react-router-dom';
import AddToCart from '../components/AddToCart';

const CartPage = () => {
  const dispatch = useAppDispatch();
  const { showLoading, showMessage } = useGlobal();
  const navigate = useNavigate();
  const cartList = useAppSelector((state) => state.cart.carts);
  const totalProducts = useAppSelector((state) => state.cart.totalProducts);

  const removeProduct = (productId: string) => {
    showLoading(true);
    dispatch(deleteOneFromCart(productId))
      .catch((e: unknown) => { showMessage(String(e)); })
      .finally(() => { showLoading(false); });
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-black-common mb-6">Your Cart ({totalProducts})</h1>
      {cartList.items.length === 0 ? (
        <div className="bg-white rounded-lg p-10 text-center">
          <p className="text-gray text-lg">Your cart is empty.</p>
          <button className="mt-4 bg-blue text-white rounded px-6 py-2 text-sm font-semibold"
            onClick={() => { navigate('/'); }}>Continue Shopping</button>
        </div>
      ) : (
        <>
          <ul className="bg-white rounded-lg p-5 mb-4">
            {cartList.items.map((item) => (
              <li className="flex mb-7 last:mb-0" key={item.product._id}>
                <img src={item.product.image} alt="" className="w-24 h-24 object-cover rounded" />
                <div className="ml-4 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <h2 className="text-lg font-bold text-black-common">{item.product.name}</h2>
                    <h2 className="text-lg font-semibold text-blue">${item.product.price.toFixed(2)}</h2>
                  </div>
                  <div className="flex justify-between items-center">
                    <AddToCart count={item.quantity} productId={item.product._id}
                      customClass={['border border-solid border-gray-border', 'text-black-common border-x border-solid border-gray-border']} />
                    <button className="text-sm font-medium text-gray underline"
                      onClick={() => { removeProduct(item.product._id); }}>Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-white rounded-lg p-5">
            <div className="flex justify-between text-base font-semibold text-black-common mb-2">
              <span>Subtotal</span><span>${cartList.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-black-common mb-4">
              <span>Tax (10%)</span><span>${(cartList.totalPrice * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-black-common mb-6">
              <span>Total</span><span>${(cartList.totalPrice * 1.1).toFixed(2)}</span>
            </div>
            <button className="w-full bg-blue text-white text-sm font-bold rounded h-11"
              onClick={() => { navigate('/checkout'); }}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
