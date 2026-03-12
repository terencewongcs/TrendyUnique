import { useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm.tsx";
import {ProductCreateType} from "../utils/type.ts";
import {useGlobal} from "../hooks/useGlobal.tsx";
import {patchRequest} from "../utils/fetch.ts";

interface ResType {
  message: string
}

const ProductsEdit = () => {
  const { showLoading, showMessage } = useGlobal();

  const id = useParams().id || '';

  const doUpdateProduct = async (params: ProductCreateType) => {
    showLoading(true);
    try {
      const data = await patchRequest<ResType>(`/api/products/${id}`, params);
      showMessage(data.message, 'success');
      showLoading(false);
      return 1;
    } catch (e) {
      showMessage(String(e));
      showLoading(false);
      return 0;
    }
  };

  return (
    <div className="w-full h-full max-w-2xl px-5">
      <h1 className="text-3xl font-bold text-black-common my-5 text-center md:text-left">Edit Product</h1>
      <ProductForm id={id} submit={doUpdateProduct}/>
      <div className="h-5"></div>
    </div>
  );
};

export default ProductsEdit;