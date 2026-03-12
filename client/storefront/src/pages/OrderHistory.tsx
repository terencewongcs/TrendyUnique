import { useEffect, useState } from 'react';
import { getRequest } from '../utils/fetch';
import { OrderType } from '../utils/type';
import { useGlobal } from '../hooks/useGlobal';

const statusColor = {
  Pending: 'bg-yellow text-black',
  Delivering: 'bg-blue text-white',
  Delivered: 'bg-green-button text-white',
};

const OrderHistory = () => {
  const { showLoading, showMessage } = useGlobal();
  const [orders, setOrders] = useState<OrderType[]>([]);

  useEffect(() => {
    showLoading(true);
    getRequest<OrderType[]>('/api/orders')
      .then(setOrders)
      .catch((e: unknown) => { showMessage(String(e)); })
      .finally(() => { showLoading(false); });
  }, []);

  if (orders.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-gray text-lg">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6 overflow-y-auto max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-black-common mb-6">My Orders</h1>
      <ul className="flex flex-col gap-4">
        {orders.map((order) => (
          <li key={order._id} className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-gray mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray">
                  {new Date(order.createdAt).toLocaleDateString()} · Sold by {order.vendor.username}
                </p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[order.status]}`}>
                {order.status}
              </span>
            </div>
            <ul className="divide-y divide-gray-border mb-3">
              {order.items.map((item) => (
                <li key={item.product._id} className="flex justify-between py-2 text-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.product.image} alt="" className="w-10 h-10 object-cover rounded" />
                    <span className="text-black-common">{item.product.name} × {item.quantity}</span>
                  </div>
                  <span className="text-black-common font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray">Shipping to: {order.shippingAddress}</p>
              <p className="text-base font-bold text-black-common">Total: ${order.totalPrice.toFixed(2)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;
