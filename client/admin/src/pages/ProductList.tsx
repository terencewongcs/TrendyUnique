import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequest, deleteRequest } from '../utils/fetch';
import { ProductType, ProductPageType } from '../utils/type';
import { useGlobal } from '../hooks/useGlobal';

const pageSize = 10;

const ProductList = () => {
  const navigate = useNavigate();
  const { showLoading, showMessage } = useGlobal();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    const url = `/api/admin/products?pageSize=${pageSize}&page=${currentPage}&search=${search}&sortField=createdAt&sortOrder=-1`;
    const data: ProductPageType = await getRequest<ProductPageType>(url);
    setProducts(data.data);
    setTotalPage(data.pages);
  }, [currentPage, search]);

  useEffect(() => {
    showLoading(true);
    load()
      .catch((e: unknown) => { showMessage(String(e)); })
      .finally(() => { showLoading(false); });
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    showLoading(true);
    try {
      await deleteRequest(`/api/admin/products/${id}`);
      showMessage('Product deleted', 'success');
      await load();
    } catch (e) {
      showMessage(String(e));
    } finally {
      showLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black-common">All Products</h1>
        <button className="bg-blue text-white rounded text-sm font-semibold py-2 px-5"
          onClick={() => { navigate('/products/add'); }}>
          + Add Product
        </button>
      </div>

      <div className="mb-4">
        <input
          className="border border-gray-border rounded px-3 h-10 outline-0 w-full max-w-sm text-sm"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-lg p-10 text-center text-gray">No products found.</div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-bg/30 text-gray font-semibold">
              <tr>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-right px-4 py-3">Price</th>
                <th className="text-right px-4 py-3">Stock</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-border">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-bg/10">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt="" className="w-10 h-10 object-cover rounded" />
                      <span className="font-medium text-black-common truncate max-w-xs">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray">{product.category}</td>
                  <td className="px-4 py-3 text-right font-medium text-black-common">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.quantity > 0 ? 'bg-green-button/20 text-green-button' : 'bg-red/20 text-red'}`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-blue text-xs font-medium underline mr-3"
                      onClick={() => { navigate(`/products/edit/${product._id}`); }}>Edit</button>
                    <button className="text-red text-xs font-medium underline"
                      onClick={() => { handleDelete(product._id); }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPage > 1 && (
        <div className="flex justify-end mt-4">
          <ul className="flex border border-gray-page-border rounded bg-white">
            {Array.from({ length: totalPage }).map((_, idx) => (
              <li key={idx}
                className={`${currentPage === idx + 1 ? 'bg-blue text-white' : 'bg-white text-blue'}
                text-sm font-normal size-9 flex justify-center items-center cursor-pointer border-l border-gray-page-border first:border-l-0`}
                onClick={() => { setCurrentPage(idx + 1); }}>{idx + 1}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductList;
