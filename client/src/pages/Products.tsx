import {useEffect, useCallback, useState} from 'react';
import PageListBox from "../components/PageListBox.tsx";
import { ProductType, ProductPageType } from '../utils/type.ts';
import { getRequest } from '../utils/fetch.ts';
import {useGlobal} from "../hooks/useGlobal.tsx";
import {useNavigate} from "react-router-dom";
import { useAppSelector } from "../app/hooks.ts";
import AddToCart from "../components/AddToCart.tsx";

const SortOptions = [
  {id: 'createdAt-des', text: 'Last added'},
  {id: 'price-asc', text: 'Price: low to high'},
  {id: 'price-des', text: 'Price: high to low'}
];

const pageSize = '10';

const Products = () => {
  const user = useAppSelector((state) => state.user);
  const search = useAppSelector((state) => state.search.value);
  const searchTriggered = useAppSelector((state) => state.search.trigger);
  const cartItems = useAppSelector((state) => state.cart.carts.items);

  const { showLoading, showMessage } = useGlobal();
  const navigate = useNavigate();

  const [sort, setSort] = useState(SortOptions[0]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [sort, searchTriggered]);

  const getAllProducts = useCallback(async () => {
    const s = sort.id.split('-');
    const sortOrder = s[1] === 'asc' ? '1' : '-1';
    const url = `/api/products?pageSize=${pageSize}&sortField=${s[0]}&sortOrder=${sortOrder}&page=${String(currentPage)}&search=${search}`;
    try {
      const data: ProductPageType = await getRequest<ProductPageType>(url);
      const productWithCount = data.data.map((item) => {
        const cartProduct = cartItems.find((t) => t.product._id === item._id);
        item.cartCount = (cartProduct && cartProduct.quantity) || 0;
        return item;
      });
      setProducts(productWithCount);
      setTotalPage(data.pages);
    } catch (e) {
      console.log(e);
      showMessage(String(e))
    }
  }, [sort, currentPage, searchTriggered, cartItems]);

  useEffect(() => {
    showLoading(true);
    getAllProducts()
      .catch(()=> {console.log('error')})
      .finally(() => {showLoading(false)});
  }, [getAllProducts]);

  const updatePage = (n: number) => {
    if (currentPage + n <= 0 || currentPage + n > totalPage) return;
    setCurrentPage(currentPage + n);
  };

  const editProduct = (id: string = '') => {
    if (id === '') navigate('/products/add');
    else navigate(`/products/edit/${id}`);
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto flex flex-col">
      <div className="w-full flex justify-between items-center flex-col md:flex-row">
        <h2 className="text-black-common text-3xl font-bold mb-4 md:mb-0">Products</h2>
        <div className="flex items-center">
          <div className="w-44">
            <PageListBox options={SortOptions} selected={sort} callback={setSort} />
          </div>
          {
            (user.role === 'Vendor' || user.role === 'Admin')
            && <button className="bg-blue text-white rounded text-sm font-semibold py-2 px-5 ml-2"
                       onClick={() => {editProduct()}}>Add Product</button>
          }
        </div>
      </div>
      {
        products.length > 0
          ?
          <ul className="bg-white rounded-sm py-4 px-2.5 w-full flex flex-wrap mt-4 flex-1 items-start">
            {products.map(product => (
              <li key={product._id}
                  className="list-none border border-gray-border rounded w-full md:w-pmd lg:w-plg mx-1/100 my-1/100 p-2">
                <img className="cursor-pointer w-full" style={{aspectRatio: '1/1'}} src={product.image} alt="" onClick={() => {navigate(`/products/${product._id}`)}}/>
                <p className="text-sm font-normal text-gray mt-1 truncate">{product.name}</p>
                <p className="font-semibold text-base text-black-common">${product.price}</p>
                <div className="flex justify-between mt-1">
                  {
                    user.role !== 'Vendor'
                    && <AddToCart count={product.cartCount} productId={product._id} customClass={['bg-blue text-white w-5.9/12', 'bg-blue text-white']}/>
                  }
                  {
                    (user.id === product.owner || user.role === 'Admin')
                    && <button onClick={() => {
                      editProduct(product._id)
                    }} className="bg-white text-black-common rounded
                      text-xs font-semibold py-1.5 w-5.9/12 border border-gray-border">Edit</button>
                  }
                </div>
              </li>
            ))}
          </ul>
          :
          <p className="w-full flex-1 flex justify-center items-center">No Data</p>
      }
      <div className="flex justify-end mt-5">
      <ul className="flex border border-gray-page-border rounded bg-white">
          <li className="size-10 flex justify-center items-center cursor-pointer" onClick={() => {
            updatePage(-1)
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="size-4 text-gray-page">
              <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"/>
            </svg>
          </li>
          {Array.from({length: totalPage}).map((_, idx) => (
            <li key={idx} className={`${currentPage === idx + 1 ? 'bg-blue text-white' : 'bg-white text-blue'} 
            text-base font-normal size-10 flex justify-center items-center cursor-pointer border-l border-gray-page-border`}
                onClick={() => {
                  setCurrentPage(idx + 1)
                }}>{idx + 1}</li>
          ))}
          <li className="size-10 flex justify-center items-center cursor-pointer border-l border-gray-page-border" onClick={() => {updatePage(1)}}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="size-4 text-gray-page">
              <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"/>
            </svg>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Products;
