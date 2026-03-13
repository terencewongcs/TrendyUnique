import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { ProductCreateType } from '../utils/type';
import { useGlobal } from '../hooks/useGlobal';
import { postRequest, patchRequest } from '../utils/fetch';

interface ResType {
  message: string;
}

const ProductFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showLoading, showMessage } = useGlobal();
  const isEdit = Boolean(id);

  const handleSubmit = async (params: ProductCreateType): Promise<number> => {
    showLoading(true);
    try {
      let data: ResType;
      if (isEdit && id) {
        data = await patchRequest<ResType>(`/api/admin/products/${id}`, params);
      } else {
        data = await postRequest<ResType>('/api/admin/products', params);
      }
      showMessage(data.message, 'success');
      showLoading(false);
      if (isEdit) navigate('/products');
      return 1;
    } catch (e) {
      showMessage(String(e));
      showLoading(false);
      return 0;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button className="text-blue text-sm underline" onClick={() => { navigate('/products'); }}>
          ← Back to Products
        </button>
        <h1 className="text-2xl font-bold text-black-common">
          {isEdit ? 'Edit Product' : 'Add Product'}
        </h1>
      </div>
      <ProductForm id={id || ''} submit={handleSubmit} />
    </div>
  );
};

export default ProductFormPage;
