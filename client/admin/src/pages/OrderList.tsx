import { useEffect, useState } from 'react';
import { getRequest, patchRequest } from '../utils/fetch';
import { OrderType } from '../utils/type';
import { useGlobal } from '../hooks/useGlobal';

const STATUS_OPTIONS: OrderType['status'][] = ['Pending', 'Delivering', 'Delivered'];

const statusColor: Record<OrderType['status'], string> = {
  Pending: 'bg-yellow text-black',
  Delivering: 'bg-blue text-white',
  Delivered: 'bg-green-button text-white',
};

const OrderList = () => {
  const { showLoading, showMessage } = useGlobal();
  const [orders, setOrders] = useState<OrderType[]>([]);

  const load = async () => {
    const data: OrderType[] = await getRequest<OrderType[]>('/api/vendor/orders');
    setOrders(data);
  };

  useEffect(() => {
    showLoading(true);
    load()
      .catch((e: unknown) => { showMessage(String(e)); })
      .finally(() => { showLoading(false); });
  }, []);

  const updateStatus = async (orderId: string, status: OrderType['status']) => {
    showLoading(true);
    try {
      await patchRequest(`/api/vendor/orders/${orderId}`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
      showMessage('Status updated', 'success');
    } catch (e) {
      showMessage(String(e));
    } finally {
      showLoading(false);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-black-common mb-6">Orders</h1>
        <div className="bg-white rounded-lg p-10 text-center text-gray">No orders yet.</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-black-common mb-6">Orders</h1>
      <ul className="flex flex-col gap-4">
        {orders.map((order) => (
          <li key={order._id} className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
              <div>
                <p className="text-xs text-gray mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray">
                  {new Date(order.createdAt).toLocaleDateString()} ·
                  Customer: {order.customer.username} ({order.customer.email})
                </p>
                <p className="text-xs text-gray mt-0.5">Ship to: {order.shippingAddress}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[order.status]}`}>
                  {order.status}
                </span>
                <select
                  className="border border-gray-border rounded text-xs px-2 py-1 outline-0 bg-white cursor-pointer"
                  value={order.status}
                  onChange={(e) => { updateStatus(order._id, e.target.value as OrderType['status']); }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <ul className="divide-y divide-gray-border">
              {order.items.map((item) => (
                <li key={item.product._id} className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-3">
                    <img src={item.product.image} alt="" className="w-10 h-10 object-cover rounded" />
                    <span className="text-sm text-black-common">{item.product.name} × {item.quantity}</span>
                  </div>
                  <span className="text-sm font-medium text-black-common">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-3">
              <p className="text-base font-bold text-black-common">Total: ${order.totalPrice.toFixed(2)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
