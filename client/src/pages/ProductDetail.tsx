import { useParams } from "react-router-dom";
import { useGlobal } from "../hooks/useGlobal.tsx";
import { getRequest } from "../utils/fetch.ts";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks.ts";
import { useCallback, useEffect, useState } from "react";
import { ProductType } from "../utils/type.ts";
import AddToCart from "../components/AddToCart.tsx";

const ProductDetail = () => {
  const { showLoading, showMessage } = useGlobal();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const cartItems = useAppSelector((state) => state.cart.carts.items);

  const id = useParams().id || "";

  const [product, setProduct] = useState<ProductType | null>(null);

  const getProduct = useCallback(async () => {
    try {
      const productUrl = `/api/products/${id}`;
      const productData = await getRequest<ProductType>(productUrl);
      const cartProduct = cartItems.find(
        (t) => t.product._id === productData._id
      );
      productData.cartCount = (cartProduct && cartProduct.quantity) || 0;
      console.log(productData);
      setProduct(productData);
    } catch (e) {
      console.log(e);
      showMessage(String(e));
    }
  }, [id, cartItems]);

  useEffect(() => {
    showLoading(true);
    getProduct()
      .catch((e: unknown) => {
        console.log(e);
      })
      .finally(() => {
        showLoading(false);
      });
  }, [getProduct]);

  useEffect(() => {
    if (user.role === "Vendor" && product && product.owner !== user.id) {
      console.log("here");
      showMessage("You don't have permission to access this page!");
      navigate("/");
    }
  }, [user.role, product]);

  const editProduct = (id: string = "") => {
    navigate(`/products/edit/${id}`);
  };

  return (
    <div className="w-full h-full px-5 md:px-16 items-center flex flex-col overflow-y-auto pb-7">
      <div className="w-full md:max-w-7xl my-5 text-center md:text-left">
        <h1 className="text-2xl md:text-4xl font-bold text-black-common">
          Product detail
        </h1>
      </div>
      {product ? (
        <div className="w-full bg-white rounded-lg p-5 md:p-10 flex flex-col md:flex-row md:max-w-7xl">
          <div className="w-full h-full flex justify-center items-center">
            <img
              src={product.image}
              alt="product"
              className="w-full md:max-h-[calc(100%-4rem)] object-contain"
            />
          </div>
          <div className="w-full h-full flex flex-col justify-center md:justify-start items-left md:items-start md:mx-8 md:pt-5">
            <p className="text-sm md:text-base text-gray-details font-normal mt-2">
              Category: {product.category}
            </p>
            <h2 className="text-xl md:text-4xl font-bold text-gray-text my-1 md:my-2">
              {product.name}
            </h2>
            <div className="flex items-center my-1 md:my-4">
              <p className="text-xl md:text-[32px]/[44px] font-bold text-black-common align-text-top">
                ${product.price}
              </p>
              {product.quantity === 0 ? (
                <div
                  className={`flex items-center mx-4 bg-[#EA3D2F]/[13%] rounded-md h-[30px]`}
                >
                  <p className="text-[10px]/[13.75px] text-red-button font-bold mx-4">
                    Out of stock
                  </p>
                </div>
              ) : (
                <div
                  className={`flex items-center mx-4 bg-[#03d833]/[13%] rounded-md h-[30px]`}
                >
                  <p className="text-[10px]/[13.75px] text-green-button font-bold mx-4">
                    {product.quantity} in stock
                  </p>
                </div>
              )}
            </div>
            <p className="text-xs md:text-base text-gray-details font-normal mt-4 md:mt-2 break-words mb-4">
              {product.description}
            </p>
            {user.role === "Vendor" ? (
              <button
                onClick={() => {
                  editProduct(product._id);
                }}
                className="bg-white text-black-common rounded text-xs font-semibold py-1.5 w-5.9/12 border border-gray-border"
              >
                Edit
              </button>
            ) : user.role === "Admin" ? (
              <div className="flex justify-between mt-1 w-full">
                <AddToCart
                  productId={product._id}
                  count={product.cartCount}
                  customClass={["bg-blue text-white  w-5.9/12", "bg-blue text-white"]}
                />

                <button
                  onClick={() => {
                    editProduct(product._id);
                  }}
                  className="bg-white text-black-common rounded text-xs font-semibold py-1.5 w-5.9/12 border border-gray-border"
                >
                  Edit
                </button>
              </div>
            ) : (
              <AddToCart
                productId={product._id}
                count={product.cartCount}
                customClass={["bg-blue text-white w-5.9/12", "bg-blue text-white"]}
              />
            )}
          </div>
        </div>
      ) : (
        <div>Something went wrong, please refresh the page</div>
      )}
    </div>
  );
};

export default ProductDetail;
