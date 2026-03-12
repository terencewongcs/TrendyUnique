import PageListBox from "./PageListBox";
import {useState, FC, useEffect} from "react";
import { getRequest } from '../utils/fetch.ts';
import {ProductCreateType} from "../utils/type.ts";
import {useGlobal} from "../hooks/useGlobal.tsx";

const CategoryOptions = [
  {id: 'iPhone', text: 'iPhone'},
  {id: 'Laptop', text: 'Laptop'},
  {id: 'Game', text: 'Game'},
  {id: 'Other', text: 'Other'},
];

interface FormProps {
  id: string,
  submit: (params: ProductCreateType) => Promise<number>
}

const ProductForm: FC<FormProps> = ({ id, submit }) => {
  const [category, setCategory] = useState(CategoryOptions[0]);
  const [form, setForm] = useState(
    {name: '', description: '', price: '', quantity: '', image: ''});
  const [previewImg, setPreviewImg] = useState('');
  const [nameErr, setNameErr] = useState('');
  const [descriptionErr, setDescriptionErr] = useState('');
  const [priceErr, setPriceErr] = useState('');
  const [quantityErr, setQuantityErr] = useState('');
  const [imageErr, setImageErr] = useState('');

  const { showLoading, showMessage } = useGlobal();

  useEffect(() => {
    if (id) {
      const getProduct = async () => {
        try {
          const data: ProductCreateType = await getRequest<ProductCreateType>(`/api/products/${id}`);
          console.log(data)
          setForm({
            name: data.name,
            description: data.description,
            price: String(data.price),
            quantity: String(data.quantity),
            image: data.image
          });
          setCategory({id: data.category, text: data.category});
          setPreviewImg(data.image);
        } catch (e) {
          console.log(e);
          showMessage(String(e))
        }
      };
      showLoading(true);
      getProduct().catch(() => {console.log('error')}).finally(() => {showLoading(false)})
    }
  }, [id]);

  const uploadImg = () => {
    const imgRegex = /^(http:\/\/|https:\/\/)/i;
    if (!imgRegex.test(form.image)) {
      setImageErr('Invalid Image Link');
      setPreviewImg('');
    } else {
      setImageErr('');
      setPreviewImg(form.image);
    }
  };

  const checkForm = () => {
    const imgRegex = /^(http:\/\/|https:\/\/)/i;
    let isValid = true;

    if (form.name === '') {
      setNameErr('Invalid Product Name');
      isValid = false;
    } else {
      setNameErr('');
    }

    if (form.description === '') {
      setDescriptionErr('Invalid Product Description');
      isValid = false;
    } else {
      setDescriptionErr('');
    }

    if (form.price === '' || isNaN(Number(form.price))) {
      setPriceErr('Invalid Price');
      isValid = false;
    } else {
      setPriceErr('');
    }

    if (form.quantity === '' || isNaN(Number(form.quantity))) {
      setQuantityErr('Invalid Quantity');
      isValid = false;
    } else {
      setQuantityErr('');
    }

    if (!imgRegex.test(form.image)) {
      setImageErr('Invalid Image Link');
      isValid = false;
    } else {
      setImageErr('');
    }

    return isValid;
  };

  const doSubmit = () => {
    if (!checkForm()) return;
    const params: ProductCreateType = {
      name: form.name,
      description: form.description,
      category: category.id,
      price: Number(form.price),
      quantity: Number(form.quantity),
      image: form.image
    };
    submit(params)
      .then((t) => {
        console.log(123);
        if (t && !id) {
          setForm({name: '', description: '', price: '', quantity: '', image: ''});
          setPreviewImg('');
        }
      }).catch(() => {console.log('error')});
  };

  return (
    <div className="bg-white w-full rounded-sm py-4 px-6">
      <div>
        <p className="text-base font-semibold text-gray mb-2">Product Name</p>
        <input className="h-12 border border-solid border-gray-border rounded px-1.5 outline-0 w-full"
               value={form.name} onChange={(e) => {setForm({...form, name: e.target.value})}}/>
        <p className="text-sm font-normal text-red text-right">{nameErr}</p>
      </div>
      <div className="mt-4">
        <p className="text-base font-semibold text-gray mb-2">Product Description</p>
        <textarea className="h-12 border border-solid border-gray-border rounded p-1.5 outline-0 w-full min-h-32"
               value={form.description} onChange={(e) => {setForm({...form, description: e.target.value})}}/>
        <p className="text-sm font-normal text-red text-right">{descriptionErr}</p>
      </div>
      <div className="mt-4 md:flex md:justify-between">
        <div className="w-full md:w-5.9/12">
          <p className="text-base font-semibold text-gray mb-2">Category</p>
          <PageListBox options={CategoryOptions} selected={category} callback={setCategory}/>
        </div>
        <div className="w-full mt-4 md:mt-0 md:w-5.9/12">
          <p className="text-base font-semibold text-gray mb-2">Price</p>
          <input className="h-9 border border-solid border-gray-border rounded px-1.5 outline-0 w-full"
                value={form.price} onChange={(e) => {setForm({...form, price: e.target.value})}}/>
          <p className="text-sm font-normal text-red text-right">{priceErr}</p>
        </div>
      </div>
      <div className="mt-4 md:flex md:justify-between">
        <div className="w-full md:w-2/5">
          <p className="text-base font-semibold text-gray mb-2">In Stock Quantity</p>
          <input className="h-12 border border-solid border-gray-border rounded px-1.5 outline-0 w-full"
                value={form.quantity} onChange={(e) => {setForm({...form, quantity: e.target.value})}}/>
          <p className="text-sm font-normal text-red text-right">{quantityErr}</p>
        </div>
        <div className="flex-1 mt-4 md:mt-0 md:ml-2">
          <p className="text-base font-semibold text-gray mb-2">Add Image Link</p>
          <div className="flex items-center h-12 border border-solid border-gray-border rounded px-1.5 w-full">
            <input className="outline-0 flex-1" placeholder="https://"
                  value={form.image} onChange={(e) => {setForm({...form, image: e.target.value})}}/>
            <button className="bg-blue text-white rounded text-sm font-semibold px-3 py-2 my-4 ml-2" onClick={uploadImg}>Upload</button>
          </div>
          <p className="text-sm font-normal text-red text-right">{imageErr}</p>
        </div>
      </div>
      <div className="flex justify-center">
        {previewImg === ''
          ?
          <div
            className="w-full md:w-3/5 h-52 my-4 border border-dashed border-gray rounded flex justify-center items-center flex-col">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="size-8 text-gray-border">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
            </svg>
            <p className="text-base font-medium text-gray">image preview!</p>
          </div>
          :
          <img className="w-10/12 max-w-48 my-4" src={previewImg} alt=''/>
        }
      </div>
      <button className="bg-blue text-white rounded text-sm font-semibold px-3 py-2 my-4" onClick={doSubmit}>
        {id ? 'Edit Product' : 'Add Product'}
      </button>
    </div>
  );
};

export default ProductForm;