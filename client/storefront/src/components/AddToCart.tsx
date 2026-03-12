import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addOneToCart, updateOneToCart, deleteOneFromCart } from '../app/slice/cart';
import { useGlobal } from '../hooks/useGlobal';

interface PropsType {
  count: number;
  productId: string;
  customClass: string[];
}

const AddToCart: FC<PropsType> = ({ count, productId, customClass }) => {
  const dispatch = useAppDispatch();
  const { showLoading, showMessage } = useGlobal();
  const user = useAppSelector((state) => state.user);
  const [productNumber, setProductNumber] = useState(String(count));

  useEffect(() => {
    setProductNumber(String(count));
  }, [count]);

  const addProductToCart = () => {
    if (!user.token) {
      localStorage.clear();
      window.location.href = '/signin';
      return;
    }
    showLoading(true);
    dispatch(addOneToCart(productId))
      .catch((e: unknown) => { showMessage(String(e)); })
      .finally(() => { showLoading(false); });
  };

  const changeQuantity = (delta: number) => {
    showLoading(true);
    dispatch(updateOneToCart(productId, count + delta))
      .catch((e: unknown) => { showMessage(String(e)); })
      .finally(() => { showLoading(false); });
  };

  const removeFromCart = () => {
    showLoading(true);
    dispatch(deleteOneFromCart(productId))
      .catch((e: unknown) => { showMessage(String(e)); })
      .finally(() => { showLoading(false); });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const n = Number(productNumber);
      if (productNumber === '' || isNaN(n)) {
        setProductNumber(String(count));
      } else {
        showLoading(true);
        dispatch(updateOneToCart(productId, n))
          .catch((e: unknown) => { showMessage(String(e)); })
          .finally(() => { showLoading(false); });
      }
    }
  };

  return (
    <>
      {count > 0 ? (
        <div className={`${customClass[0]} rounded text-xs font-semibold flex justify-between items-center`}>
          <p className="w-7 h-7 cursor-pointer flex justify-center items-center"
            onClick={() => { count === 1 ? removeFromCart() : changeQuantity(-1); }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          </p>
          <input
            className={`${customClass[1]} w-7 h-7 focus:outline-0 text-sm font-medium text-center border-0`}
            value={productNumber}
            onChange={(e) => { setProductNumber(e.target.value); }}
            onBlur={() => { setProductNumber(String(count)); }}
            onKeyDown={handleKeyDown}
          />
          <p className="w-7 h-7 cursor-pointer flex justify-center items-center" onClick={() => { changeQuantity(1); }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </p>
        </div>
      ) : (
        <button className="bg-blue text-white rounded text-xs font-semibold py-1.5 w-5.9/12" onClick={addProductToCart}>Add</button>
      )}
    </>
  );
};

export default AddToCart;
