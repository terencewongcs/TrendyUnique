import ProductForm from "../components/ProductForm.tsx";
import { ProductCreateType } from "../utils/type.ts";
import { postRequest } from "../utils/fetch.ts";
import {useGlobal} from "../hooks/useGlobal.tsx";

interface ResType {
  message: string
}

const ProductsAdd = () => {
  const { showLoading, showMessage } = useGlobal();

  const doCreateProduct = async (params: ProductCreateType) => {
    showLoading(true);
    try {
      const data = await postRequest<ResType>('/api/products/create', params);
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
      <h1 className="text-3xl font-bold text-black-common my-5 text-center md:text-left">Create Product</h1>
      <ProductForm id='' submit={doCreateProduct}/>
      <div className="h-5"></div>
    </div>
  );
};

export default ProductsAdd;