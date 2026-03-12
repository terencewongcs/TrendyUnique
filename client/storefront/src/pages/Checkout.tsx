import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { useGlobal } from '../hooks/useGlobal';
import { postRequest } from '../utils/fetch';
import { updateCarts, updateTotalProducts } from '../app/slice/cart';

interface OrderResponse {
  orders: { _id: string }[];
}

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showLoading, showMessage } = useGlobal();
  const cartList = useAppSelector((state) => state.cart.carts);

  const [shippingAddress, setShippingAddress] = useState('');
  const [addressErr, setAddressErr] = useState('');

  const placeOrder = async () => {
    if (!shippingAddress.trim()) {
      setAddressErr('Shipping address is required');
      return;
    }
    setAddressErr('');

    if (cartList.items.length === 0) {
      showMessage('Your cart is empty');
      return;
    }

    showLoading(true);
    try {
      await postRequest<OrderResponse>('/api/orders', { shippingAddress });
      dispatch(updateCarts({ items: [], totalPrice: 0 }));
      dispatch(updateTotalProducts(0));
      showLoading(false);
      showMessage('Order placed successfully!', 'success');
      navigate('/orders');
    } catch (e) {
      showLoading(false);
      showMessage(String(e));
    }
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-black-common mb-6">Checkout</h1>

      <div className="bg-white rounded-lg p-5 mb-4">
        <h2 className="text-lg font-semibold text-black-common mb-4">Order Summary</h2>
        <ul className="divide-y divide-gray-border">
          {cartList.items.map((item) => (
            <li key={item.product._id} className="flex justify-between py-2 text-sm text-black-common">
              <span>{item.product.name} × {item.quantity}</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold text-black-common mt-4">
          <span>Total</span>
          <span>${(cartList.totalPrice * 1.1).toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 mb-4">
        <h2 className="text-lg font-semibold text-black-common mb-4">Shipping Address</h2>
        <textarea
          className="w-full border border-gray-border rounded p-2.5 outline-0 min-h-24 text-sm"
          placeholder="Enter your full shipping address..."
          value={shippingAddress}
          onChange={(e) => { setShippingAddress(e.target.value); }}
        />
        {addressErr && <p className="text-red text-sm mt-1">{addressErr}</p>}
      </div>

      <button
        className="w-full bg-blue text-white text-base font-bold rounded h-12"
        onClick={placeOrder}
      >
        Place Order
      </button>
      <button className="w-full mt-2 text-blue text-sm underline" onClick={() => { navigate('/cart'); }}>
        Back to Cart
      </button>
    </div>
  );
};

export default Checkout;
